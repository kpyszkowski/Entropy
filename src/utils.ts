import { createReadStream } from "fs";
import { GetConditionalEntropyOptions, Occurances, Results } from "./types";

export const getOccurances = (samples: string[]) =>
  samples.reduce<Map<string, number>>((acc, sample) => {
    acc.set(sample, (acc.get(sample) ?? 0) + 1);
    return acc;
  }, new Map());

export const getData = (filePath: string) => {
  let data = "";

  return new Promise<string>((resolve) => {
    const stream = createReadStream(filePath);

    stream.on("data", (chunk) => {
      data = `${data}${chunk.toString()}`;
    });

    stream.on("close", () => {
      resolve(data);
      stream.destroy();
    });
  });
};

export const getEntropy = (occurances: Occurances, totalCount: number) =>
  -Array.from(occurances.values()).reduce((acc, count) => {
    const probability = count / totalCount;
    return acc + probability * Math.log2(probability);
  }, 0);

const getFormattedConditionalEntropy = (data: number[]) =>
  data
    .map((entropy, index) => {
      const depth = index + 1;
      return `    - Depth ${depth}: ${entropy}`;
    })
    .join("\n");

export const parseResults = (results: Results[]) =>
  results
    .reverse()
    .reduce(
      (
        acc,
        {
          fileName,
          wordsEntropy,
          charactersEntropy,
          wordsConditionalEntropy,
          charactersConditionalEntropy,
        }
      ) => {
        const formattedWordsConditionalEntropy = getFormattedConditionalEntropy(
          wordsConditionalEntropy
        );
        const formattedCharactersConditionalEntropy =
          getFormattedConditionalEntropy(charactersConditionalEntropy);

        return (
          `Processed ${fileName}:\n` +
          `  - Words entropy:      ${wordsEntropy}\n` +
          `  - Characters entropy: ${charactersEntropy}\n` +
          `  - Words conditional entropy:\n` +
          `${formattedWordsConditionalEntropy}\n` +
          `  - Characters conditional entropy:\n` +
          `${formattedCharactersConditionalEntropy}\n` +
          `\n${acc}`
        );
      },
      ""
    )
    .trim();

export const getConditionalEntropy = (
  options: GetConditionalEntropyOptions
) => {
  const { maxDepth = 1, scope = "characters" } = options;
  let { data } = options;

  const dictionary: Map<string, Map<string, number>> = new Map();
  let possibleCount = 0;

  const dataArray = scope === "words" ? data.split(" ") : undefined;

  for (let i = 0; i < data.length; i++) {
    const currentDepth = i + maxDepth;

    if (currentDepth < data.length) {
      const currentSample =
        dataArray?.slice(i, currentDepth).join("_") ??
        data.substring(i, currentDepth);
      const nextSample = (dataArray ?? data)[currentDepth];

      const isCurrentSampleInDictionary = dictionary.has(currentSample);

      if (!isCurrentSampleInDictionary) {
        dictionary.set(currentSample, new Map());
      }

      // Non-null assertion is safe here: the dictionary is guaranteed to exist (line 99)
      const currentSampleDictionary = dictionary.get(currentSample)!;
      const existingNextSampleFactor = currentSampleDictionary.get(nextSample);

      currentSampleDictionary.set(
        nextSample,
        (existingNextSampleFactor ?? 0) + 1
      );

      possibleCount++;
    }
  }
  return -Array.from(dictionary.values()).reduce(
    (acc, nextSampleDictionary) => {
      const nextSampleFactors = Array.from(nextSampleDictionary.values());
      const nextSampleSummaryFactor = nextSampleFactors.reduce(
        (sum, currentFactor) => sum + currentFactor,
        0
      );

      const reduced = nextSampleFactors.reduce(
        (letterAcc, val) =>
          letterAcc +
          (val / possibleCount) * Math.log2(val / nextSampleSummaryFactor),
        0
      );

      return acc + reduced;
    },
    0
  );
};
