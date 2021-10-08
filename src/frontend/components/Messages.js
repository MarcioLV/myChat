import React, { useContext } from "react";

import { AppContext } from "../context/AppProvider";
import "./style/Messages.css";

const Messages = () => {
  const { state } = useContext(AppContext);
  const { chat, user } = state;

  if (!chat.messages) {
    return <></>;
  }
  return (
    <>
      {chat.messages.map((msj) => {
        let style = msj.user === user._id ? "myMessage" : "otherMessage";
        return (
          <div key={msj.message_id} className={`message-container ${style}-container`}>
            <div  className={`message ${style}`}>
              <p>{msj.message}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Messages;
