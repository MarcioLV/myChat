import config from '../../../config'

import {io} from 'socket.io-client'


let socket = io(`${config.api.host}:${config.api.port}`)

export default socket