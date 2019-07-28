/// paths
module.exports.PATH_TO_STATIC = path.join(process.cwd(), "public");
module.exports.PATH_TO_PDF = path.join(PATH_TO_STATIC, "pdf");
module.exports.PATH_TO_PHOTOS = path.join(PATH_TO_STATIC, "photos");
module.exports.PATH_TO_SCREENS = path.join(PATH_TO_STATIC, "screenshots");

/// selectors
module.exports.VK_URL = "https://vk.com";
module.exports.INPUT_PDF_SELECTOR = '.moxie-shim > input[type="file"]';
module.exports.PDF_CONVERTER_URL = "https://imagetopdf.com/ru/";
module.exports.LAST_SELECTOR_PDF_DOWNLOAD =
  ".plupload_file:last-child .plupload_file_button";
module.exports.DOWNLOAD_BUTTON_PDF_SELECTOR = "#download-all";
module.exports.LOGIN_FIELD_VK_SELECTOR = "#index_email";
module.exports.PASSWORD_FIELD_VK_SELECTOR = "#index_pass";
module.exports.LOGIN_BUTTON_SELECTOR = "#index_login_button";
module.exports.MESSAGES_VK_BUTTON_SELECTOR = "a[href='/im']";
module.exports.INPUT_TYPE_FILE_SELECTOR = "input[type=file]";
module.exports.BUTTON_SEND_VK_SELECTOR = ".im-send-btn_send";

///other
module.exports.timeValueToRepeatScroll = 16;
