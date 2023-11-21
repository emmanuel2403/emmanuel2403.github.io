let circle1X;
let circle1Y;
let radius1 = 10;
let diameter1;
let circle1Move = false;
let endMsg = "";
let messageColor;
let level = 1;
let isGameOver = false;
let lives = 3
let winLose = ""
let lastClickTime = 0;
let doubleClickDelay = 300;
  spark = new Audio("correct.mp3");
  error = new Audio("error.mp3");

function setup() {
  createCanvas(1400, 800);
  fill('lightgreen');
  circle1X = 0;
  circle1Y = 400;
  messageColor = 'green';
  textSize(32);
  textAlign(RIGHT);
  diameter1 = radius1 * 2;
}

function draw() {
  background(100);
  drawLines(); // Draw the lines

  fill('salmon');
  circle(1400, 400, 100);

  fill('lightgreen');
  circle(circle1X, circle1Y, diameter1);
  stroke(50);
  fill(50);
  triangle(250,200,350,500,550,0);
  triangle(550,0,750,500,950,0);
  quad(0,0,550,0,250,200,0,200);
  quad(950,0,1400,0,1400,200,1050,200);
  quad(0,800,0,600,250,600,350,800);
  triangle(350,800,550,400,750,800);
  triangle(750,800,950,400,1050,600);
  quad(750,800,1050,600,1400,600,1400,800);

  fill(messageColor);
  text("Level: " + level, width - 100, 40);
  text("Lives: " + lives, 120, 40);

  if (isGameOver) {
    // Draw a modal background
    fill(0, 150); // Semi-transparent black
    rect(0, 0, width, height);
    fill(255);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("You " + winLose + "!", width / 2, height / 2);
    textSize(32);
    text("Double Click to replay", width / 2, height / 2 + 50);
  }
}

function winGame() {
  winLose = "Win"
  isGameOver = true;
}

function loseGame() {
  winLose = "Lose"
  isGameOver = true;
}

// Draw the lines
function drawLines() {
  line(0, 200, 250, 200);
  line(250, 200, 350, 500);
  line(350, 500, 550, 0);
  line(550, 0, 750, 500);
  line(750, 500, 950, 0);
  line(950, 0, 1050, 200);
  line(1050, 200, 1400, 200);

  line(0, 600, 250, 600);
  line(250, 600, 350, 800);
  line(350, 800, 550, 400);
  line(550, 400, 750, 800);
  line(750, 800, 950, 400);
  line(950, 400, 1050, 600);
  line(1050, 600, 1400, 600);
}

//circle 1
function mousePressed() {
  let d = dist(mouseX, mouseY, circle1X, circle1Y);
  if (d < radius1) {
    circle1Move = true;
  } else {
    circle1Move = false;
  }
}

function mouseReleased() {
  circle1Move = false;

  if (dist(1400, 400, circle1X, circle1Y) < 100) {
    messageColor = 'lightgreen';
    spark.pause();
    spark.currentTime = 0;
    spark.play();
    endMsg = "Level Complete!";
    level++;
    radius1 += 5;
    diameter1 = radius1 * 2;
    circle1X = 0;
    circle1Y = 400;
    if (level > 5) {
      winGame();
    }
  } else {
    messageColor = 'salmon';
    endMsg = "You Lose!";
  }
}

function mouseDragged() {
  if (circle1Move) {
    circle1X = mouseX;
    circle1Y = mouseY;

    // Check if the circle is off the line and reset its position
    if (circle1X < 0) {
      circle1X = 0;
      circle1Y = 400;
    }
  }
}

function mouseClicked() {
  if (isGameOver) {
    if (millis() - lastClickTime < doubleClickDelay) {
      // Double click detected, reset the game
      level = 1;
      lives = 3;
      radius1 = 10;
      diameter1 = radius1 * 2;
      circle1X = 0;
      circle1Y = 400;
      isGameOver = false;
    }
    lastClickTime = millis();
  }
}

function mouseDragged() {
  if (circle1Move) {
    circle1X = mouseX;
    circle1Y = mouseY;

    // Check if the circle is off the line and reset its position
    if (circle1X < 0 || checkCollision()) {
      circle1X = 0;
      circle1Y = 400;
    }
  }
}

function checkCollision() {
  // Define the equations of the lines
  let lines = [
    { x1: 0, y1: 200, x2: 250, y2: 200 },
    { x1: 250, y1: 200, x2: 350, y2: 500 },
    { x1: 350, y1: 500, x2: 550, y2: 0 },
    { x1: 550, y1: 0, x2: 750, y2: 500 },
    { x1: 750, y1: 500, x2: 950, y2: 0 },
    { x1: 950, y1: 0, x2: 1050, y2: 200 },
    { x1: 1050, y1: 200, x2: 1400, y2: 200 },
    { x1: 0, y1: 600, x2: 250, y2: 600 },
    { x1: 250, y1: 600, x2: 350, y2: 800 },
    { x1: 350, y1: 800, x2: 550, y2: 400 },
    { x1: 550, y1: 400, x2: 750, y2: 800 },
    { x1: 750, y1: 800, x2: 950, y2: 400 },
    { x1: 950, y1: 400, x2: 1050, y2: 600 },
    { x1: 1050, y1: 600, x2: 1400, y2: 600 },
    { x1: 1400, y1: 0, x2: 1400, y2: 800 }
  ];

  // Check if the circle intersects any of the lines
  for (let line of lines) {
    let d = distToSegment(circle1X, circle1Y, line.x1, line.y1, line.x2, line.y2);
    if (d < radius1) {
      lives--
      if (lives <= 0) {
      loseGame();
      }
      error.pause();
      error.currentTime = 0;
      error.play();      
      return true;
    }
  }
  return false;
}

function distToSegment(x, y, x1, y1, x2, y2) {
  let p = createVector(x, y);
  let a = createVector(x1, y1);
  let b = createVector(x2, y2);

  let d = p.dist(a);
  let u = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / p5.Vector.dist(a, b) ** 2;

  if (u >= 0 && u <= 1) {
    let closestPoint = createVector(a.x + u * (b.x - a.x), a.y + u * (b.y - a.y));
    d = p.dist(closestPoint);
  }

  return d;
}

function mouseDragged() {
  if (circle1Move) {
    circle1X = mouseX;
    circle1Y = mouseY;

    // Check if the circle is off the line and reset its position
    if (circle1X < 0 || checkCollision()) {
      circle1Move = false; // Stop dragging if collision detected
      circle1X = 0;
      circle1Y = 400;
    }
  }
}