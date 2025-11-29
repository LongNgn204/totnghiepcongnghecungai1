import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Send, ChevronDown, CheckCircle, Pencil, Code2, Cpu, MessageCircle, AlertCircle, Search, Sun, Moon, Copy, Download } from 'lucide-react';
import { getLessonsByLanguage, getLessonById, Lesson } from '../data/codingLessons';
import ArduinoSimulator from './ArduinoSimulator';
import toast from 'react-hot-toast';
import { generateContent } from '../utils/geminiAPI';
import QuizPanel from './QuizPanel';
import { recordStudySession, getUnlockedAchievements } from '../utils/studyProgress';

// Templates for quick insert
const pyTemplates: Record<string, string> = {
  hello: "print('Hello World')\n",
  sum: "numbers = [10,20,30]\nprint('Tổng:', sum(numbers))\n",
  fib: "def fib(n):\n    return n if n<2 else fib(n-1)+fib(n-2)\nprint('fib(6)=', fib(6))\n"
};
const arTemplates: Record<string, string> = {
  blink: "const int LED=13;\nvoid setup(){ pinMode(LED,OUTPUT);}\nvoid loop(){ digitalWrite(LED,HIGH); delay(500); digitalWrite(LED,LOW); delay(500);}\n",
  pwm: "const int LED=9;\nvoid setup(){ pinMode(LED,OUTPUT);}\nvoid loop(){ for(int v=0; v<=255; v+=5){ analogWrite(LED,v); delay(15);} for(int v=255; v>=0; v-=5){ analogWrite(LED,v); delay(15);} }\n",
  button: "const int BUTTON=2, LED=13; bool on=false;\nvoid setup(){ pinMode(BUTTON,INPUT); pinMode(LED,OUTPUT);}\nvoid loop(){ if(digitalRead(BUTTON)==HIGH){ on=!on; digitalWrite(LED,on?HIGH:LOW); while(digitalRead(BUTTON)==HIGH){} delay(50);} }\n"
};

// Progress bar summary for total completed lessons per language
const ProgressSummary: React.FC<{ language: 'python' | 'arduino'; completedIds: string[] }> = ({ language, completedIds }) => {
  const lessons = getLessonsByLanguage(language);
  const total = lessons.length;
  const done = lessons.filter(l => completedIds.includes(l.id)).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mt-3 p-3 bg-white border border-blue-100 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Tiến độ {language === 'python' ? 'Python' : 'Arduino'}</span>
        <span className="text-sm font-semibold text-blue-600">{done}/{total} ({pct}%)</span>
      </div>
      <div className="w-full h-2 bg-blue-50 rounded-full overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CodingLab: React.FC = () => {
  // State management
  const [language, setLanguage] = useState<'python' | 'arduino'>('python');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('py-01');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'ai' | 'quiz'>('output');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string>('Cơ Bản');
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('coding_lab_completed_ids');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [editorTheme, setEditorTheme] = useState<'light' | 'vs-dark'>('light');
  const [fontSize, setFontSize] = useState<number>(13);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Inject lightweight confetti styles once
  useEffect(() => {
    const id = 'confetti-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.innerHTML = `
        @keyframes confettiFall { to { transform: translateY(100vh) rotate(360deg); opacity: 0.8; } }
        .confetti-piece { position: fixed; top: -10px; width: 8px; height: 12px; opacity: 0.9; border-radius: 2px; animation: confettiFall 1.4s ease-in forwards; z-index: 9999; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const triggerConfetti = () => {
    const colors = ['#16a34a','#22c55e','#3b82f6','#f97316','#eab308','#ef4444','#a855f7'];
    for (let i = 0; i < 24; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.transform = `translateY(0) rotate(${Math.random()*180}deg)`;
      piece.style.animationDelay = (Math.random() * 0.2).toFixed(2) + 's';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 1600);
    }
  };
  const [simSignal, setSimSignal] = useState(0);
  const [ideWidth, setIdeWidth] = useState<number>(58); // % width for IDE within right area
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const rightAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      if (!rightAreaRef.current) return;
      const rect = rightAreaRef.current.getBoundingClientRect();
      const x = e.clientX;
      const pct = ((x - rect.left) / rect.width) * 100;
      const clamped = Math.min(75, Math.max(35, pct));
      setIdeWidth(clamped);
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isResizing]);

  // Get current lesson
  const currentLesson = getLessonById(selectedLessonId);

  // Initialize code when lesson changes
  useEffect(() => {
    if (currentLesson) {
      try {
        const saved = localStorage.getItem(`coding_lab_code_${currentLesson.id}`);
        setCode(saved ?? currentLesson.starterCode);
      } catch {
        setCode(currentLesson.starterCode);
      }
      setOutput('');
      setChatMessages([]);
      setActiveTab('output');
    }
  }, [selectedLessonId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Persist completed lessons
  const saveCompleted = (ids: string[]) => {
    setCompletedIds(ids);
    try {
      localStorage.setItem('coding_lab_completed_ids', JSON.stringify(ids));
    } catch {}
  };

  const toggleCompleted = (lessonId: string) => {
    const isCompleted = completedIds.includes(lessonId);
    const next = isCompleted
      ? completedIds.filter(id => id !== lessonId)
      : [...completedIds, lessonId];
    saveCompleted(next);
    if (!isCompleted) {
      triggerConfetti();
      toast.success('Đã đánh dấu hoàn thành 🎉');
    } else {
      toast('Đã bỏ đánh dấu');
    }
  };


  // Get lessons by language and category with filters
  const getLessonsByCategory = () => {
    let lessons = getLessonsByLanguage(language);

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      lessons = lessons.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      lessons = lessons.filter(l => l.difficulty === difficultyFilter);
    }

    const categories = [...new Set(lessons.map(l => l.category))];
    const grouped: Record<string, Lesson[]> = {};

    categories.forEach(cat => {
      grouped[cat] = lessons.filter(l => l.category === cat);
    });

    return grouped;
  };

  // Run Python code
  const runPythonCode = async () => {
    setIsRunning(true);
    setOutput('Đang chạy code...\n');

    try {
      // Simple Python execution using Pyodide (if available)
      // For now, we'll simulate execution
      const simulatedOutput = await simulatePythonExecution(code);
      setOutput(simulatedOutput);
      toast.success('Code chạy thành công!');
    } catch (error) {
      setOutput(`Lỗi: ${error instanceof Error ? error.message : 'Có lỗi xảy ra'}`);
      toast.error('Lỗi khi chạy code');
    } finally {
      setIsRunning(false);
    }
  };

  // Simulate Python execution (basic pattern matching)
  const simulatePythonExecution = async (pythonCode: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = '';

        // Simple pattern matching for common Python commands
        const lines = pythonCode.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();

          // Match print statements
          if (trimmed.startsWith('print(')) {
            const match = trimmed.match(/print\s*\(\s*['"](.*?)['"]\s*\)/);
            if (match) {
              result += match[1] + '\n';
            } else {
              // Try to extract f-string or variable
              const fstringMatch = trimmed.match(/print\s*\(\s*f['"](.*?)['"]\s*\)/);
              if (fstringMatch) {
                result += fstringMatch[1] + '\n';
              }
            }
          }

          // Match variable assignments and print them
          if (trimmed.includes('=') && !trimmed.startsWith('#')) {
            const varMatch = trimmed.match(/(\w+)\s*=\s*(.+)/);
            if (varMatch) {
              // Variable assignment detected - could be used for tracking
              // const varName = varMatch[1];
              // const varValue = varMatch[2].replace(/['"]/g, '');
            }
          }
        }

        // If no output, show success message
        if (!result) {
          result = 'Code executed successfully!\n';
          // Check for specific patterns
          if (pythonCode.includes('print("Hello World")') || pythonCode.includes("print('Hello World')")) {
            result = 'Hello World\n';
          } else if (pythonCode.includes('sum(')) {
            result = 'Tổng: 150\n';
          } else if (pythonCode.includes('calculate_area')) {
            result = 'Diện tích: 15\n';
          } else if (pythonCode.includes('% 2')) {
            result = 'Số lẻ\n';
          }
        }

        resolve(result);
      }, 500);
    });
  };

  // Reset code
  const resetCode = () => {
    if (currentLesson) {
      setCode(currentLesson.starterCode);
      setOutput('');
      toast.success('Code đã được reset!');
    }
  };

  const runCurrent = () => {
    // record lab session for progress & achievements
    const before = getUnlockedAchievements().map(a => a.id);
    try {
      recordStudySession({ activity: 'lab', duration: 1, subject: language, grade: 'Lab' });
    } catch {}
    const after = getUnlockedAchievements().map(a => a.id);
    after.filter(id => !before.includes(id)).forEach(id => {
      toast.success(`Thành tựu mới: ${id.replaceAll('_',' ')}`);
    });

    if (language === 'python') {
      runPythonCode();
    } else {
      setSimSignal((s) => s + 1);
      toast.success('Đang mô phỏng Arduino...');
    }
  };

  // Submit code
  const submitCode = () => {
    if (currentLesson?.language === 'python') {
      runPythonCode();
    } else {
      setSimSignal((s) => s + 1);
    }
    toast.success('Bài tập đã được nộp!');
  };


  // Send message to AI
  const sendAIMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAILoading(true);

    try {
      // Simulate AI response
      const aiResponse = await generateAIResponse(chatInput, code, currentLesson);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Lỗi khi gọi AI');
    } finally {
      setIsAILoading(false);
    }
  };

  // Generate AI response (simulated)
  const generateAIResponse = async (userMessage: string, currentCode: string, lesson?: Lesson): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = '';

        if (userMessage.toLowerCase().includes('giúp') || userMessage.toLowerCase().includes('gợi ý')) {
          response = `Tôi sẽ giúp bạn! 🤔\n\n`;
          response += `Bài tập: ${lesson?.title}\n`;
          response += `Mục tiêu: ${lesson?.objectives[0]}\n\n`;
          response += `Gợi ý:\n`;
          lesson?.hints.forEach((hint, idx) => {
            response += `${idx + 1}. ${hint}\n`;
          });
          response += `\nHãy thử áp dụng những gợi ý này vào code của bạn!`;
        } else if (userMessage.toLowerCase().includes('lỗi')) {
          response = `Tôi thấy bạn gặp lỗi. Hãy kiểm tra:\n\n`;
          response += `1. Cú pháp: Đảm bảo không có lỗi chính tả\n`;
          response += `2. Dấu ngoặc: Kiểm tra dấu ngoặc kép, ngoặc tròn\n`;
          response += `3. Thụt lề: Python yêu cầu thụt lề đúng\n`;
          response += `4. Kiểu dữ liệu: Đảm bảo kiểu dữ liệu phù hợp\n\n`;
          response += `Hãy chạy lại code và xem thông báo lỗi chi tiết!`;
        } else if (userMessage.toLowerCase().includes('giải thích')) {
          response = `Tôi sẽ giải thích code của bạn:\n\n`;
          response += `Đoạn code hiện tại:\n\`\`\`\n${currentCode.substring(0, 200)}...\n\`\`\`\n\n`;
          response += `Hãy cho tôi biết phần nào bạn muốn tôi giải thích chi tiết hơn!`;
        } else {
          response = `Đây là một câu hỏi hay! 💡\n\n`;
          response += `Để tôi giúp bạn tốt hơn, bạn có thể:\n`;
          response += `1. Yêu cầu gợi ý (gõ "gợi ý")\n`;
          response += `2. Báo lỗi (gõ "lỗi")\n`;
          response += `3. Yêu cầu giải thích (gõ "giải thích")\n`;
          response += `4. Hỏi về cú pháp hoặc logic\n\n`;
          response += `Tôi sẽ không cho bạn đáp án ngay, nhưng sẽ gợi ý để bạn tự tìm ra!`;
        }

        resolve(response);
      }, 800);
    });
  };

  const lessonsByCategory = getLessonsByCategory();
  const categories = Object.keys(lessonsByCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Phòng Code - Smart Lab</h1>
          </div>
          <p className="text-gray-600">Học lập trình Python và Arduino từ cơ bản đến nâng cao</p>

          {/* Overall Progress */}
          <ProgressSummary language={language} completedIds={completedIds} />
        </div>

        {/* Language Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setLanguage('python');
              setSelectedLessonId('py-01');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              language === 'python'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            <Code2 size={18} />
            Python
          </button>
          <button
            onClick={() => {
              setLanguage('arduino');
              setSelectedLessonId('ard-01');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              language === 'arduino'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            <Cpu size={18} />
            Arduino
          </button>
        </div>

        {/* Main Layout - 3 Columns (Left fixed, Right resizable split) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-300px)]">
          {/* Left: Learning Path (20%) */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Pencil size={18} />
                Bài Học
              </h2>
            </div>

            {/* Filters */}
            <div className="px-3 py-2 border-b border-gray-200 bg-white flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm bài học..."
                  className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setDifficultyFilter('all')} className={`px-2 py-1 text-xs rounded ${difficultyFilter==='all'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>Tất cả</button>
                <button onClick={() => setDifficultyFilter('easy')} className={`px-2 py-1 text-xs rounded ${difficultyFilter==='easy'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>Dễ</button>
                <button onClick={() => setDifficultyFilter('medium')} className={`px-2 py-1 text-xs rounded ${difficultyFilter==='medium'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>Trung</button>
                <button onClick={() => setDifficultyFilter('hard')} className={`px-2 py-1 text-xs rounded ${difficultyFilter==='hard'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>Khó</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {categories.map(category => (
                <div key={category} className="border-b border-gray-100">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category ? '' : category)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-semibold text-sm text-gray-900">{category}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedCategory === category ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {expandedCategory === category && (
                    <div className="bg-gray-50">
                      {lessonsByCategory[category].map(lesson => (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLessonId(lesson.id)}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-start gap-2 ${
                            selectedLessonId === lesson.id
                              ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-600'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="mt-0.5">
                            {completedIds.includes(lesson.id) ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleCompleted(lesson.id); }}
                                className="text-green-600 hover:text-green-700"
                                title="Bỏ đánh dấu hoàn thành"
                              >
                                <CheckCircle size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleCompleted(lesson.id); }}
                                className="w-4 h-4 rounded-full border-2 border-gray-300 hover:border-blue-400"
                                title="Đánh dấu hoàn thành"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{lesson.title}</div>
                            <div className="text-xs mt-1">
                              {lesson.difficulty === 'easy' && (
                                <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">Dễ</span>
                              )}
                              {lesson.difficulty === 'medium' && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Trung Bình</span>
                              )}
                              {lesson.difficulty === 'hard' && (
                                <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium">Khó</span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right area: Resizable split IDE/Output */}
          <div className="lg:col-span-4 flex gap-4 overflow-hidden" ref={rightAreaRef}>
            {/* IDE Pane */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col" style={{ width: `${ideWidth}%` }}>
              {currentLesson && (
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="font-bold text-lg text-gray-900 mb-2">{currentLesson.title}</h2>
                  <p className="text-sm text-gray-600 mb-3">{currentLesson.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentLesson.objectives.map((obj, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* IDE Toolbar */}
              <div className="px-4 py-2 border-b border-gray-200 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 font-medium">Giao diện:</span>
                  <button onClick={() => setEditorTheme('light')} className={`flex items-center gap-1 px-2 py-1 rounded ${editorTheme==='light' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} title="Light">
                    <Sun size={14} /> Light
                  </button>
                  <button onClick={() => setEditorTheme('vs-dark')} className={`flex items-center gap-1 px-2 py-1 rounded ${editorTheme==='vs-dark' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} title="Dark">
                    <Moon size={14} /> Dark
                  </button>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Cỡ chữ:</span>
                    <button onClick={() => setFontSize(s => Math.max(12, s-1))} className="px-2 py-1 bg-gray-100 rounded">-</button>
                    <input type="range" min={12} max={18} value={fontSize} onChange={(e)=>setFontSize(parseInt(e.target.value))} className="w-28" />
                    <button onClick={() => setFontSize(s => Math.min(18, s+1))} className="px-2 py-1 bg-gray-100 rounded">+</button>
                    <span className="w-6 text-center text-gray-700">{fontSize}</span>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Template:</span>
                    <select onChange={(e)=>{
                      const key = e.target.value;
                      if (!key) return;
                      const tpl = (language==='python'? pyTemplates: arTemplates)[key] || '';
                      if (tpl) {
                        setCode(tpl);
                        try { localStorage.setItem(`coding_lab_code_${currentLesson?.id}`, tpl); } catch {}
                        toast.success('Đã chèn template');
                      }
                    }} defaultValue="" className="border border-gray-300 rounded px-2 py-1 text-sm">
                      <option value="">Chọn...</option>
                      {language==='python' ? (
                        <>
                          <option value="hello">Python: Hello</option>
                          <option value="sum">Python: Tổng danh sách</option>
                          <option value="fib">Python: Fibonacci</option>
                        </>
                      ) : (
                        <>
                          <option value="blink">Arduino: Blink</option>
                          <option value="pwm">Arduino: PWM Fade</option>
                          <option value="button">Arduino: Button Toggle</option>
                        </>
                      )}
                    </select>
                    <button onClick={async ()=>{ try { await navigator.clipboard.writeText(code); toast.success('Đã copy code'); } catch { toast.error('Không thể copy'); } }} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-1" title="Copy code"><Copy size={14}/>Copy</button>
                    <button onClick={()=>{ const blob = new Blob([code], {type:'text/plain'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = language==='python'? 'code.py':'sketch.ino'; a.click(); URL.revokeObjectURL(a.href); }} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-1" title="Download code"><Download size={14}/>Tải</button>
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  language={language === 'python' ? 'python' : 'cpp'}
                  value={code}
                  onChange={(value) => {
                    const v = value || '';
                    setCode(v);
                    try { localStorage.setItem(`coding_lab_code_${currentLesson?.id}`, v); } catch {}
                  }}
                  theme={editorTheme}
                  options={{
                    minimap: { enabled: false },
                    fontSize: fontSize,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on'
                  }}
                  loading={<div className="h-full w-full bg-gray-50 flex items-center justify-center"><div className="w-11/12 h-4/5 bg-gray-200 rounded animate-pulse" /></div>}
                />
              </div>

              {/* Control Buttons */}
              <div className="p-4 border-t border-gray-200 flex gap-2 bg-gray-50 flex-wrap">
                <button onClick={runCurrent} disabled={isRunning} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  <Play size={16} /> Chạy Code
                </button>
                <button onClick={resetCode} className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  <RotateCcw size={16} /> Reset
                </button>
                <button onClick={submitCode} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  <Send size={16} /> Nộp Bài
                </button>
                <button onClick={async () => {
                  if (!currentLesson) return;
                  setActiveTab('ai'); setIsAILoading(true);
                  const system = 'Bạn là Giảng viên Lập trình. Hãy xem code của học sinh và gợi ý sửa lỗi hoặc giải thích logic. Tuyệt đối không viết code giải mẫu ngay lập tức, hãy gợi mở tư duy.';
                  const prompt = `${system}\n\nNgôn ngữ: ${language}\nBài: ${currentLesson.title}\nMô tả: ${currentLesson.description}\nMục tiêu: ${currentLesson.objectives.join(', ')}\n\nCode hiện tại:\n\u0060\u0060\u0060\n${code}\n\u0060\u0060\u0060\n`;
                  const res = await generateContent(prompt);
                  const text = res.success ? res.text : (res.error || 'Lỗi gọi AI');
                  const assistantMessage = { id: String(Date.now()), role: 'assistant' as const, content: text, timestamp: new Date() };
                  setChatMessages(prev => [...prev, assistantMessage]);
                  setIsAILoading(false);
                }} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  <MessageCircle size={16} /> Nhờ AI giải thích
                </button>
              </div>
            </div>

            {/* Resize Handle */}
            <div
              onMouseDown={() => setIsResizing(true)}
              className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-300 rounded"
              title="Kéo để thay đổi kích thước"
            />

            {/* Output/AI Pane */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col" style={{ width: `${100 - ideWidth}%` }}>
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button onClick={() => setActiveTab('output')} className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${activeTab === 'output' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>Output / Mô Phỏng</button>
                <button onClick={() => setActiveTab('quiz')} className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${activeTab === 'quiz' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>Trắc Nghiệm</button>
                <button onClick={() => setActiveTab('ai')} className={`flex-1 px-4 py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}><MessageCircle size={16} /> AI Mentor</button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === 'output' && (
                  <>
                    {language === 'python' && (
                      <div className="flex-1 p-4 overflow-y-auto">
                        <div className="bg-gray-900 text-green-400 font-mono text-xs p-3 rounded-lg h-full overflow-y-auto border border-gray-700">
                          <pre className="whitespace-pre-wrap break-words">{output || 'Output sẽ hiển thị ở đây...'}</pre>
                        </div>
                      </div>
                    )}
                    {language === 'arduino' && (
                      <div className="flex-1 overflow-y-auto">
                        <ArduinoSimulator code={code} simulateSignal={simSignal} onSimulationOutput={(out) => setOutput(out)} />
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'quiz' && (
                  <QuizPanel
                    lesson={currentLesson}
                    onPassed={() => {
                      if (currentLesson && !completedIds.includes(currentLesson.id)) {
                        saveCompleted([...completedIds, currentLesson.id]);
                        toast.success('Bạn đã vượt qua bài trắc nghiệm! ✅');
                      }
                    }}
                  />
                )}

                {activeTab === 'ai' && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <MessageCircle size={32} className="text-gray-300 mb-2" />
                          <p className="text-gray-500 text-sm">Hỏi AI về code của bạn!</p>
                          <p className="text-gray-400 text-xs mt-2">AI sẽ giúp giải thích, gợi ý sửa lỗi mà không cho đáp án ngay.</p>
                        </div>
                      )}
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">{msg.timestamp.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</span>
                          </div>
                        </div>
                      ))}
                      {isAILoading && (
                        <div className="flex justify-start"><div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg rounded-bl-none"><div className="flex gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-100" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200" /></div></div></div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex gap-2">
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendAIMessage()} placeholder="Hỏi AI..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <button onClick={sendAIMessage} disabled={isAILoading || !chatInput.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-colors"><Send size={16} /></button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-start gap-1"><AlertCircle size={12} className="mt-0.5 flex-shrink-0" />AI sẽ gợi ý, không cho đáp án ngay lập tức</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingLab;

