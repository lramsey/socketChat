var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000, '127.0.0.1');
console.log('listening on port 3000');

function handler(req, res){
  if(req.url === '/chat.js'){
    fs.readFile(__dirname + '/public/chat.js', function(err, data){
      if(err){
        console.log('failure to read file:', err);
      } else{
        var file = data;
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.end(file);
      }

    });
  } else{
    fs.readFile(__dirname + '/public/index.html', function(err, data){
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

io.on('connection', function(socket){
  i++;
  id++;
  console.log('User__'+ id + ' has entered the room');
  
  io.emit('new', {number: i, id: id});
  
  socket.on('post', function(data){
    var post = data.post;
    console.log('message received:', data.post);
    socket.broadcast.emit('post', data);
  });

  socket.on('disconnect', function(data){
    console.log('connection lost:', --i);

    io.emit('new', {number: i});
  });

});