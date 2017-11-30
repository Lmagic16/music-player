import React, { Component } from 'react';
import './MusicItem.css';
import PubSub from 'pubsub-js';

class MusicItem extends Component {
  constructor(props) {
    super(props);
    this.handleClickItem = this.handleClickItem.bind(this);
  }
  handleClickItem() {
    PubSub.publish('CHANGE_MUSIC',this.props.item.id);
  }
  render() {
    let item = this.props.item;
    return (
      <li className={`MusicItem-li${this.props.isPlay ? " focus" : ''}`} onClick={this.handleClickItem} >
        <strong>{item.title}</strong> - {item.artist}
      </li>
    );
  }
}

export default MusicItem;
