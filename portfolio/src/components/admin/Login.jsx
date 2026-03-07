import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]" style={{ background: 'var(--bg)' }}>
            <div className="w-full max-w-md p-8 neo-card" style={{ background: 'var(--bg-secondary)', border: '3px solid var(--border)' }}>
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text)' }}>Admin Login</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 font-bold" style={{ color: 'var(--text)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-2 focus:outline-none"
                            style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold" style={{ color: 'var(--text)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border-2 focus:outline-none"
                            style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 p-3 font-bold border-2 transition-transform duration-150 hover:translate-x-1 hover:translate-y-1"
                        style={{
                            background: '#ffd93d',
                            borderColor: 'var(--border)',
                            boxShadow: 'var(--shadow)',
                            color: '#000'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
