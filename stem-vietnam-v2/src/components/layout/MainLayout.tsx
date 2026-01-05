// Chú thích: Main layout với sidebar navigation
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    MessageCircle,
    FileQuestion,
    ClipboardList,
    GraduationCap,
    Library,
    Moon,
    Sun,
    Menu,
    X
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

// Chú thích: Navigation items
const navItems = [
    { path: '/chat', icon: MessageCircle, label: 'Chat AI' },
    { path: '/questions', icon: FileQuestion, label: 'Tạo Câu Hỏi' },
    { path: '/exam/thpt', icon: ClipboardList, label: 'Đề Thi THPT' },
    { path: '/exam/semester', icon: GraduationCap, label: 'Đề Giữa/Cuối Kỳ' },
    { path: '/library', icon: Library, label: 'Thư Viện' },
];

export default function MainLayout() {
    const { isDarkMode, toggleDarkMode } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Mobile menu button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 
        bg-white dark:bg-slate-800 
        border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                            STEM Vietnam
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Ôn thi Công nghệ THPT
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map(({ path, icon: Icon, label }) => (
                            <NavLink
                                key={path}
                                to={path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }
                `}
                            >
                                <Icon size={20} />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl
                text-slate-600 dark:text-slate-400 
                hover:bg-slate-100 dark:hover:bg-slate-700
                transition-all duration-200"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
