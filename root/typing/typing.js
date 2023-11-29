
let temp, button, words, timerDiv, scoreDiv, spans, typed, seconds, spark, points;

function setup() {
  createCanvas(400, 400);

  temp = select('.time');
  button = select("button");
  words = select(".words");
  timerDiv = select(".time");
  scoreDiv = select(".score");
  points = 0;
  spans = [];
  typed = '';
  seconds = 60;
  spark = new Audio("correct.mp3");
  error = new Audio("error.mp3");

  button.mousePressed(startGame);
}

function startGame() {
  countdown();
  randomWords();
  button.attribute("disabled", "true");
  document.addEventListener("keydown", typing); // Add the event listener back
}

function countdown() {
  points = 0;
  let timer = setInterval(function () {
    seconds--;
    temp.html(seconds);

    if (seconds === 0) {
      alert("Game over! Your score is " + points);
      scoreDiv.html("0");
      words.html("");
      button.removeAttribute("disabled");
      clearInterval(timer);
      seconds = 60;
      temp.html("60");
      removeEventListener(); // Remove the event listener
    }
  }, 1000);
}

function randomWords() {
  words.html("");
  let randomIndex = Math.floor(random(list.length));
  let wordArray = list[randomIndex].split("");

  for (let i = 0; i < wordArray.length; i++) {
    let span = createSpan(wordArray[i]);
    span.class("span");
    words.child(span);
    spans.push(span);
  }
}

function removeEventListener() {
  document.removeEventListener("keydown", typing);
}

function typing(e) {
  typed = String.fromCharCode(e.which);

  for (let i = 0; i < spans.length; i++) {
    if (spans[i].html() === typed) {
      if (spans[i].class() === "span bg") {
        continue;
      } else if (spans[i].class() !== "span bg" && (i === 0 || spans[i - 1].class() === "span bg")) {
        spans[i].class("span bg");
        break;
      }
    }
  }

  let checker = 0;
  for (let j = 0; j < spans.length; j++) {
    if (spans[j].class() === "span bg") {
      checker++;
    }

    if (checker === spans.length) {
      spark.pause();
      spark.currentTime = 0;
      spark.play();
      words.class("words animated fadeOut");
      points++;
      scoreDiv.html(points);

      setTimeout(function () {
        words.class("words");
        spans = [];
        randomWords();
      }, 400);
    }
  }
}

function typing(e) {
  typed = String.fromCharCode(e.which);

  let found = false; // Add a flag to check if a match is found
  for (let i = 0; i < spans.length; i++) {
    if (spans[i].html() === typed) {
      if (spans[i].class() === "span bg") {
        continue;
      } else if (spans[i].class() !== "span bg" && (i === 0 || spans[i - 1].class() === "span bg")) {
        spans[i].class("span bg");
        found = true; // Match found
        break;
      }
    }
  }

  if (!found) {
    // Play the "error" audio if no match is found
    error.pause();
    error.currentTime = 0;
    error.play();
  }

  let checker = 0;
  for (let j = 0; j < spans.length; j++) {
    if (spans[j].class() === "span bg") {
      checker++;
    }

    if (checker === spans.length) {
      spark.pause();
      spark.currentTime = 0;
      spark.play();
      words.class("words animated fadeOut");
      points++;
      scoreDiv.html(points);

      setTimeout(function () {
        words.class("words");
        spans = [];
        randomWords();
      }, 400);
    }
  }
}

function draw() {
  background(66);
}

const list = ['ACCOUNT', 'ACCURATE', 'ACRES', 'ACROSS', 'ACT', 'ACTION', 'ACTIVE', 'ACTIVITY',
  'ACTUAL', 'ACTUALLY', 'ADD', 'ADDITION', 'ADDITIONAL', 'ADJECTIVE', 'ADULT', 'ADVENTURE','LIVE','KING','RECORD','DRINK'];

document.addEventListener("keydown", typing);
