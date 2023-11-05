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
  Array.from(occurances.values()).reduce((acc, count) => {
    const probability = count / totalCount;
    return acc + probability * -Math.log2(probability);
  }, 0);

const getFormattedConditionalEntropy = (data: number[]) =>
  data
    .map((entropy, index) => {
      const depth = index + 1;
      return `     - Depth ${depth}: ${entropy}`;
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
          `📄 Processed ${fileName}:\n` +
          `   - Words entropy:      ${wordsEntropy}\n` +
          `   - Characters entropy: ${charactersEntropy}\n` +
          `   - Words conditional entropy:\n` +
          `${formattedWordsConditionalEntropy}\n` +
          `   - Characters conditional entropy:\n` +
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

  const dictionary: Record<string, Record<string, number>> = {};
  let possibleCount = 0;

  if (scope === "words") {
    data = (data as string).split(" ");
  }

  for (let i = 0; i < data.length; i++) {
    const currentDepth = i + maxDepth;

    if (currentDepth < data.length) {
      const currentSample = `"${
        scope === "words"
          ? (data.slice(i, currentDepth) as []).join("_")
          : (data as string).substring(i, currentDepth)
      }"`;
      const nextSample = `"${data[currentDepth]}"`;

      const isCurrentSampleInDictionary = currentSample in dictionary;

      if (!isCurrentSampleInDictionary) {
        dictionary[currentSample] = {};
      }

      dictionary[currentSample][nextSample] =
        (dictionary[currentSample][nextSample] ?? 0) + 1;

      possibleCount++;
    }
  }
  return -Object.values(dictionary).reduce((acc, nextSampleDictionary) => {
    const nextSampleFactors = Object.values(nextSampleDictionary);
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
  }, 0);
};
