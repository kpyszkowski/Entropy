export interface Results {
  fileName: string;
  wordsEntropy: number;
  charactersEntropy: number;
  wordsConditionalEntropy: number[];
  charactersConditionalEntropy: number[];
}

export type Occurances = Map<string, number>;

export interface GetConditionalEntropyOptions {
  data: string | string[];
  maxDepth?: number;
  scope?: "characters" | "words";
}
