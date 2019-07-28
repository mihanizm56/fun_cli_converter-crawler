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
