
const canvasSize = 600;
const NUM_COUNT = 10;
const NUMBER_SIZE = 80;

let numbers = [];
let currentNumber = 1;

function setup() {
  const canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('game-container'); // Set parent container for the canvas
  for (let i = 1; i <= NUM_COUNT; i++) {
    let num = {
      value: i,
      x: random(canvasSize - NUMBER_SIZE),
      y: random(canvasSize - NUMBER_SIZE),
      visible: true
    };
    numbers.push(num);
  }
  avoidOverlap();
}

function draw() {
  background('grey');
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i].visible) {
      fill("black");
      noStroke();
      rect(numbers[i].x, numbers[i].y, NUMBER_SIZE, NUMBER_SIZE);
      fill('red');
      textSize(20);
      textAlign(CENTER, CENTER);
      text(numbers[i].value, numbers[i].x + NUMBER_SIZE / 2, numbers[i].y + NUMBER_SIZE / 2);
    }
  }
}

function avoidOverlap() {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i !== j && dist(numbers[i].x, numbers[i].y, numbers[j].x, numbers[j].y) < NUMBER_SIZE) {
        // Slightly adjust position until no overlap
        numbers[i].x += random(-5, 5);
        numbers[i].y += random(-5, 5);
        j = 0; // Restart inner loop to recheck for overlaps
      }
    }
  }
}

function mousePressed() {
  for (let i = 0; i < numbers.length; i++) {
    let d = dist(mouseX, mouseY, numbers[i].x + NUMBER_SIZE / 2, numbers[i].y + NUMBER_SIZE / 2);
    if (d < NUMBER_SIZE / 2 && numbers[i].value === currentNumber) {
      numbers[i].visible = false;
      currentNumber++;
      avoidOverlap(); // Recheck for overlaps after a number is clicked
      break;
    }
  }

  if (currentNumber > NUM_COUNT) {
    displayCongratulations();
  }
}

function displayCongratulations() {
  const congratulationsMessage = document.getElementById('congratulations-message');
  congratulationsMessage.innerHTML = '<p>Congratulations! You clicked all the numbers in order.</p>';
}

function resetGame() {
  currentNumber = 1;
  numbers = [];
  setup(); // Reset the game setup
  const congratulationsMessage = document.getElementById('congratulations-message');
  congratulationsMessage.innerHTML = ''; // Clear the congratulations message
}