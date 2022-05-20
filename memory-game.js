"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */
const FOUND_MATCH_WAIT_MSECS = 1000;

const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);


function startGame() {



  createCards(colors);
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
/**    BUTTONS     */
const btnGroup = document.querySelector(".btn-group");

/**Start Game */
const startButton = document.querySelector(".start-btn");
startButton.addEventListener("click", () => {
  startGame();
  createReset();
  createSubmit();
  startButton.remove();
});

/**Reset/Submit Score after finishing game*/
function createSubmit() {
  const submitButton = createElementWithClasses("button", "btn", "submit-btn");
  submitButton.innerText = "Submit Score";

  btnGroup.appendChild(submitButton);

  function finishedSubmit() {
    submitButton.addEventListener("click", () => {
      removeCards();
      startGame();
    })
  }
}

/**Reset before finishing game */
function createReset() {
  const resetButton = createElementWithClasses("button", "btn", "start-btn");
  resetButton.innerText = "Start Over";

  resetButton.addEventListener("click", () => {
    removeCards();
    startGame();
  });
  btnGroup.appendChild(resetButton);

}

/** Remove Cards */
function removeCards() {
  const allCards = document.querySelectorAll(".inner");
  [...allCards].forEach((card) => {
    card.remove();
  })
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

    if (firstFlip.className === secondFlip.className) {
      colorsMatched++;
    }

    if (colorsMatched === COLORS.length/2) {
      finishedSubmit();
    }


  }

  //last match needs to activate reset button//





}
