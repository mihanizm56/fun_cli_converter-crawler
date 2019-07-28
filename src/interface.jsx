const React = require("react");
const { render, Color, Box, Text, AppContext } = require("ink");
const { UncontrolledTextInput } = require("ink-text-input");
const BigText = require("ink-big-text");
const Gradient = require("ink-gradient");
const { PartyMaker } = require("../scraper/api/party-maker");
const { textParser } = require("./utils");

class Interface extends React.Component {
	constructor() {
		super();

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async handleSubmit(text) {
		const { login, password, filename, chatname } = textParser(text);
		if (login && password && filename && chatname) {
			console.log("full data");
			const party = new PartyMaker({ login, password, filename, chatname });

			await party.photosToPDF();
			await this.props.onExit();
		} else {
			console.log("not full data, please enter completed string");
		}
	}

	render() {
		return (
			<React.Fragment>
				<Gradient name="summer">
					<BigText text="I am the copier" />
				</Gradient>
				<Text>Последовательно введите, разделяя знаком восклицания:</Text>
				<Text>Ваш логин вконтакте</Text>
				<Text>Ваш пароль вконтакте</Text>
				<Text>Название выгружаемого файла</Text>
				<Text>Название беседы вконтакте для выгрузки файла</Text>
				<Text>Например login!123!Файл!Агеева Ада</Text>
				<UncontrolledTextInput onSubmit={this.handleSubmit} />
			</React.Fragment>
		);
	}
}

module.exports = Interface;
