import puppeteer from "puppeteer";
import path from "path";
import { access, readdir, readFile, rename } from "../utils/fs-promises.mjs";
import mkdirp from "mkdirp";
import {
  doSelector,
  uploadFile,
  filesBundleUpload,
  inputValueToField,
  chooseTheChatTemplate,
  deleteFolder,
  autoScroll,
  scrollToFind
} from "../utils/pup-helpers.mjs";
import {
  VK_URL,
  INPUT_PDF_SELECTOR,
  PDF_CONVERTER_URL,
  LAST_SELECTOR_PDF_DOWNLOAD,
  DOWNLOAD_BUTTON_PDF_SELECTOR,
  LOGIN_FIELD_VK_SELECTOR,
  PASSWORD_FIELD_VK_SELECTOR,
  LOGIN_BUTTON_SELECTOR,
  MESSAGES_VK_BUTTON_SELECTOR,
  timeValueToRepeatScroll,
  INPUT_TYPE_FILE_SELECTOR,
  BUTTON_SEND_VK_SELECTOR
} from "../config.mjs";

export default class PartyMaker {
  constructor({
    pathToPDF,
    pathToPhotos,
    screensPath,
    nameOfPDF,
    loginVK,
    passwordVK,
    chatName
  }) {
    this.pathToPDF = pathToPDF;
    this.pathToPhotos = pathToPhotos;
    this.screensPath = screensPath;
    this.nameOfPDF = nameOfPDF;
    this.loginVK = loginVK;
    this.passwordVK = passwordVK;
    this.chatSpanSelector = chooseTheChatTemplate(chatName);
  }

  photosToPDF = async () => {
    try {
      await this.checkAllFolders();
      await this.startApp();
      await this.pdfWork();
      await this.page.waitFor(1000);
      await this.VKUpload();
      await this.closeApp();
    } catch (error) {
      console.log("error in photosToPDF mode", error);
    }
  };

  startApp = async () => {
    this.browser = await puppeteer.launch({ headless: false });
    const page = await this.browser.newPage();
    this.page = page;

    await page._client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: this.pathToPDF
    });
    await page.setViewport({ width: 1366, height: 580 });
    await page.waitFor(1000);
  };

  checkAllFolders = async () => {
    const allNecessaryFolders = [
      this.pathToPDF,
      this.pathToPhotos,
      this.screensPath
    ];

    const promises = allNecessaryFolders.map(async path => {
      try {
        await access(path);
      } catch (error) {
        if (error.code === "ENOENT") {
          await mkdirp(path);
        } else {
          console.log("error in checkAllFolders", error);
        }
      }
    });

    await Promise.all(promises);
  };

  pdfWork = async () => {
    try {
      // init
      await this.page.goto(PDF_CONVERTER_URL);
      await this.page.waitFor(3000);
      await this.page.waitForSelector(INPUT_PDF_SELECTOR);

      // upload bundle
      await filesBundleUpload(
        this.page,
        this.pathToPhotos,
        INPUT_PDF_SELECTOR,
        uploadFile
      );

      /// waits for the last image will be transformed
      await this.page.waitFor(
        selector => {
          const element = document.querySelector(selector);

          return element && element.style && element.style.display === "block";
        },
        {},
        LAST_SELECTOR_PDF_DOWNLOAD
      );

      // click the download button
      await doSelector(this.page, DOWNLOAD_BUTTON_PDF_SELECTOR, "click");
    } catch (error) {
      console.log("error pdfWork", error);
    }
  };

  VKUpload = async () => {
    try {
      await this.page.goto(VK_URL);
      await this.page.waitForNavigation();

      /// input form values to enter VK
      await inputValueToField(this.page, LOGIN_FIELD_VK_SELECTOR, this.loginVK);
      await inputValueToField(
        this.page,
        PASSWORD_FIELD_VK_SELECTOR,
        this.passwordVK
      );

      await doSelector(this.page, LOGIN_BUTTON_SELECTOR, "click");

      /// click on messages link
      await doSelector(this.page, MESSAGES_VK_BUTTON_SELECTOR, "click");

      await this.page.waitFor(1000);

      /// find the chat
      await scrollToFind(
        this.page,
        this.chatSpanSelector,
        timeValueToRepeatScroll
      );

      /// rename pdf file
      await rename(
        path.join(this.pathToPDF, "imagetopdf.pdf"),
        path.join(this.pathToPDF, `${this.nameOfPDF}.pdf`)
      );

      /// get chat id
      await this.page.waitForSelector(this.chatSpanSelector);

      const idOfChat = await this.page.$eval(
        this.chatSpanSelector,
        element => element.parentNode.parentNode.parentNode.dataset.listId
      );

      /// redirect by chat id
      await this.page.goto(`${VK_URL}/im?sel=${idOfChat}`);
      await autoScroll(this.page);

      /// upload files
      await filesBundleUpload(
        this.page,
        this.pathToPDF,
        INPUT_TYPE_FILE_SELECTOR,
        uploadFile
      );

      await doSelector(this.page, BUTTON_SEND_VK_SELECTOR, "click");
    } catch (error) {
      console.log("error in VKUpload", error);
    }
  };

  closeApp = async () => {
    try {
      /// close browser
      await deleteFolder(this.pathToPDF);
      await this.browser.close();
    } catch (error) {
      console.log("error in closeApp", error);
    }
  };
}
