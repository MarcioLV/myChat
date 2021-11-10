import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import config from '../config'

import MainUser from "../components/MainUser";
import Chats from "../components/Chats";
import Messages from "../components/Messages";
import InputMsj from "../components/InputMsj";
import Search from "../components/Search";
import UserChat from "../components/UserChat";
import Loading from "../components/Loading";
import Error from "../components/Error";
import socket from "../socket/socket";

import "./style/Main.css";

import { AppContext } from "../context/AppProvider";

const API_URL = `${config.api.host}/api/`



const Main = () => {
  const { state, setChats, addChatIncome, addMessage, addNewMessage, deleteChatMessages } =
    useContext(AppContext);

  const { user, chats, chat, newMessages } = state;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchInp, setSearchInp] = useState("");

  const [seeStyle, setSeeStyle] = useState();
  const [msgToChat, setMsgToChat] = useState(false);
  const [searchChat, setSearchChat] = useState();

  let history = useHistory();

  let celWidth = 600;
  console.log("state: ", state);

  useEffect(() => {
    if (!user._id) {
      return history.push("/login");
    }
    socket.emit("login", user._id);
    fetchChats();
    return ()=>{
      goBackToChats()
    }
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
    const { chats, chat } = state;
    const chatExist = chats.some((e) => e.chat_id === msg.chat_id);
    if (chatExist) {
      if (chat.chat.chat_id === msg.chat_id) {
        handleChangeSeen(msg.message_id);
        addMessage({...msg, seen: 0});
      } else {
        addNewMessage(msg.chat_id);
      }
    } else {
      const newChat = {
        chat_id: msg.chat_id,
        user_id: msg.user,
        name: msg.name,
      };
      addChatIncome(newChat);
    }
  };

  const handleChangeSeen = async (msj_id) => {
    try {
      const response = await fetch(`${API_URL}message/` + msj_id, {
        method: "PUT",
        mode: "cors",
      });

      // let data = await response.json();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchInp = (value) => {
    setSearchInp(value);
  };

  const handleFetchMessages = async (chat) => {
    if(chat){
      setSearchChat(chat);
    }else{
      setSeeStyle("onlyMsg")
    }
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

  const goBackToChats = () => {
    deleteChatMessages();
    setSearchChat("");
    if (window.innerWidth <= celWidth) {
      setSeeStyle("");
    }
  };

  if (error) {
    return <Error />;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <div className={`main ${seeStyle}`}>
      <div className="chatList-mainUser">
        <MainUser />
      </div>
      <div className="chatList-search">
        <Search handleSearchInp={handleSearchInp} />
      </div>
      <div className="chatList-chats">
        <Chats
          handleFetchMessages={handleFetchMessages}
          searchInp={searchInp}
        />
      </div>
      <div className="chatUser-username">
        <UserChat goBackToChats={() => goBackToChats()} />
      </div>
      <div className="chatUser-messages">
        <Messages
          searchChat={searchChat}
          setSeeStyle={() => setSeeStyle("onlyMsg")}
          goBackToChats={()=>goBackToChats}
        />
      </div>
      <div className="chatUser-input">
        <InputMsj searchChat={searchChat}/>
      </div>
    </div>
  );
};

export default Main;
