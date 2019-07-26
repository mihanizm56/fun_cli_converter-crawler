import { walker } from "./walker.mjs";
import rimraf from "rimraf-promise";

export const doSelector = async (page, selector, event) => {
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

export const uploadFile = async (page, pathToFile, formSelector) => {
  const input = await page.$(formSelector);
  await input.uploadFile(pathToFile);
};

export const filesBundleUpload = async (
  page,
  uploadDir,
  inputSelector,
  uploadFunc
) => {
  walker(
    uploadDir,
    file =>
      new Promise(async resolve => {
        await uploadFunc(page, file, inputSelector);
        resolve();
      }),

    () => Promise.resolve()
  );
};

export const inputValueToField = async (page, inputSelector, value) => {
  await page.$eval(
    inputSelector,
    (input, value) => (input.value = value),
    value
  );
};

export const chooseTheChatTemplate = chatName =>
  `span[aria-label="Перейти к беседе: ${chatName}"]`;

export const deleteFolder = async pathToFolder => await rimraf(pathToFolder);

export const autoScroll = async page => {
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
      }, 16);
    });
  });
};

export const scrollToFind = async (page, selector, ms) => {
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
    console.log("error in scrollToFind", error);
  }
};
