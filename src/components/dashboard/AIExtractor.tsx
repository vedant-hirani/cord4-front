import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { aiService } from '@/services/aiService';
import type { ExpenseCreate } from '@/types/expense';
import { Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIExtractorProps {
  onExtract?: (data: Partial<ExpenseCreate>) => void;
}

export function AIExtractor({ onExtract }: AIExtractorProps) {
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Partial<ExpenseCreate> | null>(null);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!rawText.trim()) return;
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const extracted = await aiService.extractFromText(rawText);
      const mapped: Partial<ExpenseCreate> = {
        amount: extracted.amount,
        category: extracted.category,
        date: extracted.date,
        note: extracted.note,
      };
      setResult(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI extraction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUse = () => {
    if (result && onExtract) {
      onExtract(result);
      setRawText('');
      setResult(null);
    }
  };

  return (
    <Card className="border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">AI Receipt Parser</h3>
          <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            Powered by Grok
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Paste any receipt text, SMS, or invoice — AI will extract the expense details
        </p>
      </CardHeader>
      <CardBody className="space-y-4">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder='e.g. "Paid $32.45 for Uber ride on 2026-05-22"'
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isLoading}
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <Button
          onClick={handleExtract}
          isLoading={isLoading}
          disabled={!rawText.trim() || isLoading}
          className="w-full"
        >
          <Sparkles size={16} />
          Extract with AI
        </Button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-2"
            >
              <p className="text-sm font-semibold text-green-800 mb-3">Extracted Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {result.amount !== undefined && (
                  <div className="rounded-md bg-white border border-green-100 px-3 py-2">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-900">${result.amount.toFixed(2)}</p>
                  </div>
                )}
                {result.category && (
                  <div className="rounded-md bg-white border border-green-100 px-3 py-2">
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="font-semibold text-gray-900">{result.category}</p>
                  </div>
                )}
                {result.date && (
                  <div className="rounded-md bg-white border border-green-100 px-3 py-2">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">{result.date}</p>
                  </div>
                )}
                {result.note && (
                  <div className="rounded-md bg-white border border-green-100 px-3 py-2 col-span-2">
                    <p className="text-xs text-gray-500">Note</p>
                    <p className="font-semibold text-gray-900">{result.note}</p>
                  </div>
                )}
              </div>
              <Button onClick={handleUse} size="sm" className="w-full mt-2">
                Use These Details
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>
    </Card>
  );
}
