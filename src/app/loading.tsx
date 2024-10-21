import React from "react";
import PropTypes from "prop-types";
import "./Loading.css";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="loading-container" aria-busy="true" aria-live="polite">
      <div className="spinner" role="progressbar" aria-label="Loading"></div>
      <div className="loading-text">{text}</div>
    </div>
  );
};

Loading.propTypes = {
  text: PropTypes.string,
};

export default Loading;
