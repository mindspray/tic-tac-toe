// ======= PLAYER SETUP =======
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
  let addCandidate = (value) => candidate.push(value);
  let isCpu = false;
  let getPiece = () => piece;
  return {
    candidate,
    addCandidate,
    isCpu,
    getPiece,
    getName: () => name,
    piecesPlaced,
    placePiece: (targetElement) => {
      (targetElement.innerText = piece);
      piecesPlaced++;
    },
    raiseScore: (amount = 1) => (score += amount),
    lowerScore: (amount = 1) => (score -= amount),
    getScore: () => score,
  };
};

let PlayerOne;
let PlayerTwo;
let currentPlayer;

// Player select display
let playerController = () => {
  // Set up Player Select screen in DOM
  let XButton = document.querySelector('.XButton');
  let OButton = document.querySelector('.OButton');
  let selectObject = document.querySelector('.XOSelect');
  let gameBoard = document.querySelector('.gameBoard');
  let vsCpuCheck = document.querySelector('#isCpuConfirm');

  /* Add radio buttonn to  see which player goes first. Set that to currentPlayer in postClick */

  let P1Name = prompt('Enter a name for Player 1', 'Player 1') || 'Player 1';
  let P2Name = prompt('Enter a name for Player 2', 'Player 2') || 'Player 2';
  let postClick = () => {
    if (vsCpuCheck.checked) {
      PlayerTwo.isCpu = true;
    }
    selectObject.style.display = 'none';
    gameBoard.style.display = 'grid';
    gameBoard.style.gap = '15px';
    currentPlayer = PlayerOne;
  };
  XButton.addEventListener('click', (event) => {
    PlayerOne = PlayerFactory(P1Name, 'X');
    PlayerTwo = PlayerFactory(P2Name, 'O');
    postClick();
  });
  OButton.addEventListener('click', (event) => {
    PlayerOne = PlayerFactory(P1Name, 'O');
    PlayerTwo = PlayerFactory(P2Name, 'X');
    postClick();
  });
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
};

/**
 * An array of individual game cells (9 in total)
 */
const cells = document.querySelectorAll('.cell');

/**
 * Get the first empty cell of a set of 3 (ideally 2 filled)
 * @param {Array<String>} pieceSet 
 * @param {Array<Number>} indices 
 * @returns The index of the empty cell
 */
let getEmptyCell = function(pieceSet, indices){
  for(let i = 0; i < 3; i++){
    if (pieceSet[i]=== ""){
      return indices[i];
    }
  }
}

let getXOCount = () => {
  let xCount = 0;
  let oCount = 0;
  cells.forEach(cell => {
    if (cell.textContent === 'X'){
      xCount++
    } else if (cell.textContent === 'O'){
      oCount++;
    }
  })

  return {x: xCount, o: oCount}
}

let hasEqualTurnCount = (() => {
  const XOCount = getXOCount();
  if (XOCount["o"] === XOCount["x"]){
    return true;
  }
})

let onEqualTurnCount = (func = ()=>{return})=>{
  const XOCount = getXOCount();
  if (hasEqualTurnCount()){
    console.log(`Equal ran: ${JSON.stringify(XOCount)}`);
    func();
  }
}

let onUnequalTurnCount = (func) => {
  let XOCount = getXOCount();
  if (XOCount["x"] !== XOCount["o"]){
    console.log(`Unequal ran: ${JSON.stringify(XOCount)}`);
    func();
  }
}

let getFilledCells = () => {
  let filledCells = []
  cells.forEach((cell, index) => {
    if(cell.textContent !== ""){
      filledCells.push(index);
    }
  })
  return filledCells;
}

let switchPlayer = () => {
  currentPlayer = currentPlayer == PlayerOne ? PlayerTwo : PlayerOne;
  console.log("Players switched");
};
// ======= GAME LOGIC =======

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

// CPU Turn
let runCpuTurn = () => {
  if (gameOver){
    return;
  }
  let cpuPiece = currentPlayer.getPiece();
  let emptyCells = [];
  let cpuPiecePresent = false;
  let opponentCells = [];
  let lowPrioCells = [];
  let priority = false;
  let prioPiece;


  cells.forEach((cell, index) => {
    if (!cell.textContent) {
      emptyCells.push(index);
    }
    if (cell.textContent === cpuPiece) {
      cpuPiecePresent = true;
    }
  });

  // If no cpu piece present, place randomly
  if (!cpuPiecePresent) {
    let rando = emptyCells[rand(emptyCells.length)];
    placeAndCheck(rando);
    console.log("Placed piece at " + rando);
  } else {
    let remainingSet = [];
    /* Put logic that places a piece from a set of possible winning combinations in order for the cpu to better get a match. e.g., if piece placed at 0, try for 1 and 2, or 3 and 6, or 4 and 8. */
    const getPotentialMoves = () => {
      let matchCount = 0;
      let matches = [];
      let gameState = [];
      let pieceSet = [];

      // Create array of pieces
      cells.forEach((cell) => {
        gameState.push(`${cell.textContent}`);
      });

      console.log("game state: " + gameState);

      for(let winSet in keypadWins) {
        pieceSet = [
          gameState[keypadWins[winSet][0]],
          gameState[keypadWins[winSet][1]],
          gameState[keypadWins[winSet][2]]
        ];

        let count = 0;
        let isEmpty;
        pieceSet.forEach((piece, index) => {
          if (piece === "") {
            isEmpty = true;
          }
        })
        
        pieceSet.forEach((piece, index) => {
          if (piece === 'X'){
            count++;
            opponentCells.push(index);
            if (isEmpty){
              if (count === 2) {
                // prioPiece is getting assigned to undefined for some reason, need to fix
                prioPiece = getEmptyCell(pieceSet, keypadWins[winSet]);
                priority = true;
              }
            }
        }});

        console.log(`prio piece: ${prioPiece}`);
        console.log(`Entering ${winSet}`);
        console.log(`pieceSet: ${pieceSet}`);
        
        

        if (pieceSet.includes('X') && pieceSet.includes('O')) {
          console.log('Route blocked');
          let emptyCell = getEmptyCell(pieceSet, keypadWins[winSet]);
          if (emptyCell){
            lowPrioCells.push(getEmptyCell(pieceSet, keypadWins[winSet]));
            console.log(emptyCell);
          }
        } else if (!(pieceSet.includes('X') || pieceSet.includes('O'))){
          remainingSet.push(...keypadWins[winSet]);
          console.log(`Added ${[keypadWins[winSet][0], keypadWins[winSet][1], keypadWins[winSet][2]]}`);
        } else {
          for (let elem of keypadWins[winSet]) {
            // e.g. for 4 of 4, 1, 7
            let candidate = [...PlayerTwo.candidate];
            console.log(`for ${elem} in ${keypadWins[winSet]}`);
            // if 4 holds a cpu piece, push 1 and 7 to remainingSet
            if (!(candidate.indexOf(+elem) === -1)) {
              console.log('Match!');
              remainingSet.push(
                ...keypadWins[winSet].filter((num) => num !== elem)
              );
            }
          }
        }

      }
      return remainingSet;
    };

    let potentialMoves = [... new Set(getPotentialMoves())];
    console.log(`Forbidden cells: ${[...lowPrioCells]}`);
    console.log(`Potential moves before: ${[...potentialMoves]}`);
    let finalPotentialMoves = potentialMoves.filter((num) => !lowPrioCells.includes(num));
    console.log(`Potential moves after: ${[...finalPotentialMoves]}`);
    

    /* if priority, do priority move first. otherwise, do rando part */
    let rando = finalPotentialMoves[rand(finalPotentialMoves.length)];
    if (rando === undefined) {
      rando = lowPrioCells[rand(lowPrioCells.length)];
    }
    if (priority) {
      console.log("rando again: " + rando);
      placeAndCheck(prioPiece);
      console.log("Placed prio piece at " + prioPiece);
      priority = false;
    } else {
      console.log("rando again: " + rando);
      placeAndCheck(rando);
      console.log("Placed piece at " + rando); 
    }
    
  }
};

// If the game isn't over, on every click
let placeAndCheck = (index) => {
  console.log('working with index ' + index);
  let cell = cells[index];

  // Place piece
  // Do a check, "If firstPlayer === playerOne and equalTurnCount" before this (i think)
  if (!cell.textContent) {
    // Cell color
    cell.style.backgroundColor = `hsl(${rand(360)}deg, ${rand(100)}%, ${rand(60) + 30}%)`;
    // Capture current cell for currentPlayer
    currentPlayer.placePiece(cell);
    currentPlayer.addCandidate(index);
    console.log(`Placed an ${currentPlayer.getPiece()}`);
  }


  // Test win if candidate length is 3
  if (currentPlayer.candidate.length >= 3) {
    /**
     * Tests whether the candidate is a win.
     * @param {Array<Number>} candidate The currently constructed candidate
     * @returns True if the tested candidate is a match
     */
    const passWinningConditionTest = (candidate) => {
      for (let winSet in keypadWins) {
        console.log(`Comparing candidate ${candidate} to winSet ${keypadWins[winSet]}`);
        if (matchArraysUnorderedVsOrdered(candidate, keypadWins[winSet])) {
          return true;
        }
      }
      return false;
    };

    let result = passWinningConditionTest(currentPlayer.candidate);

    console.log("result" + result);

    let runGameOverScreen = (result)=> {
      gameOver = true;
      cells.forEach((cell) => (cell.style.pointerEvents = 'none'));
      let displayEndScreen = (result) => {
        let endScreen = document.querySelector('.endScreen');
        let endScreenMessage = document.querySelector('.endScreen .message');
        let vsPlayerButton = document.querySelector('.vsPlayer');
        let vsCpu = document.querySelector('.vsCpu');
        let currentPlayerPiece = currentPlayer.getPiece();

        endScreen.style.display = 'initial';
        if (result){
          endScreenMessage.textContent = `${currentPlayer.getName()} wins`;
          currentPlayer.raiseScore();
        } else {
          endScreenMessage.textContent = `The cat got it`
        }
        vsPlayerButton.addEventListener('click', () => {
          // Some kind of createNewGame() function
          gameOver = false;
          cells.forEach((cell) => {
            cell.style.pointerEvents = 'initial';
            cell.textContent = '';
            cell.style.backgroundColor = 'white';
          });
          endScreen.style.display = 'none';
          document.querySelector('.XOSelect').style.display = 'flex';
          document.querySelector('.gameBoard').style.gap = '0px';
          PlayerOne.candidate = [];
          PlayerTwo.candidate = [];
          currentPlayer = switchPlayer();
        });
      };
      displayEndScreen(result);

      console.log(
        `You passed the winning conditions! The result is: ${result}`
      );
    }

    // If win
    if (result) {
      runGameOverScreen(result);
    } else if (getFilledCells().length  === 9){
      runGameOverScreen();
    }
  }

  
  if(currentPlayer === PlayerOne && !hasEqualTurnCount()){
    // placeAndCheck(index);
    switchPlayer();
  }
  if (currentPlayer === PlayerTwo && !hasEqualTurnCount()){
    runCpuTurn();
    switchPlayer();

  }

};

// On every click...
cells.forEach((cell, index) => {
  /**
   * Every time an unclicked cell has been clicked, run this.
   */
  const gameLogic = () => {
    console.log("cell clicked: " + index);
    console.log(hasEqualTurnCount());
    if (!gameOver) {
      if(currentPlayer === PlayerOne && hasEqualTurnCount()){
        placeAndCheck(index);
      } else if (currentPlayer === PlayerTwo && hasEqualTurnCount()){
        runCpuTurn();
      }
    } else {
      return;
    }
  };

  cell.addEventListener('click', gameLogic);
});

/* I need a way to see who went first, and when the piece count for both X and O are similar, switch players. */
