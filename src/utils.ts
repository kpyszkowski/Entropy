import { createReadStream } from "fs";

export const getCharacters = (input: string) => [...new Set(input)];

export const getWords = (input: string) => [
  ...new Set(input.trim().split(" ")),
];

export const getOccurance = (sample: string, input: string) =>
  input.split(sample).length - 1;

export const handleStream = async (
  filePath: string,
  callback: (data: string) => void
) =>
  new Promise<void>((resolve) => {
    const stream = createReadStream(filePath, { encoding: "utf8" });

    stream.on("data", (data) => {
      callback(data.toString() ?? data);
      stream.destroy();
    });

    stream.on("end", () => {
      resolve();
    });
  });
