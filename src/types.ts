export interface Results {
  fileName: string;
  data: string;
  characters: string[];
  words: string[];
  characterOccurances?: Record<string, number>;
  wordOccurances?: Record<string, number>;
}
