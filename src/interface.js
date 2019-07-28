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
// nameOfPDF,
//   loginVK,
//   passwordVK,
//   chatName
// });

// party.photosToPDF();

const React = require("react");
const { render, Color, Box, Text, AppContext } = require("ink");
const { UncontrolledTextInput } = require("ink-text-input");
const BigText = require("ink-big-text");
const Gradient = require("ink-gradient");
const { PartyMaker } = require("../scraper/api/party-maker");

const textParser = textLine => {
	const paramsArray = textLine.split("!");
	const login = paramsArray[0];
	const password = paramsArray[1];
	const filename = paramsArray[2];
	const chatname = paramsArray[3];
	return { login, password, filename, chatname };
};

class Interface extends React.Component {
	constructor() {
		super();

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(text) {
		const { login, password, filename, chatname } = textParser(text);
		console.log("result", { login, password, filename, chatname });
		if (login && password && filename && chatname) {
			console.log("full data");
			const party = new PartyMaker({ login, password, filename, chatname });

			party.photosToPDF();
		} else {
			console.log("not full data, please enter completed string");
		}
	}

	render() {
		return (
			<AppContext.Consumer>
				{({ exit }) => (
					<React.Fragment>
						{/* <Gradient name="summer">
							<BigText text="I am the copier" />
						</Gradient> */}
						<Text>Последовательно введите, разделяя знаком восклицания:</Text>
						<Text>Ваш логин вконтакте</Text>
						<Text>Ваш пароль вконтакте</Text>
						<Text>Название выгружаемого файла</Text>
						<Text>Название беседы вконтакте для выгрузки файла</Text>
						<Text>Например login!123!Файл!Агеева Ада</Text>
						<UncontrolledTextInput onSubmit={this.handleSubmit} />
					</React.Fragment>
				)}
			</AppContext.Consumer>
		);
	}
}

module.exports = Interface;
