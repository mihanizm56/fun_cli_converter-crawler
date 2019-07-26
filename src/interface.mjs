import dotenv from "dotenv";
import PartyMaker from "./api/party-maker.mjs";
import path from "path";
import fs from "fs";

dotenv.config();

const pathToStatic = path.join(process.cwd(), "public");
const pathToPDF = path.join(pathToStatic, "pdf");
const pathToPhotos = path.join(pathToStatic, "photos");
const nameOfPDF = "test_name";
const screensPath = path.join(pathToStatic, "screenshots");
const loginVK = process.env.LOGIN;
const passwordVK = process.env.PASSWORD;
const chatName = "Миша Кожевников";

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
