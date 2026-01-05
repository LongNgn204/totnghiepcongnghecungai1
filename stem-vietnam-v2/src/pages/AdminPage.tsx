// Chú thích: Admin Dashboard - Quản lý users (chỉ chạy local)
import { useState, useEffect } from 'react';
import { Users, MessageSquare, Trash2, Edit2, Search, RefreshCw, BarChart3, X, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://stem-vietnam-api.stu725114073.workers.dev';

interface User {
    id: string;
    email: string;
    name: string;
    avatar_url: string | null;
    created_at: number;
    updated_at: number;
}

interface Stats {
    total_users: number;
    total_conversations: number;
    total_messages: number;
}

interface UserDetail {
    user: User;
    stats: { conversations: number; messages: number };
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
    const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load data
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/users`),
                fetch(`${API_URL}/api/admin/stats`)
            ]);

            if (!usersRes.ok || !statsRes.ok) {
                throw new Error('Failed to load data');
            }

            const usersData = await usersRes.json();
            const statsData = await statsRes.json();

            setUsers(usersData.users || []);
            setStats(statsData.stats || null);
        } catch (err) {
            setError('Không thể kết nối đến server');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // View user details
    const viewUser = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedUser(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Delete user
    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa user này? Tất cả dữ liệu của user sẽ bị xóa.')) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
                setSelectedUser(null);
                loadData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Update user
    const handleUpdate = async () => {
        if (!editingUser) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingUser.name, email: editingUser.email })
            });

            if (res.ok) {
                setEditingUser(null);
                loadData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Filter users
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500 text-sm">Quản lý users - Học Công Nghệ</p>
                    </div>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-sm"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-5 border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Users className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stats.total_users}</p>
                                    <p className="text-slate-500 text-sm">Users</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <MessageSquare className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stats.total_conversations}</p>
                                    <p className="text-slate-500 text-sm">Conversations</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <BarChart3 className="text-purple-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stats.total_messages}</p>
                                    <p className="text-slate-500 text-sm">Messages</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm user..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">User</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Email</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Ngày tạo</th>
                                <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-slate-400">
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-slate-400">
                                        Không có user nào
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-slate-900 text-sm">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 text-sm">{user.email}</td>
                                        <td className="px-4 py-3 text-slate-500 text-sm">{formatDate(user.created_at)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => viewUser(user.id)}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-all"
                                                title="Xem chi tiết"
                                            >
                                                <Users size={16} />
                                            </button>
                                            <button
                                                onClick={() => setEditingUser({ id: user.id, name: user.name, email: user.email })}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-all ml-1"
                                                title="Sửa"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-1.5 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition-all ml-1"
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* User Detail Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Chi tiết User</h3>
                                <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                                        {selectedUser.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{selectedUser.user.name}</p>
                                        <p className="text-slate-500 text-sm">{selectedUser.user.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-2xl font-bold text-slate-900">{selectedUser.stats.conversations}</p>
                                        <p className="text-slate-500 text-sm">Conversations</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-2xl font-bold text-slate-900">{selectedUser.stats.messages}</p>
                                        <p className="text-slate-500 text-sm">Messages</p>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500">
                                    <p>ID: <span className="font-mono text-xs">{selectedUser.user.id}</span></p>
                                    <p>Tạo lúc: {formatDate(selectedUser.user.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Sửa User</h3>
                                <button onClick={() => setEditingUser(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên</label>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <button
                                    onClick={handleUpdate}
                                    className="w-full py-2 bg-primary-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-600 transition-all text-sm"
                                >
                                    <Save size={16} />
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
