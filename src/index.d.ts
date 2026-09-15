export type EydDomainMode = 'general' | 'ux' | 'marketing' | 'seo' | 'academic';

export interface CheckOptions {
  mode?: EydDomainMode;
  ignoreWords?: string[];
  preferredPronoun?: string | null;
}

export interface ReadabilityMetrics {
  score: number;
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  activeRatio: number;
  grade: string;
}

export interface EydError {
  type: 'PREPOSISI' | 'BENTUK_TERIKAT' | 'GABUNGAN_KATA' | 'PARTIKEL' | 'PELULUHAN_KTSP' | 'KOSAKATA_NONBAKU' | 'TANDA_BACA' | 'TANDA_BACA_SUBORDINATIF' | 'TANDA_BACA_WAKTU' | 'TANDA_PISAH_RENTANG' | 'SINGKATAN' | 'ANGKA_DAN_MATA_UANG' | 'PLEONASME' | 'KONSISTENSI_PRONOMINA' | 'ETIKA_PARIWARA' | 'SEO_TITLE_LENGTH' | 'RAGAM_AKADEMIK' | string;
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
  readability?: ReadabilityMetrics | null;
}

export interface SingleWordResult {
  word: string;
  isBaku: boolean;
  suggestion: string;
  rule?: string;
  reference?: string;
}

export interface TechTerm {
  term: string;
  padanan: string;
  kategori: string;
  keterangan?: string;
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

export function checkEyd(text: string, options?: CheckOptions): EydCheckResult;
export function checkSingleWord(word: string): SingleWordResult;
export function getTechTerms(): TechTerm[];
export function lookupTechTerm(query: string): TechTerm[];
export function searchRules(query: string, options?: SearchOptions): EydRuleChunk[];
export function getRuleById(id: string): EydRuleChunk | null;
export function getAllRules(): EydRuleDoc[];
export function getRAGChunks(): EydRuleChunk[];
export function getLeksikon(): Record<string, any>;
export function listCategories(): string[];
export function startServer(port?: number): Promise<any>;
export function createEydServer(): any;
