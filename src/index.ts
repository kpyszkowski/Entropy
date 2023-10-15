import { readdir as readDirBase } from "fs";
import { promisify } from "util";
import { resolve as resolvePath, join as joinPath } from "path";
import { getCharacters, getOccurance, getWords, handleStream } from "./utils";

const FILES_PATH = resolvePath("./data"); // TOOD: add environmental variables
const readDir = promisify(readDirBase);

readDir(FILES_PATH).then((files) => {
  files.forEach((file) => {
    const filePath = joinPath(FILES_PATH, file);

    handleStream(filePath, (data) => {
      const characters = getCharacters(data);
      const occurances = characters.map((character) =>
        getOccurance(character, data)
      );
      const words = getWords(data);
      console.log({
        filePath,
        length: data.length,
        characters,
        occurances,
        words,
      });
    });
  });
});
