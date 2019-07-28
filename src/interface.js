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

const React = require("react");
const { render, Color } = require("ink");

class Counter extends React.Component {
  constructor() {
    super();

    this.state = {
      counter: 0
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        counter: prevState.counter + 1
      }));
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <Color green>{this.state.counter} tests passed</Color>;
  }
}

render(<Counter />);
