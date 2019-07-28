module.exports.textParser = textLine => {
	const paramsArray = textLine.split("!");
	const login = paramsArray[0];
	const password = paramsArray[1];
	const filename = paramsArray[2];
	const chatname = paramsArray[3];
	return { login, password, filename, chatname };
};
