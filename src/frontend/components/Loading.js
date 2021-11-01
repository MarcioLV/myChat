import React from "react";

import "./style/Loading.css";

const Loading = ({height}) => {
  return (
    <div className="loading" style={height && {height: height}}>
      <div className="preloader"></div>
    </div>
  );
};

export default Loading;
