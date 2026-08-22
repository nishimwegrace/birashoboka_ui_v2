import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Server, 
  Key, 
  RefreshCw, 
  Database, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Code2, 
  ExternalLink,
  Copy
} from 'lucide-react';
import { 
  getStoredApiBaseUrl, 
  setStoredApiBaseUrl, 
  getStoredAuthToken, 
  setStoredAuthToken 
} from '../services/api.js';

export const ApiSettingsModal = ({
  isOpen,
  onClose,
  onRefreshData,
  isApiLive
}) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [token, setToken] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBaseUrl(getStoredApiBaseUrl());
      setToken(getStoredAuthToken());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setStoredApiBaseUrl(baseUrl);
    setStoredAuthToken(token);
    setIsTesting(true);
    setTestResult(null);

    // Test pinging /api/volets
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const testUrl = cleanBase ? `${cleanBase}/api/volets` : '/api/volets';

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const res = await fetch(testUrl, { headers });
      if (res.ok) {
        setTestResult({ success: true, message: 'Connected directly to your backend API!' });
      } else {
        setTestResult({
          success: false,
          message: `Endpoint responded with HTTP ${res.status}. Check API routes and CORS.`
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Could not reach ${testUrl} (${err.message || 'Network error'}). Using fallback dynamic seed mode.`
      });
    } finally {
      setIsTesting(false);
      onRefreshData();
    }
  };

  const copyMigrationNotes = () => {
    const text = `// Recommended Eloquent Schema Additions in birashoboka_v2:
// 1. In 'posts' migration:
$table->json('image_urls')->nullable();
$table->string('featured_image')->nullable();

// 2. New 'members' migration:
Schema::create('members', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('position');
    $table->text('bio')->nullable();
    $table->string('avatar');
    $table->string('email')->nullable();
    $table->timestamps();
});`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">API & Backend Connectivity</h3>
              <p className="text-xs text-slate-400">Configure connection to your PHP Eloquent Docker container</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Current Status Pill */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isApiLive 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isApiLive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span className="font-bold block text-sm">
                {isApiLive ? 'Connected to Live Local API' : 'Dynamic Seed & Simulation Mode Active'}
              </span>
              <p className="mt-0.5 text-slate-600">
                {isApiLive 
                  ? 'The frontend is fetching live records from your backend container.' 
                  : 'When served locally inside your docker container at /public, it automatically queries your relative /api endpoints. In cloud preview, rich seed data guarantees 100% interactive fidelity.'}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                API Base URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://localhost:8000 or empty for relative /api"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-mono text-slate-800 outline-hidden"
                />
                <Server className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Leave empty for relative paths (<code>/api/volets</code>), or set to <code>http://localhost:8000</code>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Bearer Auth Token (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Bearer token or API key"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-mono text-slate-800 outline-hidden"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          {/* Test feedback */}
          {testResult && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
              testResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {testResult.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Migration helper snippet */}
          <div className="bg-slate-900 rounded-2xl p-4 text-slate-300 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-400" />
                Backend Model Helper (Eloquent)
              </span>
              <button
                type="button"
                onClick={copyMigrationNotes}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto p-2 bg-slate-950 rounded-lg">
{`// Post Model: support image_urls & featured_image
$table->json('image_urls')->nullable();
$table->string('featured_image')->nullable();

// Member Model (id, name, position, bio, avatar, email)`}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setBaseUrl('http://localhost:8000');
              setToken('');
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Reset to Default
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isTesting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing Connection...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Test Connection</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
