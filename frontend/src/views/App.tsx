import React from "react";
import "../styles/App.css";
import Logo from "../images/logo.svg";
import { Button } from "@mantine/core";

const App = () => {
  return (
    <div>
      <img className="logo" src={Logo} />
      <h1>React App</h1>
      <p>This react app is created from scratch using webpack 5</p>
      <Button>Test Button</Button>
    </div>
  );
};

export default App;
