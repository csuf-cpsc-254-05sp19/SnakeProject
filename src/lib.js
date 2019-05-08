var ctx;
var WIDTH;
var HEIGHT;

var dx = 20;
var dy = 20;
var dr = 10;
var xVelocity = 4;
var yVelocity = 4;
// 0: left
// 1: up
// 2: right
// 3: down
var direction;

var snake;
var size;

var food;

var id;

function init() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();

  createsnake();
  newfood();

  direction = 0;
  size = 1;

  id = setInterval(step, 100);
}

function onKeyDown(evt) {
  if (evt.keyCode == 32) {
    return;
  }
  newdir = evt.keyCode - 37;

  // only lateral turns are allowed
  // (that is, no u-turns)
  if (newdir != direction && newdir != direction+2 && newdir != direction-2) {
    direction = newdir;
  }
}

if ($.browser.mozilla) {
    $(document).keypress(onKeyDown);
} else {
    $(document).keydown(onKeyDown);
}

function changecolor(){
  var letters ="0123456789ABCDEF";
  var color = "#";
  var colors= "#34FFFF";
  for (var i = 0; i < 6; i++){
    color += letters[Math.floor(Math.random()*16)];
  }
  return color;
}

function foodBounce()
{
// bounce function
  if (food.x + dr < 0){
    xVelocity = -xVelocity;
  }
  if(food.x + dr > WIDTH)
  {
    xVelocity = - xVelocity;
  }
  if (food.y + dr < 0)
  {
    yVelocity = -yVelocity;
  }
  if (food.y + dr > HEIGHT)
  {
    yVelocity = -yVelocity;
  }
  food.x += xVelocity;
  food.y += yVelocity;
}


function onKeyDown(evt) {
  if (evt.keyCode == 32) {
    return;
  }
  newdir = evt.keyCode - 37;

  // only lateral turns are allowed
  // (that is, no u-turns)
  if (newdir != direction && newdir != direction+2 && newdir != direction-2) {
    direction = newdir;
  }
}

if ($.browser.mozilla) {
    $(document).keypress(onKeyDown);
} else {
    $(document).keydown(onKeyDown);
}

function createsnake() {
  color = changecolor();
  snake = Array();
  var head = Array();
  head.x = WIDTH/2;
  head.y = HEIGHT/2;
  snake.push(head);
}

function collision(n) {
  // are we out of the playground?
  if (n.x < 0 || n.x > WIDTH - 1 || n.y < 0 || n.y > HEIGHT - 1) {
    return true;
  }

  // are we eating ourselves?
  for (var i = 0; i < snake.length; i++) {
    if (snake[i].x == n.x && snake[i].y == n.y) {
      return true;
    }
  }
  return false;
}

function newfood() {
  var wcells = WIDTH/dx;
  var hcells = HEIGHT/dy;

  var randomx = Math.floor(Math.random()*wcells);
  var randomy = Math.floor(Math.random()*hcells);

  food = Array();
  food.x = randomx * dx;
  food.y = randomy * dy;
  food.r = dr;
  size = size+1;
}

function meal(n) {
  if(n.x<=food.x+food.r+2 && n.x >=food.x-food.r-2){
    if(n.y <=food.y + food.r+2 && n.y>= food.y- food.r-2){return true;}
    else{return false;}
  }
  else{return false;}



  //return (n.x == food.x && n.y == food.y);
}

function movesnake() {

  h = snake[0]; // peek head

  // create new head relative to current head
  var n = Array();
  switch (direction) {
    case 0: // left
      n.x = h.x - dx;
      n.y = h.y;
      break;
    case 1: // up
      n.x = h.x;
      n.y = h.y - dy;
      break;
    case 2: // right
      n.x = h.x + dx;
      n.y = h.y;
      break;
    case 3: // down
      n.x = h.x;
      n.y = h.y + dy;
      break;

  }

  // if out of box or collision with ourselves, we die
  if (collision(n)) {
    return false;
  }

  snake.unshift(n);

  // if there's food there
  if (meal(n)) {
    color = changecolor();
    newfood(); // we eat it and another shows up




  } else {
    snake.pop();
    // we only remove the tail if there wasn't food
    // if there was food, the snake grew
  }

  return true;

}

function die() {
  if (id) {
    clearInterval(id);
  }
  gameStarted = false;
}

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

//creates a more snake-like rectangle body
//function roundedRect(ctx, x, y, width, height, radius) {
//  ctx.beginPath();
//  ctx.moveTo(x, y + radius);
//  ctx.lineTo(x, y + height - radius);
//  ctx.arcTo(x, y + height, x + radius, y + height, radius);
//  ctx.lineTo(x + width - radius, y + height);
//  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
//  ctx.lineTo(x + width, y + radius);
//  ctx.arcTo(x + width, y, x + width - radius, y, radius);
//  ctx.lineTo(x + radius, y);
//  ctx.arcTo(x, y, x, y + radius, radius);
//  ctx.stroke();
//  ctx.closePath();
//  ctx.fill();
//}


function screenclear() {
  ctx.fillStyle = "#000000";
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  rect(0,0,WIDTH,HEIGHT);
}

function drawsnake() {
    ctx.fillStyle = color;
  snake.forEach(function(p) {
    rect(p.x, p.y, dx, dy);
  })
}

function drawfood() {
  ctx.fillStyle = "#FFFFFF";
  circle(food.x+food.r, food.y+food.r, food.r);
  foodBounce();
}
