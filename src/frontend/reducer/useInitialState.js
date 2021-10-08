import { useState } from "react";
import initialState from "../initialState";

const useInitialState = () => {
  const [state, setState] = useState(initialState);

  const modifyNewMessage = (payload) => {
    let msg = state.newMessages
    const index = msg.findIndex(e=>e.chat_id === payload)
    if(index === -1){
      msg.push({chat_id: payload, cant: 1})
    }else{
      const cant = msg[index].cant + 1
      msg.splice(index, 1)
      msg.push({chat_id: payload, cant: cant})
    }
    return msg
  }

  const setUser = (payload) => {
    setState({
      ...state,
      user: { _id: payload.user_id, name: payload.name },
    });
  };

  const setChats = (payload) => {
    setState({
      ...state,
      chats: payload,
    });
  };
  
  const addChatIncome = (payload) => {
    const msg = modifyNewMessage(payload.chat_id)
    setState({
      ...state,
      chats: [...state.chats, payload],
      newMessages: msg
    });
  };

  const addChatOutcome = (payload)=>{
    setState({
      ...state,
      chats: [...state.chats, payload],
      chat: {...state.chat, chat: payload}
    })

  }
  
  const setChat = (payload) => {
    let msg = state.newMessages
    const index = msg.findIndex(e=>e.chat_id === payload.chat.chat_id)
    if(index !== -1){ 
      msg.splice(index, 1)
    }
    setState({
      ...state,
      chat: { ...state.chat, ...payload },
      newMessages: msg
    });
  };

  const addMessage = (payload) => {
    setState({
      ...state,
      chat: { ...state.chat, messages: [...state.chat.messages, payload] },
    });
  };

  const addNewMessage = (payload) => {
    const msg = modifyNewMessage(payload)
    setState({
      ...state,
      newMessages: msg,
    });
  };
  
  // const deleteNewMessage = payload => {
  //   setState({
  //     ...state,
  //     newMessages: msg
  //   })
  // }

  const addSearch = (payload) => {
    setState({
      ...state,
      search: payload,
    });
  };

  const deleteSearch = () => {
    setState({
      ...state,
      search: [],
    });
  };

  return {
    state,
    setUser,
    setChats,
    addChatIncome,
    addChatOutcome,
    setChat,
    addMessage,
    addNewMessage,
    // deleteNewMessage,
    addSearch,
    deleteSearch,
  };
};

export default useInitialState;
