import {
  access as accessNative,
  readdir as readdirNative,
  readFile as readFileNative,
  writeFile as writeFileNative,
  lstat as lstatNative,
  rmdir as rmdirNative,
  unlink as unlinkNative,
  stat as statNative,
  rename as renameNative
} from "fs";
import { promisify } from "util";

export const access = promisify(accessNative);
export const readdir = promisify(readdirNative);
export const readFile = promisify(readFileNative);
export const writeFile = promisify(writeFileNative);
export const lstat = promisify(lstatNative);
export const rmdir = promisify(rmdirNative);
export const unlink = promisify(unlinkNative);
export const stat = promisify(statNative);
export const rename = promisify(renameNative);
