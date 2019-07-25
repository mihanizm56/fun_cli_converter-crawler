import fs from "fs";
import path from "path";

export const walker = (dir, callbackOnFile, callBackOnFolder) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, list) => {
      if (err) return reject(err);
      let i = 0;

      const next = () => {
        let filePath = list[i++];

        if (!filePath) {
          if (callBackOnFolder) {
            return callBackOnFolder(dir)
              .then(() => resolve(null))
              .catch(reject);
          } else {
            return resolve(null);
          }
        }

        filePath = path.join(dir, filePath);

        fs.stat(filePath, (err, stat) => {
          if (err) return reject(err);

          if (stat && stat.isDirectory()) {
            walker(filePath, callbackOnFile, callBackOnFolder)
              .then(() => next())
              .catch(reject);
          } else {
            callbackOnFile(filePath)
              .then(() => next())
              .catch(reject);
          }
        });
      };

      next();
    });
  });
};
