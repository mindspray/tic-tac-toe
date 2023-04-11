/*
 * ALGORITHM *
Local Multiplayer only. Either shared mouse or keyboard.
[X]1) Players select who goes first, X or O.
[X]2) Player select closes and a blank gameboard gets drawn
[ ]3) A blinking (marker?) cursor shows which cell is currently active.
When clicked-
[X]a) any cell that hasn't already been selected will receive either an X or an O, depending on which player is going.
[X]b) The control will be turned over to the other player.
[X]4) Play will end when a winning combination has been created; a winning condition being when three symbols in a straight line match, either all X's or all O's.
[ ]5) A winner is awarded a point, and play continues until a best of 3 winner is chosen, or the game is reset.

*/



/**
 * Creates a player object
 * @param {String} name The player's name
 * @param {String} piece The piece the player selected
 * @returns {Object} a Player
 */
const PlayerFactory = (name, piece) => {
  let score = 0;
  let candidate = [];
  let getPiece = () => piece;
  return {
    name,
    candidate,
    getPiece,
    placePiece: (targetElement) => (targetElement.innerText = piece),
    raiseScore: (amount = 1) => (score += amount),
    lowerScore: (amount = 1) => (score -= amount),
    getScore: () => score,
  };
};

let PlayerOne;
let PlayerTwo;
let currentPlayer;

// Player select
let playerController = () => {
  let XButton = document.querySelector('.XButton');
  let OButton = document.querySelector('.OButton');
  let selectObject = document.querySelector('.XOSelect');
  let gameBoard = document.querySelector('.gameBoard');

  XButton.addEventListener('click', (event) => {
    PlayerOne = PlayerFactory('Player 1', 'X');
    PlayerTwo = PlayerFactory('Player 2', 'O');
    selectObject.style.display = 'none';
    gameBoard.style.display = 'grid';
    currentPlayer = PlayerOne;
  });
  OButton.addEventListener('click', (event) => {
    PlayerOne = PlayerFactory('Name1', 'O');
    PlayerTwo = PlayerFactory('Name2', 'X');
    selectObject.style.display = 'none';
    gameBoard.style.display = 'grid';
    currentPlayer = PlayerOne;
  });
};
playerController();

/**
 *
 * @param {Object} currentPlayer The object to check for a condition
 * @returns The complementary object
 */
let swap = function (currentPlayer) {
  if (currentPlayer == PlayerOne) return PlayerTwo;
  else if (currentPlayer == PlayerTwo) return PlayerOne;
};

/**
 * A function to generate a random number up to a specified limit
 * @param {Number} limit
 * @returns {Number} A random number up to a specified limit
 */
let rand = (limit) => Math.floor(Math.random() * (limit || 1));

/**
 * Gets a reversed copy of a multidimensional array of winning conditions
 * @param {Array<array>} mdArray 
 * @returns A reversed copy of the multidimensional array
 */
let reverseMDArrayCopy = (mdArray) => {
  let newArray = [];
  for (let item in mdArray) {
    newArray.push(mdArray[item].slice().reverse());
  }
  return newArray;
};

// /**
//  * Get a series of numbers in an array, either multiples of the same number, or random numbers up to a specified range.
//  * @param {Number} multi The number of times to repeat
//  * @param {Number} limit The number upper limit
//  * @param {Boolean} isRandom Whether to randomize or have the same numbers across the board
//  * @returns {Array<Number>} Returns an array of multiples of either the same number, or random numbers up to a specifienewArrayd range. e.g. {5,5,5} or {2,8,3}
//  */
// let getNumberSeries = (multi, limit, isRandom = false) => {
//   if (typeof multi === 'number') {
//     if (isRandom) {
//       return Array.from({ length: multi }, () =>
//         Math.floor(Math.random() * (limit || 1))
//       );
//     } else {
//       return Array(multi).fill(limit);
//     }
//   }
// };

/**
 * 
 * @param {Array<Number>} arrUL Unordered Array (candidate)
 * @param {Array<Number>} arrOL Ordered Array (winSet)
 */
const matchArraysUnorderedVsOrdered = (arrUL, arrOL) => {
  let matchCount = 0;
  for (let elem of arrOL) { // e.g. for 4 of 4, 1, 7
    if (matchCount < 3){
      console.log(`looking for ${+elem} in arrUL ${arrUL}`);
      if(!(arrUL.indexOf(+elem) === -1)){ // 
        console.log(`found elem ${elem} in arrUL:${arrUL}`);
        matchCount++;
        if (matchCount === 3) {
          return true;
        }
        console.log(`Match: ${matchCount}`);
        continue;
      } else {
        break;
      }
    }
  }
  return false;
}

/**
 * An array of individual game cells (9 in total)
 */
const cells = document.querySelectorAll('.gameBoard > *');


let gameOver = false;

cells.forEach((cell, index) => {
  let clicked = false;
  
  const gameLogic = () => {
    if(!gameOver){
      if (!clicked) {
        clicked = true; // Only single cell click allowed
        // Cell color
        let bgHSLColor = `hsl(${rand(360)}deg, ${rand(100)}%, ${rand(60) + 30}%)`;
        cell.style.backgroundColor = `${bgHSLColor}`;
        // Capture current cell for currentPlayer
        currentPlayer.placePiece(cell);
        // If cell matches the players piece, add to candidate
        if (cell.textContent === currentPlayer.getPiece()) {
          currentPlayer.candidate.push(index);
        }
        console.log("candidate: " + currentPlayer.candidate);
        if (currentPlayer.candidate.length >= 3) {
          let result = passWinningConditionTest(currentPlayer.candidate);
          if(result){
            gameOver = true;
            cells.forEach((item)=> item.removeEventListener("click", gameLogic));

            console.log(`You passed the winning conditions! The result is: ${result}`);
          }
        }
        currentPlayer = swap(currentPlayer);
      } else {
        return;
      }
    } else {
      console.log("Game over");
    }
  };
  /**
   * Every time an unclicked cell has been clicked, run this.
   */
  cell.addEventListener('click', gameLogic );
});

/**
 * Creates a multidimensional array of win conditions
 * @returns A multidimensional array consisting of winning possibilities
 */
const getWinningConditionsMatrix = () => {
  const keypadWins = {
    row1: [0, 1, 2],
    row2: [3, 4, 5],
    row3: [6, 7, 8],
    col1: [0, 3, 6],
    col2: [1, 4, 7],
    col3: [2, 5, 8],
    tlToBr: [0, 4, 8],
    brToTr: [2, 4, 6],
  };
  const winningMatrix = [];

  for (let line in keypadWins) {
    winningMatrix.push(keypadWins[line]);
  }
  return winningMatrix;
};

/**
 * Tests whether the candidate is a win.
 * @param {Array<Number>}  candidate The currently constructed candidate
 * @returns True if the tested candidate is a match
 */
const passWinningConditionTest = ( candidate ) => {
  // get array of arrays of winning conditions.
  /**
   * @type {Array<Array>}
   */
  let winningMatrix = getWinningConditionsMatrix();
  console.log(`Candidate: ${ candidate}`);
  console.log(`Winning: ${winningMatrix}`);
  console.log(`Reverse: ${reverseMDArrayCopy(winningMatrix)}`);

  for (let winSet of winningMatrix) {
    console.log(`candidate: ${candidate} == winSet: ${winSet}?`);
    console.log(`Comparing candidate ${candidate} to winSet ${winSet}`);
    if (
      //  candidate.toString() === winSet.toString()
      matchArraysUnorderedVsOrdered(candidate, winSet)
    ) {
      return true;
    }
  }
  return false;
}

/* 
  PROBLEM: Accounting for a non-perfect candidate. If I have 4 numbers to test, i need 3 of them to be in a specific order to count as a win. The best bet is to test the candidate against all winning conditions. If a condition matches in the 0th index, continue to the next candidate digit. If that does match and there's less than 3 matches or doesn't match, go to the next candidate digit provided it isn't a repeat of the starting index.

*/