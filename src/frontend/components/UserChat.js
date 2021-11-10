import React, { useContext, useState, useEffect } from "react";
// import { useEffect } from 'react/cjs/react.development'

import { AppContext } from "../context/AppProvider";
import ViewImage from "./ViewImage";

import "./style/UserChat.css";
import userPic from "../assets/icons/user.png";
import backIcon from "../assets/icons/back-icon.png";

const Username = ({ goBackToChats }) => {
  const { state } = useContext(AppContext);
  const { chat } = state;

  const [isOpened, setIsOpened] = useState(false);

  const closeViewImage = () => {
    setIsOpened(false);
  };

  const handleChangeView = () => {
    goBackToChats();
  };

  if (!chat.chat.user_id) {
    return <></>;
  }
  let userImg = chat.chat.avatar ? chat.chat.avatar : userPic;
  
  return (
    <div className="username-container">
      <ViewImage onClose={closeViewImage} isOpened={isOpened} image={userImg} />
      <button className="username_backButton" onClick={handleChangeView}>
        <img src={backIcon} alt="" />
      </button>
      <div className="username-chatName">
        {chat.chat.name}
        <figure className="username-figure" onClick={()=>setIsOpened(true)}>
          <img
            src={userImg}
            alt="chatUser-img"
            className={chat.chat.avatar ? "imgAvatar" : "notImgAvatar"}
          />
        </figure>
      </div>
    </div>
  );
};

export default Username;
