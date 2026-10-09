'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, ShieldCheck, Key, PlusCircle, CheckCircle2, AlertCircle, FileText, Send } from 'lucide-react';

export default function AdminPage() {
  const locale = useLocale();

  const [email, setEmail] = React.useState('admin@viksitbengal.gov.in');
  const [password, setPassword] = React.useState('Admin@123');
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Promise state
  const [newPromise, setNewPromise] = React.useState({
    code: 'INFRA-99',
    titleEn: 'Kolkata-Siliguri High-Speed Expressway Corridor',
    titleBn: 'কলকাতা-শিলিগুড়ি দ্রুতগতির এক্সপ্রেসওয়ে করিডোর',
    descriptionEn: 'Dedicated 6-lane access-controlled greenfield highway reducing transit time to 6 hours.',
    descriptionBn: 'কলকাতা ও উত্তরবঙ্গের সংযোগকারী ৬ লেন বিশিষ্ট গ্রিনফিল্ড এক্সপ্রেসওয়ে।',
    status: 'ANNOUNCED',
  });

  // New Evidence state
  const [newEvidence, setNewEvidence] = React.useState({
    title: 'State Cabinet Approval & Gazette Notification for Expressway',
    url: 'https://wb.gov.in/gazette/2026/expressway-approval.pdf',
    sourceType: 'GAZETTE',
    sourceTier: 'TIER_1',
    extractedText: 'Cabinet grants administrative approval for land acquisition along Corridor-A.',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setToken(data.accessToken);
      setUser(data.user);
      setMessage({ text: `Signed in successfully as ${data.user?.name} (${data.user?.role})`, type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Authentication error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:3001/promises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPromise),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create promise');
      setMessage({ text: `Promise ${newPromise.code} created and registered in state catalog!`, type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:3001/evidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvidence),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit evidence');
      setMessage({ text: `Evidence item uploaded and sent to verification queue!`, type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-bold uppercase">
            007 RBAC Security Protected
          </Badge>
          <span className="text-xs text-stone-500 font-medium">NestJS JWT + RolesGuard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-ink mt-1 flex items-center gap-2.5">
          <ShieldCheck className="w-8 h-8 text-primary" />
          {locale === 'bn' ? 'প্রশাসনিক সিএমএস পোর্টাল' : 'CMS & Governance Portal'}
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          {locale === 'bn'
            ? 'সরকারি প্রতিশ্রুতি নিবন্ধন, বাস্তবায়ন প্রমাণ আপলোড এবং অডিট যাচাইকরণ'
            : 'Authorized platform for logging policy milestones, submitting Tier 1-3 audit evidence, and managing records.'}
        </p>
      </div>

      {message && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : 'bg-red-50 text-red-950 border-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {!token ? (
        <Card className="max-w-md mx-auto border border-stone-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              {locale === 'bn' ? 'নিরাপদ লগইন' : 'Secure Admin Authentication'}
            </CardTitle>
            <CardDescription>
              {locale === 'bn'
                ? 'প্রশাসক বা গবেষক হিসেবে সাইন ইন করুন'
                : 'Sign in to access restricted mutations and evidence management.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 border rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 border rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button type="submit" disabled={loading} className="w-full font-bold">
                  {loading ? 'Authenticating...' : 'Sign In with JWT'}
                </Button>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@viksitbengal.gov.in');
                      setPassword('Admin@123');
                    }}
                    className="text-stone-500 hover:text-primary underline"
                  >
                    Use Admin
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('researcher@viksitbengal.gov.in');
                      setPassword('Researcher@123');
                    }}
                    className="text-stone-500 hover:text-primary underline"
                  >
                    Use Researcher
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active Session Info */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {user?.role?.slice(0, 2)}
              </div>
              <div>
                <div className="font-bold text-ink text-sm">{user?.name}</div>
                <div className="text-xs text-stone-500">{user?.email} • Role: <strong>{user?.role}</strong></div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setToken(null);
                setUser(null);
              }}
            >
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Promise Form */}
            <Card className="border border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  {locale === 'bn' ? 'নতুন প্রতিশ্রুতি নিবন্ধন' : 'Register New Promise'}
                </CardTitle>
                <CardDescription>
                  Adds a tracked policy item to the state database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePromise} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700">Promise Code</label>
                    <input
                      type="text"
                      value={newPromise.code}
                      onChange={(e) => setNewPromise({ ...newPromise, code: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-1.5 border rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700">Title (English)</label>
                    <input
                      type="text"
                      value={newPromise.titleEn}
                      onChange={(e) => setNewPromise({ ...newPromise, titleEn: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-1.5 border rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700">Title (Bengali)</label>
                    <input
                      type="text"
                      value={newPromise.titleBn}
                      onChange={(e) => setNewPromise({ ...newPromise, titleBn: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-1.5 border rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700">Status</label>
                    <select
                      value={newPromise.status}
                      onChange={(e) => setNewPromise({ ...newPromise, status: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-1.5 border rounded-lg text-xs"
                    >
                      <option value="ANNOUNCED">ANNOUNCED</option>
                      <option value="UNDER_IMPLEMENTATION">UNDER_IMPLEMENTATION</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full mt-2 font-bold">
                    Create Promise
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Submit Evidence Form */}
            <Card className="border border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  {locale === 'bn' ? 'প্রমাণ ও নথি আপলোড' : 'Submit Evidence Item'}
                </CardTitle>
                <CardDescription>
                  Upload gazette or audit citation to verify status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEvidence} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700">Evidence Title</label>
                    <input
                      type="text"
                      value={newEvidence.title}
                      onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-1.5 border rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700">Source Document URL</label>
                    <input
                      type="url"
                      value={newEvidence.url}
                      onChange={(e) => setNewEvidence({ ...newEvidence, url: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-1.5 border rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700">Source Type</label>
                      <select
                        value={newEvidence.sourceType}
                        onChange={(e) => setNewEvidence({ ...newEvidence, sourceType: e.target.value })}
                        className="w-full min-h-[44px] px-2 py-1.5 border rounded-lg text-xs"
                      >
                        <option value="GAZETTE">GAZETTE</option>
                        <option value="GOVERNMENT_ORDER">GOVERNMENT_ORDER</option>
                        <option value="AUDIT">AUDIT</option>
                        <option value="BUDGET">BUDGET</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700">Source Tier</label>
                      <select
                        value={newEvidence.sourceTier}
                        onChange={(e) => setNewEvidence({ ...newEvidence, sourceTier: e.target.value })}
                        className="w-full min-h-[44px] px-2 py-1.5 border rounded-lg text-xs"
                      >
                        <option value="TIER_1">Tier 1 (Official)</option>
                        <option value="TIER_2">Tier 2 (Institutional)</option>
                        <option value="TIER_3">Tier 3 (Public)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700">Key Excerpt / Quotation</label>
                    <textarea
                      rows={2}
                      value={newEvidence.extractedText}
                      onChange={(e) => setNewEvidence({ ...newEvidence, extractedText: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full mt-2 font-bold">
                    Submit for Verification
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
