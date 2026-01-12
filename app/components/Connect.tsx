'use client'
import React, { useState, useEffect } from 'react'
import { PlaceholdersAndVanishInput } from './ui/PlaceholdersAndVanishInput';
import { motion, AnimatePresence } from 'framer-motion';

const Connect = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'checking'>('checking');
  const [ttl, setTtl] = useState(0);

  // Check status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/contact');
        const data = await res.json();

        if (data.degraded) {
          // Redis is down, allow form but log warning
          console.warn('Rate limiter degraded: Redis unavailable');
          setStatus('idle');
        } else if (data.restricted) {
          setTtl(data.ttl);
          setStatus('success');
        } else {
          setStatus('idle');
        }
      } catch (error) {
        console.error('Failed to check rate limit status:', error);
        setStatus('idle');
      }
    };
    checkStatus();
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (status === 'success' && ttl > 0) {
      const timer = setInterval(() => {
        setTtl((prev) => {
          if (prev <= 1) {
            setStatus('idle'); // Reset when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, ttl]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const placeholders = [
    "yourname@example.com",
    "Let's build something great together...",
    "contact@yourcompany.com",
    "Ready to start? Enter your email...",
    "hello@world.com",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setEmail(e.target.value);
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 429) {
        // Rate limited
        setTtl(600);
        setStatus('success');
      } else if (data.success) {
        setStatus('success');
        setTtl(600); // 10 minutes default
        setEmail('');
      } else {
        alert('Transmission Failed. System usage high. Try again via direct mail.');
      }
    } catch (error) {
      console.error(error);
      alert('Transmission Error. Check network connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-neutral-900 bg-black relative min-h-[40rem] flex items-center justify-center" suppressHydrationWarning>
      <div className="flex flex-col justify-center items-center px-4 max-w-7xl mx-auto w-full">

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="success"
              className="text-center w-full max-w-lg mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-doto uppercase tracking-tight">
                Signal <span className="text-green-500">Transmitted</span>
              </h2>
              <p className="text-neutral-400 font-mono text-sm leading-relaxed mb-8">
                Transmission successful. Please wait for the system cooldown before sending further signals.
              </p>

              <div className="font-mono text-xs text-neutral-500">
                NEXT UPLINK AVAILABLE IN: <span className="text-white ml-2">{formatTime(ttl)}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="form"
              className="w-full flex flex-col items-center"
            >
              <h2 className="text-3xl md:text-6xl font-bold text-center text-white mb-6 font-doto uppercase tracking-tight">
                Ready to <span className="text-red-600">Collaborate?</span>
              </h2>

              <p className='mb-12 text-neutral-400 font-mono text-sm tracking-wide text-center max-w-md leading-relaxed'>
                Drop your email below to initiate the conversation. I'll get back to you with a secure line shortly.
              </p>

              <div className="w-full max-w-xl relative">
                {loading && (
                  <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="text-xs font-mono text-red-500 animate-pulse">TRANSMITTING...</div>
                  </div>
                )}
                <PlaceholdersAndVanishInput
                  placeholders={placeholders}
                  onChange={handleChange}
                  onSubmit={onSubmit}
                />
              </div>

              <div className="mt-16 flex items-center gap-6 text-xs font-mono text-neutral-600">
                <a href="https://github.com" target="_blank" className="hover:text-white transition-colors">[ GITHUB ]</a>
                <span>//</span>
                <a href="https://linkedin.com" target="_blank" className="hover:text-white transition-colors">[ LINKEDIN ]</a>
                <span>//</span>
                <a href="mailto:contact@afsal.dev" className="hover:text-white transition-colors">[ MAIL ]</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Connect
