let stream = new RegExp(/([-a-z0-9]+\.[a-z]+)(?:\=)([-\w]+)/i).exec(location.search);
if(stream)stream = new Stream(stream[1],stream[2]);