import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Main from "../containers/Main";
import Login from "../containers/Login";
import AppProvider from "../context/AppProvider";

import "./App.css";

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);
window.addEventListener("resize", () => {
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});


const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/home" component={Main} />
        </Switch>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
