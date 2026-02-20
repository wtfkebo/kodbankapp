'use client';

import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import confetti from 'canvas-confetti';

export default function Dashboard() {
    const [balance, setBalance] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkBalance = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/user/balance');
            const data = await res.json();

            if (res.ok) {
                setBalance(data.balance);
                triggerConfetti();
            } else {
                setError(data.error || 'Failed to fetch balance');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const triggerConfetti = () => {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        var random = function (min: number, max: number) {
            return Math.random() * (max - min) + min;
        };

        var interval: any = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black">
            <GlassCard className="w-full max-w-lg text-center">
                <h1 className="text-4xl font-bold mb-8 text-[#722F37]">Dashboard</h1>

                <div className="py-8">
                    {balance !== null ? (
                        <div className="animate-fade-in-up">
                            <p className="text-xl mb-2 text-gray-600 dark:text-gray-300">Your total balance is:</p>
                            <h2 className="text-5xl font-extrabold text-[#722F37]">${Number(balance).toLocaleString()}</h2>
                        </div>
                    ) : (
                        <div className="h-24 flex items-center justify-center">
                            <p className="text-gray-500 italic">Click below to reveal your riches</p>
                        </div>
                    )}
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <Button
                    onClick={checkBalance}
                    disabled={loading}
                    className="text-lg px-8 py-3 w-full sm:w-auto"
                >
                    {loading ? 'Checking...' : 'Check Balance'}
                </Button>
            </GlassCard>
        </main>
    );
}
