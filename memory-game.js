"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */
const FOUND_MATCH_WAIT_MSECS = 1000;

const COLORS = [
  "navajoWhite", "cornflowerBlue", "darkSeaGreen", "lightSalmon", "paleVioletRed",
  "navajoWhite", "cornflowerBlue", "darkSeaGreen", "lightSalmon", "paleVioletRed"
];

const colors = shuffle(COLORS);

/**Set variables, notices, and classlists to default settings then create cards */

function startGame() {
  colorsMatched = 0;
  currScore.innerText = 0;
  congrats.innerText = "Match all the colors to win the game";
  submitButton.classList.remove("is-done");
  createCards(colors);
  clicks = 0;
}


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/**    BUTTONS/HEADER TEXT     */
const btnGroup = document.querySelector(".btn-group");
const submitButton = createElementWithClasses("button", "btn", "submit-btn");
const resetButton = createElementWithClasses("button", "btn", "start-btn");
const congrats = document.querySelector(".popup");

/** Scripts for start button on opening site */


const startButton = document.querySelector(".start-btn");
congrats.innerText = "Match all the colors to win the game";
startButton.addEventListener("click", () => {
  startGame();
  createReset();
  createSubmit();
  startButton.remove();
});

/** Scoreboards */

localStorage.setItem("highScoreValue", null);
const currScoreBox = document.querySelector("#curr-score");
const currScore = currScoreBox.querySelector("p")
const highScoreBox = document.querySelector("#high-score");
const highScore = highScoreBox.querySelector("p")

let iColor = 0;
function randomColor(counter) {
  counter.style.backgroundColor = (COLORS[iColor]);
  iColor = (iColor + 1) % COLORS.length;
}
setInterval(() => {
  randomColor(currScoreBox);
  randomColor(highScoreBox);
}, 1500)

function setHighScore() {
  if (localStorage.highScoreValue !== "null") {
    localStorage.highScoreValue = Math.min(Number(localStorage.highScoreValue), clicks);

  } else {
    localStorage.highScoreValue = clicks;
  }
  highScore.innerText = localStorage.highScoreValue;
}

/** Submit Button to submit score + reset game */
function createSubmit() {
  //submit button prior to finishing game//
  submitButton.innerText = "Submit Score";
  btnGroup.appendChild(submitButton);
}

function finishedSubmit() {
  //submit button after finishing game//
  congrats.innerText = "Congratulations! Click submit to save score and restart";
  submitButton.classList.add("is-done");
  submitButton.addEventListener("click", () => {
    setHighScore();
    setTimeout(resetGame, 100);
  })
}

/**Start Over Button */
function createReset() {
  resetButton.innerText = "Start Over";
  resetButton.addEventListener("click", resetGame);
  btnGroup.appendChild(resetButton);

}

/** Reset Game function to remove cards and start new game.
 *  Used in Start Over Button and Submit Button
*/
function resetGame(callback) {
  removeCards();
  startGame();

  function removeCards() {
    const allCards = document.querySelectorAll(".inner");
    [...allCards].forEach((card) => {
      card.remove();
    })
  }
}


/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 * - a front face (side facing player)
 * - a back face (side face down with color)
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const newCard = createElementWithClasses("div", "inner", color);
    const frontFace = createFace("front");
    const backFace = createFace("back", color);

    newCard.appendChild(frontFace);
    newCard.appendChild(backFace);
    newCard.addEventListener("click", handleCardClick);

    gameBoard.appendChild(newCard);
  }


  /**Function to create front or back face of card */

  function createFace (side, color) {
    const face = "card_face--" + side;
    const cardFace = createElementWithClasses("div", "card_face", face);
    cardFace.style.backgroundColor = color;
    cardFace.innerText = "CARD";
    return cardFace;
  }
}



/** Create document.element with class or classes. must pass classes as strings */

function createElementWithClasses (element) {
  const newElem = document.createElement(element);
  for (let i=1; i<arguments.length; i++) {
    newElem.classList.add(arguments[i]);
  }
  return newElem;
}

/** Flip a card face-up.*/

function flipCard(card) {
  numFlipped++;
  clicks++;
  currScore.innerText = clicks
  card.classList.toggle("is-flipped");
  cardsFlipped.push(card)
  card.style.pointerEvents = "none";

}

/** Flip a card face-down */

function unFlipCard(card) {
  card.classList.toggle("is-flipped");
  card.style.pointerEvents = "auto";
  numFlipped--;
}

/** Handle clicking on a card: this could be first-card or second-card.
 * Push card into cardFlipped, make card unclickable, increase clicks by 1
 *
 * When 2 cards are flipped, empty cardsFlipped array
 * by popping into firstFlip variable and secondFlip variable
 *
 * compare firstFlip and secondFlip:
 * 1. if firstFlip != secondFlip,
 *    unflip both cards and make cards clickeable again
 * 2. if firstFlip === secondFlip,
 *    leave unclickable
 *
 * Reset clicks to 0
*/

const cardsFlipped = [];
let colorsMatched = 0;
let numFlipped = 0;
let clicks = 0;

function handleCardClick(card) {
  if (numFlipped < 2) {
    flipCard(card.currentTarget);
  }

  if (numFlipped === 2) {
    let firstFlip = cardsFlipped.pop();
    let secondFlip = cardsFlipped.pop();

    setTimeout(()=> {
      if (firstFlip.className !== secondFlip.className) {
        unFlipCard(firstFlip);
        unFlipCard(secondFlip);
      }
      numFlipped = 0;
    }, 1000);


    //last match activates reset button. compare colorsMatched to COLORS array//

    if (firstFlip.className === secondFlip.className) {
      colorsMatched++;
    }

    if (colorsMatched === COLORS.length/2) {
      setTimeout(finishedSubmit, 1000);
    }


  }







}
