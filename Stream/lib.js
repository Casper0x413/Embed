class Stream{
  static service = {
    "breakers.tv": {
      "chat_url": "https://breakers.tv/popout/chat/{id}",
      "color_scheme": "#3B4E53",
      "video_url": "https://breakers.tv/embed/video/{id}"
    },
    "twitch.tv": {
      "chat_url": `https://www.twitch.tv/embed/{id}/chat?parent=${location.host}`,
      "color_scheme": "#9147FF",
      "video_url": `https://player.twitch.tv/?channel={id}&parent=${location.host}`
    },
    "vaughn.live": {
      "chat_url": "https://vaughn.live/popout/chat/{id}",
      "color_scheme": "#1A3E66",
      "video_url": "https://vaughn.live/embed/video/{id}"
    },
    "youtube.com": {
      "chat_url": `https://www.youtube.com/live_chat?v={id}&embed_domain=${location.host}`,
      "color_scheme": "#E62117",
      "video_url": "https://gaming.youtube.com/embed/{id}?autoplay=true"
    }
  };
  constructor(service,channel){
    service = typeof service == "string" ? service.match(/^[-a-z0-9]+\.[a-z]+$/i) : null;
    channel = typeof channel == "string" ? channel.match(/^[-\w]+$/i) : null;
    if(!service || !channel)throw Error("Invalid/Missing Arguments");
    service = service[0];
    channel = channel[0];
    if(!(service in Stream.service))throw Error("Service Not Supported");
    this.service = service;
    this.id = channel;
    this.orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    this.chat;
    this.video;
    this.divider;
    this.resizing;
    this.build().then(()=>{
      this.resize_monitor();
    }).catch(e=>{throw Error(e)});
  }
  build(){
    return new Promise((rs,rj)=>{
      this.chat = document.createElement("iframe");
      this.chat.classList.add("chat");
      this.chat.src = Stream.service[this.service].chat_url.replace("{id}",this.id);
      this.divider = document.createElement("div");
      this.divider.classList.add("divider");
      this.divider.resizing = false;
      this.divider.snap_at = 128;
      this.divider.style.background = Stream.service[this.service].color_scheme;
      this.video = document.createElement("iframe");
      this.video.classList.add("video");
      this.video.src = Stream.service[this.service].video_url.replace("{id}",this.id);
      document.body.insertBefore(this.chat,document.body.children[0]);
      document.body.insertBefore(this.divider,document.body.children[0]);
      document.body.insertBefore(this.video,document.body.children[0]);
      rs();
    });
  }
  resize_monitor(){
    let resize_start = e=>{
      if(e.type.includes("touch")){
        let touch = e.touches[0];
        e.x = touch.clientX;
        e.y = touch.clientY;
      }
      this.resizing = true;
      this.divider.style.position = "absolute";
      this.divider.style.opacity = "0.2";
      this.divider.style.height = "100vh";
      this.divider.style.width = "100vw";
    };
    this.divider.addEventListener("mousedown",resize_start);
    this.divider.addEventListener("touchstart",resize_start);
    let resize_end = e=>{
      if(e.type.includes("touch")){
        let touch = e.touches[0];
        e.x = touch.clientX;
        e.y = touch.clientY;
      }
      this.resizing = false;
      this.divider.style.position = "unset";
      this.divider.style.opacity = "1";
      this.divider.style[this.orientation == "portrait" ? "height" : "width"] = "8px";
      this.divider.style[this.orientation != "portrait" ? "height" : "width"] = `100v${this.orientation == "portrait" ? "h" : "w"}`;
      this.divider.inner_snap = e[this.orientation == "landscape" ? "x" : "y"];
      this.divider.outer_snap = window[this.orientation == "portrait" ? "innerHeight" : "innerWidth"] - e[this.orientation == "landscape" ? "x" : "y"];
      if(this.divider.inner_snap < this.divider.snap_at || this.divider.outer_snap < this.divider.snap_at){
        this.video.style[this.orientation == "portrait" ? "height" : "width"] = this.divider.outer_snap < this.divider.snap_at ? "100%" : "0%";
        this.chat.style[this.orientation == "portrait" ? "height" : "width"] = !(this.divider.outer_snap < this.divider.snap_at) ? "100%" : "0%";
      }
    };
    this.divider.addEventListener("mouseup",resize_end);
    this.divider.addEventListener("touchend",resize_end);
    let resize_move = e=>{
      if(e.type.includes("touch")){
        let touch = e.touches[0];
        e.x = touch.clientX;
        e.y = touch.clientY;
      }
      if(!this.resizing)return;
      let video_size = 100 * (e[this.orientation == "landscape" ? "x" : "y"] / window[this.orientation == "landscape" ? "innerWidth" : "innerHeight"]);
      let chat_size = 100 - video_size;
      this.video.style[this.orientation == "portrait" ? "height" : "width"] = `${video_size}%`;
      this.chat.style[this.orientation == "portrait" ? "height" : "width"] = `${chat_size}%`;
    };
    this.divider.addEventListener("mousemove",resize_move);
    this.divider.addEventListener("touchmove",resize_move);
    window.addEventListener('resize',()=>{
      let orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
      if(this.orientation != orientation){
        this.orientation = orientation;
        this.divider.style[orientation == "portrait" ? "height" : "width"] = "8px";
        this.divider.style[orientation != "portrait" ? "height" : "width"] = `100v${orientation == "portrait" ? "h" : "w"}`;
        let vw = this.video.style.width;
        let vh = this.video.style.height;
        let cw = this.chat.style.width;
        let ch = this.chat.style.height;
        this.video.style.height = vw;
        this.video.style.width = vh;
        this.chat.style.height = cw;
        this.chat.style.width = ch;
      }
    });
  }
}