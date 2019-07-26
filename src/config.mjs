/// paths
export const PATH_TO_STATIC = path.join(process.cwd(), "public");
export const PATH_TO_PDF = path.join(PATH_TO_STATIC, "pdf");
export const PATH_TO_PHOTOS = path.join(PATH_TO_STATIC, "photos");
export const PATH_TO_SCREENS = path.join(PATH_TO_STATIC, "screenshots");

/// selectors
export const VK_URL = "https://vk.com";
export const INPUT_PDF_SELECTOR = '.moxie-shim > input[type="file"]';
export const PDF_CONVERTER_URL = "https://imagetopdf.com/ru/";
export const LAST_SELECTOR_PDF_DOWNLOAD =
  ".plupload_file:last-child .plupload_file_button";
export const DOWNLOAD_BUTTON_PDF_SELECTOR = "#download-all";
export const LOGIN_FIELD_VK_SELECTOR = "#index_email";
export const PASSWORD_FIELD_VK_SELECTOR = "#index_pass";
export const LOGIN_BUTTON_SELECTOR = "#index_login_button";
export const MESSAGES_VK_BUTTON_SELECTOR = "a[href='/im']";
export const INPUT_TYPE_FILE_SELECTOR = "input[type=file]";
export const BUTTON_SEND_VK_SELECTOR = ".im-send-btn_send";

///other
export const timeValueToRepeatScroll = 16;
