"use strict";

let numFlipped = 0;

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
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const newCard = document.createElement("div")
    newCard.classList.add(color);
    newCard.addEventListener("click", handleCardClick);
    gameBoard.appendChild(newCard);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  console.log(card.target.getAttribute('class') +  "flipup");
  card.target.style.backgroundColor = card.target.getAttribute("class");
}

/** Flip a card face-down. */

function unFlipCard(card) {
  console.log(card.target.getAttribute('class') + "flipdown")
  setTimeout(unFlip, 600);

  function unFlip() {
  card.target.style.removeProperty = ("backgroundColor");
  };
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(card) {
  let colorsFlipped = [];
  if (numFlipped < 2) {
    console.log(card.target.getAttribute('class'));
    flipCard(card);
    colorsFlipped.push(card.target.getAttribute("class"));
    numFlipped += 1;
  }
  if (numFlipped == 2 && colorsFlipped.some(x => x != colorsFlipped[0])) {
    unFlipCard(card);
    numFlipped = 0;
  }
}
