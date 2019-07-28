const React = require("react");
const importJsx = require("import-jsx");
const { render, AppContext } = require("ink");
const App = importJsx("./app-module.jsx");

render(React.createElement(App));
