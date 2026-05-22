import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { aiService } from '@/services/aiService';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIExtractorProps {
  onExtract?: (data: {
    amount?: number;
    category?: string;
    description?: string;
    date?: string;
  }) => void;
}

export function AIExtractor({ onExtract }: AIExtractorProps) {
  const [receiptText, setReceiptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExtract = async () => {
    if (!receiptText.trim()) return;

    setIsLoading(true);
    try {
      const extracted = await aiService.extractFromReceipt({
        receiptText,
      });
      setResult(extracted);
      if (onExtract) {
        onExtract({
          amount: extracted.amount,
          category: extracted.category,
          description: extracted.description,
          date: extracted.date,
        });
      }
    } catch (error) {
      console.error('Extraction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-blue-100 bg-blue-50/50">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Receipt Parser</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Paste receipt text and let AI extract expense details
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <textarea
            value={receiptText}
            onChange={(e) => setReceiptText(e.target.value)}
            placeholder="Paste receipt content here..."
            className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isLoading}
          />

          <Button
            onClick={handleExtract}
            isLoading={isLoading}
            disabled={!receiptText.trim() || isLoading}
            className="w-full"
          >
            Extract Details
          </Button>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2"
            >
              <p className="text-sm font-semibold text-green-900">Extraction Results:</p>
              {result.amount && (
                <p className="text-sm text-green-800">
                  <span className="font-medium">Amount:</span> ${result.amount.toFixed(2)}
                </p>
              )}
              {result.category && (
                <p className="text-sm text-green-800">
                  <span className="font-medium">Category:</span> {result.category}
                </p>
              )}
              {result.description && (
                <p className="text-sm text-green-800">
                  <span className="font-medium">Description:</span> {result.description}
                </p>
              )}
              {result.date && (
                <p className="text-sm text-green-800">
                  <span className="font-medium">Date:</span> {result.date}
                </p>
              )}
              <p className="text-xs text-green-700">
                Confidence: {Math.round(result.confidence * 100)}%
              </p>
            </motion.div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
