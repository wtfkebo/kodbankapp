'use client';

import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

function useCountUp(target: number, duration = 2000, active = false) {
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

export default function Dashboard() {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [revealed, setRevealed] = useState(false);
    const [profile, setProfile] = useState<{ username: string; email: string; role: string } | null>(null);

    const counted = useCountUp(balance ?? 0, 700, revealed);

    useEffect(() => {
        fetch('/api/user/profile')
            .then(r => r.json())
            .then(d => { if (d.username) setProfile(d); })
            .catch(() => { });
    }, []);

    // Single quick burst — no loop
    const fireConfetti = useCallback(() => {
        confetti({ particleCount: 40, angle: 60, spread: 70, origin: { x: 0, y: 0.65 }, colors: ['#722F37', '#9b3d47', '#f5c6cb', '#fff', '#ffd700'] });
        confetti({ particleCount: 40, angle: 120, spread: 70, origin: { x: 1, y: 0.65 }, colors: ['#722F37', '#daa520', '#ffd700', '#fff', '#f5c6cb'] });
    }, []);

    const checkBalance = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/user/balance');
            const data = await res.json();
            if (res.ok) {
                setBalance(Number(data.balance));
                setRevealed(true);
                fireConfetti();
            } else {
                setError(data.error || 'Could not fetch balance');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1,
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
                <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'linear-gradient(135deg, #722F37, #9b3d47)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 8px 24px rgba(114,47,55,0.35)',
                }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                </div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a2e' }}>Kodbank</h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Your premium banking dashboard</p>
            </div>

            {/* Profile Card */}
            <div className="glass" style={{
                width: '100%', maxWidth: 480,
                padding: '1.1rem 1.5rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
                {/* Avatar */}
                <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #722F37, #9b3d47)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(114,47,55,0.3)',
                }}>
                    {profile ? profile.username[0].toUpperCase() : '?'}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {profile?.username ?? '—'}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {profile?.email ?? 'Loading...'}
                    </p>
                </div>
                {/* Role badge */}
                <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: 99,
                    background: 'rgba(114,47,55,0.1)',
                    border: '1px solid rgba(114,47,55,0.2)',
                    fontSize: '0.72rem', fontWeight: 700, color: '#722F37', textTransform: 'capitalize',
                    flexShrink: 0,
                }}>
                    {profile?.role ?? '...'}
                </div>
            </div>

            {/* Balance Hero Card */}
            <div className="glass" style={{
                width: '100%', maxWidth: 480,
                padding: '2.5rem 2.25rem',
                textAlign: 'center',
            }}>
                {/* Virtual card strip */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '1.75rem',
                }}>
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Account Balance
                        </p>
                        <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 2 }}>● ● ● ●  9 2 8 3</p>
                    </div>
                    <div style={{
                        width: 44, height: 32, borderRadius: 6,
                        background: 'linear-gradient(135deg, rgba(114,47,55,0.2), rgba(114,47,55,0.05))',
                        border: '1px solid rgba(114,47,55,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#722F37" strokeWidth="1.5">
                            <rect x="7" y="10" width="4" height="4" rx="1" />
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                        </svg>
                    </div>
                </div>

                {/* Balance display */}
                <div style={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                    {!revealed ? (
                        <p style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1a1a2e', letterSpacing: '0.12em' }}>
                            ₹ &nbsp;● ● ● ● ●
                        </p>
                    ) : (
                        <p className="fade-in-up" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1a1a2e' }}>
                            ₹ {counted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    )}
                </div>

                <button
                    className="wine-btn"
                    onClick={checkBalance}
                    disabled={loading || revealed}
                    style={{ width: '100%', padding: '1rem', fontSize: '0.95rem' }}
                >
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                                style={{ animation: 'spin 0.8s linear infinite' }}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            Verifying with backend...
                        </span>
                    ) : revealed
                        ? '🎉 Balance Revealed!'
                        : '👁  Reveal My Balance'}
                </button>

                {error && (
                    <p style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '0.75rem' }}>{error}</p>
                )}
            </div>

            {/* Footer nav */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                <a href="/login" style={{ fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}>Sign out</a>
                <span style={{ color: '#e5e7eb' }}>|</span>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 }}>Kodbank © 2025</span>
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </main>
    );
}
