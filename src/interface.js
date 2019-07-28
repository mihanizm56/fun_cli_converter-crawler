// import dotenv from "dotenv";
// import PartyMaker from "./api/party-maker.js";
// import path from "path";
// import fs from "fs";
// import {
//   PATH_TO_STATIC,
//   PATH_TO_PDF,
//   PATH_TO_PHOTOS,
//   PATH_TO_SCREENS
// } from "./config.js";

// dotenv.config();

// /// users settings
// const nameOfPDF = "test_name";
// const chatName = "Миша Кожевников";
// const loginVK = process.env.LOGIN;
// const passwordVK = process.env.PASSWORD;

// const party = new PartyMaker({
//   pathToPDF,
//   pathToPhotos,
//   nameOfPDF,
//   screensPath,
//   loginVK,
//   passwordVK,
//   chatName
// });

// party.photosToPDF();

import React from "react";
import { render, Color, Box, Text } from "ink";
import TextInput from "ink-text-input";

class Interface extends React.Component {
  constructor() {
    super();

    this.state = {
      text: ""
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(text) {
    this.setState({ text });
  }

  render() {
    return (
      <Box>
        <Text bold={true}>Вас приветствует mihanizm56</Text>
        <TextInput />
      </Box>
    );
  }
}

render(<Interface />);
