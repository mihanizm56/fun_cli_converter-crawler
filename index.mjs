import puppeteer from "puppeteer";
import dotenv from "dotenv";
import path from "path";
import lodash from "lodash";
import fs from "fs";
import { access, mkdir, readdir, readFile } from "./fs-promises.mjs";
import { walker } from "./walker.mjs";
import zipFolder from "zip-folder";
import unzip from "unzipper";

dotenv.config();

const VK_URL = "https://vk.com";
const chatUserName = "Миша Кожевников";
const { uniqueId } = lodash;
const pathToShot = path.join(process.cwd(), "screenshots");
const time = new Date().getTime();
const filename = `${time}_screen.png`;

const autoScroll = async page => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

const doSelector = async (page, selector, event) => {
  try {
    await page.waitForSelector(selector);
    await page.evaluate(
      (selector, event) => {
        document.querySelector(selector)[event]();
      },
      selector,
      event
    );
  } catch (error) {
    console.log("error", error);
  }
};

const scrollToFind = async (page, selector, ms) => {
  try {
    await page.evaluate(
      (ms, selector) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          const element = document.querySelector(selector);

          if (element) {
            clearInterval(timer);
          }
        }, ms);
      },
      ms,
      selector
    );
  } catch (error) {
    console.log("error", error);
  }
};

const uploadFile = async (page, pathToFile, formSelector) => {
  const input = await page.$(formSelector);
  await input.uploadFile(pathToFile);
};

// const filesBundleUpload = async (page, uploadDir, inputSelector) => {
//   const pathToFolder = path.join(process.cwd(), "upload_files");
//   walker(
//     pathToFolder,
//     file =>
//       new Promise(resolve => {
//         uploadFile(page, file, "input[type=file]");
//         resolve();
//       }),

//     () => Promise.resolve()
//   );
//   await doSelector(page, ".im-send-btn_send", "click");
//   await page.waitFor(3000);
// };

const filesBundleUpload = async (page, uploadDir, inputSelector) => {
  walker(
    uploadDir,
    file =>
      new Promise(resolve => {
        uploadFile(page, file, inputSelector);
        resolve();
      }),

    () => Promise.resolve()
  );
};

async function imagesToPdf(paths, resultPath) {
  if (!Array.isArray(paths) || paths.length === 0) {
    throw new Error("Must have at least one path in array");
  }
  const pdfWriter = hummus.createWriter(resultPath);
  paths.forEach(path => {
    const { width, height } = pdfWriter.getImageDimensions(path);
    const page = pdfWriter.createPage(0, 0, width, height);
    pdfWriter.startPageContentContext(page).drawImage(0, 0, path);
    pdfWriter.writePage(page);
  });
  pdfWriter.end();
  await streamToPromise(pdfWriter);
  return resultPath;
}

const makeZip = () =>
  new Promise(resolve => {
    const pathMergeFromFolder = path.join(
      process.cwd(),
      "files",
      "photos_to_pdf"
    );
    const pathMergeToFile = path.join(
      process.cwd(),
      "files",
      "zip",
      "test.zip"
    );

    zipFolder(pathMergeFromFolder, pathMergeToFile, error => {
      if (error) {
        console.log("error", error);
        reject();
      }

      console.log("zipped!!!");
      resolve();
    });
  });

const unZipFile = (pathToZip, pathToOut) => {
  fs.createReadStream(pathToZip).pipe(unzip.Extract({ path: pathToOut }));
};

const uploadPhotosAndConvertToPdf = async page => {
  /// start
  const uploadPhotosDir = path.join(process.cwd(), "files", "photos_to_pdf");
  const inputPdfSelector = '.moxie-shim.moxie-shim-html5 > input[type="file"]';
  const pdfConverterUrl = "https://imagetopdf.com/ru/";

  // init
  await page.goto(pdfConverterUrl, { waitUntil: "networkidle0" });

  await page.waitForSelector(
    '.moxie-shim.moxie-shim-html5 > input[type="file"]'
  );

  // upload bundle
  await filesBundleUpload(page, uploadPhotosDir, inputPdfSelector);

  /// waits for the last image will be transformed
  await page.waitFor(() => {
    const element = document.querySelector(
      ".plupload_file:last-child .plupload_file_button"
    );

    return element && element.style && element.style.display === "block"
      ? true
      : false;
  });

  // click the download button
  await doSelector(page, "#download-all", "click");

  // close browser
  // browser.close();
};

const AppStart = async () => {
  const login = process.env.LOGIN;
  const password = process.env.PASSWORD;

  /// check folder if exists
  try {
    await access(pathToShot);
  } catch (error) {
    if (error.code === "ENOENT") {
      await mkdir(pathToShot);
    } else {
      console.log("error", error);
    }
  }

  //////////////// TODO make an attention on the whole folders structure is ready

  try {
    /// start
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page._client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: path.join(process.cwd(), "files", "download_files")
    });
    await page.setViewport({ width: 1366, height: 580 });

    await page.waitFor(1000);

    /// make some pdfs
    await uploadPhotosAndConvertToPdf(page);
    await page.waitFor(1000);
    await page.goto(VK_URL);

    /// login form
    await page.$eval(
      "#index_email",
      (input, login) => (input.value = login),
      login
    );
    await page.$eval(
      "#index_pass",
      (input, password) => (input.value = password),
      password
    );
    await doSelector(page, "#index_login_button", "click");

    /// click on messages link
    await doSelector(page, "a[href='/im']", "click");

    /// find the chat
    await scrollToFind(
      page,
      `span[aria-label="Перейти к беседе: ${chatUserName}"]`,
      6
    );

    await page.waitForSelector(
      `span[aria-label="Перейти к беседе: ${chatUserName}"]`
    );

    /// get chat id
    const idOfChat = await page.$eval(
      `span[aria-label="Перейти к беседе: ${chatUserName}"]`,
      element => element.parentNode.parentNode.parentNode.dataset.listId
    );

    /// redirect by chat id
    await page.goto(`${VK_URL}/im?sel=${idOfChat}`);
    await autoScroll(page);

    /// upload files

    // const pathToFolder = path.join(process.cwd(), "upload_files");
    // walker(
    //   pathToFolder,
    //   file => {
    //     console.log("file");

    //     Promise.resolve();
    //   },
    //   () => Promise.resolve()
    // );
    // await uploadFile(page, filePath, "input[type=file]", true);
    // await doSelector(page, ".im-send-btn_send", "click");
    const uploadFilesDir = path.join(process.cwd(), "files", "download_files");
    await filesBundleUpload(page, uploadFilesDir, "input[type=file]");
    await doSelector(page, ".im-send-btn_send", "click");

    // await page.screenshot({
    //   path: path.join(pathToShot, filename)
    // });

    /// close browser
    browser.close();
  } catch (error) {
    console.log("error", error);
  }
};

AppStart();
// mergeFilesToPdf();
// makeZip();
