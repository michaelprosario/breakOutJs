const PADDLE_MOVE_STOP = 0;
const PADDLE_MOVE_LEFT = 1;
const PADDLE_MOVE_RIGHT = 2;
const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 600;
const STARTING_BALL_SPEED = 4;

function Brick() {
  this.x = 0;
  this.y = 0;
  this.width = 40;
  this.height = 20;
  this.isBroken = false;
  this.color = "pink";
  this.draw = function () {
    if (!this.isBroken) {
      let myColor = this.color;
      let colorToSet;

      if (myColor !== null || myColor !== undefined || myColor !== '') {
        colorToSet = myColor;
      } else {
        colorToSet = "Red"
      }

      fill(color(colorToSet));
      rect(this.x, this.y, this.width, this.height);
    }
  }

  this.ballHitsMe = function (ball) {
    if (!ball) {
      throw new Error('Ball is not defined');
    }

    if (ball.x < this.x) return false;

    if (ball.x > this.x + this.width) return false;

    if (ball.y < this.y) return false;

    if (ball.y > this.y + this.height) return false;

    return true;
  }
}

class Ball {
  x = 0;
  y = 0;
  radius = 20;
  ballSpeed = STARTING_BALL_SPEED;
  deltaX = STARTING_BALL_SPEED;
  deltaY = STARTING_BALL_SPEED;

  constructor() {}

  update() {
    this.x += this.deltaX;
    this.y += this.deltaY;

    if (this.y > SCREEN_HEIGHT) {
      this.deltaY = -1 * this.ballSpeed;
      alert("game over");
      gameOver = true;
    }

    if (this.x > SCREEN_WIDTH) {
      this.deltaX = -1 * this.ballSpeed;
    }

    if (this.x < 0) {
      this.deltaX = this.ballSpeed;
    }

    if (this.y < 0) {
      this.deltaY = this.ballSpeed;
    }
  }

  draw() {
    ellipse(this.x, this.y, this.radius, this.radius);
  }

  bounceUp() {
    this.deltaY = this.ballSpeed * -1;
  }

  toggleUpDown() {
    this.deltaY = this.deltaY * -1;
  }
}

class Paddle {
  x = mouseX;
  y = 0;
  width = 100;
  height = 20;
  deltaX = 10;
  currentDirection = PADDLE_MOVE_STOP;

  constructor() {
    this.y = SCREEN_HEIGHT - 20;
  }

  moveLeft() {
    this.currentDirection = PADDLE_MOVE_LEFT;
  }

  moveRight() {
    this.currentDirection = PADDLE_MOVE_RIGHT;
  }

  stopMoving() {
    this.currentDirection = PADDLE_MOVE_STOP;
  }

  ballHitsMe(ball) {
    if (!ball) {
      throw new Error('Ball is not defined');
    }

    if (ball.x < this.x) return false;

    if (ball.x > this.x + this.width) return false;

    if (ball.y < this.y) return false;

    if (ball.y > this.y + this.height) return false;

    return true;
  }

  update() {
    this.x = mouseX;
  }

  draw() {
    rect(this.x, this.y, this.width, this.height);
  }
}

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let paddle;
let ball;
let gameOver = false;
let bricks = [];

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  paddle = new Paddle();
  ball = new Ball();

  for (let i = 0; i < 30; i++) {
    var brick = new Brick();
    brick.x = Math.random() * SCREEN_WIDTH;
    brick.y = Math.random() * SCREEN_HEIGHT * 0.5;

    let color = pickRandomColor();

    brick.color = color;
    bricks.push(brick);
  }

  showStatusOfBricks(bricks);
}

function pickRandomColor() {
  const colorIndex = getRandomInt(0, 3);
  let color = "pink";
  switch (colorIndex) {
    case 0:
      color = "#4285F4";
      break;
    case 1:
      color = "#EA4335";
      break;
    case 2:
      color = "#FBBC05";
      break;
    case 3:
      color = "#34A853";
      break;
  }
  return color;
}

function repeatString(k, myString) {
  let response = "";
  for (let i = 0; i < k; i++) {
    response += myString;
  }
  return response;
}

function showStatusOfBricks(bricks) {
  for (let k = 0; k < bricks.length; k++) {
    let brick = bricks[k];
    let brickData = "";
    brickData += "k=" + k + repeatString(3, " ");
    brickData += "brick.x=" + brick.x + repeatString(3, " ");
    brickData += "brick.y=" + brick.y + repeatString(3, " ");
    brickData += "brick.width=" + brick.width + repeatString(3, " ");
    brickData += "brick.height=" + brick.height + repeatString(3, " ");
    brickData += "brick.color=" + brick.color + repeatString(3, " ");
    brickData += "brick.isBroken=" + brick.isBroken + repeatString(3, " ");

    console.log(brickData);
  }
}

function draw() {
  if (gameOver) {
    return;
  }
  background(200);
  fill(204, 101, 192, 127);
  stroke(127, 63, 120);

  paddle.update();
  paddle.draw();

  ball.update();
  ball.draw();

  if (paddle.ballHitsMe(ball)) {
    ball.bounceUp();
  }

  for (let k = 0; k < bricks.length; k++) {
    let brick = bricks[k];
    brick.draw();

    if (!brick.isBroken && brick.ballHitsMe(ball)) {
      brick.isBroken = true;
      ball.toggleUpDown();
    }
  }
}