import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Tape from '../components/ui/Tape.jsx';
import { ArrowRight, AlertTriangle, Lock } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('student@campus.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
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
    // Static mock auth flow
    setTimeout(() => {
      setLoading(false);
      if (email.includes('admin')) {
        if (onLoginSuccess) onLoginSuccess({ role: 'admin', name: 'Admin Officer', verificationStatus: 'approved' });
        navigate('/admin/verifications');
      } else if (email.includes('pending')) {
        if (onLoginSuccess) onLoginSuccess({ role: 'student', name: 'Alex Chen', verificationStatus: 'pending' });
        navigate('/verification');
      } else if (email.includes('reject')) {
        if (onLoginSuccess) onLoginSuccess({ role: 'student', name: 'Sam Taylor', verificationStatus: 'rejected' });
        navigate('/verification');
      } else {
        if (onLoginSuccess) onLoginSuccess({ role: 'student', name: 'Jordan Taylor', verificationStatus: 'approved' });
        navigate('/browse');
      }
    }, 400);
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
                label="Campus Email Address"
                id="campus-email"
                type="email"
                required
                placeholder="netid@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                hint="Must be registered with University Registrar domain."
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

              {/* Demo credentials hint for static review */}
              <div className="bg-manila/50 border border-ink p-2.5 font-meta text-xs space-y-1">
                <span className="font-bold uppercase text-[10px] tracking-wider block text-ink">
                  Terminal Review Presets:
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] text-ink">
                  <button
                    type="button"
                    onClick={() => setEmail('student@campus.edu')}
                    className="underline hover:bg-manila px-1"
                  >
                    approved student
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setEmail('pending@campus.edu')}
                    className="underline hover:bg-manila px-1"
                  >
                    pending user
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setEmail('admin@campus.edu')}
                    className="underline hover:bg-manila px-1"
                  >
                    admin
                  </button>
                </div>
              </div>

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
