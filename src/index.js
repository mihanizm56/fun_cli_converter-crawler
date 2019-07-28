const React = require("react");
const importJsx = require("import-jsx");
const { render } = require("ink");
const App = importJsx("./interface");

render(React.createElement(App));
