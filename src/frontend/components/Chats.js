import React, { useContext, useEffect, useState } from "react";

import "./style/Chats.css";

import { AppContext } from "../context/AppProvider";
import userPic from "../assets/icons/user.png";

const Chats = (props) => {
  const { state, deleteSearch, setChat } = useContext(AppContext);
  const { chat, chats, search, newMessages } = state;

  const [filterChats, setFilterChats] = useState(chats);
  const [filterAct, setFilterAct] = useState(false);

  useEffect(() => {
    if (props.searchInp !== "") {
      const filChat = chats.filter((chat) =>
        chat.name.toLowerCase().includes(props.searchInp.toLowerCase())
      );
      setFilterChats(filChat);
      setFilterAct(true);
    } else {
      setFilterChats(chats);
      setFilterAct(false);
      deleteSearch();
    }
  }, [props.searchInp, chats]);

  const handleFetchMessages = (chat) => {
    props.handleFetchMessages(chat);
  };

  const handleVerifyChat = (newChat) => {
    let chatear = chats.find((e) => e.user_id === newChat.user_id);
    if (chatear) {
      handleFetchMessages(chatear);
    } else {
      handleFetchMessages()
      setChat({
        chat: { chat_id: null, user_id: newChat.user_id, name: newChat.name },
        messages: [],
      });
    }
  };

  if (search.length !== 0) {
    return (
      <div className="chats-container">
        {search.map((chat) => {
          let userImg = chat.avatar ? chat.avatar : userPic;
          return (
            <div
              className="chatItem"
              key={chat.user_id + 10000}
              onClick={() => handleVerifyChat(chat)}
            >
              <div className="Main_container chatItem_container">
                <div className="chatItem_user">
                  <div className="chatItem-figure_container">
                    <figure className="chatItem-figure">
                      <img
                        src={userImg}
                        alt="chatUser-avatar"
                        className={chat.avatar ? "imgAvatar" : "notImgAvatar"}
                      />
                    </figure>
                  </div>
                  <div className="chatItem_user_name">
                    <h3>{chat.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="chats-container">
      {filterChats.map((chat) => {
        let userImg = chat.avatar ? chat.avatar : userPic;
        let style = "";
        let cant = null;
        if (newMessages.length > 0) {
          const index = newMessages.findIndex(
            (e) => e.chat_id === chat.chat_id
          );
          index !== -1 && (style = "chats-newMessage");
          index !== -1 && (cant = newMessages[index].cant);
        }
        return (
          <div
            className={`chatItem ${style}`}
            key={chat.chat_id}
            onClick={() => handleFetchMessages(chat)}
          >
            <div className="Main_container chatItem_container">
              <div className="chatItem_user">
                <div className="chatItem-figure_container">
                  <figure className="chatItem-figure">
                    <img
                      src={userImg}
                      alt="chatUser-avatar"
                      className={chat.avatar ? "imgAvatar" : "notImgAvatar"}
                    />
                  </figure>
                </div>
                <div className="chatItem_user_name">
                  <h3>{chat.name}</h3>
                </div>
              </div>
              {cant && <div className="chatItem-cant">{cant}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
