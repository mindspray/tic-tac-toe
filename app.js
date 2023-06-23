// ======= PLAYER SETUP ======= //
/**
 * Creates a player object
 * @param {String} name The player's name
 * @param {String} piece The piece the player selected
 * @returns {Object} a Player
 */
const PlayerFactory = (name, piece) => {
  let score = 0;
  let piecesPlaced = 0;
  let candidate = [];
  let isCpu = false;

  const addCandidate = function (value) {
    this.candidate.push(+value);
  };

  return {
    candidate,
    name,
    score,
    piece,
    addCandidate,
    isCpu,
    piecesPlaced,
    placePiece: (targetElement) => {
      targetElement.innerText = piece;
      piecesPlaced++;
    },
    raiseScore() {
      this.score++; // Use regular function expression to access the player object's score
    },
    lowerScore() {
      this.score--;
    },
  };
};

let PlayerOne;
let PlayerTwo;
let currentPlayer;
let firstPlayer;

// Player select display
let playerController = () => {
  // Set up Player Select screen in DOM
  let XButton = document.querySelector('.XButton');
  let OButton = document.querySelector('.OButton');
  let selectObject = document.querySelector('.XOSelect');
  let gameBoard = document.querySelector('.gameBoard');
  let vsCpuCheck = document.querySelector('#isCpuConfirm');
  let playerOneCheck = document.querySelector('#playerOneFirst');
  let playerTwoCheck = document.querySelector('#playerTwoFirst');

  let P1Name = prompt('Enter a name for Player 1', 'Player 1') || 'Player 1';
  let P2Name = prompt('Enter a name for Player 2', 'Player 2') || 'Player 2';
  let postClick = () => {
    selectObject.style.display = 'none';
    gameBoard.style.display = 'grid';
    gameBoard.style.gap = '15px';

    if (playerTwoCheck.checked) {
      firstPlayer = PlayerTwo;
    } else {
      firstPlayer = PlayerOne;
    }

    currentPlayer = firstPlayer;
    PlayerOne.candidate = [];
    PlayerTwo.candidate = [];
    console.log("Game starting...");

    if (vsCpuCheck.checked) {
      PlayerTwo.isCpu = true;
    }
    if (firstPlayer === PlayerTwo && PlayerTwo.isCpu) {
      runCpuTurn();
      switchPlayer();
    }
  };
  XButton.addEventListener('click', (event) => {
    if(!PlayerOne) {
      PlayerOne = PlayerFactory(P1Name, 'X')
    } else {
      PlayerOne.piece = 'X';
    };
    if(!PlayerTwo) {
      PlayerTwo = PlayerFactory(P2Name, 'O')
    } else {
      PlayerTwo.piece = 'O';
    };
    postClick();
  });
  OButton.addEventListener('click', (event) => {
    if(!PlayerOne) {
      PlayerOne = PlayerFactory(P1Name, 'O')
    } else {
      PlayerOne.piece = 'O';
    };
    if(!PlayerTwo) {
      PlayerTwo = PlayerFactory(P2Name, 'X')
    } else {
      PlayerTwo.piece = 'X';
    };
    postClick();
  });
};

playerController();

// ======= UTILITIES ======= //

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
 * Tests whether a candidate unordered array matches numbers of an ordered array win set
 * @param {Array<Number>} arrUL Unordered Array (candidate)
 * @param {Array<Number>} arrOL Ordered Array (winSet)
 * @returns A boolean value regarding whether the unordered array matches all 3 of its values to the winSet or not
 */
const matchArraysUnorderedVsOrdered = (arrUL, arrOL) => {
  let matchCount = 0;
  for (let elem of arrOL) {
    // e.g. for 4 of 4, 1, 7
    if (matchCount < 3) {
      // console.log(`looking for ${+elem} in arrUL ${arrUL}`);
      if (!(arrUL.indexOf(+elem) === -1)) {
        //
        matchCount++;
        if (matchCount === 3) {
          console.log(`found ${arrOL} in arrUL[${arrUL}]`);
          return true;
        }
        continue;
      } else {
        break;
      }
    }
  }
  return false;
};

/**
 * An array of individual game cells (9 in total)
 */
const cells = document.querySelectorAll('.cell');

let getGameState = () => {
  let gameState = [];
  
  cells.forEach((cell) => {
    gameState.push(`${cell.textContent}`);
  });

  return gameState;
}


/**
 * Get the first empty cell of a set of 3 (ideally 2 filled)
 * @param {Array<String>} pieceSet
 * @param {Array<Number>} indices
 * @returns The index of the empty cell
 */
let getEmptyCell = function (pieceSet, indices) {
  for (piece in pieceSet) {
    if (pieceSet[piece] === '') {
      return piece;
    }
  }
};

let getEmptyBoardCells = () => {
  let emptyCells = [];
  cells.forEach((cell, index) => {
    if (!cell.textContent) {
      emptyCells.push(index);
    }
  });
  return emptyCells;
};

let getXOCount = (listThing) => {
  let arr;
  if(listThing){
    arr = Object.values(listThing);
  } else {
    arr = getGameState()
  }
  
  let xCount = 0;
  let oCount = 0;
  arr.forEach((cell) => {
    if (cell === 'X') {
      xCount++;
    } else if (cell === 'O') {
      oCount++;
    }
  });
  
  return { X: xCount, O: oCount };
};

let hasEqualTurnCount = () => {
  const XOCount = getXOCount();
  if (XOCount['O'] === XOCount['X']) {
    return true;
  } else {
    return false;
  }
};

let onEqualTurnCount = (
  func = () => {
    return;
  }
) => {
  const XOCount = getXOCount();
  if (hasEqualTurnCount()) {
    console.log(`Equal ran: ${JSON.stringify(XOCount)}`);
    func();
  }
};

let onUnequalTurnCount = (func) => {
  let XOCount = getXOCount();
  if (XOCount['X'] !== XOCount['O']) {
    console.log(`Unequal ran: ${JSON.stringify(XOCount)}`);
    func();
  }
};

let getFilledCells = () => {
  let filledCells = [];
  cells.forEach((cell, index) => {
    if (cell.textContent !== '') {
      filledCells.push(index);
    }
  });
  return filledCells;
};

let switchPlayer = () => {
  currentPlayer = (currentPlayer == PlayerOne) ? PlayerTwo : PlayerOne;
  console.log('=== Players switched ===');
};

let getObjectEmptyValueCount = (pieceSet) => 3 - (getXOCount(pieceSet).X + getXOCount(pieceSet).O);

// ======= GAME LOGIC ======= //

let gameOver = false;

// Win layout
const keypadWins = {
  row1: [0, 1, 2],
  row2: [3, 4, 5],
  row3: [6, 7, 8],
  col1: [0, 3, 6],
  col2: [1, 4, 7],
  col3: [2, 5, 8],
  tlToBr: [0, 4, 8],
  blToTr: [2, 4, 6],
};

const checkWin = ()=> {
  if (currentPlayer.candidate.length >= 3) {
    const passWinningConditionTest = (candidate) => {

      return Object.values(keypadWins).some(winSet => matchArraysUnorderedVsOrdered(candidate, winSet));
    };

    let result = passWinningConditionTest(currentPlayer.candidate);

    let runGameOverScreen = (result) => {
      gameOver = true;
      cells.forEach((cell) => (cell.style.pointerEvents = 'none'));
      let displayEndScreen = (result) => {
        let endScreen = document.querySelector('.endScreen');
        let endScreenMessage1 = document.querySelector('.endScreen .message1');
        let endScreenMessage2 = document.querySelector('.endScreen .message2');
        let playAgainButton = document.querySelector('.playAgain');

        endScreen.style.display = 'flex';
        if (result) {
          currentPlayer.raiseScore();
          endScreenMessage1.textContent = `${currentPlayer.name} wins`;
          endScreenMessage2.textContent = `${PlayerOne.name}: ${PlayerOne.score} ${PlayerTwo.name}: ${PlayerTwo.score}`;
        } else {
          endScreenMessage1.textContent = `The cat got it`;
          endScreenMessage2.textContent = `${PlayerOne.name}: ${PlayerOne.score} ${PlayerTwo.name}: ${PlayerTwo.score}`;
        }
        playAgainButton.addEventListener('click', () => {
          gameOver = false;
          cells.forEach((cell) => {
            cell.style.pointerEvents = 'initial';
            cell.textContent = '';
            cell.style.backgroundColor = 'white';
          });
          endScreen.style.display = 'none';
          document.querySelector('.gameBoard').style.gap = '0px';
          document.querySelector('.XOSelect').style.display = 'flex';
          // PlayerOne.candidate = [];
          // PlayerTwo.candidate = [];
        });
      };
      displayEndScreen(result);
    };

    // If win
    if (result) {
      runGameOverScreen(result);
    } else if (getFilledCells().length === 9) {
      runGameOverScreen();
    }
  }
}

// CPU Turn
let runCpuTurn = () => {
  if (gameOver) {
    return;
  }
  let cpuPiece = currentPlayer.piece;
  let playerPiece = (cpuPiece === "X") ? "O" : "X";
  let emptyCells = [];
  let cpuPiecePresent = false;
  let lowPrioCells = [];
  let priority = false;
  let prioPieces = [];
  let prioPiece;
  let opportunity = false;
  let opportunities = [];
  let opportunePiece;

  emptyCells = getEmptyBoardCells();
  cells.forEach((cell, index) => {
    if (cell.textContent === cpuPiece) {
      cpuPiecePresent = true;
    }
  });

  // If no cpu piece present, place randomly
  if (!cpuPiecePresent) {
    let rando = emptyCells[rand(emptyCells.length)];
    placeAndCheck(rando);
  } else {
    let remainingSet = [];
    let gameState = getGameState();

    const getPotentialMoves = () => {
      for (let winSet in keypadWins) {
        pieceSet = {};
        pieceSet[keypadWins[winSet][0]] = gameState[keypadWins[winSet][0]];
        pieceSet[keypadWins[winSet][1]] = gameState[keypadWins[winSet][1]];
        pieceSet[keypadWins[winSet][2]] = gameState[keypadWins[winSet][2]];

        if (
          !Object.values(pieceSet).includes(playerPiece) &&
          !Object.values(pieceSet).includes(cpuPiece)
        ) {
          remainingSet.push(...keypadWins[winSet]);
          continue;
        }

        if (getObjectEmptyValueCount(pieceSet) > 0) {
          for (piecePos in pieceSet) {
            if (pieceSet[piecePos] === cpuPiece && pieceSet[piecePos] !== '') {
              // if two CPU pieces
              if (getXOCount(pieceSet)[cpuPiece] === 2) {
                opportunePiece = getEmptyCell(pieceSet, keypadWins[winSet]);
                opportunities.push(opportunePiece);
                opportunity = true;
                break;
              }
            } else if (pieceSet[piecePos] === playerPiece && pieceSet[piecePos] !== '') {
              // if two User pieces
              if (getXOCount(pieceSet)[playerPiece] === 2) {
                prioPiece = getEmptyCell(pieceSet, keypadWins[winSet]);
                prioPieces.push(prioPiece);
                priority = true;
                break;
              }
            } 
          }

          // if has X and O, push empty cell to lowprio cells
          if (pieceSet.hasOwnProperty('X') && pieceSet.hasOwnProperty('O')) {
            let emptyCell = getEmptyCell(pieceSet, keypadWins[winSet]);
            if (emptyCell) {
              lowPrioCells.push(
                ...keypadWins[winSet].filter((num) => num !== emptyCell)
              );
            } else {
              break;
            }
          } else {
            // if has single O, push empty to remainingCells
            for (let elem of keypadWins[winSet]) {
              // e.g. for 4 of 4, 1, 7
              // if 4 holds a cpu piece, push 1 and 7 to remainingSet
              if (!(PlayerTwo.candidate.indexOf(+elem) === -1)) {
                remainingSet.push(
                  ...keypadWins[winSet].filter((num) => num !== elem)
                );
                break;
              }
            }
          }
          
        }
      }
      return remainingSet;
    };

    let potentialMoves = [...new Set(getPotentialMoves())];
    let finalPotentialMoves = potentialMoves.filter(
      (num) => !lowPrioCells.includes(num)
    ).filter(num=> emptyCells.includes(num));

    let rando = finalPotentialMoves[rand(finalPotentialMoves.length)];
    if (rando === undefined) {
      rando = lowPrioCells[rand(lowPrioCells.length)];
    }
    if (opportunity) {
      placeAndCheck(opportunities[rand(opportunities.length)]);
      console.log('Placed opportune piece at ' + opportunities[rand(opportunities.length)]);
      opportunity = false;
    } else if (priority) {
      placeAndCheck(prioPieces[rand(prioPieces.length)]);
      console.log('Placed prio piece at ' + prioPieces[rand(prioPieces.length)]);
      priority = false;
    } else {
      placeAndCheck(rando);
    }
  }
};

// If the game isn't over, on every click
let placeAndCheck = (index) => {
  // console.log('working with index ' + index);
  let cell = cells[index];

  // Place piece
  if (!cell.textContent) {
    // Assign random color to cell
    cell.style.backgroundColor = `hsl(${rand(360)}deg, ${rand(100)}%, ${
      rand(60) + 30
    }%)`;
    // Capture current cell for currentPlayer
    currentPlayer.placePiece(cell);
    currentPlayer.addCandidate(index);
    console.log(`Placed an ${currentPlayer.piece} at ${index}.`);
  }

  checkWin();
};

// Add click event listener to every cell
cells.forEach((cell, index) => {
  const gameLogic = () => {
    if (!cell.textContent && !gameOver){
      if (hasEqualTurnCount()) {
        if (currentPlayer === PlayerOne) {
          placeAndCheck(index);
          switchPlayer();
          if (PlayerTwo.isCpu){
            runCpuTurn();
            switchPlayer();
          }
        } else {
          placeAndCheck(index);
          switchPlayer();
        }
      } else {
        if (currentPlayer === PlayerOne) {
          placeAndCheck(index);
          switchPlayer();
          if(PlayerTwo.isCpu){
            runCpuTurn();
            switchPlayer();
          }
        } else {
          placeAndCheck(index);
          switchPlayer();
        }
      }
    }
  };

  cell.addEventListener('click', gameLogic);
});
