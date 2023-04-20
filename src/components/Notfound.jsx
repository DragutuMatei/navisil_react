import React from "react";
import "../css/notfound.css";
import { Link } from "react-router-dom";

function Notfound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p>Oops! Something is wrong.</p>
      <Link className="button" to="/">
        <i className="icon-home"></i> Go back in initial page, is better.
      </Link>
    </div>
  );
}

export default Notfound;
