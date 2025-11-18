import React, { useState, useEffect } from 'react';
import FlashcardView from './FlashcardView';
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
  getDeckStats
} from '../utils/flashcardStorage';

const Product5: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'decks' | 'study' | 'create'>('decks');
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);

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

  const loadDecks = () => {
    setDecks(getAllDecks());
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
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-2">
          <i className="fas fa-layer-group mr-2"></i>
          Sản Phẩm 5: Flashcards - Học Thông Minh
        </h2>
        <p className="text-center text-pink-100">
          Tạo flashcards, ôn tập theo phương pháp spaced repetition, theo dõi tiến độ học tập
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-lg shadow-md p-2">
        <button
          onClick={() => setActiveTab('decks')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'decks'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <i className="fas fa-folder mr-2"></i>
          Bộ thẻ của tôi ({decks.length})
        </button>
        <button
          onClick={() => setActiveTab('study')}
          disabled={!selectedDeck}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'study' && selectedDeck
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          <i className="fas fa-brain mr-2"></i>
          Ôn tập
        </button>
        <button
          onClick={() => {
            setShowCreateDeck(true);
            setActiveTab('create');
          }}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'create'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <i className="fas fa-plus-circle mr-2"></i>
          Tạo bộ thẻ mới
        </button>
      </div>

      {/* Decks Tab */}
      {activeTab === 'decks' && (
        <div className="grid gap-6">
          {decks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <i className="fas fa-layer-group text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có bộ thẻ nào</h3>
              <p className="text-gray-500 mb-6">Tạo bộ thẻ đầu tiên để bắt đầu học!</p>
              <button
                onClick={() => {
                  setShowCreateDeck(true);
                  setActiveTab('create');
                }}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Tạo bộ thẻ mới
              </button>
            </div>
          ) : (
            decks.map(deck => {
              const stats = getDeckStats(deck.id);
              return (
                <div
                  key={deck.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-gray-200 hover:border-pink-400"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">{deck.title}</h3>
                        <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-bold">
                          {deck.category}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                          Lớp {deck.grade}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{deck.description}</p>
                      
                      {stats && (
                        <div className="grid grid-cols-5 gap-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.totalCards}</div>
                            <div className="text-xs text-gray-600">Tổng thẻ</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.masteredCards}</div>
                            <div className="text-xs text-gray-600">Thành thạo</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{stats.learningCards}</div>
                            <div className="text-xs text-gray-600">Đang học</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{stats.newCards}</div>
                            <div className="text-xs text-gray-600">Mới</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.dueCards}</div>
                            <div className="text-xs text-gray-600">Cần ôn</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startStudySession(deck)}
                      disabled={stats?.dueCards === 0}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-brain mr-2"></i>
                      Ôn tập ngay ({stats?.dueCards || 0})
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDeck(deck);
                        setShowCreateCard(true);
                      }}
                      className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteDeck(deck.id)}
                      className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold"
                    >
                      <i className="fas fa-trash"></i>
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
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Thẻ {currentCardIndex + 1} / {studyCards.length}
              </span>
              <span className="text-sm text-gray-600">
                {selectedDeck.title}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pink-600 to-rose-600 h-3 rounded-full transition-all duration-500"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              <i className="fas fa-plus-circle text-pink-600 mr-2"></i>
              Tạo bộ thẻ mới
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên bộ thẻ *
                </label>
                <input
                  type="text"
                  value={deckForm.title}
                  onChange={(e) => setDeckForm({ ...deckForm, title: e.target.value })}
                  placeholder="VD: Mạch điện ba pha"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={deckForm.description}
                  onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về nội dung bộ thẻ"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={deckForm.category}
                    onChange={(e) => setDeckForm({ ...deckForm, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="Công nghiệp">Công nghiệp</option>
                    <option value="Nông nghiệp">Nông nghiệp</option>
                    <option value="Chung">Chung</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lớp
                  </label>
                  <select
                    value={deckForm.grade}
                    onChange={(e) => setDeckForm({ ...deckForm, grade: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    {['6', '7', '8', '9', '10', '11', '12'].map(g => (
                      <option key={g} value={g}>Lớp {g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateDeck(false);
                  setActiveTab('decks');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateDeck}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <i className="fas fa-check mr-2"></i>
                Tạo bộ thẻ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Card Modal */}
      {showCreateCard && selectedDeck && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              <i className="fas fa-plus text-pink-600 mr-2"></i>
              Thêm thẻ vào: {selectedDeck.title}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Câu hỏi *
                </label>
                <textarea
                  value={cardForm.question}
                  onChange={(e) => setCardForm({ ...cardForm, question: e.target.value })}
                  placeholder="VD: Công thức tính công suất trong mạch điện ba pha là gì?"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Đáp án *
                </label>
                <textarea
                  value={cardForm.answer}
                  onChange={(e) => setCardForm({ ...cardForm, answer: e.target.value })}
                  placeholder="VD: P = √3 × U × I × cosφ"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Độ khó
                </label>
                <div className="flex gap-3">
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <button
                      key={diff}
                      onClick={() => setCardForm({ ...cardForm, difficulty: diff })}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                        cardForm.difficulty === diff
                          ? diff === 'easy' ? 'bg-green-500 text-white'
                          : diff === 'medium' ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {diff === 'easy' ? 'Dễ' : diff === 'medium' ? 'Trung bình' : 'Khó'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (nhãn)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={cardForm.tagInput}
                    onChange={(e) => setCardForm({ ...cardForm, tagInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Thêm tag và nhấn Enter"
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {cardForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cardForm.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-pink-600 hover:text-pink-800"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateCard(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateCard}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <i className="fas fa-check mr-2"></i>
                Thêm thẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product5;
