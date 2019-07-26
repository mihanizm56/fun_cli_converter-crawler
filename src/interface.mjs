import dotenv from "dotenv";
import PartyMaker from "./api/party-maker.mjs";
import path from "path";
import fs from "fs";
import {
  PATH_TO_STATIC,
  PATH_TO_PDF,
  PATH_TO_PHOTOS,
  PATH_TO_SCREENS
} from "./config.mjs";

dotenv.config();

/// users settings
const nameOfPDF = "test_name";
const chatName = "Миша Кожевников";
const loginVK = process.env.LOGIN;
const passwordVK = process.env.PASSWORD;

const party = new PartyMaker({
  pathToPDF,
  pathToPhotos,
  nameOfPDF,
  screensPath,
  loginVK,
  passwordVK,
  chatName
});

party.photosToPDF();
