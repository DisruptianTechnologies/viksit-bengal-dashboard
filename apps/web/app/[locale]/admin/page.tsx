'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  ShieldCheck,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function AdminPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [email, setEmail] = React.useState('admin@viksitbengal.gov.in');
  const [password, setPassword] = React.useState('Admin@123');
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [evidences, setEvidences] = React.useState<any[]>([]);
  const [message, setMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Promise state
  const [newPromise, setNewPromise] = React.useState({
    code: 'INFRA-99',
    titleEn: 'Kolkata-Siliguri High-Speed Expressway Corridor',
    titleBn: 'কলকাতা-শিলিগুড়ি দ্রুতগতির এক্সপ্রেসওয়ে করিডোর',
    descriptionEn: 'Dedicated 6-lane access-controlled greenfield highway reducing transit time to 6 hours.',
    descriptionBn: 'কলকাতা ও উত্তরবঙ্গের সংযোগকারী ৬ লেন বিশিষ্ট গ্রিনফিল্ড এক্সপ্রেসওয়ে।',
    status: 'UNDER_IMPLEMENTATION',
  });

  // New Evidence state
  const [newEvidence, setNewEvidence] = React.useState({
    promiseCode: 'TEA-01',
    title: 'State Cabinet Approval & Gazette Notification for Darjeeling Tea & Expressway',
    url: 'https://wb.gov.in/gazette/2026/expressway-approval.pdf',
    sourceType: 'GAZETTE',
    sourceTier: 'TIER_1',
    outlayCr: 450,
    extractedText: 'Cabinet grants administrative approval and ₹450 Cr initial disbursement.',
  });

  const loadEvidenceQueue = React.useCallback(async () => {
    try {
      const res = await fetch('/api/evidence', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setEvidences(Array.isArray(data) ? data.slice(0, 8) : []);
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    loadEvidenceQueue();
  }, [loadEvidenceQueue]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setToken(data.accessToken);
      setUser(data.user);
      setMessage({
        text: `Signed in successfully as ${data.user?.name} (${data.user?.role})`,
        type: 'success',
      });
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
      const res = await fetch('/api/promises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPromise),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create promise');
      setMessage({
        text: `Promise ${newPromise.code} registered in live state catalog and added to today's Daily Delta!`,
        type: 'success',
      });
      await loadEvidenceQueue();
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
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvidence),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit evidence');
      setMessage({
        text: `Evidence item uploaded, linked to [${newEvidence.promiseCode}], and published to the Daily Delta feed!`,
        type: 'success',
      });
      await loadEvidenceQueue();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerLiveScrape = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/scraper/run', { method: 'POST' });
      const data = await res.json();
      setMessage({
        text: `Live RSS & Gemini verification run complete: ${data.itemsDiscovered} items checked, ${data.itemsMatched} promises reconciled.`,
        type: 'success',
      });
      await loadEvidenceQueue();
    } catch (err: any) {
      setMessage({ text: err.message || 'Live sync failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="font-bold text-primary uppercase tracking-wider">
              007 RBAC Security Protected
            </span>
            <span aria-hidden="true">·</span>
            <span>JWT + Role Verification</span>
          </div>
          <h1 className="text-3xl font-extrabold text-ink mt-1 flex items-center gap-2.5 tracking-tight">
            <ShieldCheck className="w-8 h-8 text-primary" />
            {isBn ? 'প্রশাসনিক সিএমএস পোর্টাল' : 'CMS & Governance Portal'}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {isBn
              ? 'সরকারি প্রতিশ্রুতি নিবন্ধন, বাস্তবায়ন প্রমাণ আপলোড এবং অডিট যাচাইকরণ'
              : 'Authorized platform for logging policy milestones, submitting Tier 1–3 audit evidence, and managing daily delta records.'}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleTriggerLiveScrape}
          disabled={loading}
          className="gap-2 border-stone-300 font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{isBn ? 'লাইভ সোর্স সিঙ্ক করুন' : 'Run Live Source Scraper'}</span>
        </Button>
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
        <Card className="max-w-md mx-auto border border-stone-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              {isBn ? 'নিরাপদ লগইন' : 'Secure Admin Authentication'}
            </CardTitle>
            <CardDescription>
              {isBn
                ? 'প্রশাসক বা গবেষক হিসেবে সাইন ইন করুন'
                : 'Sign in to access restricted mutations and evidence management.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 border rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
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
                <div className="flex items-center justify-center gap-3 text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@viksitbengal.gov.in');
                      setPassword('Admin@123');
                    }}
                    className="text-stone-600 hover:text-primary underline font-medium"
                  >
                    Use Admin
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('researcher@viksitbengal.gov.in');
                      setPassword('Researcher@123');
                    }}
                    className="text-stone-600 hover:text-primary underline font-medium"
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
                <div className="text-xs text-stone-600">
                  {user?.email} · Role: <strong>{user?.role}</strong>
                </div>
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
            <Card className="border border-stone-200 shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  {isBn ? 'নতুন প্রতিশ্রুতি নিবন্ধন' : 'Register New Promise'}
                </CardTitle>
                <CardDescription>
                  Adds a tracked policy item to the live state database and Daily Delta
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
            <Card className="border border-stone-200 shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  {isBn ? 'প্রমাণ ও নথি আপলোড' : 'Submit Evidence Item'}
                </CardTitle>
                <CardDescription>
                  Upload gazette or audit citation to verify status and update Daily Delta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEvidence} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700">Promise Code</label>
                      <input
                        type="text"
                        value={newEvidence.promiseCode}
                        onChange={(e) => setNewEvidence({ ...newEvidence, promiseCode: e.target.value })}
                        className="w-full min-h-[44px] px-3 py-1.5 border rounded-lg text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700">Outlay (₹ Cr)</label>
                      <input
                        type="number"
                        value={newEvidence.outlayCr}
                        onChange={(e) =>
                          setNewEvidence({ ...newEvidence, outlayCr: Number(e.target.value) || 0 })
                        }
                        className="w-full min-h-[44px] px-3 py-1.5 border rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
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

      {/* Live Evidence Verification Ledger */}
      <Card className="border border-stone-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-stone-100">
          <CardTitle className="text-lg font-bold">
            {isBn ? 'সাম্প্রতিক যাচাইকৃত প্রমাণ ও অডিট সারি' : 'Live Evidence & Audit Ledger'}
          </CardTitle>
          <CardDescription>
            {isBn
              ? 'স্ক্র্যাপার, গবেষক এবং নাগরিকদের দ্বারা জমা দেওয়া সাম্প্রতিক নথি'
              : 'Real-time log of official gazettes, PIB releases, and citizen submissions.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="divide-y divide-stone-100 text-xs">
            {evidences.map((ev) => (
              <div key={ev.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-stone-500">
                    <span className="font-mono font-bold text-primary">
                      [{ev.matchedPromiseCode || 'INFRA-01'}]
                    </span>
                    <span>·</span>
                    <span>{ev.sourceTier}</span>
                    <span>·</span>
                    <span>{ev.publisher}</span>
                  </div>
                  <div className="font-bold text-stone-900">{ev.title}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {ev.outlayCr && (
                    <span className="font-mono tabular-nums font-bold text-stone-800">
                      ₹{ev.outlayCr} Cr
                    </span>
                  )}
                  <Badge variant="outline" className="text-[10px]">
                    {ev.reviewStatus || 'APPROVED'}
                  </Badge>
                  {ev.sourceUrl && (
                    <a
                      href={ev.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
