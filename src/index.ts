import { readdir as readDirBase } from "fs";
import { promisify } from "util";
import { resolve as resolvePath, join as joinPath } from "path";
import { getCharacters, getWords, getData, getOccurances } from "./utils";
import { Results } from "./types";

const FILES_PATH = resolvePath(process.env.DATA_DIR);
const readDir = promisify(readDirBase);

async function main() {
  const fileNames = await readDir(FILES_PATH);
  let results: Results[] = [];

  for await (const fileName of fileNames) {
    console.log(`Processing ${fileName}:`);

    const filePath = joinPath(FILES_PATH, fileName);

    const data = await getData(filePath);

    const words = getWords(data);
    const characters = getCharacters(data);

    const characterOccurances = getOccurances(data.split(""));
    const wordOccurances = getOccurances(data.split(" "));

    results.push({
      fileName,
      data,
      characters,
      words,
      characterOccurances,
      wordOccurances,
    });
  }

  // const results: Results[] = await Promise.all(
  //   fileNames.map(async (fileName) => {
  //     const filePath = joinPath(FILES_PATH, fileName);

  //     const data = await getData(filePath);

  //     const words = getWords(data);
  //     const characters = getCharacters(data);

  //     const characterOccurances = getOccurances(characters, data);
  //     const wordOccurances = getOccurances(words, data);

  //     return {
  //       fileName,
  //       data,
  //       characters,
  //       words,
  //       characterOccurances,
  //       wordOccurances,
  //     };
  //   })
  // );

  console.log(results.filter(({ data, ...restResults }) => restResults));
}

main();
