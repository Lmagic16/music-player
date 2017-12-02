## React练手项目-音乐播放器
### 所用技术
框架：React  
路由：react-router  
音乐播放器(多媒体库插件)：jPlayer    
事件发布/订阅库：pubsub-js  

### 项目src结构
```
src/
├─App.js
├─App.test.js
├─index.css
├─index.js
├─registerServiceWorker.js
├─static
|   ├─images
|   |   └logo.png
├─page
|  ├─MusicList.css
|  ├─MusicList.js
|  ├─Player.css
|  └Player.js
├─config
|   └config.js
├─components
|     ├─Header.css
|     ├─Header.js
|     ├─MusicItem.css
|     ├─MusicItem.js
|     ├─Progress.css
|     └Progress.js

```

### overview
![](https://i.imgur.com/MEJAE81.jpg)
![](https://i.imgur.com/rHuXgae.jpg)
## 如何运行

### 安装
$npm install

### 启动
$npm start

## 项目总结
### 基础知识：
- webpack：webpack默认配置文件名webpack.config.js；webpack-dev-server 基于node的服务器，可热刷新；
- 安装包：$ npm install jquery --save;   
npm install module-name -save 自动把模块和版本号添加到dependencies部分  
npm install module-name -save-dve 自动把模块和版本号添加到devdependencies部分  
- 绑定事件要注意解绑操作，订阅事件要注意取消订阅；  
- 组件间通信，1）可通过最近的公共祖先组件通信，如果层级较多，会比较复杂；2）通过事件订阅机制
- 使用图标：npm install font-awesome --save安装，并在全局css中引入@import url('../node_modules/font-awesome/css/font-awesome.min.css')
- 如果组件在共用时，某些部分需要改变，可通过props传入需要变化的变量部分；

### 项目逻辑：
 1. 首先从项目效果上，将UI进行拆分，相似的UI可拆为一个组件，组件最好单一职责原则；  
 总体分为两个页面，播放页面Player和MusicList，两个页面共用一个Header组件，页面Player内音量和播放的进度条组件可共用，在页面MusicList内每一条歌曲为一个组件；
 2. 确定组件的state，state尽可能少，以便于维护，如果state可以从父组件传过来，或者由state和props共同计算出来，就不是state；   
 由于，两个页面切换，不影响当前播放，所以主页面存放当前播放歌曲和全部歌曲；
 3. 页面逻辑   
 播放器采用基于jQuery的第三方插件jplayer；  
 主页App控制歌曲的播放（jplayer的api）；   
 页面Player的交互逻辑：通过props从父组件拿到当前播放歌曲的信息，并展示，点击播放进度条可调控播放进度，点击音量进度条可控制音量，控制当前歌曲的播放和暂停，三者都通过jplayer的api来调控。上一曲和下一曲需要利用回调函数传参的方式将要播放的歌曲ID传给父组件；  
 页面MusicList的交互逻辑：从父组件获取当前播放歌曲并高亮显示，从父组件获取全部歌曲并显示（map），点击事件将要播放的歌曲传给父组件的父组件（层层回调），相似的UI可划为一个组件，显示的不同内容可通过props传入；  
 4. 页面路由（不用React Router）  
 在相应a链接处，写入hash值。在主页面记录hash的state，并监听window.location.hash的变化修改相应state，主页的render()函数内if判断当前state，将需要渲染的child分别赋值为页面Player和页面MusicList； 
 5. **页面路由（采用React Router4.2.2）**  
  [react-router中文文档](https://react-guide.github.io/react-router-cn/index.html)    
  [react-router版本变化指南](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md)  
  [react-router API github 文档](https://github.com/ReactTraining/react-router/tree/master/packages/react-router/docs/api)   
  [react-router@4简介](http://www.jianshu.com/p/6a45e2dfc9d9)     
  $npm install react-router-dom --save  
  \<Route render\> 这种方式可进行内联渲染和包装组件
 
 6. 组件通信优化   
 由于层层回调难以维护，所以采用**事件订阅机制**，由于是松耦合，所以便于维护；  
 消息可通过发布者传给订阅者，即publisher传给subscribe；  
 安装：$npm install pubsub-js --save 
 引入: import PubSub from 'pubsub-js';  
 发送消息：PubSub.publish(订阅分类名称,参数)；     
 订阅消息：PubSub.subscrib(订阅分类名称,函数) ，这里注意函数的第一个参数是订阅分类名称，第二个参数为接收到publisher传来的消息；   
 取消订阅：PubSub.unsubscrib(名称)； 
 7. 技巧:  
 上一首和下一首不用if-else判断是否溢出数组长度，可采用对数组长度取余的方式；上一首为了防止出现id为负数，可加上数组长度再取余；   

### jPlayer API
```javascript
/*jplayer初始化*/
$("#player").jPlayer({
  supplied: "mp3",
  wmode:"window",
});

/*播放具体音乐*/
$("#player").jPlayer("setMedia", {
  mp3: MUSIC_LIST[musicID].file,
}).jPlayer("play");

/*播放*/
$("#player").jPlayer("play");

/*暂停*/
$("#player").jPlayer("pause");

/*调整播放进度*/
$("#player").jPlayer("play",duration * currentPercent);

/*调整播放音量*/
$("#player").jPlayer("volume",currentPercent);

/*当当前事件被改变时触发*/
$.jPlayer.event.timeupdate

/*当多媒体播放结束时触发*/
$.jPlayer.event.ended

/*当前音量0-1*/
event.jPlayer.options.volume

/*当前播放进度百分比0-100*/
event.jPlayer.status.currentPercentAbsolute
```

### 后续工作
- 优化CSS以及手机端的自适应
- 引入获取音乐的API，增加音乐库
- 增加功能
- 增加状态管理：mobx  