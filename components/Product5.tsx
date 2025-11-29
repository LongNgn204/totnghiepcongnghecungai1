import React, { useState, useEffect, useMemo } from 'react';
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
  recordReview,
  getCardsForReview,
  getDeckStats,
  syncDecksFromBackend
} from '../utils/flashcardStorage';
import ProductTemplate from './layout/ProductTemplate';
import { Layers3, Sparkles, Brain, RefreshCcw, FolderPlus, BookOpenCheck } from 'lucide-react';

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
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('');

  const loadDecks = () => {
    setLoading(true);
    const allDecks = getAllDecks();
    setDecks(allDecks);
    // Use a simpler timestamp approach or fetch from a dedicated sync manager if available.
    // For now, we'll just show the current time if we just synced.
    setLoading(false);
  };

  const handleSync = async () => {
    setLoading(true);
    await syncDecksFromBackend();
    setLastSyncedAt(new Date().toLocaleString('vi-VN'));
    loadDecks();
    setLoading(false);
  };

  useEffect(() => {
    loadDecks();
    window.addEventListener('sync-completed', loadDecks);
    return () => window.removeEventListener('sync-completed', loadDecks);
  }, []);

  const totalCards = useMemo(() => decks.reduce((sum, deck) => sum + deck.cards.length, 0), [decks]);
  const dueCardsCount = useMemo(() => {
    return decks.reduce((sum, deck) => {
      const stats = getDeckStats(deck.id);
      return sum + (stats?.dueCards || 0);
    }, 0);
  }, [decks]);
  const masteredCards = useMemo(() => {
    return decks.reduce((sum, deck) => {
      const stats = getDeckStats(deck.id);
      return sum + (stats?.masteredCards || 0);
    }, 0);
  }, [decks]);

  const handleCreateDeck = () => {
    if (!newDeckTitle.trim()) return;
    // createDeck(title, description, category, grade)
    const newDeck = createDeck(newDeckTitle, newDeckDescription, 'Chung', '12');
    saveDeck(newDeck);
    setNewDeckTitle('');
    setNewDeckDescription('');
    setShowCreateDeck(false);
    loadDecks();
  };

  const handleCreateCard = () => {
    if (!selectedDeck || !newCardFront.trim() || !newCardBack.trim()) return;

    // addCardToDeck expects Omit<Flashcard, 'id' ...>
    // We construct the partial card here
    const newCardPart = {
      question: newCardFront,
      answer: newCardBack,
      difficulty: 'medium' as 'medium',
      tags: [],
      // Other fields like createdAt, reviewCount are handled by addCardToDeck
    };

    addCardToDeck(selectedDeck.id, newCardPart);
    setNewCardFront('');
    setNewCardBack('');
    setShowCreateCard(false);
    loadDecks();
    // Update selected deck
    const updatedDeck = getDeck(selectedDeck.id);
    if (updatedDeck) setSelectedDeck(updatedDeck);
  };

  const handleDeleteDeck = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bộ thẻ này?')) {
      deleteDeck(id);
      loadDecks();
      if (selectedDeck?.id === id) setSelectedDeck(null);
    }
  };

  const handleStartStudy = (deck: FlashcardDeck) => {
    const cards = getCardsForReview(deck.id);
    if (cards.length === 0) {
      alert('Không có thẻ nào cần ôn tập lúc này!');
      return;
    }
    setSelectedDeck(deck);
    setStudyCards(cards);
    setCurrentCardIndex(0);
    setActiveTab('study');
  };

  const handleAnswer = (correct: boolean) => {
    if (!selectedDeck || studyCards.length === 0) return;
    const card = studyCards[currentCardIndex];
    recordReview(selectedDeck.id, card.id, correct);

    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      alert('Đã hoàn thành phiên ôn tập!');
      setActiveTab('decks');
      loadDecks();
    }
  };

  const handleSaveGeneratedCards = (deckName: string) => {
    const newDeck = createDeck(deckName, 'Được tạo bởi AI', 'Chung', '12');
    saveDeck(newDeck); // Save first to establish ID

    generatedCards.forEach(card => {
      const newCardPart = {
        question: card.front,
        answer: card.back,
        difficulty: 'medium' as 'medium',
        tags: [],
      };
      addCardToDeck(newDeck.id, newCardPart);
    });

    setGeneratedCards([]);
    setActiveTab('decks');
    loadDecks();
  };

  const sidebarContent = (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpenCheck className="w-4 h-4 text-blue-600" />
          Tổng quan học tập
        </h4>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Bộ thẻ</span>
            <span className="font-bold text-gray-900 dark:text-white">{decks.length}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Thẻ đã tạo</span>
            <span className="font-bold text-gray-900 dark:text-white">{totalCards}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Thẻ đến hạn</span>
            <span className="font-bold text-amber-500">{dueCardsCount}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Đã thuần thục</span>
            <span className="font-bold text-emerald-500">{masteredCards}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Đồng bộ cuối: {lastSyncedAt || 'Chưa đồng bộ'}</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-3">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Layers3 className="w-4 h-4 text-purple-600" />
          Hành động nhanh
        </h4>
        <button
          onClick={() => setShowCreateDeck(true)}
          className="w-full btn-primary py-2.5 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2"
        >
          <FolderPlus className="w-4 h-4" />
          Tạo bộ thẻ
        </button>
        <button
          onClick={handleSync}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Đồng bộ lại
        </button>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-blue-500">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          Mẹo ôn tập
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc pl-4">
          <li>Ôn tối đa 20 thẻ/lượt để não không quá tải.</li>
          <li>Đánh dấu thẻ khó và ôn lại ngay trong ngày.</li>
          <li>Luôn đồng bộ sau khi chỉnh sửa để tránh mất dữ liệu.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ProductTemplate
      icon={<Brain className="w-28 h-28 text-white/40" />}
      title="Sản phẩm học tập số 5: Flashcards thông minh"
      subtitle="Tạo bộ thẻ, dùng AI hỗ trợ và ôn luyện theo spaced repetition với đồng bộ offline-first"
      heroGradientFrom="from-blue-700"
      heroGradientTo="to-purple-600"
      sidebar={sidebarContent}
    >
      <div className="space-y-8 animate-fade-in">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold">Bộ thẻ</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 flex items-center gap-2">
              <Layers3 className="w-6 h-6 text-blue-600" />
              {decks.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Phủ đủ Công nghiệp, Nông nghiệp, Chung.</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold">Thẻ đã tạo</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              {totalCards}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Sẵn sàng tùy chỉnh, thêm ảnh & tags phong phú.</p>
          </div>
          <div className="glass-card p-6 border-t-4 border-t-amber-500">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold">Thẻ đến hạn ôn</p>
            <p className="text-3xl font-bold text-amber-500 mt-2">{dueCardsCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Ưu tiên ôn trong tab “Ôn tập” để giữ streak.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-1.5 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('decks')}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'decks'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
          >
            <Layers3 className="w-4 h-4" />
            Bộ thẻ ({decks.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'ai'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
          >
            <Sparkles className="w-4 h-4" />
            Tạo bằng AI
          </button>
          <button
            onClick={() => setActiveTab('study')}
            disabled={!selectedDeck || studyCards.length === 0}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'study'
              ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
          >
            <Brain className="w-4 h-4" />
            Ôn tập
          </button>
        </div>

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div className="animate-fade-in">
            <FlashcardGenerator onGenerate={(cards) => setGeneratedCards(cards)} />
            {generatedCards.length > 0 && (
              <div className="glass-card p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kết quả tạo thẻ ({generatedCards.length})</h3>
                  <button
                    onClick={() => {
                      const name = prompt("Nhập tên bộ thẻ mới:");
                      if (name) handleSaveGeneratedCards(name);
                    }}
                    className="btn-primary px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Lưu thành bộ thẻ mới
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {generatedCards.map((card, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">Q: {card.front}</p>
                      <p className="text-gray-600 dark:text-gray-400">A: {card.back}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Decks Tab */}
        {activeTab === 'decks' && (
          <div className="grid gap-6 animate-fade-in">
            {decks.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layers3 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chưa có bộ thẻ nào</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Tạo bộ thẻ thủ công hoặc dùng AI để bắt đầu học tập ngay.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setShowCreateDeck(true)} className="btn-primary px-6 py-2.5 rounded-xl font-bold">
                    Tạo thủ công
                  </button>
                  <button onClick={() => setActiveTab('ai')} className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                    Dùng AI tạo
                  </button>
                </div>
              </div>
            ) : (
              decks.map(deck => {
                const stats = getDeckStats(deck.id);
                return (
                  <div key={deck.id} className="glass-card p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all group relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{deck.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{deck.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedDeck(deck);
                            setShowCreateCard(true);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                          title="Thêm thẻ"
                        >
                          <FolderPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeck(deck.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                          title="Xóa bộ thẻ"
                        >
                          <span className="text-lg leading-none">×</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="block font-bold text-gray-900 dark:text-white text-lg">{deck.cards.length}</span>
                        <span className="text-gray-500">Tổng thẻ</span>
                      </div>
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <span className="block font-bold text-amber-600 dark:text-amber-400 text-lg">{stats?.dueCards || 0}</span>
                        <span className="text-amber-600/80 dark:text-amber-400/80">Cần ôn</span>
                      </div>
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <span className="block font-bold text-emerald-600 dark:text-emerald-400 text-lg">{stats?.masteredCards || 0}</span>
                        <span className="text-emerald-600/80 dark:text-emerald-400/80">Thuần thục</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartStudy(deck)}
                      className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Brain className="w-4 h-4" />
                      Ôn tập ngay
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Study Tab */}
        {activeTab === 'study' && selectedDeck && studyCards.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{selectedDeck.title}</h3>
                <p className="text-sm text-gray-500">Thẻ {currentCardIndex + 1} / {studyCards.length}</p>
              </div>
              <button
                onClick={() => setActiveTab('decks')}
                className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
              >
                Kết thúc
              </button>
            </div>
            <FlashcardView card={studyCards[currentCardIndex]} onAnswer={handleAnswer} showButtons={true} />
          </div>
        )}

        {/* Modals */}
        {showCreateDeck && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-md p-6 animate-scale-in">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tạo bộ thẻ mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên bộ thẻ</label>
                  <input
                    type="text"
                    value={newDeckTitle}
                    onChange={(e) => setNewDeckTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="VD: Công nghệ 10 - Chương 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
                  <textarea
                    value={newDeckDescription}
                    onChange={(e) => setNewDeckDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Mô tả ngắn về nội dung..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateDeck(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateDeck}
                    disabled={!newDeckTitle.trim()}
                    className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
                  >
                    Tạo bộ thẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCreateCard && selectedDeck && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-lg p-6 animate-scale-in">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thêm thẻ mới vào "{selectedDeck.title}"</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mặt trước (Câu hỏi)</label>
                  <textarea
                    value={newCardFront}
                    onChange={(e) => setNewCardFront(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Nhập câu hỏi hoặc từ vựng..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mặt sau (Đáp án)</label>
                  <textarea
                    value={newCardBack}
                    onChange={(e) => setNewCardBack(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Nhập câu trả lời hoặc định nghĩa..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateCard(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateCard}
                    disabled={!newCardFront.trim() || !newCardBack.trim()}
                    className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
                  >
                    Thêm thẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProductTemplate>
  );
};

export default Product5;
