import React from 'react'
import ReactDOM from 'react-dom'

import App from './routes/App'

let vh = window.innerHeight * 0.01
console.log(vh);

ReactDOM.render(<App />, document.getElementById("app"))
