let build_list = ()=>{
  return new Promise((rs,rj)=>{
    let datalist = document.querySelector("#services");
    for(let service in Stream.service){
      let option = document.createElement("option");
      option.value = service;
      datalist.appendChild(option);
    }
    rs();
  });
};

let stream = new Promise((rs,rj)=>{
  let checker = new RegExp(/([-a-z0-9]+\.[a-z]+)(?:\=)([-\w]+)/i);
  if(!location.search.length){
    build_list().then(()=>{
      document.querySelector("form").addEventListener("submit",e=>{
        e.preventDefault();
        let service = e.target.querySelector("input[name=\"stream_service\"]").value;
        let id = e.target.querySelector("input[name=\"stream_id\"]").value;
        let data = checker.exec(`${service}=${id}`);
        rs(data);
      });
    }).catch(e=>{rj(e)});
  }else{
    let data = checker.exec(location.search);
    rs(data);
  }
});

stream.then(d=>{
  if(!d || d.length != 3)throw Error("There was an error parsing the stream information");
  let service = d[1];
  let id = d[2];
  document.querySelector("form").classList.add("hidden");
  history.pushState({},"Embed/Stream",`?${service}=${id}`);
  stream = new Stream(service,id);
}).catch(e=>{throw Error(e)});
