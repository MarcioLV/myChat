import React, { useContext, useState } from "react";

import { AppContext } from "../context/AppProvider";
import FotoModal from "./fotoModal";
import "./style/MainUser.css";
import userPic from "../assets/icons/user.png";

const MainUser = () => {
  const { state } = useContext(AppContext);
  const { user } = state;

  const [isOpenedImg, setIsOpenedImg] = useState(false);

  const openModalImg = () => {
    setIsOpenedImg(true);
  };

  const closeModalImg = () => {
    setIsOpenedImg(false);
  };

  let userImg = user.avatar ? user.avatar : userPic;

  return (
    <div className="mainUser">
      <div className="Main_container mainUser_container">
        <button onClick={openModalImg}>
          <figure className="mainUser-figure">
            <img
              // ref={i}
              src={userImg}
              alt="mainUser-avatar"
              className={user.avatar ? "imgAvatar" : "notImgAvatar"}
              // className="addPost-user-figure-img"
              // onLoad={check}
            />
          </figure>
        </button>
        <FotoModal
          onClose={closeModalImg}
          isOpened={isOpenedImg}
          userId={user._id}
          userAvatar={userImg}
        />
        <h2>{user.name}</h2>
      </div>
    </div>
  );
};

export default MainUser;
