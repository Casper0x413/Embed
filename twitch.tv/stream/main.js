class TwitchStream{
  constructor(channel){
    if(!channel && typeof channel != "string" && channel != "")throw Error("Missing a channel name or search query as an argument for TwitchStream");
    channel = new RegExp(/(?:channel\=)(\w+)/ig).exec(channel);
    if(!channel || !channel.length)throw Error("Invalid channel name or search query as an argument for TwitchStream");
    this.channel = channel[1];
    this.chat = `https://www.twitch.tv/embed/${this.channel}/chat?parent=${location.host}`;
    this.video = `https://player.twitch.tv/?channel=${this.channel}&parent=${location.host}`;
    this.resizing = false;
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
  this.style.width = "100%";
});

divider.addEventListener("mouseup",function(e){
  stream.resizing = false;
  this.style.position = "unset";
  this.style.opacity = "1";
  this.style.width = "8px";
  if(e.x < 64){
    stream.video.style.width = `0px`;
    stream.chat.style.width = `${window.innerWidth}px`;
  }else if(e.x > (window.innerWidth - 64)){
    stream.video.style.width = `${window.innerWidth}px`;
    stream.chat.style.width = `0px`;
  }
});

window.addEventListener("mousemove",e=>{
  if(!stream.resizing)return;
  stream.video.style.width = `${e.x}px`;
  stream.chat.style.width = `${window.innerWidth - (e.x + 1)}px`;
});

window.addEventListener("mouseout",e=>{
  if(stream.resizing){
    if(e.x < 64){
      stream.video.style.width = `0px`;
      stream.chat.style.width = `${window.innerWidth}px`;
    }else if(e.x > (window.innerWidth - 64)){
      stream.video.style.width = `${window.innerWidth}px`;
      stream.chat.style.width = `0px`;
    }
  }
});

let stream = new TwitchStream(location.search);

stream.watch();