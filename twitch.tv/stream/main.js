class TwitchStream{
  constructor(channel){
    if(!channel && typeof channel != "string" && channel != "")throw Error("Missing a channel name or search query as an argument for TwitchStream");
    channel = new RegExp(/(?:channel\=)(\w+)/ig).exec(channel);
    if(!channel || !channel.length)throw Error("Invalid channel name or search query as an argument for TwitchStream");
    this.channel = channel[1];
    this.chat = `https://www.twitch.tv/embed/${this.channel}/chat?parent=${location.host}`;
    this.video = `https://player.twitch.tv/?channel=${this.channel}&parent=${location.host}`;
  }
  watch(){
    document.querySelector("#video").src = this.video;
    document.querySelector("#chat").src = this.chat;
  }
}

let stream = new TwitchStream(location.search);

stream.watch();