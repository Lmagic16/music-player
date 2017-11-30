import React, { Component } from 'react';
import './Player.css';
import $ from 'jquery';
import 'jplayer';
import Header from "../components/Header.js";
import Progress from "../components/Progress.js";
import { Link } from 'react-router-dom';
import PubSub from 'pubsub-js';

let duration = null;
class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
        progress:0,
        volume:0,
        isPlay:true,
    }
    this.handlePlayerProgress = this.handlePlayerProgress.bind(this);
    this.handleVolumeProgress = this.handleVolumeProgress.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleLast = this.handleLast.bind(this);
  }
  handlePlayerProgress(currentPercent) {
    $("#player").jPlayer("play",duration * currentPercent);/*这里会触发$.jPlayer.event.timeupdate事件*/
  }
  handleVolumeProgress(currentPercent) {
    $("#player").jPlayer("volume",currentPercent);/*这里会触发$.jPlayer.event.timeupdate事件*/
  }
  handleIconClick() {
    if(this.state.isPlay){
        $("#player").jPlayer("pause");
    }else{
        $("#player").jPlayer("play");
    }
    this.setState({
        isPlay:!this.state.isPlay,
    });
  }
  handleNext() {
    let currentPlayID = this.props.currentPlay.id;
    let nextID = (currentPlayID + 1) % this.props.musicLength;
    PubSub.publish('CHANGE_MUSIC',nextID);
  }
  handleLast() {
    let currentPlayID = this.props.currentPlay.id;
    let lastID = (currentPlayID - 1 + this.props.musicLength) % this.props.musicLength;
    PubSub.publish('CHANGE_MUSIC',lastID);
  }
  handleChangeMode() {
    PubSub.publish('CHANGE_MODE');
  }
  componentDidMount() {
    $("#player").bind($.jPlayer.event.timeupdate,(event) => {
        duration = event.jPlayer.status.duration;
        this.setState({
            volume:event.jPlayer.options.volume * 100,
            progress:event.jPlayer.status.currentPercentAbsolute,
        });
    });
  }
  componentWillUnmount() {
    $("#player").unbind($.jPlayer.event.timeupdate);
  }
  render() {
    let time = (100-this.state.progress)/100 * duration;
    let minute = Math.floor(time/60);
    let second = Math.round(time - minute * 60);
    let currentPlay = this.props.currentPlay;
    return (
      <div className="Player">
        <Header />
        <div className="Player-container">
            <div className="Player-content">
                <div className="Player-content-left">
                    <Link className="Player-link" to="/musiclist">我的私人音乐坊 > </Link>
                    <div className="Player-musicName">{currentPlay.title}</div>
                    <div className="Player-singer">{currentPlay.artist}</div>
                    <div className="Player-info">
                        <span>{`-${minute}:${second}`}</span>
                        <div className="Player-volume">
                            <span className="fa fa-volume-up" aria-hidden="true"></span>
                            <div className="Player-volume-progress volume-bar" >
                                <Progress progress={this.state.volume} handleProgress={this.handleVolumeProgress} barColor="#888" />
                            </div>
                            <span className="volume-bar">{Math.round(this.state.volume)}%</span>
                        </div>
                    </div>
                    <Progress progress={this.state.progress} handleProgress={this.handlePlayerProgress} barColor="#2f9842" />
                    <div className="Player-icon-container">
                        <span className="fa fa-chevron-left Player-icon" aria-hidden="true" onClick={this.handleLast}></span>
                        <span className={"fa Player-icon " + (this.state.isPlay ? "fa-pause" : "fa-play") } aria-hidden="true"
                              onClick={this.handleIconClick}
                        ></span>
                        <span className="fa fa-chevron-right Player-icon" aria-hidden="true" onClick={this.handleNext}></span>
                        <span className={"fa Player-icon " + (this.props.playMode === "in-order" ? "fa-random" : " ") +
                              (this.props.playMode === "single-loop" ? "fa-refresh" : " ") } aria-hidden="true"
                              onClick = {this.handleChangeMode}
                        ></span>
                    </div>
                </div>
                <div className="Player-content-right">
                    <img src={currentPlay.cover} alt="logo" />
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Player;
