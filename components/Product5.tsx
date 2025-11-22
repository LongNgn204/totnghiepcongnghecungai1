import React, { useState, useEffect } from 'react';
import FlashcardView from './FlashcardView';
import FlashcardGenerator, { GeneratedFlashcard } from './FlashcardGenerator';
import {
  FlashcardDeck,
  Flashcard,
  getAllDecks,
  getDeck,
  createDeck,
  saveDeck,
  deleteDeck,
  addCardToDeck,
  deleteCard,
  recordReview,
  getCardsForReview,
  getDeckStats,
  syncDecksFromBackend
} from '../utils/flashcardStorage';

const Product5: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'decks' | 'study' | 'create' | 'ai'>('decks');
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<GeneratedFlashcard[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [deckForm, setDeckForm] = useState({
    title: '',
    description: '',
    category: 'Công nghiệp',
    grade: '12'
  });

  const [cardForm, setCardForm] = useState({
    question: '',
    answer: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: [] as string[],
    tagInput: ''
  });

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    setLoading(true);
    // Load local first for immediate UI
    setDecks(getAllDecks());
    // Then sync
    const syncedDecks = await syncDecksFromBackend();
    setDecks(syncedDecks);
    setLoading(false);
  };

  const handleCreateDeck = () => {
    if (!deckForm.title.trim()) {
      alert('Vui lòng nhập tên bộ thẻ');
      return;
    }

    const newDeck = createDeck(
      deckForm.title,
      deckForm.description,
      deckForm.category,
      deckForm.grade
    );

    saveDeck(newDeck);
    loadDecks();
    setShowCreateDeck(false);
    setDeckForm({ title: '', description: '', category: 'Công nghiệp', grade: '12' });
  };

  const handleDeleteDeck = (deckId: string) => {
    if (confirm('Bạn có chắc muốn xóa bộ thẻ này?')) {
      deleteDeck(deckId);
      loadDecks();
      if (selectedDeck?.id === deckId) {
        setSelectedDeck(null);
      }
    }
  };

  const handleCreateCard = () => {
    if (!selectedDeck) return;
    if (!cardForm.question.trim() || !cardForm.answer.trim()) {
      alert('Vui lòng nhập đầy đủ câu hỏi và đáp án');
      return;
    }

    addCardToDeck(selectedDeck.id, {
      question: cardForm.question,
      answer: cardForm.answer,
      difficulty: cardForm.difficulty,
      tags: cardForm.tags
    });

    const updatedDeck = getDeck(selectedDeck.id);
    if (updatedDeck) {
      setSelectedDeck(updatedDeck);
    }
    loadDecks();
    setShowCreateCard(false);
    setCardForm({
      question: '',
      answer: '',
      difficulty: 'medium',
      tags: [],
      tagInput: ''
    });
  };

  const handleAddTag = () => {
    if (cardForm.tagInput.trim() && !cardForm.tags.includes(cardForm.tagInput.trim())) {
      setCardForm({
        ...cardForm,
        tags: [...cardForm.tags, cardForm.tagInput.trim()],
        tagInput: ''
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCardForm({
      ...cardForm,
      tags: cardForm.tags.filter(t => t !== tag)
    });
  };

  const startStudySession = (deck: FlashcardDeck) => {
    const dueCards = getCardsForReview(deck.id);
    if (dueCards.length === 0) {
      alert('Không có thẻ nào cần ôn tập!');
      return;
    }
    setSelectedDeck(deck);
    setStudyCards(dueCards);
    setCurrentCardIndex(0);
    setActiveTab('study');
  };

  const handleAnswer = (correct: boolean) => {
    if (!selectedDeck || !studyCards[currentCardIndex]) return;

    recordReview(selectedDeck.id, studyCards[currentCardIndex].id, correct);

    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Session complete
      alert(`Hoàn thành! Bạn đã ôn ${studyCards.length} thẻ.`);
      setActiveTab('decks');
      loadDecks();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 flex items-center justify-center gap-3">
          🧠 Sản Phẩm 5: Flashcards - Học Thông Minh
        </h2>
        <p className="text-center text-gray-600">
          Tạo flashcards, ôn tập theo phương pháp spaced repetition, theo dõi tiến độ học tập
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-lg shadow-sm p-2 border border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('decks')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'decks'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          📂 Bộ thẻ ({decks.length})
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'ai'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          ✨ AI tạo thẻ
        </button>
        <button
          onClick={() => setActiveTab('study')}
          disabled={!selectedDeck}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'study' && selectedDeck
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
        >
          🧠 Ôn tập
        </button>
        <button
          onClick={() => {
            setShowCreateDeck(true);
            setActiveTab('create');
          }}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'create'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          ➕ Tạo bộ thẻ mới
        </button>
      </div>

      {/* AI Tab */}
      {activeTab === 'ai' && (
        <div>
          <FlashcardGenerator
            onGenerate={(cards) => {
              setGeneratedCards(cards);
            }}
          />

          {generatedCards.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  ✅ Đã tạo {generatedCards.length} flashcards
                </h3>
                <button
                  onClick={() => setGeneratedCards([])}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  ❌
                </button>
              </div>

              {/* Preview cards */}
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {generatedCards.map((card, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-all bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                          <span className="text-blue-500 mt-1 shrink-0">❓</span>
                          {card.front}
                        </p>
                        <p className="text-gray-600 text-sm mb-2 flex items-start gap-2">
                          <span className="text-green-500 mt-1 shrink-0">💡</span>
                          {card.back}
                        </p>
                        {card.explanation && (
                          <p className="text-gray-500 text-xs italic flex items-start gap-2 mt-2 pt-2 border-t border-gray-200">
                            <span className="text-gray-400 mt-0.5 shrink-0">📖</span>
                            {card.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save to deck */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                  💾 Lưu vào bộ thẻ nào?
                </p>
                <div className="flex gap-3">
                  <select
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    id="saveDeckSelect"
                  >
                    <option value="">-- Tạo bộ thẻ mới --</option>
                    {decks.map(deck => (
                      <option key={deck.id} value={deck.id}>{deck.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const selectEl = document.getElementById('saveDeckSelect') as HTMLSelectElement;
                      const deckId = selectEl.value;

                      if (!deckId) {
                        // Create new deck
                        const deckTitle = prompt('Tên bộ thẻ mới:', 'Flashcards AI');
                        if (!deckTitle) return;

                        const newDeck = createDeck(
                          deckTitle,
                          'Tạo bởi AI',
                          'AI Generated',
                          '10'
                        );

                        // Add all cards
                        generatedCards.forEach(card => {
                          addCardToDeck(newDeck.id, {
                            question: card.front,
                            answer: card.back + (card.explanation ? `\n\n${card.explanation}` : ''),
                            difficulty: 'medium',
                            tags: ['AI']
                          });
                        });

                        alert(`Đã tạo bộ thẻ "${deckTitle}" với ${generatedCards.length} thẻ!`);
                      } else {
                        // Add to existing deck
                        generatedCards.forEach(card => {
                          addCardToDeck(deckId, {
                            question: card.front,
                            answer: card.back + (card.explanation ? `\n\n${card.explanation}` : ''),
                            difficulty: 'medium',
                            tags: ['AI']
                          });
                        });

                        const deck = getDeck(deckId);
                        alert(`Đã thêm ${generatedCards.length} thẻ vào "${deck?.title}"!`);
                      }

                      setGeneratedCards([]);
                      loadDecks();
                      setActiveTab('decks');
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md flex items-center gap-2"
                  >
                    💾 Lưu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decks Tab */}
      {activeTab === 'decks' && (
        <div className="grid gap-6">
          {decks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📂</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có bộ thẻ nào</h3>
              <p className="text-gray-500 mb-8">Tạo bộ thẻ đầu tiên để bắt đầu học!</p>
              <button
                onClick={() => {
                  setShowCreateDeck(true);
                  setActiveTab('create');
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center mx-auto gap-2 font-bold shadow-lg"
              >
                ➕ Tạo bộ thẻ mới
              </button>
            </div>
          ) : (
            decks.map(deck => {
              const stats = getDeckStats(deck.id);
              return (
                <div
                  key={deck.id}
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-blue-300 group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{deck.title}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                          {deck.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">
                          Lớp {deck.grade}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-6">{deck.description}</p>

                      {stats && (
                        <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.totalCards}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">Tổng thẻ</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.masteredCards}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">Thành thạo</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{stats.learningCards}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">Đang học</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{stats.newCards}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">Mới</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.dueCards}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">Cần ôn</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => startStudySession(deck)}
                      disabled={stats?.dueCards === 0}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      🧠 Ôn tập ngay ({stats?.dueCards || 0})
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDeck(deck);
                        setShowCreateCard(true);
                      }}
                      className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-all font-bold flex items-center justify-center"
                      title="Thêm thẻ"
                    >
                      ➕
                    </button>
                    <button
                      onClick={() => handleDeleteDeck(deck.id)}
                      className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all font-bold flex items-center justify-center"
                      title="Xóa bộ thẻ"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Study Tab */}
      {activeTab === 'study' && selectedDeck && studyCards.length > 0 && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <span className="text-blue-600">📂</span>
                Thẻ {currentCardIndex + 1} / {studyCards.length}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {selectedDeck.title}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentCardIndex + 1) / studyCards.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Card */}
          <FlashcardView
            card={studyCards[currentCardIndex]}
            onAnswer={handleAnswer}
            showButtons={true}
          />
        </div>
      )}

      {/* Create Deck Modal */}
      {showCreateDeck && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">➕</span>
              Tạo bộ thẻ mới
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tên bộ thẻ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deckForm.title}
                  onChange={(e) => setDeckForm({ ...deckForm, title: e.target.value })}
                  placeholder="VD: Mạch điện ba pha"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={deckForm.description}
                  onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về nội dung bộ thẻ"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={deckForm.category}
                    onChange={(e) => setDeckForm({ ...deckForm, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="Công nghiệp">Công nghiệp</option>
                    <option value="Nông nghiệp">Nông nghiệp</option>
                    <option value="Chung">Chung</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Lớp
                  </label>
                  <select
                    value={deckForm.grade}
                    onChange={(e) => setDeckForm({ ...deckForm, grade: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  >
                    {['6', '7', '8', '9', '10', '11', '12'].map(g => (
                      <option key={g} value={g}>Lớp {g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowCreateDeck(false);
                  setActiveTab('decks');
                }}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateDeck}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md flex items-center justify-center gap-2"
              >
                ✅ Tạo bộ thẻ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Card Modal */}
      {showCreateCard && selectedDeck && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">➕</span>
              Thêm thẻ vào: <span className="text-blue-600">{selectedDeck.title}</span>
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Câu hỏi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cardForm.question}
                  onChange={(e) => setCardForm({ ...cardForm, question: e.target.value })}
                  placeholder="VD: Công thức tính công suất trong mạch điện ba pha là gì?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Đáp án <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cardForm.answer}
                  onChange={(e) => setCardForm({ ...cardForm, answer: e.target.value })}
                  placeholder="VD: P = √3 × U × I × cosφ"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Độ khó
                </label>
                <div className="flex gap-3">
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <button
                      key={diff}
                      onClick={() => setCardForm({ ...cardForm, difficulty: diff })}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${cardForm.difficulty === diff
                        ? diff === 'easy' ? 'bg-green-500 text-white shadow-md'
                          : diff === 'medium' ? 'bg-yellow-500 text-white shadow-md'
                            : 'bg-red-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {diff === 'easy' ? 'Dễ' : diff === 'medium' ? 'Trung bình' : 'Khó'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tags (nhãn)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={cardForm.tagInput}
                    onChange={(e) => setCardForm({ ...cardForm, tagInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Thêm tag và nhấn Enter"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all font-bold"
                  >
                    ➕
                  </button>
                </div>
                {cardForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cardForm.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-100"
                      >
                        <span className="text-xs">🏷️</span>
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-400 hover:text-blue-600"
                        >
                          ❌
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowCreateCard(false)}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateCard}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md flex items-center justify-center gap-2"
              >
                ✅ Thêm thẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product5;
