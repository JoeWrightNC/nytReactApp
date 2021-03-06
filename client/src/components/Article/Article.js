import React from 'react';
import moment from 'moment';
import './Article.css';


export const Article = props => (

  <div className="list-group bg-light">
    <div className="titleLinkContainer" target="_blank">
      <div className="titleContainer">
        <h5 className="title">{props.title}</h5>
        <small>{moment(props.date).format("dddd, MMMM Do YYYY, h:mm")}</small>
      </div>
    </div>
      <div className="summaryContainer" style={{display: 'inline-block'}}>
        <h5 className="summary">{props.summary}</h5>
      </div>
      <div className="btn-group" role="group">
        <a href={props.url} target='_blank'><button type="button" className="btn btnLeft btn-primary">Read</button></a>
        <button type="button" className="btn btn-info" onClick={props.onClick}>{props.type}</button>
      </div>
  </div>
)
