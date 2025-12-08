import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const firstFieldRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            // Focus first field when modal opens
            setTimeout(() => firstFieldRef.current?.focus(), 0);
        }
    }, [isOpen, mode]);

    if (!isOpen) return null;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (mode === 'register') {
                // Validate
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Mật khẩu xác nhận không khớp');
                }
                if (formData.password.length < 6) {
                    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
                }
                if (!formData.displayName.trim()) {
                    throw new Error('Vui lòng nhập tên hiển thị');
                }

                await register(formData.email, formData.password, formData.displayName);
                setSuccess('Đăng ký thành công!');
                setTimeout(() => {
                    onClose();
                    resetForm();
                    navigate('/dashboard');
                }, 1500);
            } else {
                await login(formData.email, formData.password);
                setSuccess('Đăng nhập thành công!');
                setTimeout(() => {
                    onClose();
                    resetForm();
                    navigate('/dashboard');
                }, 1000);
            }
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            displayName: '',
            confirmPassword: ''
        });
        setError('');
        setSuccess('');
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        resetForm();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="login-modal-title" onKeyDown={handleKeyDown}>
            <div className="glass-panel w-full max-w-md p-0 overflow-hidden shadow-2xl animate-scale-in border-0" role="document">
                {/* Header */}
                <div className="relative p-8 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 opacity-90"></div>
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150">
                        {mode === 'login' ? <User size={150} /> : <UserPlus size={150} />}
                    </div>

                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                        }}
                        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10">
                        <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
                            {mode === 'login' ? <User className="w-10 h-10 text-white" /> : <UserPlus className="w-10 h-10 text-white" />}
                        </div>
                        <h2 id="login-modal-title" className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
                        </h2>
                        <p className="text-blue-100 text-sm font-medium">STEM Vietnam - Học tập ôn thi cùng AI</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 bg-white dark:bg-gray-900">
                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl">
                        <button
                            onClick={() => mode !== 'login' && switchMode()}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'login'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-white shadow-md'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            Đăng Nhập
                        </button>
                        <button
                            onClick={() => mode !== 'register' && switchMode()}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'register'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-white shadow-md'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            Đăng Ký
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-start gap-3 animate-shake">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl text-green-700 dark:text-green-300 text-sm flex items-start gap-3 animate-pulse-slow">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Display Name (Register only) */}
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                    Tên hiển thị
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all outline-none"
                                        placeholder="Nguyễn Văn A"
                                        required={mode === 'register'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all outline-none"
                                    placeholder="student@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                Mật khẩu
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            {mode === 'register' && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1">Ít nhất 6 ký tự</p>
                            )}
                        </div>

                        {/* Confirm Password (Register only) */}
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all outline-none"
                                        placeholder="••••••••"
                                        required={mode === 'register'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 shadow-md"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {mode === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                    {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Note */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                            <button
                                onClick={switchMode}
                                className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
                            >
                                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                            </button>
                        </p>
                    </div>

                    {/* Backend Note */}
                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        Dữ liệu được lưu trữ an toàn trên Cloudflare Workers
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
