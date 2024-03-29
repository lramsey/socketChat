var form = document.getElementById('type');
var type = document.getElementById('val');
var socket = io('http://localhost');
var userName;

form.addEventListener('submit', function(ev){
  ev.preventDefault();
  var post = userName + ': ' + type.value;
  type.value = '';
  socket.emit('post', {post: post});
  postMessage(post);
});

socket.on('new', function(data){
  var header = document.getElementById('count');
  var text = header.innerHTML;
  text = header.innerHTML.slice(0, text.length-1) + data.number;
  header.innerHTML = text;
  if(!userName){
    userName = 'User_' + data.id;
  }
});

socket.on('post', function(data){
  var post = data.post;
  postMessage(post);
});

function postMessage(text){
  var p = document.createElement("p");
  p.appendChild(document.createTextNode(text));
  var chat = document.getElementById("chat");
  chat.appendChild(p);
}