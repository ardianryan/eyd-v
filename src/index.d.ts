export interface EydError {
  type: 'PREPOSISI' | 'BENTUK_TERIKAT' | 'GABUNGAN_KATA' | 'PARTIKEL' | 'PELULUHAN_KTSP' | 'KOSAKATA_NONBAKU' | 'TANDA_BACA' | string;
  original: string;
  suggestion: string;
  rule: string;
  reference?: string;
  index: number;
}

export interface EydCheckResult {
  valid: boolean;
  errorCount: number;
  errors: EydError[];
  correctedText: string;
}

export interface EydRuleChunk {
  id: string;
  category: string;
  section: string;
  title: string;
  content: string;
  examples: string[];
  url: string;
  tags: string[];
  score?: number;
}

export interface EydRuleItem {
  id: string;
  category: string;
  section: string;
  title: string;
  explanation: string;
  examples: string[];
  notes: string[];
  url: string;
}

export interface EydRuleDoc {
  title: string;
  slug: string;
  category: string;
  url: string;
  rules: EydRuleItem[];
}

export interface SearchOptions {
  limit?: number;
  category?: string;
}

export function checkEyd(text: string): EydCheckResult;
export function searchRules(query: string, options?: SearchOptions): EydRuleChunk[];
export function getRuleById(id: string): EydRuleChunk | null;
export function getAllRules(): EydRuleDoc[];
export function getRAGChunks(): EydRuleChunk[];
export function getLeksikon(): Record<string, any>;
