import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { AppContext } from "../context/AppProvider";

const API_URL = "http://localhost:3000/api/";

const Login = () => {
  const { state, setUser } = useContext(AppContext);
  const { user } = state;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState();

  let history = useHistory();

  useEffect(() => {
    if (user._id) {
      return history.push("/home");
    }
    // handleFetchUser();
    handleSelectUser({user_id: 1, name: "Marcio"})
  }, []);

  const handleFetchUser = async () => {
    const data = await fetchUser();
    if (data.error) {
      console.error("Error fetch", data.body);
    } else {
      setUsers(data.body);
      setLoading(false);

    }
  };

  const fetchUser = async () => {
    try {
      let response = await fetch(API_URL + "user");
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

  const handleSelectUser = (user) => {
    setUser(user)
    history.push("/home")
  }

  if (loading) {
    return <div>loading</div>;
  }
  const loginStyle = {
    display: "flex",
    flexWrap: "wrap",
  };
  const userStyle = {
    border: "1px solid black",
    padding: "8px 12px",
    margin: "10px",
  };
  return (
    <div>
      <h1>LOGIN</h1>
      <div style={loginStyle}>
        {users.map((user) => {
          return (
            <div 
              key={user.user_id} 
              style={userStyle}
              onClick={() => handleSelectUser(user)}
            >
              {user.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Login;
