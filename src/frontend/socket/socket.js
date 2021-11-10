import config from '../config'

import {io} from 'socket.io-client'

console.log(config.api.host);
let socket = io(`${config.api.host}`)

export default socket