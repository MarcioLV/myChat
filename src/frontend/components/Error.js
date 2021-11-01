import React from "react";

import "./style/Error.css";

const Error = ({height}) => {
  return (
    <div className="error" style={height && {height: height}}>
      Sucedio un Error
    </div>
  );
};

export default Error;