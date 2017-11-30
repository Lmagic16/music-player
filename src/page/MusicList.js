import React, { Component } from 'react';
import Header from "../components/Header.js";
import MusicItem from "../components/MusicItem.js";
import "./MusicList.css";
import { Link } from 'react-router-dom';

class MusicList extends Component {
  render() {
    let musicList = this.props.musicList;
    let musicListUI = musicList.map((item) => (
        <div key={item.id}>
            <MusicItem  item={item} isPlay={this.props.currentMusic.id === item.id} />
        </div>
    ));
    return (
      <div className="MusicList">
        <Header />
        <ul className="MusicList-ul">{musicListUI}</ul>
        <Link className="MusicList-link" to="/player"><i className="fa fa-angle-double-left" aria-hidden="true"></i> 返回播放界面</Link>
      </div>
    );
  }
}

export default MusicList;
