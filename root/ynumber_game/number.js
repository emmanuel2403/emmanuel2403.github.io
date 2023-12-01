const canvasSize = 600;
const NUM_COUNT = 10;
const NUMBER_SIZE = 80;
const MAX_LIVES = 3;

let numbers = [];
let currentNumber = 1;
let lives = MAX_LIVES;
let isGameOver = false;
let restartPromptVisible = false;

// Add variables to store audio elements
let correctSound;
let incorrectSound;
let correctSoundReady = false;
let incorrectSoundReady = false;

function setup() {
  const canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('game-container');

  // Create audio elements
  correctSound = createAudio('correct.mp3', () => {
    correctSoundReady = true;
  });
  incorrectSound = createAudio('error.mp3', () => {
    incorrectSoundReady = true;
  });

  for (let i = 1; i <= NUM_COUNT; i++) {
    let num = {
      value: i,
      x: random(NUMBER_SIZE / 2, canvasSize - NUMBER_SIZE / 2),
      y: random(NUMBER_SIZE / 2, canvasSize - NUMBER_SIZE / 2),
      visible: true
    };
    numbers.push(num);
  }
  avoidOverlap();
}

function draw() {
  background('grey');

  if (!isGameOver) {
    displayLives(); // Display lives on the top right

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i].visible) {
        fill("black");
        noStroke();
        rect(numbers[i].x - NUMBER_SIZE / 2, numbers[i].y - NUMBER_SIZE / 2, NUMBER_SIZE, NUMBER_SIZE);
        fill('red');
        textSize(20);
        textAlign(CENTER, CENTER);
        text(numbers[i].value, numbers[i].x, numbers[i].y);
      }
    }

    if (currentNumber > NUM_COUNT && !isGameOver) {
      displayCongratulations();
    }
  } else {
    displayGameOver();
  }
}

function avoidOverlap() {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i !== j && dist(numbers[i].x, numbers[i].y, numbers[j].x, numbers[j].y) < NUMBER_SIZE) {
        numbers[i].x = random(NUMBER_SIZE / 2, canvasSize - NUMBER_SIZE / 2);
        numbers[i].y = random(NUMBER_SIZE / 2, canvasSize - NUMBER_SIZE / 2);
        j = 0;
      }
    }
  }
}

function mousePressed() {
  if (!isGameOver) {
    let numberClicked = false;

    for (let i = 0; i < numbers.length; i++) {
      let d = dist(mouseX, mouseY, numbers[i].x, numbers[i].y);
      if (d < NUMBER_SIZE / 2 && numbers[i].value === currentNumber) {
        numbers[i].visible = false;
        currentNumber++;
        avoidOverlap();
        playCorrectSound();
        numberClicked = true;
        break;
      }
    }

    if (!numberClicked) {
      playIncorrectSound();
      loseLife();
    }

    if (currentNumber > NUM_COUNT && !isGameOver) {
      // Show congratulations message permanently
      restartPromptVisible = true;
    }
  } else {
    restartGameOnDoubleClick();
  }
}

function playCorrectSound() {
  if (correctSoundReady) {
    incorrectSound.pause();
    correctSound.play();
  } else {
    setTimeout(playCorrectSound, 1);
  }
}

function playIncorrectSound() {
  if (incorrectSoundReady) {
    correctSound.pause();
    incorrectSound.play();
  } else {
    setTimeout(playIncorrectSound, 1);
  }
}

function displayLives() {
  fill('white');
  textSize(20);
  textAlign(RIGHT, TOP);
  text(`Lives: ${lives}`, width - 10, 10);
}

function loseLife() {
  lives--;
  if (lives === 0) {
    isGameOver = true;
  }
}

function displayGameOver() {
  fill('white');
  textSize(40);
  textAlign(CENTER, CENTER);
  text('Game Over', width / 2, height / 2 - 50);
  textSize(20);
  text('Double-click to restart', width / 2, height / 2 + 50);
}

function displayCongratulations() {
  if (restartPromptVisible) {
    fill('white');
    textSize(40);
    textAlign(CENTER, CENTER);
    text('Congratulations!', width / 2, height / 2 - 50);
    textSize(20);
    text('Double-click to restart', width / 2, height / 2 + 50);
  }
}

function restartGameOnDoubleClick() {
  if (mouseIsPressed && millis() > 2000) {
    restartPromptVisible = false;
    isGameOver = false;
    currentNumber = 1;
    lives = MAX_LIVES;
    numbers = [];
    for (let i = 1; i <= NUM_COUNT; i++) {
      let num = {
        value: i,
        x: random(NUMBER_SIZE / 2, canvasSize - NUMBER_SIZE / 2),
        y: random(NUMBER_SIZE / 2, canvasSize - NUMBER_SIZE / 2),
        visible: true
      };
      numbers.push(num);
    }
    avoidOverlap();
  }
}

function resetGame() {
  currentNumber = 1;
  lives = MAX_LIVES;
  numbers = [];
  isGameOver = false;
  restartPromptVisible = false;
  setup();
}
