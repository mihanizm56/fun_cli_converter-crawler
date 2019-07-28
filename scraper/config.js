const path = require("path");

/// paths
const PATH_TO_STATIC = path.join(process.cwd(), "public");
const PATH_TO_PDF = path.join(PATH_TO_STATIC, "pdf");
const PATH_TO_PHOTOS = path.join(PATH_TO_STATIC, "photos");
const PATH_TO_SCREENS = path.join(PATH_TO_STATIC, "screenshots");

const test = "89686576017!89686576017ьшлрфшд!test_name!Миша Кожевников";
/// selectors
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
const INPUT_TYPE_FILE_SELECTOR = "input[type=file]";
const BUTTON_SEND_VK_SELECTOR = ".im-send-btn_send";

///other
const timeValueToRepeatScroll = 16;

module.exports = {
	PATH_TO_STATIC,
	PATH_TO_PDF,
	PATH_TO_PHOTOS,
	PATH_TO_SCREENS,
	VK_URL,
	INPUT_PDF_SELECTOR,
	PDF_CONVERTER_URL,
	LAST_SELECTOR_PDF_DOWNLOAD,
	DOWNLOAD_BUTTON_PDF_SELECTOR,
	LOGIN_FIELD_VK_SELECTOR,
	PASSWORD_FIELD_VK_SELECTOR,
	LOGIN_BUTTON_SELECTOR,
	MESSAGES_VK_BUTTON_SELECTOR,
	INPUT_TYPE_FILE_SELECTOR,
	BUTTON_SEND_VK_SELECTOR,
	timeValueToRepeatScroll
};
