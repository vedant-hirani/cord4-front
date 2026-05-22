// ── AI Extractor Service ─────────────────────────────────────
// Backend: POST /api/v1/ai/extract
//
// Mode A — Text only:
//   Content-Type: application/json
//   Body: { rawText: string }
//   → Backend routes to fast text model (llama-3.3-70b / grok-2)
//
// Mode B — File / Image upload:
//   Content-Type: multipart/form-data
//   Fields: receipt (binary file, max 5MB) + optional rawText
//   → Backend routes to vision model (llama-3.2-11b-vision / grok-2-vision-1212)
//   → Backend always purges temp file in finally block (no disk leaks)
//
// Accepted file types: jpeg, jpg, png, gif, pdf, csv
// (validated by backend MIME + extension guard)

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface AIExtractResult {
  amount: number;       // always a number (0 if not found)
  category: string;     // always a valid enum or "Other"
  date: string;         // always YYYY-MM-DD
  note: string;         // always a string
}

export const aiService = {
  /**
   * Mode A — text only.
   * Sends JSON body { rawText }.
   * Backend uses fast text model.
   */
  async extractFromText(rawText: string): Promise<AIExtractResult> {
    const res = await fetch(`${BASE_URL}/ai/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ rawText }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message ?? 'AI extraction failed');
    }

    const json = await res.json();
    return json.data as AIExtractResult;
  },

  /**
   * Mode B — file upload (image or CSV).
   * Sends multipart/form-data with field name "receipt".
   * Backend uses vision model for images, text model for CSV/PDF.
   * Backend always purges the temp file after processing.
   */
  async extractFromFile(file: File, rawText?: string): Promise<AIExtractResult> {
    const form = new FormData();
    form.append('receipt', file);           // field name must be "receipt"
    if (rawText?.trim()) {
      form.append('rawText', rawText.trim());
    }

    // Do NOT set Content-Type header — browser sets it with correct boundary
    const res = await fetch(`${BASE_URL}/ai/extract`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message ?? 'AI extraction failed');
    }

    const json = await res.json();
    return json.data as AIExtractResult;
  },
};
