import React from "react";
import "./App.css";
import Logo from "./logo.svg";
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
