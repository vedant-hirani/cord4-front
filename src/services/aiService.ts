import type { AIExtractionRequest, AIExtractionResponse } from '@/types/auth';
import { api } from '@/lib/api';

export const aiService = {
  async extractFromReceipt(data: AIExtractionRequest): Promise<AIExtractionResponse> {
    const response = await api.post<{ data: AIExtractionResponse }>('/ai/extract', data);
    return response.data;
  },
};
