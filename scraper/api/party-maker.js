const puppeteer = require("puppeteer");
const path = require("path");
const {
	access,
	readdir,
	readFile,
	rename
} = require("../utils/fs-promises.js");
const mkdirp = require("mkdirp");
const {
	doSelector,
	uploadFile,
	filesBundleUpload,
	inputValueToField,
	chooseTheChatTemplate,
	deleteFolder,
	autoScroll,
	scrollToFind
} = require("../utils/pup-helpers.js");
const {
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
	BUTTON_SEND_VK_SELECTOR,
	PATH_TO_PDF,
	PATH_TO_PHOTOS,
	PATH_TO_SCREENS
} = require("../config.js");

class PartyMaker {
	constructor({ filename, login, password, chatname }) {
		this.filename = filename;
		this.login = login;
		this.password = password;
		this.chatname = chatname;
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
			downloadPath: PATH_TO_PDF
		});
		await page.setViewport({ width: 1280, height: 1024 });
		await page.waitFor(1000);
	};

	checkAllFolders = async () => {
		const allNecessaryFolders = [PATH_TO_PDF, PATH_TO_PHOTOS, PATH_TO_SCREENS];

		await deleteFolder(PATH_TO_PDF);

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
				PATH_TO_PHOTOS,
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
		const chatSpanSelector = chooseTheChatTemplate(this.chatname);
		try {
			await this.page.goto(VK_URL);

			/// input form values to enter VK
			await inputValueToField(this.page, LOGIN_FIELD_VK_SELECTOR, this.login);
			await inputValueToField(
				this.page,
				PASSWORD_FIELD_VK_SELECTOR,
				this.password
			);

			await doSelector(this.page, LOGIN_BUTTON_SELECTOR, "click");

			/// click on messages link
			await doSelector(this.page, MESSAGES_VK_BUTTON_SELECTOR, "click");

			await this.page.waitFor(1000);

			/// find the chat
			await scrollToFind(this.page, chatSpanSelector, timeValueToRepeatScroll);

			/// rename pdf file
			await rename(
				path.join(PATH_TO_PDF, "imagetopdf.pdf"),
				path.join(PATH_TO_PDF, `${this.filename}.pdf`)
			);

			/// get chat id
			await this.page.waitForSelector(chatSpanSelector);

			const idOfChat = await this.page.$eval(
				chatSpanSelector,
				element => element.parentNode.parentNode.parentNode.dataset.listId
			);

			/// redirect by chat id
			await this.page.goto(`${VK_URL}/im?sel=${idOfChat}`);
			await autoScroll(this.page);

			/// upload files
			await filesBundleUpload(
				this.page,
				PATH_TO_PDF,
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
			await this.browser.close();
		} catch (error) {
			console.log("error in closeApp", error);
		}
	};
}

module.exports.PartyMaker = PartyMaker;
