var ctx;
var WIDTH;
var HEIGHT;

var dx = 20;
var dy = 20;
var dr = 10;
var xVelocity = 8;
var yVelocity = 8;
// 0: left
// 1: up
// 2: right
// 3: down
var direction;

var snake;
var size;

var food;

var id;
var foodColor = changeFoodColor();
var minmum_amount_of_shapes=1;
var maximum_amount_of_shapes=3;
var shape_id;

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

//function changes the color of the
//food everytime it bounces off the
//wall.
function changeFoodColor() {
    var letters = 'ABCDE'.split('');
    var foodColor = '#';
    for (var i=0; i<6; i++ ) {
        foodColor += letters[Math.floor(Math.random() * letters.length)];
    }
    return foodColor;
}

function changecolor(){
  var letters ="0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++){
    color += letters[Math.floor(Math.random()*16)];
  }
  return color;
}

//makes food that snakes eats
function foodBounce()
{
// bounce function

if(food.x + dr > WIDTH || food.x + dr < 0)
{
  xVelocity = -xVelocity;
  foodColor = changeFoodColor();
}
if(food.y + dr > HEIGHT || food.y + dr < 0)
{
  yVelocity = -yVelocity;
  foodColor = changeFoodColor();
}
food.x += xVelocity;
food.y += yVelocity
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

  foodColor = changeFoodColor();
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
    drawsnake();
    /*since we so far only have two shapes, we will keep the number of id between 1-2. if and when we add more shapes, the ID of that shape will increase by one
    ==shape_id list:==
      1: rectangle
      2: triangle
    */


    shape_id =Math.floor(Math.random() * (maximum_amount_of_shapes - minmum_amount_of_shapes)) + minmum_amount_of_shapes;

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
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#666666';
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
}
function snakecircle(x,y,r){
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  //ctx.lineWidth = 10;
  //ctx.stroke();
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

//Creating a triangle
function tri(x, y, w, h)
{
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x - w / 2, y + h);
  ctx.closePath();
  ctx.fill();
}

function screenclear() {
  ctx.fillStyle = "#000000";
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  rect(0,0,WIDTH,HEIGHT);
}

function drawsnake() {
    ctx.fillStyle = color;
    if(shape_id == 1){
      //ctx.fillStyle = color;
      snake.forEach(function(p) {
        rect(p.x, p.y, dx, dy);
      })
    }
    else if(shape_id == 2){
      //ctx.fillStyle = color;
  snake.forEach(function(p) {
    tri(p.x, p.y, dx, dy);
  })
}
  else{
    snake.forEach(function(p) {
    snakecircle(p.x+food.r, p.y+food.r, food.r);
  })
}
}

function drawfood() {
  ctx.fillStyle = foodColor;
  circle(food.x+food.r, food.y+food.r, food.r);
  foodBounce();
}
