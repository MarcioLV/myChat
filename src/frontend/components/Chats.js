import React, { useContext, useEffect, useState } from "react";

import "./style/Chats.css";

import { AppContext } from "../context/AppProvider";

const Chats = (props) => {
  const { state, deleteSearch, setChat } = useContext(AppContext);
  const { chat, chats, search, newMessages } = state;

  const [filterChats, setFilterChats] = useState(chats)

  useEffect(()=>{
    if(props.searchInp !== ''){
      const filChat = chats.filter((chat) => 
        chat.name.toLowerCase().includes(props.searchInp.toLowerCase())
      )
      setFilterChats(filChat)
    }else{
      setFilterChats(chats)
      deleteSearch()
    }
  },[props.searchInp, chats])

  useEffect(()=>{
    let copyListChat = filterChats.slice()
    newMessages.forEach(e => {
      const index = copyListChat.findIndex(c=>c.chat_id === e.chat_id)
      copyListChat.unshift(copyListChat[index])
      copyListChat.splice(index + 1, 1)
    });
    setFilterChats(copyListChat)
  },[newMessages[newMessages.length - 1]])

  const handleFetchMessages = (chat) => {
    props.handleFetchMessages(chat);
  };

  const handleVerifyChat = (newChat) => {
    let chatear = chats.find(e => e.user_id === newChat.user_id)
    if (chatear) {
      handleFetchMessages(chatear);
    } else {
      setChat({
        chat: { chat_id: null, user_id: newChat.user_id, name: newChat.name },
        messages: [],
      });
    }
  };

  if (search.length !== 0) {
    return (
      <>
        <div className="chats-container">
          {/* <button onClick={handleDeleteSearch}>Volver</button> */}
          {search.map((chat) => {
            return (
              <div
                className="chatItem"
                key={chat.user_id}
                onClick={() => handleVerifyChat(chat)}
              >
                <h3>{chat.name}</h3>
              </div>
            );
          })}
        </div>
      </>
    );
  }
  return (
    <>
      <div className="chats-container">
        {filterChats.map((chat) => {
          let style = {};
          let cant = null
          if(newMessages.length > 0){
            const index = newMessages.findIndex(e => e.chat_id === chat.chat_id);
            index !== -1 && (style.color = "red")
            index !== -1 && (cant=newMessages[index].cant)
          }
          return (
            <div
              className="chatItem"
              key={chat.chat_id}
              onClick={() => handleFetchMessages(chat)}
            >
              <h3 style={style}>{chat.name}</h3>
              {/* {cant && <div className="ChatItem-cant">{cant}</div>} */}
              <div className="ChatItem-cant">2</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Chats;
