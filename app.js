// ======= PLAYER SETUP =======
/**
 * Creates a player object
 * @param {String} name The player's name
 * @param {String} piece The piece the player selected
 * @returns {Object} a Player
 */
const PlayerFactory = (name, piece) => {
  let score = 0;
  let candidate = [];
  let isCpu = false;
  let getPiece = () => piece;
  return {
    candidate,
    isCpu,
    getPiece,
    getName: () => name,
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
  // Set up Player Select screen in DOM
  let XButton = document.querySelector('.XButton');
  let OButton = document.querySelector('.OButton');
  let selectObject = document.querySelector('.XOSelect');
  let gameBoard = document.querySelector('.gameBoard');
  let vsCpuCheck = document.querySelector('#isCpuConfirm');

  let P1Name = prompt("Enter a name for Player 1", "Player 1") || "Player 1";
  let P2Name = prompt("Enter a name for Player 2", "Player 2") || "Player 2";
  
  XButton.addEventListener('click', (event) => {
    PlayerOne = PlayerFactory(P1Name, 'X');
    PlayerTwo = PlayerFactory(P2Name, 'O');
    selectObject.style.display = 'none';
    gameBoard.style.display = 'grid';
    currentPlayer = PlayerOne;
  });
  OButton.addEventListener('click', (event) => {
    PlayerOne = PlayerFactory(P1Name, 'O');
    PlayerTwo = PlayerFactory(P2Name, 'X');
    selectObject.style.display = 'none';
    gameBoard.style.display = 'grid';
    currentPlayer = PlayerOne;
  });
  if (vsCpuCheck.checked){
    PlayerTwo.isCpu = true;
  }

};
playerController();

// ======= UTILITIES =======

/**
 * A function to generate a random number up to n
 * @param {Number} limit
 * @returns {Number} A random number up to n
 */
let rand = (n) => Math.floor(Math.random() * (n || 1));

/**
 * Returns a reversed copy of a multidimensional array of winning conditions
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

/**
 * 
 * @param {Array<Number>} arrUL Unordered Array (candidate)
 * @param {Array<Number>} arrOL Ordered Array (winSet)
 * @returns A boolean value regarding whether the unordered array matches all 3 of its values to the winSet or not
 */
const matchArraysUnorderedVsOrdered = (arrUL, arrOL) => {
  let matchCount = 0;
  for (let elem of arrOL) { // e.g. for 4 of 4, 1, 7
    if (matchCount < 3){
      // console.log(`looking for ${+elem} in arrUL ${arrUL}`);
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
const cells = document.querySelectorAll('.cell');

/**
 * An opponent AI controller
 */
let opponentController = function(){
  let occupied = false;

  cells.forEach((cell, index) => {
    if (cell.textContent === "X" || cell.textContent === "O") {
      occupied = true;
    }
  })
  if(occupied) {

  } else {

  }
}

// ======= GAME LOGIC =======

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
        currentPlayer.candidate.push(index); // add to candidate array
        
        if (currentPlayer.candidate.length >= 3) {
          /**
           * Tests whether the candidate is a win.
           * @param {Array<Number>}  candidate The currently constructed candidate
           * @returns True if the tested candidate is a match
           */
          const passWinningConditionTest = ( candidate ) => {
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
             * @type {Array<Array>} An array of arrays of winning conditions
             */
            let winningMatrix = getWinningConditionsMatrix();
          
            for (let winSet of winningMatrix) {
              console.log(`Comparing candidate ${candidate} to winSet ${winSet}`);
              if (
                matchArraysUnorderedVsOrdered(candidate, winSet)
              ) {
                return true;
              }
            }
            return false;
          }
          let result = passWinningConditionTest(currentPlayer.candidate);
          if(result){
            gameOver = true;
            cells.forEach((item)=> item.removeEventListener("click", gameLogic));

            let displayEndScreen = (result) => {
              let endScreen = document.querySelector('.endScreen');
              let endScreenMessage = document.querySelector('.endScreen .message');
              let vsPlayerButton = document.querySelector('vsPlayer');
              let vsCpu = document.querySelector('vsCpu');
              let currentPlayerPiece = currentPlayer.getPiece();

              endScreen.style.display = "initial";
              endScreenMessage.textContent = `${currentPlayer.getName()} wins`;
              vsPlayerButton.addEventListener("click", () => {
                // Run some kind of createNewGame() function;
              })
              // vsCpu.addEventListener("click", () => {
              //   PlayerTwo = 
              // })
            }
            displayEndScreen(result);

            console.log(`You passed the winning conditions! The result is: ${result}`);
          }
        }

        let swapPlayer = (currentPlayer) => (currentPlayer == PlayerOne) ? PlayerTwo : PlayerOne;
        currentPlayer = swapPlayer(currentPlayer);
      } else {
        return;
      }
    } else {
      return;
    }
  };
  /**
   * Every time an unclicked cell has been clicked, run this.
   */
  cell.addEventListener('click', gameLogic );
});
