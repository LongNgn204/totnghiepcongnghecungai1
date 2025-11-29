import React, { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Search, Layers, Calendar, BookMarked } from 'lucide-react';
import {
  FlashcardDeck,
  getAllDecks,
  syncDecksFromBackend,
  createDeck,
  saveDeck
} from '../utils/flashcardStorage';

const Flashcards: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Chung',
    grade: '12',
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        // Offline-first: lấy local trước cho hiển thị nhanh
        const local = getAllDecks();
        if (mounted) setDecks(local);
        // Nếu online, sync server rồi merge về local
        const merged = await syncDecksFromBackend();
        if (mounted) setDecks(merged);
      } catch (e) {
        // fallback giữ local
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return decks;
    return decks.filter(d =>
      d.title.toLowerCase().includes(q) ||
      (d.description || '').toLowerCase().includes(q) ||
      (d.category || '').toLowerCase().includes(q)
    );
  }, [decks, query]);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const merged = await syncDecksFromBackend();
      setDecks(merged);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const deck = createDeck(form.title.trim(), form.description.trim(), form.category, form.grade);
    await saveDeck(deck);
    setShowCreate(false);
    setForm({ title: '', description: '', category: 'Chung', grade: '12' });
    // Reload list (local + sync nếu online)
    const local = getAllDecks();
    setDecks(local);
    if (navigator.onLine) {
      await handleSync();
    }
  };

  const formatDate = (iso?: string) => {
    try { return iso ? new Date(iso).toLocaleDateString('vi-VN') : ''; } catch { return ''; }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Flashcards</h2>
          <p className="text-gray-500 dark:text-gray-400">Đồng bộ offline-first. Tạo bộ thẻ và học mọi lúc.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className={`px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 transition-all ${syncing ? 'opacity-60 cursor-wait' : ''}`}
            title="Đồng bộ với máy chủ"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Đồng bộ</span>
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} />
            Tạo bộ thẻ
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bộ thẻ theo tiêu đề, mô tả, danh mục..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card h-48 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chưa có bộ thẻ nào</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Hãy tạo bộ thẻ mới để bắt đầu học tập hiệu quả hơn.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Tạo bộ thẻ ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(deck => (
            <div key={deck.id} className="glass-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 group-hover:text-primary-600 transition-colors">{deck.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mt-1">{deck.description}</p>
                </div>
                <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
                  <Layers size={20} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs font-medium">
                  {deck.category || 'Chung'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookMarked size={14} className="text-primary-500" />
                  {deck.cards?.length || 0} thẻ
                </span>
                <span className="inline-flex items-center gap-1.5 ml-auto text-xs">
                  <Calendar size={14} />
                  {formatDate(deck.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal>
          <div className="glass-panel w-full max-w-md p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tạo bộ thẻ mới</h3>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tiêu đề</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="VD: Từ vựng Công nghệ 12"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-400"
                  rows={3}
                  placeholder="Mô tả ngắn về bộ thẻ này..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Danh mục</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                  >
                    <option>Chung</option>
                    <option>Công nghiệp</option>
                    <option>Nông nghiệp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Lớp</label>
                  <select
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                  >
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-colors">Hủy</button>
                <button type="submit" className="btn-primary py-2.5 px-6 rounded-xl shadow-md">Tạo bộ thẻ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
