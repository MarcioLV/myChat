import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
// import config from '../../../config'

import Chats from "../components/Chats";
import Messages from "../components/Messages";
import InputMsj from "../components/InputMsj";
import Search from "../components/Search";
import UserChat from "../components/UserChat";
import socket from "../socket/socket";

import "./style/Main.css";

import { AppContext } from "../context/AppProvider";

// const API_URL = `${config.api.host}:${config.api.port}/${config.api.port}`
const API_URL = "http://localhost:3000/api/";

const Main = () => {
  const { state, setChats, setChat, addChatIncome, addMessage, addNewMessage } =
    useContext(AppContext);

  const { user, chats, chat, newMessages } = state;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchInp, setSearchInp] = useState('')
  let history = useHistory();

  console.log("state: ", state);

  useEffect(() => {
    if (!user._id) {
      return history.push("/");
    }
    socket.emit("login", user._id);
    fetchChats();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    socket.on("message", (msg) => {
      if (!isCancelled) {
        handleAddMessageSocket(state, msg);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [state]);

  const handleAddMessageSocket = async (state, msg) => {
    const {chats, chat} = state
    const chatExist = chats.some((e) => e.chat_id === msg.chat_id);
    if (chatExist) {
      if (chat.chat.chat_id === msg.chat_id) {
        addMessage(msg);
      } else {
        const inc = newMessages.indexOf(msg.chat_id);
        if (inc === -1) {
          addNewMessage(msg.chat_id);
        }
      }
    }else {
      const newChat = {
        chat_id: msg.chat_id,
        user_id: msg.user,
        name: msg.name,
      };
      addChatIncome(newChat);
    }
  };

  const handleSearchInp = (value) => {
    setSearchInp(value)
  }
  
  const handleFetchMessages = async (chat) => {
    const data = await fetchMessagesData(chat.chat_id);
    if (data.error) {
      console.error("error en fetch");
      setError(true);
    } else {
      setChat({ chat: chat, messages: data.body });
    }
    setLoading(false);
  };
  
  const fetchChats = async () => {
    const data = await fetchChatsData();
    if (data.error) {
      console.error("error en fetch", data.body);
      setError(true);
    } else {
      setChats(data.body);
    }
    setLoading(false);
  };

  const fetchChatsData = async () => {
    try {
      const response = await fetch(`${API_URL}chat/` + user._id, {
        method: "GET",
        mode: "cors",
      });

      let data = await response.json();
      return data;
    } catch (err) {
      // console.error(err);
      const error = {
        error: true,
        body: err,
      };
      setError(true);
      setLoading(false);
      return error;
    }
  };

  const fetchMessagesData = async (chat) => {
    try {
      const response = await fetch(`${API_URL}message/` + chat, {
        method: "GET",
        mode: "cors",
      });
      let data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div className="main">
      <div className="chatList-search">
        <Search handleSearchInp={handleSearchInp}/>
      </div>
      <div className="chatList-chats">
        <Chats handleFetchMessages={handleFetchMessages} searchInp={searchInp}/>
      </div>
      <div className="chatUser-username">
        <UserChat />
      </div>
      <div 
        className="chatUser-messages"
        style={chat.chat.chat_id && {background: "#e5ddd5"}}
      >
        <Messages />
      </div>
      <div className="chatUser-input">
        <InputMsj />
      </div>
    </div>
  );
};

export default Main;
