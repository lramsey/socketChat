var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000, '127.0.0.1');
console.log('listening on port 3000');

function handler(req, res){
  console.log(req.url);
  if(req.url === '/chat.js'){
    fs.readFile(__dirname + '/chat.js', function(err, data){
      if(err){
        console.log('failure to read file:', err);
      } else{
        var file = data;
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.end(file);
      }

    });
  } else{
    fs.readFile(__dirname + '/index.html', function(err, data){
      if(err){
        console.log('failure to read file:', err);
      }
      else {
        var file = data;
        res.writeHead(200);
        res.end(file);
      }
  });
    
  }
}

var i = 0;
var id = 0;
var connections = [];
io.on('connection', function(socket){
  console.log('connection made',++i);
  id++;
  var index = connections.push(socket);
  
  io.emit('new', {number: i, id: id});
  
  socket.on('post', function(data){
    var post = data.post;
    console.log('message received:', data.post);
    socket.broadcast.emit('post', data);
  });
  socket.on('my other event', function(data){
    console.log('yo:', data.my);
  });
  socket.on('disconnect', function(data){
    connections.splice(index, 1);
    console.log('connection lost:', --i);

    io.emit('new', {number: i});
  });

});