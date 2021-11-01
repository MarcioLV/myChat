import React, { useState, useContext, useRef, useEffect } from "react";

import { AppContext } from "../context/AppProvider";
import ViewImage from "./ViewImage";
import Loading from "./Loading";
import Error from "./Error";

import "./style/Messages.css";
import config from '../../../config'
const API_URL = `${config.api.host}:${config.api.port}/${config.api.name}/`
// const API_URL = `http://localhost:3000/api/`;

const Messages = ({ searchChat, setSeeStyle }) => {
  const { state, setChat } = useContext(AppContext);
  const { chat, user } = state;

  const [isOpened, setIsOpened] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [onScroll, setOnScroll] = useState(false);
  const [scrollBottom, setScrollBottom] = useState(false);
  // const [load, setLoad] = useState(0)
  // const [view, setView] = useState("hidden")

  const mainRef = useRef(null);
  const mainContainerRef = useRef(null);
  const messRef = useRef(null);
  const dateRef = useRef(null);

  let load = 0
  

  useEffect(async () => {
    if (searchChat) {
      setSeeStyle();
      setLoading(true);
      setError(false);
      resetView()
      const data = await fetchMessagesData(searchChat.chat_id);
      if (data.error) {
        console.error("error en fetch");
        setError(true);
      } else {
        setChat({ chat: searchChat, messages: data.body });
        
      }
      setLoading(false);
    }
  }, [searchChat]);

  useEffect(() => {
    if (messRef.current) {
      handleHeightView();
      // if (
      //   !onScroll ||
      //   chat.messages[chat.messages.length - 1].user === user._id
      // ) {
      //   console.log("effect");
      //   if (scrollBottom) {
      //     mainContainerRef.current.scrollIntoView(false);
      //   } else {
      //     messRef.current.scrollIntoView(true);
      //   }
      // }
    }
  }, [messRef.current, chat.messages.length, loading]);

  const resetView = () => {
    setOnScroll(false)
    setScrollBottom(false)
  }

  const handleScroll = () => {
    if (mainContainerRef.current) {
      console.log("scroll");
      const clientHeight = mainRef.current.clientHeight;
      const scrollHeight = mainRef.current.scrollHeight;
      const scrollTop = Math.ceil(mainRef.current.scrollTop);
      if (clientHeight + scrollTop >= scrollHeight) {
        console.log("scrollBottom");
        setOnScroll(false);
        setScrollBottom(true);
      } else {
        setScrollBottom(false);
        setOnScroll(true);
      }
      // console.log("ch",mainRef.current.clientHeight);
      // console.log("sh",mainRef.current.scrollHeight);
      // console.log("st",mainRef.current.scrollTop);
      // console.log(clientHeight+scrollTop);
      // console.log(mainRef)
    }
    // console.log(e);
  };

  const moveScroll = () => {
    handleHeightView(true);
  };

  const handleHeightView = (onload) => {
    mainContainerRef.current.style.height = mainRef.current.clientHeight + "px";
    mainContainerRef.current.style.height =
      mainContainerRef.current.scrollHeight + "px";

    if (onload) {
      console.log(load);
      if (!onScroll && !scrollBottom) {
        messRef.current.scrollIntoView(true);
      } else if (scrollBottom) {
        mainContainerRef.current.scrollIntoView(false);
      }
    } else {
      if (!onScroll && !scrollBottom) {
        messRef.current.scrollIntoView(true);
      } else if (scrollBottom) {
        mainContainerRef.current.scrollIntoView(false);
      }
    }
  };

  const openViewImage = (e) => {
    setImageSrc(e.target.src);
    setIsOpened(true);
  };

  const closeViewImage = () => {
    setIsOpened(false);
    setImageSrc("");
  };

  const fetchMessagesData = async (chat) => {
    const datos = { userId: user._id };
    try {
      const response = await fetch(`${API_URL}message/` + chat, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      let data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  const handleTime = (msj) => {
    let time;
    if (msj.date) {
      time = msj.date.split(" ");
    } else {
      time = new Date();
      time = time.toString();
      time = time.split(" ");
    }
    return time;
  };

  const modifyBorder = (msj, index) => {
    let modBorder = [false, false];
    let border = {};
    index !== 0 &&
      (modBorder[0] = chat.messages[index - 1].user === msj.user && true);
    index !== chat.messages.length - 1 &&
      (modBorder[1] = chat.messages[index + 1].user === msj.user && true);
    if (msj.user === user._id) {
      modBorder[0] && (border.borderTopRightRadius = "0");
      modBorder[1] && (border.borderBottomRightRadius = "0");
    } else {
      modBorder[0] && (border.borderTopLeftRadius = "0");
      modBorder[1] && (border.borderBottomLeftRadius = "0");
    }
    return border;
  };

  if (error) {
    return <Error />;
  }

  if (loading) {
    return <Loading height={"100%"} />;
  }

  if (!chat.chat.user_id) {
    return <></>;
  }
  let storeDate;
  let ref = false;
  let last = false;
  return (
    <div
      className="messages-main"
      style={chat.chat.user_id && { background: "#e5ddd5" }}
      ref={mainRef}
      onLoad={moveScroll}
      onScroll={(e) => handleScroll(e)}
    >
      <ViewImage
        onClose={closeViewImage}
        isOpened={isOpened}
        image={imageSrc}
      />
      <div className="messages-main_container" ref={mainContainerRef}>
        {chat.messages.map((msj, index) => {
          let date;
          let time = handleTime(msj);
          msj.file && load++
          if (storeDate !== time[2] + time[1] || index === 0) {
            storeDate = time[2] + time[1];
            date = `${time[2]}-${time[1]}`;
          }
          let border = modifyBorder(msj, index);
          let style = msj.user === user._id ? "myMessage" : "otherMessage";

          //toNewMessage
          let noRef = false;
          if (!ref) {
            if (msj.seen === 0 && msj.user !== user._id) {
              ref = true;
              noRef = true;
            } else if (index === chat.messages.length - 1) {
              ref = true;
              noRef = true;
              last = true;
            }
          }

          return (
            <React.Fragment key={msj.message_id}>
              {date && (
                <div className="dateTime" ref={dateRef}>
                  <div className="dateTime-info">{date}</div>
                </div>
              )}
              {noRef && !last && (
                <div className="newMsg-contenedor" ref={noRef ? messRef : null}>
                  <div className="newMsg-title">Mensajes Nuevos</div>
                </div>
              )}
              <div className={`message-container ${style}-container`}>
                <div
                  className={`message ${style}`}
                  style={border}
                  ref={noRef && last ? messRef : null}
                >
                  <div className="message-data">
                    {msj.message.split("\n").map((msg, index) => {
                      return <p key={`${msj.message_id}-${index}`}>{msg}</p>;
                    })}
                    {msj.file && (
                      <figure className="message-data_figure">
                        <img
                          src={msj.file}
                          alt="image"
                          className="message-data_img"
                          onClick={(e) => openViewImage(e)}
                        />
                      </figure>
                    )}
                  </div>
                  <div className="time">
                    <small>{time[4].slice(0, 5)}</small>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
