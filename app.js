/*
 * ALGORITHM *
Local Multiplayer only. Either shared mouse or keyboard.
[X]1) Players select who goes first, X or O.
[ ]2) Player select closes and a blank gameboard gets drawn
[ ]3) A blinking (marker?) cursor shows which cell is currently active.
[ ]When clicked-
[ ]a) any cell that hasn't already been selected will receive either an X or an O, depending on which player is going.
[ ]b) The control will be turned over to the other player.
[ ]4) Play will end when a winning combination has been created; a winning condition being when three symbols in a straight line match, either all X's or all O's.
[ ]5) A winner is awarded a point, and play continues until a best of 3 winner is chosen, or the game is reset.

*/

/**
* Creates a player object
* @param {String} name The player's name
* @param {String} piece The piece the player selected
* @returns {Object}
*/
const UserFactory = (name, piece) => {
  let score = 0;
  let getPiece = () => piece;
  return {
    name,
    getPiece,
    placePiece: (targetElement) => targetElement.innerText = piece,
    raiseScore: (amount) => score+= amount,
    lowerScore: (amount) => score-= amount,
    getScore: () => score,
  }
}

let PlayerOne;
let PlayerTwo;
let currentPlayer;

// Player select
let playerController = () => {
  let XButton = document.querySelector(".XButton");
  let OButton = document.querySelector(".OButton");
  let selectObject = document.querySelector(".XOSelect");
  let gameBoard = document.querySelector(".gameBoard");
  
  XButton.addEventListener("click", (event) =>{
    PlayerOne = UserFactory("Player 1", "X");
    PlayerTwo = UserFactory("Player 2", "O");
    selectObject.style.display = "none";
    gameBoard.style.display = "grid";
    currentPlayer = PlayerOne;
  })
  OButton.addEventListener("click", (event) => {
    PlayerOne = UserFactory("Name1", "O");
    PlayerTwo = UserFactory("Name2", "X");
    selectObject.style.display = "none";
    gameBoard.style.display = "grid";
    currentPlayer = PlayerOne;
  })
}
playerController();

/**
 * 
 * @param {Object} currentPlayer The object to check for a condition
 * @returns The complementary object
 */
let swap = function(currentPlayer){
  if(currentPlayer == PlayerOne) {
    return PlayerTwo
  }
  else if (currentPlayer == PlayerTwo) {
    return PlayerOne
  }
}

/**
 * A function to generate a random number up to a specified limit
 * @param {Number} number 
 * @returns {Number}
 */
let rand = (number) => Math.floor(Math.random() * (number || 1));

/**
 * Returns an array of multiples of either the same number, or random numbers up to a specified range. e.g. {5,5,5} or {2,8,3}
 * @param {Number} multi The number of times to repeat
 * @param {Number} limit The number upper limit
 * @param {Boolean} isRandom Whether to randomize or have the same numbers across the board
 * @returns {Array<Number>}
 */
let getNumberSeries = (multi, limit, isRandom = false) => {
  if (typeof multi === "number"){
    if(isRandom){
      return Array.from(
        {length: multi},
        () => Math.floor(Math.random() * (limit || 1))
      );
    } else {
      return Array(multi).fill(limit);
    }
  }
}
/**
 * An array of individual game cells (9 in total)
 */
const cells = document.querySelectorAll('.gameBoard > *');

/**
 * Every time an unclicked cell has been clicked, run this.
 */
cells.forEach((cell)=>{
  let clicked = false;
  
  cell.addEventListener("click", () => {
    if(!clicked){
      clicked = true;
      let bgHSLColor = `hsl(${rand(360)}deg, ${rand(100)}%, ${rand(100)}%)`
      // cell.style.backgroundColor = `rgb(${getNumberSeries(3, 255, true).join(', ')})`;
      cell.style.backgroundColor = `${bgHSLColor}`;
      console.log({currentPlayer});
      currentPlayer.placePiece(cell);
      currentPlayer = swap(currentPlayer);
    } else {
      return;
    }
    
  })
})