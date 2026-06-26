import type { ParsedIntent } from './types';

const OLLAMA_URL = 'http://localhost:11434/api/generate';

const FEW_SHOT_PROMPT = `You are FinCalc AI, a financial calculator that parses Turkish/English queries into structured JSON.

Examples:
Query: "500.000 TL'yi yıllık %45 faizle 3 yıla vurursam ne kadar kazanırım?"
Response: {"type": "compound_interest", "params": {"principal": 500000, "rate": 45, "years": 3}}

Query: "Aylık 30.000 TL brüt maaşımdan elimde ne kalır?"
Response: {"type": "tax_tr", "params": {"grossMonthly": 30000}}

Query: "200.000 TL konut kredisi çekersem %1.2 faizle 10 yılda aylık ödemem ne olur?"
Response: {"type": "mortgage", "params": {"principal": 200000, "annualRate": 14.4, "years": 10}}

Query: "100 dolar kaç tl"
Response: {"type": "currency", "params": {"amount": 100, "from": "USD", "to": "TRY"}}

Query: "500 euro to lira"
Response: {"type": "currency", "params": {"amount": 500, "from": "EUR", "to": "TRY"}}

Rules:
- Parse Turkish number format: "500.000" = 500000, "1.500,50" = 1500.50
- Rate: "%45" = 45, "yüzde 1.2" = 1.2
- For mortgage, convert monthly rate to annual (monthly × 12)
- If unclear, respond with: {"type": "clarify", "params": {}, "question": "Ne hesaplamak istiyorsunuz? (faiz, kredi, maaş, döviz)"}

Query: `;

export async function parseIntent(query: string): Promise<ParsedIntent> {
  try {
    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        prompt: FEW_SHOT_PROMPT + query,
        stream: false,
        temperature: 0.1,
      }),
    });

    if (!res.ok) throw new Error('Ollama not reachable');

    const data = await res.json();
    const text = data.response.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);

    if (parsed.type === 'clarify') {
      return {
        type: 'clarify',
        params: {},
        originalQuery: query,
      } as any;
    }

    return {
      type: parsed.type,
      params: parsed.params,
      originalQuery: query,
    };
  } catch (e) {
    return {
      type: 'error' as any,
      params: { message: e instanceof Error ? e.message : 'Unknown error' },
      originalQuery: query,
    } as any;
  }
}
