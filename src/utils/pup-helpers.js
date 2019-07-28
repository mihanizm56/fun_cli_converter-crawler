const { walker } = require("./walker.js");
const rimraf = require("rimraf-promise");

module.exports.doSelector = async (page, selector, event) => {
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

module.exports.uploadFile = async (page, pathToFile, formSelector) => {
  const input = await page.$(formSelector);
  await input.uploadFile(pathToFile);
};

module.exports.filesBundleUpload = async (
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

module.exports.inputValueToField = async (page, inputSelector, value) => {
  await page.$eval(
    inputSelector,
    (input, value) => (input.value = value),
    value
  );
};

module.exports.chooseTheChatTemplate = chatName =>
  `span[aria-label="Перейти к беседе: ${chatName}"]`;

module.exports.deleteFolder = async pathToFolder => await rimraf(pathToFolder);

module.exports.autoScroll = async page => {
  await page.evaluate(async () => {
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
};

module.exports.scrollToFind = async (page, selector, ms) => {
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
