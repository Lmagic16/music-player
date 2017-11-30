import React, { Component } from 'react';
import $ from 'jquery';
import 'jplayer';
import Player from "./page/Player.js";
import MusicList from "./page/MusicList.js";
import { MUSIC_LIST } from "./config/config.js";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import PubSub from 'pubsub-js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentPlayID:0,
        playMode:"in-order",
    }
    this.playMusic = this.playMusic.bind(this);
  }
  playMusic(musicID) {
    $("#player").jPlayer("setMedia", {
        mp3: MUSIC_LIST[musicID].file,
    }).jPlayer("play");
  }
  componentDidMount() {
    $("#player").jPlayer({
      supplied: "mp3",
      wmode:"window",
    });/*jplayer初始化*/
    this.playMusic(this.state.currentPlayID);
    PubSub.subscribe('CHANGE_MUSIC', (topic,itemId) => { /*添加订阅*/
        this.setState({
            currentPlayID:itemId,
        });
        this.playMusic(itemId);
    });
    PubSub.subscribe('CHANGE_MODE', (topic) => { /*添加订阅*/
        this.setState((prevState, props) => ({/*由于state异步更新，采用如此方式*/
          playMode: (prevState.playMode === "in-order" ? "single-loop" : "in-order"),
        }));
    });
    $("#player").bind($.jPlayer.event.ended,(event) => { /*监听歌曲播放完的事件*/
        if(this.state.playMode === "in-order"){/*顺序播放*/
            let nextID = (this.state.currentPlayID + 1) % MUSIC_LIST.length;
            PubSub.publish('CHANGE_MUSIC',nextID);
        }else if(this.state.playMode === "single-loop"){/*单曲循环*/
            PubSub.publish('CHANGE_MUSIC',this.state.currentPlayID);
        }
    });
  }
  componentWillUnmount(){
    PubSub.unsubscribe("CHANGE_MUSIC");/*取消订阅*/
    PubSub.unsubscribe("CHANGE_MODE");
    $("#player").unbind($.jPlayer.event.ended);
  }
  render() {
    let currentPlay = MUSIC_LIST[this.state.currentPlayID];
    return (
      <div className="App">
        <div id="player"></div>
        <Router>
            <Switch>
                <Route exact path="/" render={(props) => (
                    <Player {...props} currentPlay={currentPlay} musicLength={MUSIC_LIST.length} playMode={this.state.playMode} ></Player>
                    )} />
                <Route path="/player" render={(props) => (
                    <Player {...props} currentPlay={currentPlay} musicLength={MUSIC_LIST.length} playMode={this.state.playMode} ></Player>
                    )} />
                <Route path="/musiclist" render={(props) => (
                    <MusicList {...props} musicList={MUSIC_LIST}  currentMusic={currentPlay}></MusicList>
                    )} />
            </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
