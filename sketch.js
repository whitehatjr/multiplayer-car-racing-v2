var canvas;
var bgImg, car1_img, car2_img, track, backgroundImage1, backgroundImage2;
var database, form, player, playerCount;
var allPlayers, car1, car2;
var gameState;
var cars = [];

function preload() {
  backgroundImage1 = loadImage("./assets/background1.png");
  backgroundImage2 = loadImage("./assets/background2.png");
  car1_img = loadImage("../assets/car1.png");
  car2_img = loadImage("../assets/car2.png");
  track = loadImage("../assets/track.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  bgImg = backgroundImage1;
}

function draw() {
  background(bgImg);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    game.showLeaderboard();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
