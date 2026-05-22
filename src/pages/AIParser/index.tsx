import { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { aiService } from '@/services/aiService';
import { expensesService } from '@/services/expensesService';
import type { AIExtractResult } from '@/services/aiService';
import type { ExpenseCreate } from '@/types/expense';
import {
  Sparkles, FileText, ImageIcon, Type,
  CheckCircle, AlertCircle, Upload, X, Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────
type InputMode = 'text' | 'file' | 'image';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Other'];

// Accepted MIME types / extensions that backend allows
const FILE_ACCEPT  = '.csv,.pdf';
const IMAGE_ACCEPT = 'image/jpeg,image/jpg,image/png,image/gif';

// Max file size: 5 MB (backend enforces this too)
const MAX_BYTES = 5 * 1024 * 1024;

// ── Helpers ──────────────────────────────────────────────────
function toExpenseCreate(r: AIExtractResult): ExpenseCreate {
  return {
    amount:   r.amount   ?? 0,
    category: CATEGORIES.includes(r.category ?? '') ? r.category! : CATEGORIES[0],
    date:     /^\d{4}-\d{2}-\d{2}$/.test(r.date ?? '')
                ? r.date!
                : new Date().toISOString().split('T')[0],
    note:     r.note ?? '',
  };
}

// ── Component ────────────────────────────────────────────────
export default function AIParserPage() {
  const [mode, setMode]               = useState<InputMode>('text');
  const [rawText, setRawText]         = useState('');
  const [file, setFile]               = useState<File | null>(null);
  const [preview, setPreview]         = useState('');
  const [isParsing, setIsParsing]     = useState(false);
  const [extracted, setExtracted]     = useState<AIExtractResult | null>(null);
  const [parseError, setParseError]   = useState('');
  const [isSaving, setIsSaving]       = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError]     = useState('');

  const [confirmed, setConfirmed] = useState<ExpenseCreate>({
    amount: 0,
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ── Reset ──────────────────────────────────────────────────
  const reset = () => {
    setRawText('');
    setFile(null);
    setPreview('');
    setExtracted(null);
    setParseError('');
    setSaveSuccess(false);
    setSaveError('');
    setConfirmed({
      amount: 0, category: CATEGORIES[0],
      date: new Date().toISOString().split('T')[0], note: '',
    });
    if (fileInputRef.current)  fileInputRef.current.value  = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const switchMode = (m: InputMode) => { setMode(m); reset(); };

  // ── File validation ────────────────────────────────────────
  const validateFile = (f: File, isImage: boolean): string | null => {
    if (f.size > MAX_BYTES) return `File too large. Max size is 5 MB.`;
    if (isImage) {
      const ok = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(f.type);
      if (!ok) return 'Invalid image type. Use JPG, PNG, or GIF.';
    } else {
      const ok = ['.csv', '.pdf'].some((ext) => f.name.toLowerCase().endsWith(ext));
      if (!ok) return 'Invalid file type. Use CSV or PDF.';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f, false);
    if (err) { setParseError(err); return; }
    setFile(f);
    setExtracted(null);
    setParseError('');
    setSaveSuccess(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f, true);
    if (err) { setParseError(err); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setExtracted(null);
    setParseError('');
    setSaveSuccess(false);
  };

  // ── Parse ──────────────────────────────────────────────────
  const handleParse = async () => {
    setIsParsing(true);
    setParseError('');
    setExtracted(null);
    setSaveSuccess(false);

    try {
      let result: AIExtractResult;

      if (mode === 'text') {
        // Mode A — JSON body { rawText } → fast text model
        if (!rawText.trim()) throw new Error('Please enter some text.');
        result = await aiService.extractFromText(rawText.trim());

      } else {
        // Mode B — multipart/form-data, field "receipt" → vision or text model
        if (!file) throw new Error('Please select a file.');
        result = await aiService.extractFromFile(
          file,
          mode === 'file' ? `File: ${file.name}` : undefined,
        );
      }

      setExtracted(result);
      setConfirmed(toExpenseCreate(result));

    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'AI parsing failed. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  // ── Save ───────────────────────────────────────────────────
  const handleConfirmAdd = async () => {
    if (!confirmed.amount || confirmed.amount <= 0) {
      setSaveError('Amount must be greater than 0.');
      return;
    }
    setIsSaving(true);
    setSaveError('');
    try {
      await expensesService.createExpense(confirmed);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save expense.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={22} className="text-indigo-500" />
            AI Receipt Parser
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Paste text, upload a CSV / PDF, or drop a photo of an invoice.
            Grok extracts the expense fields — review and confirm to add.
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
          {([
            { value: 'text',  label: 'Text',           icon: Type        },
            { value: 'file',  label: 'CSV / PDF',      icon: FileText    },
            { value: 'image', label: 'Photo / Invoice', icon: ImageIcon  },
          ] as { value: InputMode; label: string; icon: React.ElementType }[]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => switchMode(tab.value)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                mode === tab.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {mode === 'text'  && 'Paste receipt text, SMS alert, or invoice content'}
                {mode === 'file'  && 'Upload a CSV or PDF file (max 5 MB)'}
                {mode === 'image' && 'Upload a photo or scan of your receipt (max 5 MB)'}
              </h3>
              {/* Model hint badge */}
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600 border border-indigo-100">
                {mode === 'text' ? 'Text model' : 'Vision model'}
              </span>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">

            {/* ── Text mode ── */}
            {mode === 'text' && (
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={5}
                placeholder={`e.g. "Paid $32.45 for Uber ride on 2026-05-22"\nor paste a full SMS / email receipt here...`}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isParsing}
              />
            )}

            {/* ── File (CSV / PDF) mode ── */}
            {mode === 'file' && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={FILE_ACCEPT}
                  className="hidden"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-indigo-700 min-w-0">
                      <FileText size={16} className="flex-shrink-0" />
                      <span className="font-medium truncate">{file.name}</span>
                      <span className="text-indigo-400 flex-shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => { setFile(null); setExtracted(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="ml-3 flex-shrink-0 text-indigo-400 hover:text-indigo-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-xl border-2 border-dashed border-gray-300 px-6 py-10
                               flex flex-col items-center gap-3 text-gray-400
                               hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                  >
                    <Upload size={28} />
                    <span className="text-sm font-medium">Click to upload CSV or PDF</span>
                    <span className="text-xs text-gray-300">.csv, .pdf · max 5 MB</span>
                  </button>
                )}
              </>
            )}

            {/* ── Image mode ── */}
            {mode === 'image' && (
              <>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept={IMAGE_ACCEPT}
                  className="hidden"
                  onChange={handleImageChange}
                />
                {file && preview ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={preview}
                      alt="Receipt preview"
                      className="w-full max-h-64 object-contain bg-gray-50"
                    />
                    <button
                      onClick={() => {
                        setFile(null); setPreview(''); setExtracted(null);
                        if (imageInputRef.current) imageInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow text-gray-600 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                    <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500 truncate">{file.name}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full rounded-xl border-2 border-dashed border-gray-300 px-6 py-10
                               flex flex-col items-center gap-3 text-gray-400
                               hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                  >
                    <ImageIcon size={28} />
                    <span className="text-sm font-medium">Click to upload invoice photo</span>
                    <span className="text-xs text-gray-300">JPG, PNG, GIF · max 5 MB</span>
                  </button>
                )}
              </>
            )}

            {/* Error */}
            <AnimatePresence>
              {parseError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {parseError}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleParse}
              isLoading={isParsing}
              disabled={isParsing || (mode === 'text' ? !rawText.trim() : !file)}
              className="w-full"
            >
              <Sparkles size={15} />
              {isParsing ? 'Parsing with Grok…' : 'Extract with AI'}
            </Button>
          </CardBody>
        </Card>

        {/* ── Extracted result + confirm form ── */}
        <AnimatePresence>
          {extracted && !saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-indigo-100">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-indigo-500" />
                    <h3 className="text-sm font-semibold text-gray-800">
                      Extracted Fields — Review & Confirm
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    All fields are editable. Backend validated: category, date format, and amount.
                  </p>
                </CardHeader>
                <CardBody className="space-y-4">

                  {/* Raw extracted preview chips */}
                  <div className="flex flex-wrap gap-2 pb-1 border-b border-gray-100">
                    {[
                      { label: 'Amount',   value: `$${extracted.amount?.toFixed(2) ?? '—'}` },
                      { label: 'Category', value: extracted.category ?? '—' },
                      { label: 'Date',     value: extracted.date ?? '—' },
                    ].map((chip) => (
                      <div key={chip.label} className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1.5">
                        <p className="text-[10px] text-indigo-400 font-medium">{chip.label}</p>
                        <p className="text-xs font-bold text-indigo-700">{chip.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Editable fields */}
                  <Input
                    label="Amount ($)"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={confirmed.amount || ''}
                    onChange={(e) => setConfirmed({ ...confirmed, amount: parseFloat(e.target.value) || 0 })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setConfirmed({ ...confirmed, category: cat })}
                          className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                            confirmed.category === cat
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Date"
                    type="date"
                    value={confirmed.date}
                    onChange={(e) => setConfirmed({ ...confirmed, date: e.target.value })}
                  />

                  <Input
                    label="Note"
                    type="text"
                    placeholder="e.g. Uber ride home"
                    value={confirmed.note ?? ''}
                    onChange={(e) => setConfirmed({ ...confirmed, note: e.target.value })}
                  />

                  {saveError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      <AlertCircle size={15} />
                      {saveError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <Button variant="outline" onClick={reset} className="flex-1" disabled={isSaving}>
                      <X size={14} />
                      Discard
                    </Button>
                    <Button onClick={handleConfirmAdd} isLoading={isSaving} className="flex-1">
                      <Plus size={14} />
                      Add to Expenses
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Success */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-green-200 bg-green-50 px-6 py-8 text-center space-y-3"
            >
              <CheckCircle size={36} className="text-green-500 mx-auto" />
              <p className="text-base font-semibold text-green-800">Expense added successfully!</p>
              <p className="text-sm text-green-600">
                ${confirmed.amount.toFixed(2)} · {confirmed.category} · {confirmed.date}
              </p>
              <Button onClick={reset} variant="secondary" size="sm" className="mx-auto">
                Parse another
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}
