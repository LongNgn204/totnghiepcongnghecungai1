import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-graduation-cap text-4xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">STEM Vietnam</h1>
          <p className="text-gray-600">Học tập ôn thi cùng AI</p>
        </div>

        {/* Toggle Login/Register */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              isLogin
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Đăng nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              !isLogin
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <i className="fas fa-user-plus mr-2"></i>
            Đăng ký
          </button>
        </div>

        {/* Forms */}
        {isLogin ? <LoginForm /> : <RegisterForm setIsLogin={setIsLogin} />}
      </div>
    </div>
  );
}

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-user mr-2 text-blue-500"></i>
          Username hoặc Email
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Nhập username hoặc email"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-lock mr-2 text-blue-500"></i>
          Mật khẩu
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Nhập mật khẩu"
          required
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
            <i className="fas fa-question-circle mr-1"></i>
            Quên mật khẩu?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Đang đăng nhập...
          </>
        ) : (
          <>
            <i className="fas fa-sign-in-alt mr-2"></i>
            Đăng nhập
          </>
        )}
      </button>
    </form>
  );
}

const securityQuestions = [
  'Tên trường tiểu học của bạn là gì?',
  'Tên người bạn thân nhất thời thơ ấu của bạn là gì?',
  'Tên con thú cưng đầu tiên của bạn là gì?',
  'Thành phố nơi bạn sinh ra là gì?',
  'Tên đường phố bạn đã lớn lên là gì?'
];

function RegisterForm({ setIsLogin }: { setIsLogin: (val: boolean) => void }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    securityQuestion: securityQuestions[0],
    securityAnswer: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username phải có ít nhất 3 ký tự');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-4xl text-green-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h3>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <i className="fas fa-exclamation-circle"></i>
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-user mr-2 text-blue-500"></i>
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Ít nhất 3 ký tự"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-envelope mr-2 text-blue-500"></i>
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="email@example.com"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-id-card mr-2 text-blue-500"></i>
          Tên hiển thị
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={e => setFormData({ ...formData, displayName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Nguyễn Văn A"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-lock mr-2 text-blue-500"></i>
          Mật khẩu
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Ít nhất 6 ký tự"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-check-circle mr-2 text-blue-500"></i>
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Nhập lại mật khẩu"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-shield-alt mr-2 text-blue-500"></i>
          Câu hỏi bảo mật
        </label>
        <select
          value={formData.securityQuestion}
          onChange={e => setFormData({ ...formData, securityQuestion: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
          disabled={loading}
        >
          {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-key mr-2 text-blue-500"></i>
          Câu trả lời bảo mật
        </label>
        <input
          type="text"
          value={formData.securityAnswer}
          onChange={e => setFormData({ ...formData, securityAnswer: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Ít nhất 3 ký tự"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Đang đăng ký...
          </>
        ) : (
          <>
            <i className="fas fa-user-plus mr-2"></i>
            Đăng ký tài khoản
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Đã có tài khoản?{' '}
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Đăng nhập ngay
        </button>
      </p>
    </form>
  );
}
