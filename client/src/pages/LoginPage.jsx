import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Tape from '../components/ui/Tape.jsx';
import { ArrowRight, AlertTriangle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/errors.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = await login({ email, password });
      if (!user) throw new Error('Login failed');
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.verificationStatus !== 'approved') {
        navigate('/verification');
      } else {
        navigate('/browse');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans justify-between">
      <Navbar variant="public" />

      <main className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12 flex-1 flex items-center justify-center relative">
        {/* Archival Docket Card */}
        <div className="w-full max-w-[480px] relative z-10 my-4">
          <Tape position="top-center" />

          <div className="bg-paper border-2 border-ink hard-shadow-6 p-6 sm:p-8 relative">
            {/* Eyelet Punch Motif */}
            <div className="absolute top-4 right-4 eyelet" />

            {/* Docket Header Strip */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-dashed border-ink">
              <span className="px-2 py-0.5 bg-manila font-meta text-xs uppercase font-bold border border-ink text-ink">
                ACCESS CLEARANCE // FORM 01-A
              </span>
              <span className="font-meta text-xs text-ink-muted">SERIAL: #88092-DX</span>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-ink tracking-tight">
                Student Terminal Login
              </h1>
              <p className="font-meta text-xs text-ink-muted mt-1 uppercase tracking-wider">
                Please verify credentials before checking the bins.
              </p>
            </div>

            {/* Error Banner if any */}
            {error && (
              <div className="border-2 border-stamp-rejected bg-stamp-rejected/10 p-3.5 mb-6 relative hard-shadow-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-stamp-rejected shrink-0 mt-0.5" />
                  <div>
                    <div className="font-meta text-xs uppercase font-extrabold tracking-wider text-stamp-rejected">
                      [AUTHENTICATION REJECTED]
                    </div>
                    <div className="font-meta text-xs font-bold text-ink mt-0.5">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                id="email"
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Security Phrase / Password"
                id="password"
                type="password"
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint="Minimum 8 characters."
              />



              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Log in'}</span>
                  <ArrowRight className="w-4 h-4 font-bold" />
                </Button>
              </div>

              {/* New here? Sign up */}
              <div className="pt-3 text-center border-t border-ink/40 mt-5">
                <span className="font-sans text-sm text-ink">
                  New here?{' '}
                  <Link
                    to="/signup"
                    className="font-meta text-xs font-bold uppercase underline underline-offset-4 decoration-2 decoration-ink hover:bg-manila px-1 ml-1"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </form>

            {/* Perforated Tear-off Line */}
            <div className="relative my-6 pt-2">
              <div className="w-full border-t-2 border-dashed border-ink" />
              <div className="absolute -left-8 sm:-left-10 -top-1.5 w-4 h-4 rounded-full bg-paper border-r-2 border-ink" />
              <div className="absolute -right-8 sm:-right-10 -top-1.5 w-4 h-4 rounded-full bg-paper border-l-2 border-ink" />
            </div>

            <div className="flex items-center justify-between text-ink-muted font-meta text-[11px]">
              <span className="tracking-wider uppercase">
                AUTHORIZED USERS ONLY // CAMPUS REPOSITORY
              </span>
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
