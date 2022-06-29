window.addEventListener('load', ()=>{
  startGame()
})

var canvasWidth = 600;
var canvasHeight = 400;

var player;
var playerYPosition = 200;

var fallSpeed = 0;
var interval = setInterval(updateCanvas, 20);

var isJumping = false;
var jumpSpeed = 0;

var block;

// Create a score of 0 to start with
var score = 0;
// Create a variable to hold our scoreLabel
var scoreLabel;

function startGame() {
  initCanvas();
  player = new createPlayer(30, 30, 10);
  block = new createBlock();
  // Assign your scoreLabel variable a value from scoreLabel()
  scoreLabel = new createScoreLabel(10, 30);
}

let context; /* La creamos para guardar nuestro contexto al iniciar el canvas */

function initCanvas() {
  let canvas = document.querySelector("#canvas")  /* Seleccionamos nuestro canvas */ 
  canvas.width = canvasWidth; /* Le pasamos el ancho y el alto */
  canvas.height = canvasHeight;
  context = canvas.getContext("2d");    
}

function createPlayer(width, height, x) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = playerYPosition;
  
  this.draw = function() {
      ctx = context;
      ctx.fillStyle = "green";
      ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.makeFall = function() {
      if (!isJumping) {
          this.y += fallSpeed;
          fallSpeed += 0.1;
          this.stopPlayer();
      }
  }
  this.stopPlayer = function() {
      var ground = canvasHeight - this.height;
      if (this.y > ground) {
          this.y = ground;
      }
  }
  this.jump = function() {
      if (isJumping) {
          this.y -= jumpSpeed;
          jumpSpeed += 0.3;
      }
  }
}

function createBlock() {
  var width = randomNumber(10, 50);
  var height = randomNumber(10, 200);
  var speed = randomNumber(2, 6);
  
  this.x = canvasWidth;
  this.y = canvasHeight - height;
  
  this.draw = function() {
      ctx = context;
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, width, height);
  }
  this.attackPlayer = function() {
      this.x -= speed;
      this.returnToAttackPosition();
  }
  this.returnToAttackPosition = function() {
      if (this.x < 0) {
          width = randomNumber(10, 50);
          height = randomNumber(50, 200);
          speed = randomNumber(4, 6);
          this.y = canvasHeight - height;
          this.x = canvasWidth;
          // Increase your score if your block made it to the edge
          score++;
      }
  }
}
/* Detectar cuando se choca */
function detectCollision() {
  var playerLeft = player.x
  var playerRight = player.x + player.width;
  var blockLeft = block.x;
  var blockRight = block.x + block.width;
  
  var playerBottom = player.y + player.height;
  var blockTop = block.y;
  
  if (playerRight > blockLeft && 
      playerLeft < blockLeft && 
      playerBottom > blockTop) {
      alert("Fin del juego") /* Detiene el juego al chocar */
  }
}

/* Crear el tablero del puntaje */
function createScoreLabel(x, y) {
  this.score = 0;  
  this.x = x;
  this.y = y;
  this.draw = function() {
      ctx = context;
      ctx.font = "25px Marker Felt";
      ctx.fillStyle = "black";
      ctx.fillText(this.text, this.x, this.y);
  }
}

function updateCanvas() {
  detectCollision();
  
  ctx = context;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  player.makeFall();
  player.draw();
  player.jump();
  
  block.draw();
  block.attackPlayer();
  
  // Redraw your score and update the value
  scoreLabel.text = "SCORE: " + score;
  scoreLabel.draw();
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function resetJump() {
  jumpSpeed = 0;
  isJumping = false;
}

document.body.onkeyup = function(e) {
  if (e.keyCode == 32) {
      isJumping = true;
      setTimeout(function() { resetJump(); }, 1000);
  }
}
