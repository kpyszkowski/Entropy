import { existsSync, readdir as readDirBase } from "fs";
import { promisify } from "util";
import {
  resolve as resolvePath,
  join as joinPath,
  isAbsolute as isPathAbsolute,
} from "path";
import {
  getConditionalEntropy,
  getData,
  getEntropy,
  getOccurances,
  parseResults,
} from "./utils";
import { Results } from "./types";

const readDir = promisify(readDirBase);

async function main() {
  const [, , ...args] = process.argv;

  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      "Etropy Analyzer\n" +
        "\n" +
        "Usage: entropy-analyzer --data=<path>\n" +
        "Options:\n" +
        "  --help, -h     Show this help message\n" +
        "  --data=<path>  Specify the location of the data to be processed\n"
    );
    return;
  }

  console.log("📚 Entropy Analyzer\n");

  const dataLocation = args.find((arg) => arg.startsWith("--data="))?.slice(7);
  if (!dataLocation) {
    console.log("❌: Please specify a data location using --data=<path>");
    return;
  }

  const dataPath = resolvePath(
    isPathAbsolute(dataLocation) ? "" : "./",
    dataLocation
  );
  if (!existsSync(dataPath)) {
    console.log(`❌: Specified data location is invalid (${dataPath})`);
    return;
  }

  const fileNames = await readDir(dataPath);
  let results: Results[] = [];

  for (const fileName of fileNames) {
    const progress = `${fileNames.indexOf(fileName) + 1}/${fileNames.length}`;
    console.log(`🛠️ [${progress}]: Processing ${fileName}...`);

    const filePath = joinPath(dataPath, fileName);

    const data = await getData(filePath);

    const words = data.split(" ");
    const wordOccurances = getOccurances(words);
    const wordsEntropy = getEntropy(wordOccurances, words.length);

    const characters = data.split("");
    const characterOccurances = getOccurances(characters);
    const charactersEntropy = getEntropy(
      characterOccurances,
      characters.length
    );

    let wordsConditionalEntropy: number[] = [];
    for (let i = 1; i <= 5; i++) {
      const entropy = getConditionalEntropy({
        data,
        maxDepth: i,
        scope: "words",
      });
      wordsConditionalEntropy.push(entropy);
    }

    let charactersConditionalEntropy: number[] = [];
    for (let i = 1; i <= 5; i++) {
      const entropy = getConditionalEntropy({
        data,
        maxDepth: i,
      });
      charactersConditionalEntropy.push(entropy);
    }

    results.push({
      fileName,
      wordsEntropy,
      charactersEntropy,
      wordsConditionalEntropy,
      charactersConditionalEntropy,
    });
  }

  console.log("\n✅: Finished processing files\n");
  console.log(parseResults(results));
}

main();
