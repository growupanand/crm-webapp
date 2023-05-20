import React from "react";
import "./App.css";
import "./Button.scss";
import Logo from "./logo.svg";

const App = () => {
  return (
    <div>
      <img className="logo" src={Logo} />
      <h1>React App</h1>
      <p>This react app is created from scratch using webpack 5</p>
      <button>Test Button</button>
    </div>
  );
};

export default App;
