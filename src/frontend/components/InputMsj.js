import React, { useContext, useState, useRef,useEffect } from "react";

import { AppContext } from "../context/AppProvider";
import "./style/InputMsj.css"

const API_URL = "http://localhost:3000/api/"

const InputMsj = () => {
  const { state, addChatOutcome, setChat } = useContext(AppContext);
  const {user, chat} = state
  const [msj, setMsj] = useState("");
  const [height, setHeight] = useState()

  const textRef = useRef()
  const divRef = useRef()
  const textareaheight = 23

  useEffect(()=>{
    if(textRef.current){
      const textHeigth = textRef.current.clientHeight
      const divHeigth = divRef.current.clientHeight
      setHeight({text: textHeigth, div: divHeigth})
    }
  },[textRef.current])

  const handleTypeMessage = (value) => {
    console.log(height);
    if(height){
      textRef.current.style.height = height.text + "px";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
      divRef.current.style.height = height.div + "px";
      divRef.current.style.height = textRef.current.scrollHeight + "px";
    }
    setMsj(value)
  }

  const handleAddMessage = async () => {
    if(!msj){
      return alert("Escribi un mensaje")
    }
    let chatId =chat.chat.chat_id;
    //Add new Chat to DB
    if(!chatId){
      const newChat = {
        userFrom: user._id,
        userTo: chat.chat.user_id
      }
      let response = await handleAddNewChat(newChat)
      if(response.error){
        console.error(response.body);
        return alert("Sucedio un error")
      }
      chatId = response.body.insertId
      const addChat = {
        chat_id: chatId,
        user_id: chat.chat.user_id,
        name: chat.chat.name
      }
      addChatOutcome(addChat)
    }
    //Add the message to the new chat
    const msjInfo = {
      chat: chatId,
      user: user._id,
      userTo: chat.chat.user_id,
      message: msj
    }

    const response = await fetchAddMessage(msjInfo)
    if(response.error){
      console.error(response.body);
      return alert("Sucedio un error")
    }
    setMsj('')

  }

  const handleAddNewChat = async (data) => {
    try{
      let response = await fetch(`${API_URL}chat`,{
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type":"application/json"
        },
        body:JSON.stringify(data)
      })
      response = await response.json()
      return response
    } catch (err){
      let error = {
        error: true,
        body: err
      }
      return error
    }
  }

  const fetchAddMessage = async (data) => {
    try {
      let response = await fetch(`${API_URL}message`,{
        method: "POST",
        mode:"cors",
        headers:{
          "Content-type": "application/json"
        },
        body:JSON.stringify(data)
      })
      response = await response.json()
      return response
    } catch (error) {
      let err = {
        error: true,
        body: error,
      }
      return err
    }
  }

  if(!chat.chat.user_id){
    return <div></div>
  }
  return (
    <>
      <div ref={divRef} className="input-container">
        <textarea
          value={msj}
          onChange={(e) => handleTypeMessage(e.target.value)}
          placeholder="Escribe un mensaje aqui"
          ref={textRef}
        />
        <button onClick={handleAddMessage}>Send</button>
      </div>
    </>
  );
};

export default InputMsj;
