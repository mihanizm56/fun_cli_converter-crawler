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
import { walker } from "../utils/walker.mjs";

const VK_URL = "https://vk.com";
const INPUT_PDF_SELECTOR = '.moxie-shim > input[type="file"]';
const PDF_CONVERTER_URL = "https://imagetopdf.com/ru/";
const LAST_SELECTOR_PDF_DOWNLOAD =
  ".plupload_file:last-child .plupload_file_button";
const DOWNLOAD_BUTTON_PDF_SELECTOR = "#download-all";
const LOGIN_FIELD_VK_SELECTOR = "#index_email";
const PASSWORD_FIELD_VK_SELECTOR = "#index_pass";
const LOGIN_BUTTON_SELECTOR = "#index_login_button";
const MESSAGES_VK_BUTTON_SELECTOR = "a[href='/im']";
const timeValueToRepeatScroll = 16;
const INPUT_TYPE_FILE_SELECTOR = "input[type=file]";
const BUTTON_SEND_VK_SELECTOR = ".im-send-btn_send";

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
      console.log("error photosToPDF app option", error);
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
          console.log("error", error);
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

      /// rename pdf file
      await rename(
        path.join(this.pathToPDF, "imagetopdf.pdf"),
        path.join(this.pathToPDF, `${this.nameOfPDF}.pdf`)
      );

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

      await this.page.waitForSelector(this.chatSpanSelector);

      /// get chat id
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
      console.log("error", error);
    }
  };

  closeApp = async () => {
    /// close browser
    await deleteFolder(this.pathToPDF);
    await this.browser.close();
  };
}
