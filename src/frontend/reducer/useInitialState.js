import { useState } from "react";
import initialState from "../initialState";

const useInitialState = () => {
  const [state, setState] = useState(initialState);

  //funciones internas
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

  const modifyOrderChat = (chat) => {
    let ordChat = state.chats.slice()
    let index = ordChat.findIndex(e=>e.chat_id === chat.chat_id)
    if(index === -1){
      ordChat.unshift(chat)
      return ordChat
    }
    const element = ordChat.splice(index, 1)
    ordChat.unshift(element[0])
    return ordChat
  }

  const modifySeenMsj = (messages) => {
    messages.forEach(msj => {
      if(msj.seen === 0){
        msj.seen = 1
      }
    });
    return messages
  }
  //-------------------------
  const setUser = (payload) => {
    setState({
      ...state,
      user: { _id: payload.user_id, name: payload.name, avatar: payload.avatar },
    });
  };
  
  const setAvatar = (payload) => {
    setState({
      ...state,
      user: {...state.user, avatar: payload}
    })
  }

  const setChats = (payload) => {
    const mark = payload.filter(e=>e.seen > 0)
    let msg = []
    mark.forEach(chat => {
      msg.push({chat_id: chat.chat_id, cant: chat.seen})
    })
    setState({
      ...state,
      chats: payload,
      newMessages: msg
    });
  };
  
  const addChatIncome = (payload) => {
    const msg = modifyNewMessage(payload.chat_id)
    setState({
      ...state,
      chats: [payload, ...state.chats],
      newMessages: msg,
    });
  };

  const addChatOutcome = (chat, message)=>{
    const ordChat = modifyOrderChat(chat)
    setState({
      ...state,
      chats: ordChat,
      chat: {...state.chat, chat: chat, messages:[...state.chat.messages, message]}
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

  const deleteChatMessages = () => {
    setState({
      ...state,
      chat: {chat: {}, messages: []}
    
    });
  }

  const handleModifyMsj = () => {
    let messages = state.chat.messages
    messages = modifySeenMsj(messages)
    setState({
      ...state,
      chat: { ...state.chat, messages: [...messages] },
    });
  }

  const addMessage = (payload) => {
    const ordChat = modifyOrderChat(payload)
    let messages = state.chat.messages
    if(payload.user === state.user._id){
      messages = modifySeenMsj(messages)
    }
    setState({
      ...state,
      chat: { ...state.chat, messages: [...messages, payload] },
      chats: ordChat
    });
  };

  const addNewMessage = (payload) => {
    const msg = modifyNewMessage(payload)
    const ordChat = modifyOrderChat({chat_id: payload})
    setState({
      ...state,
      newMessages: msg,
      chats: ordChat
    });
  };
  
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
    setAvatar,
    setChats,
    addChatIncome,
    addChatOutcome,
    setChat,
    deleteChatMessages,
    addMessage,
    handleModifyMsj,
    addNewMessage,
    addSearch,
    deleteSearch,
  };
};

export default useInitialState;
