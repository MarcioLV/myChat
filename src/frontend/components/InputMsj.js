import React, { useContext, useState, useRef, useEffect } from "react";

import { AppContext } from "../context/AppProvider";
import "./style/InputMsj.css";

import sendIcon from "../assets/icons/send-icon.png";
import loadPic from "../assets/icons/picture1.png";
import closeIcon from "../assets/icons/cerrar-icon.png";
import config from "../../../config";
const API_URL = `${config.api.host}/${config.api.name}/`;
// const API_URL = `http://localhost:3000/api/`;

const InputMsj = ({searchChat}) => {
  const { state, addChatOutcome, addMessage } = useContext(AppContext);
  const { user, chat } = state;
  const [msj, setMsj] = useState("");
  const [height, setHeight] = useState();

  //uso en el frontend
  const [file, setFile] = useState(null);
  //lo que mando
  const [imagen, setImagen] = useState(null);

  const textRef = useRef();
  const imgInput = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const textHeigth = textRef.current.clientHeight;
      setHeight(textHeigth);
    }
  }, [textRef.current]);

  useEffect(async () => {
    if (searchChat) {
      resetView()
    }
  }, [searchChat]);

  useEffect(() => {
    if (height) {
      textRef.current.style.height = height + "px";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, [msj]);

  const resetView = () => {
    if(imgInput.current){
      imgInput.current.value = "";
    }
    setImagen(null);
    setFile(null);
  }

  const handleAddImage = (e) => {
    console.log(e);
    if (e.target.files.length > 0) {
      let img = e.target.files[0];
      let reader = new FileReader();
      let image = new Image();

      reader.onload = function (f) {
        image.src = f.target.result;
        image.onload = async function () {
          const maxHeight = 500;
          const maxWidth = 500;
          let width = image.width;
          let height = image.height;
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          image.width = width;
          image.height = height;
          setFile(image);

          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);

          const blob = await new Promise((rs) => canvas.toBlob(rs, 1));
          const resizedFile = await new File([blob], img.name, img);

          setImagen(resizedFile);
        };
      };
      reader.readAsDataURL(img);
    }
  };

  const handleAddMessage = async () => {
    if (!msj && !imagen) {
      return alert("Escribi un mensaje");
    }
    let chatId = chat.chat.chat_id;
    //Add new Chat to DB
    let addChat;
    if (!chatId) {
      const newChat = {
        userFrom: user._id,
        userTo: chat.chat.user_id,
      };
      let response = await handleAddNewChat(newChat);
      if (response.error) {
        console.error(response.body);
        return alert("Sucedio un error");
      }
      chatId = response.body.insertId;
      addChat = {
        chat_id: chatId,
        user_id: chat.chat.user_id,
        name: chat.chat.name,
      };
    }
    //Add the message to the new chat
    let msjInfo = new FormData();
    msjInfo.append("chat", chatId);
    msjInfo.append("user", user._id);
    msjInfo.append("userTo", chat.chat.user_id);
    msjInfo.append("message", msj);
    msjInfo.append("picture", imagen);

    const response = await fetchAddMessage(msjInfo);
    if (response.error) {
      console.error(response.body);
      return alert("Sucedio un error");
    }
    const message = {
      message_id: response.body.insertId,
      chat_id: chatId,
      user: user._id,
      message: msj,
      file: response.body.file,
    };
    if (addChat) {
      addChatOutcome(addChat, message);
    } else {
      addMessage(message);
    }
    setMsj("");
    resetView()
  };

  const handleAddNewChat = async (data) => {
    try {
      let response = await fetch(`${API_URL}chat`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      response = await response.json();
      return response;
    } catch (err) {
      let error = {
        error: true,
        body: err,
      };
      return error;
    }
  };

  const fetchAddMessage = async (data) => {
    try {
      let response = await fetch(`${API_URL}message`, {
        method: "POST",
        mode: "cors",
        // headers: {
        //   "Content-type": "application/json",
        // },
        body: data,
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

  const handleSubmit = (e) => {
    if (e.charCode === 13) {
      if (!e.shiftKey) {
        handleAddMessage();
      } else {
        setMsj(msj + "\n");
      }
    }
  };

  const closeImage = () => {
    resetView()
  };

  if (!chat.chat.user_id) {
    return <></>;
  }
  // //imagen para post
  // let picture = "";
  // // let imgStyle = { display: "none" };
  // if (file) {
  //   picture = file.src;
  //   // imgStyle.display = "flex";
  // }
  return (
    <div className="input">
      {file && (
        <div className="input-image" /*style={{ display: imgStyle.display }}*/>
          <figure className="input-image_figure">
            <img src={file.src} /*style={imgStyle}*/ />
          </figure>
          <div className="input-image_close">
            <button className="input-image_close_button" onClick={closeImage}>
              <img src={closeIcon} alt="" />
            </button>
          </div>
        </div>
      )}
      <div className="input-text">
        <div className="input-container">
          <textarea
            value={msj}
            onChange={(e) => {
              e.target.value.slice(-1) !== "\n" && setMsj(e.target.value);
              // setMsj(e.target.value)
            }}
            onKeyPress={(e) => {
              handleSubmit(e);
            }}
            placeholder="Escribe un mensaje"
            ref={textRef}
          />
          <div className="input-imagenLoad">
            <label htmlFor="img-file">
              <img src={loadPic} />
            </label>
            <input
              ref={imgInput}
              type="file"
              id="img-file"
              accept="image/*"
              onChange={(e) => handleAddImage(e)}
            />
          </div>
          <button onClick={handleAddMessage}>
            <img className="sendButton" src={sendIcon} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputMsj;
