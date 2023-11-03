import { createReadStream } from "fs";

const removeDuplicates = (input: string | string[]) => [...new Set(input)];

export const getCharacters = (input: string) => removeDuplicates(input);

export const getWords = (input: string) => {
  const words = input.trim().split(" ");
  return removeDuplicates(words);
};

export const getOccurances = (samples: string[]) =>
  samples.reduce<Record<string, number>>(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue]: accumulator[currentValue] || 0,
    }),
    {}
  );
// Object.fromEntries(
//   samples.map((sample) => [sample, input.split(sample).length - 1])
// );

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
