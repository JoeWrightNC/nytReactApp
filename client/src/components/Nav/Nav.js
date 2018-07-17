import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const Nav = () =>

  <nav className="navbar navbar-fixed-top">
    <div className="header">
      <div className="headerText" to="/">The Historical Chronicle</div><br/>
      <h4 className='subHeaderText'>Find and Save NYT Articles Dating Back to 1851</h4>
      <ul className="navbar-nav">
        <li className="nav-item navMarg">
          <Link to="/"><button type="button" className="btn btn-lg btn-info">Home</button></Link>
        </li>
        <li className="nav-item">
          <Link to="/savedArticles"><button type="button" className="btn btn-lg btn-info">Saved</button></Link>
        </li>
      </ul>
    </div>
  </nav>;

export default Nav;
