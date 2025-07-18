import { ReportConfig } from '@/types/operations';

const AI_API_BASE_URL = process.env.EXPO_PUBLIC_AI_API_URL || 'http://localhost:3000/api';

class AIAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${AI_API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetches an AI-generated natural language summary for the given report configuration.
   */
  async getReportInsights(config: Omit<ReportConfig, 'id'>): Promise<{ insights: string }> {
    return this.request<{ insights: string }>('/ai/report-insights', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }
}

const aiApi = new AIAPI();
export default aiApi;