// Inicio del juego
window.addEventListener('load', ()=>{
  startGame()
})

// Inicialización de variables
var canvasWidth = 600;
var canvasHeight = 400;

var player;
var playerYPosition = 200;

var fallSpeed = 0;
var interval = setInterval(updateCanvas, 20);

var isJumping = false;
var jumpSpeed = 0;

var block;

// Inicialización del puntaje en cero
var score = 0;
// Creación de la variable para guardar el puntaje
var scoreLabel;

function startGame() {
  /*
  Inicio del juego Block Jumper
        
  Variables
  ----------
  player :
    creación de un nuevo jugador
  block :
    creación del bloque
  scoreLabel :
    asignación a la variable puntaje  el nuevo valor de puntaje
  */
  initCanvas();
  player = new createPlayer(30, 30, 10);
  block = new createBlock();
  scoreLabel = new createScoreLabel(10, 30);
}

//Se crea para guardar el contexto al iniciar el canvas
let context; 

function initCanvas() {
  /*
  Inicio de canvas
        
  Variables
  ----------
  let canvas :
    seleccionar el canvas
  canvas.width, canvas.height :
    ancho y alto de canvas
  */
  let canvas = document.querySelector("#canvas")
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context = canvas.getContext("2d");    
}

function createPlayer(width, height, x) {
  /*
  Creación de la caja jugador recibiendo como parámetro el ancho y alto
        
  Funciones
  ----------
  draw : para dibujar la caja del jugador, ancho y alto
  makeFall : velocidad de la caída de la caja
  stopPlayer : para detener el juego en caso de colisión
  jump : velocidad del salto de la caja
  */
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = playerYPosition;
  
  this.draw = function() {
      ctx = context;
      ctx.fillStyle = "blue";
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
          jumpSpeed += 0.6;
      }
  }
}

function createBlock() {
  /*
  Creación del bloque obstáculo a superar, variables de ancho, alto y velocidad con valores aleatorios
        
  Funciones
  ----------
  draw : para dibujar el bloque obstáculo
  attackPlayer : atacar al jugador
  returnToAttackPosition : para reiniciar su partida inicial
  */
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
          // Incrementa el puntaje en caso de superar el bolque obstáculo
          score++;
      }
  }
}
/* Detectar cuando se choca */
function detectCollision() {
  /*
  Detecta la colisión del bloque con el jugador a través de igualar las variables
  */
  var playerLeft = player.x
  var playerRight = player.x + player.width;
  var blockLeft = block.x;
  var blockRight = block.x + block.width;
  
  var playerBottom = player.y + player.height;
  var blockTop = block.y;
  
  // Detiene el juego al colapasar los bloques y devuelve una alerta de fin de juego
  if (playerRight > blockLeft && 
      playerLeft < blockLeft && 
      playerBottom > blockTop) {
      alert("Fin del juego")
  }
}

function createScoreLabel(x, y) {
  /*
  Creación del tablero del puntaje
  */
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
  /*
  Actualización del canvas al reiniciar el juego
        
  Funciones
  ----------
  Llama a las funciones del jugador:
    detectCollision
    makeFall
    draw
    jump

  Llama a las funciones del bloque obstáculo:
    draw
    attackPlayer
  */
  detectCollision();
  
  ctx = context;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  player.makeFall();
  player.draw();
  player.jump();
  
  block.draw();
  block.attackPlayer();
  
  // Reinicia el puntaje y actualiza el valor
  scoreLabel.text = "SCORE: " + score;
  scoreLabel.draw();
}

// Función que genera valores aleatorios
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Función para reiniciar los saltos
function resetJump() {
  jumpSpeed = 0;
  isJumping = false;
}

// Define la altura del salto del bloque jugador
document.body.onkeyup = function(e) {
  if (e.keyCode == 32) {
      isJumping = true;
      setTimeout(function() { resetJump(); }, 900);
  }
}
