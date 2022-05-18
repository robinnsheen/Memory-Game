"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

createCards(colors);


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

  /**Create face of card */

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
  };
  return newElem;
}

/** Flip a card face-up. */

function flipCard(card) {
  card.currentTarget.classList.toggle("is-flipped");
}

/** Flip a card face-down. */

function unFlipCard(card) {

}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(card) {
  flipCard(card);

}
