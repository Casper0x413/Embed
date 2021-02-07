class Stream{
  static services = {

  };
  constructor(channel){
    if(!channel && typeof channel != "string" && channel != "")throw Error("Missing a channel name or search query as an argument for TwitchStream");
    channel = new RegExp(/(?:channel\=)(\w+)/ig).exec(channel);
    if(!channel || !channel.length)throw Error("Invalid channel name or search query as an argument for TwitchStream");
    this.channel = channel[1];
    this.chat = `https://www.twitch.tv/embed/${this.channel}/chat?parent=${location.host}`;
    this.video = `https://player.twitch.tv/?channel=${this.channel}&parent=${location.host}`;
    this.orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    this.resizing = false;
    this.snapdist = 128;
  }
  watch(){
    document.querySelector("#video").src = this.video;
    this.video = document.querySelector("#video");
    document.querySelector("#chat").src = this.chat;
    this.chat = document.querySelector("#chat");
  }
}

let divider = document.querySelector("#divider");

divider.addEventListener("mousedown",function(e){
  stream.resizing = true;
  this.style.position = "absolute";
  this.style.opacity = "0.2";
  this.style.height = "100vh";
  this.style.width = "100vw";
});

divider.addEventListener("mouseup",function(e){
  stream.resizing = false;
  this.style.position = "unset";
  this.style.opacity = "1";
  this.style[stream.orientation == "portrait" ? "height" : "width"] = "8px";
  this.style[stream.orientation != "portrait" ? "height" : "width"] = `100v${stream.orientation == "portrait" ? "h" : "w"}`;
  if(e[stream.orientation == "landscape" ? "x" : "y"] < stream.snapdist){
    stream.video.style[stream.orientation == "portrait" ? "height" : "width"] = "0%";
    stream.chat.style[stream.orientation == "portrait" ? "height" : "width"] = "100%";
  }else if(e[stream.orientation == "landscape" ? "x" : "y"] > (window[stream.orientation == "portrait" ? "innerHeight" : "innerWidth"] - stream.snapdist)){
    stream.video.style[stream.orientation == "portrait" ? "height" : "width"] = "100%";
    stream.chat.style[stream.orientation == "portrait" ? "height" : "width"] = "0%";
  }
});

window.addEventListener("mousemove",e=>{
  if(!stream.resizing)return;
  let video_size = 100 * (e[stream.orientation == "landscape" ? "x" : "y"] / window[stream.orientation == "landscape" ? "innerWidth" : "innerHeight"]);
  let chat_size = 100 - video_size;
  stream.video.style[stream.orientation == "portrait" ? "height" : "width"] = `${video_size}%`;
  stream.chat.style[stream.orientation == "portrait" ? "height" : "width"] = `${chat_size}%`;
});

window.addEventListener('resize',()=>{
  let orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  if(stream.orientation != orientation){
    stream.orientation = orientation;
    divider.style[orientation == "portrait" ? "height" : "width"] = "8px";
    divider.style[orientation != "portrait" ? "height" : "width"] = `100v${orientation == "portrait" ? "h" : "w"}`;
    let vw = stream.video.style.width;
    let vh = stream.video.style.height;
    let cw = stream.chat.style.width;
    let ch = stream.chat.style.height;
    stream.video.style.height = vw;
    stream.video.style.width = vh;
    stream.chat.style.height = cw;
    stream.chat.style.width = ch;
  }
});

let stream = new Stream(location.search);

stream.watch();