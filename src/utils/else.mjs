import { walker } from "./walker.mjs";

// export const renamePdfToCorrectName = async (fileToRename, newName) => {
// let usageName;

// await walker(
//   pathToPhotos,
//   file =>
//     new Promise(resolve => {
//       const name = path.basename(file);
//       if (name.indexOf("1_") !== -1) {
//         usageName = name.split("_")[1].split(".")[0];
//         console.log(usageName);
//       }
//       resolve();
//     }),
//   () => Promise.resolve()
// );

const fileToRename = path.join(pathToPDF, "imagetopdf.pdf");
const resultName = path.join(pathToPDF, `${newName}.pdf`);

// await rename(fileToRename, test);
// };
