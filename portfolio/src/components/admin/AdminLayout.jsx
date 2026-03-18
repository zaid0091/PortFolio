import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { LogOut, LayoutDashboard, FileText } from 'lucide-react';
import { ToastProvider } from '../../contexts/ToastContext';

export default function AdminLayout() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return <div className="p-8 text-center text-xl" style={{ color: 'var(--text)' }}>Loading Admin...</div>;

    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="flex flex-col md:flex-row h-screen pt-[70px] overflow-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
            {/* Sidebar / Topbar */}
            <div className="w-full md:w-64 border-b-[3px] md:border-b-0 md:border-r-[3px] flex flex-row md:flex-col shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                <div className="p-4 md:p-6 border-r-[3px] md:border-r-0 md:border-b-[3px] flex items-center shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <h1 className="text-xl md:text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-2 md:p-4 flex flex-row md:flex-col overflow-x-auto gap-2">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-2 p-2 md:p-3 font-bold border-2 transition-transform hover:translate-x-1 shrink-0 ${location.pathname === '/admin' ? 'bg-[#ffd93d] text-black' : ''}`}
                        style={{ borderColor: 'var(--border)', boxShadow: location.pathname === '/admin' ? 'var(--shadow)' : 'none' }}
                    >
                        <LayoutDashboard size={20} /> <span className="hidden sm:inline">Projects</span>
                    </Link>
                    <Link
                        to="/admin/blogs"
                        className={`flex items-center gap-2 p-2 md:p-3 font-bold border-2 transition-transform hover:translate-x-1 shrink-0 ${location.pathname === '/admin/blogs' ? 'bg-[#ff6b9d] text-black' : ''}`}
                        style={{ borderColor: 'var(--border)', boxShadow: location.pathname === '/admin/blogs' ? 'var(--shadow)' : 'none' }}
                    >
                        <FileText size={20} /> <span className="hidden sm:inline">Blogs</span>
                    </Link>
                </nav>
                <div className="p-2 md:p-4 border-l-[3px] md:border-l-0 md:border-t-[3px] flex items-center shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-2 md:w-full md:p-3 font-bold border-2 transition-transform hover:-translate-y-1 hover:translate-x-1"
                        style={{ background: '#ff6b6b', borderColor: 'var(--border)', boxShadow: 'var(--shadow)', color: '#000' }}
                    >
                        <LogOut size={20} /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto w-full p-4 md:p-6">
                <ToastProvider>
                    <Outlet />
                </ToastProvider>
            </div>
        </div>
    );
}
