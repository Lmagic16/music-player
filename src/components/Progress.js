import React, { Component } from 'react';
import './Progress.css';

class Progress extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    let progressBar = this.refs.progressBar;
    let currentPercent = (event.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
    this.props.handleProgress(currentPercent);
  }
  render() {
    return (
      <div className="Progress-container" onClick={this.handleClick} ref="progressBar" >
        <div className="Progress-bar" style={{width:`${this.props.progress}%`,backgroundColor:`${this.props.barColor}`}} ></div>
      </div>
    );
  }
}

export default Progress;
