import React, {useContext} from 'react'

import {AppContext} from '../context/AppProvider'
import './style/UserChat.css'

const Username = () => {
  const {state} = useContext(AppContext)
  const {chat} = state
  if(!chat.chat){
    return 
  }
  return (
    <div>{chat.chat.name}</div>
  )
}

export default Username