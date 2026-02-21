'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

function useCountUp(target: number, duration = 700, active = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active || target === 0) return;
        let current = 0;
        const steps = Math.ceil(duration / 16);
        const increment = target / steps;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration, active]);
    return count;
}

type Message = { role: 'user' | 'assistant'; content: string };

export default function Dashboard() {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [revealed, setRevealed] = useState(false);
    const [profile, setProfile] = useState<{ username: string; email: string; role: string } | null>(null);
    const [dark, setDark] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm FinBot 🤖 Your Kodbank AI assistant. Ask me anything about your account, transfers, or banking!" }
    ]);
    const [input, setInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const counted = useCountUp(balance ?? 0, 700, revealed);

    useEffect(() => {
        const saved = localStorage.getItem('kb-theme');
        if (saved === 'dark') { setDark(true); document.documentElement.setAttribute('data-theme', 'dark'); }
    }, []);

    const toggleDark = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
        localStorage.setItem('kb-theme', next ? 'dark' : 'light');
    };

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => {
        fetch('/api/user/profile')
            .then(r => r.json())
            .then(d => { if (d.username) setProfile(d); })
            .catch(() => { });
    }, []);

    const fireConfetti = useCallback(() => {
        confetti({ particleCount: 40, angle: 60, spread: 70, origin: { x: 0, y: 0.65 }, colors: ['#722F37', '#9b3d47', '#f5c6cb', '#fff', '#ffd700'] });
        confetti({ particleCount: 40, angle: 120, spread: 70, origin: { x: 1, y: 0.65 }, colors: ['#722F37', '#daa520', '#ffd700', '#fff', '#f5c6cb'] });
    }, []);

    const checkBalance = async () => {
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/user/balance');
            const data = await res.json();
            if (res.ok) { setBalance(Number(data.balance)); setRevealed(true); fireConfetti(); }
            else setError(data.error || 'Could not fetch balance');
        } catch { setError('Network error. Please try again.'); }
        finally { setLoading(false); }
    };

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || chatLoading) return;
        const newMessages: Message[] = [...messages, { role: 'user', content: text }];
        setMessages(newMessages);
        setInput('');
        setChatLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply ?? data.error ?? 'Sorry, something went wrong.' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
        } finally { setChatLoading(false); }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <main style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'row',
            gap: '1.5rem', padding: '2rem', position: 'relative', zIndex: 1,
        }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.1rem' }}>

                {/* Header row */}
                <div style={{ textAlign: 'center', position: 'relative', width: '100%', maxWidth: 480 }}>
                    <button onClick={toggleDark} title={dark ? 'Light mode' : 'Dark mode'} style={{
                        position: 'absolute', right: 0, top: 0,
                        width: 40, height: 40, borderRadius: '50%',
                        border: '1px solid var(--divider)', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', transition: 'all 0.2s ease',
                    }}>
                        {dark ? '☀️' : '🌙'}
                    </button>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: 'linear-gradient(135deg, #722F37, #9b3d47)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 0.75rem', boxShadow: '0 8px 24px rgba(114,47,55,0.35)',
                    }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Kodbank</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        {greeting}, {profile?.username ?? '…'} · {today}
                    </p>
                </div>

                {/* Profile Card */}
                <div className="glass" style={{
                    width: '100%', maxWidth: 480, padding: '1rem 1.5rem',
                    display: 'flex', alignItems: 'center', gap: '0.9rem',
                }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #722F37, #9b3d47)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 800, fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(114,47,55,0.3)',
                    }}>
                        {profile ? profile.username[0].toUpperCase() : '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.username ?? '—'}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.email ?? 'Loading...'}</p>
                    </div>
                    <div style={{ padding: '0.25rem 0.75rem', borderRadius: 99, background: 'rgba(114,47,55,0.1)', border: '1px solid rgba(114,47,55,0.2)', fontSize: '0.72rem', fontWeight: 700, color: '#722F37', textTransform: 'capitalize', flexShrink: 0 }}>
                        {profile?.role ?? '...'}
                    </div>
                </div>

                {/* Balance Card */}
                <div className="glass" style={{ width: '100%', maxWidth: 480, padding: '2rem 2.25rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Account Balance</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>● ● ● ●  9 2 8 3</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.7rem', borderRadius: 99, background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669' }}>Secured</span>
                        </div>
                    </div>
                    <div style={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem' }}>
                        {!revealed ? (
                            <p style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.12em' }}>₹ &nbsp;● ● ● ● ●</p>
                        ) : (
                            <p className="fade-in-up" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                ₹ {counted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>
                    <button className="wine-btn" onClick={checkBalance} disabled={loading || revealed} style={{ width: '100%', padding: '1rem', fontSize: '0.95rem' }}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                Verifying...
                            </span>
                        ) : revealed ? '🎉 Balance Revealed!' : '👁  Reveal My Balance'}
                    </button>
                    {error && <p style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '0.75rem' }}>{error}</p>}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="/login" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Sign out</a>
                    <span style={{ color: 'var(--divider)' }}>|</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Kodbank © 2025</span>
                </div>
            </div>

            {/* ── RIGHT COLUMN: FinBot ── */}
            <div className="glass" style={{ width: 370, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: 'calc(100vh - 4rem)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--divider)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #722F37, #9b3d47)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 4px 12px rgba(114,47,55,0.3)' }}>🤖</div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>FinBot</p>
                        <p style={{ fontSize: '0.72rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                            AI Banking Assistant
                        </p>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        Powered by<br /><span style={{ fontWeight: 600, color: '#722F37' }}>Llama 3.1</span>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={{
                                maxWidth: '82%', padding: '0.65rem 1rem',
                                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                background: msg.role === 'user' ? 'linear-gradient(135deg, #722F37, #9b3d47)' : 'var(--chat-bubble-bg)',
                                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                                fontSize: '0.85rem', lineHeight: 1.5,
                                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(114,47,55,0.25)' : '0 2px 8px rgba(0,0,0,0.06)',
                                border: msg.role === 'assistant' ? '1px solid var(--glass-border)' : 'none',
                                backdropFilter: 'blur(10px)', whiteSpace: 'pre-wrap',
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {chatLoading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div style={{ padding: '0.65rem 1rem', borderRadius: '16px 16px 16px 4px', background: 'var(--chat-bubble-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)', display: 'flex', gap: 5, alignItems: 'center' }}>
                                {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#722F37', animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />)}
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--divider)', display: 'flex', gap: '0.6rem', flexShrink: 0, background: 'var(--chat-input-bg)' }}>
                    <input className="input-field" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask FinBot anything..." disabled={chatLoading} style={{ flex: 1, padding: '0.7rem 0.9rem', fontSize: '0.85rem' }} />
                    <button className="wine-btn" onClick={sendMessage} disabled={chatLoading || !input.trim()} style={{ padding: '0.7rem 1rem', flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-5px); } }
      `}</style>
        </main>
    );
}
