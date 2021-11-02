import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { AppContext } from "../context/AppProvider";
import "./style/Login.css";

import config from '../../../config'
const API_URL = `${config.api.host}:${config.api.port}/${config.api.name}/`

// const API_URL = `http://localhost:3000/api/`;

const Login = () => {
  const { state, setUser } = useContext(AppContext);
  const { user } = state;
  const [incorrect, setIncorrect] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [register, setRegister] = useState(false);

  let history = useHistory();

  useEffect(() => {
    if (user._id) {
      return history.push("/home");
    }
    // handleLogin()
  }, []);

  const erraseLogin = () => {
    if (incorrect) {
      setIncorrect(false);
    }
  };

  const handleGoRegister = () => {
    setRegister(!register);
    setIncorrect(false);
    setLoginName("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if(loginName === ''){
      return 
    }
    const name = { name: loginName };
    const response = await fetchRegister(name);
    if (response.error) {
      return alert("Sucedió un Error");
    }
    if (response.body === "") {
      return setIncorrect(true);
    }
    name.user_id = response.body.insertId;
    setUser(name);
    history.push("/home");
  };

  const fetchRegister = async (name) => {
    try {
      let response = await fetch(API_URL + "user", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(name),
      });
      response = await response.json();
      return response;
    } catch (error) {
      let err = {
        error: true,
        body: error,
      };
      return err;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if(loginName === ''){
      return 
    }
    const response = await fetchUser(loginName);
    if (response.error) {
      return alert("Sucedio Un Error");
    }
    if (response.body.length === 0) {
      return setIncorrect(true);
    }
    setUser(response.body);
    history.push("/home");
  };

  const fetchUser = async (loginName) => {
    try {
      let response = await fetch(API_URL + "user?name=" + loginName, {
        mode: "cors",
      });
      response = await response.json();
      return response;
    } catch (err) {
      const error = {
        error: true,
        body: err,
      };
      return error;
    }
  };

  return (
    <div className="login">
      <h1>Bienvenido</h1>
      {!register ? (
        <div className="login-box">
          <form>
            <small style={incorrect ? { visibility: "visible" } : {}}>
              Nombre de usuario incorrecto
            </small>
            <input
              type="text"
              value={loginName}
              placeholder="Nombre de Usuario"
              onChange={(e) => setLoginName(e.target.value)}
              onClick={erraseLogin}
            />
            <button type="submit" onClick={(e) => handleLogin(e)}>
              Iniciar sesion
            </button>
          </form>
          <div className="login-box_register">
            <p>¿No tenes cuenta?</p>
            <button onClick={handleGoRegister}>Registrate</button>
          </div>
        </div>
      ) : (
        <div className="register-box">
          <form>
            <small style={incorrect ? { visibility: "visible" } : {}}>
              Nombre de usuario ocupado
            </small>
            <input
              type="text"
              value={loginName}
              placeholder="Elegir Nombre de Usuario"
              onChange={(e) => setLoginName(e.target.value)}
              onClick={erraseLogin}
            />

            <button type="submit" onClick={(e) => handleRegister(e)}>
              Registrarme
            </button>
          </form>
          <div className="register-box_login">
            <p>¿Ya tenes cuenta?</p>
            <button onClick={handleGoRegister}>Logueate</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
