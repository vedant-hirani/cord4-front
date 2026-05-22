import type { AIExtractionRequest, AIExtractionResponse } from '@/types/auth';
import { api } from '@/lib/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const aiService = {
  async extractFromReceipt(rawText: string): Promise<AIExtractionResponse> {
    const response = await api.post<ApiResponse<AIExtractionResponse>>('/ai/extract', { rawText });
    return response.data;
  },
};
