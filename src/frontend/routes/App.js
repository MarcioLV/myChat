import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Main from "../containers/Main";
import Login from "../containers/Login";
import AppProvider from "../context/AppProvider";

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
