let Gameboard = { 
 gameBoard: [' ','|',' ','|',' ',' ','|',' ','|',' ',' ','|',' ','|',' '],
}

const cells = document.querySelectorAll('.gameBoard > *');

let rand = (number) => Math.floor(Math.random() * (number || 1));

let getNumberSeries = (multi, limit, isRandom = false) => {
  if(isRandom){
    return Array.from(
      {length: multi},
      ()=> Math.floor(Math.random() * (limit || 1))
    );
  } else {
    return Array(multi).fill(limit);
  }
}

 cells.forEach((cell)=>{
  console.log(cell);
  cell.style.backgroundColor = `rgb(${getNumberSeries(3, 255, true).join(', ')})`
 })

 let UserFactory = (name, piece) => {
  let score = 0;
  return {
    name,
    piece,
    raiseScore: (amount) => score+= amount,
    lowerScore: (amount) => score-= amount,
    getScore: () => score,
    placePiece: (targetElement) => targetElement.innerText = piece,
  }
 }

 let PlayerOne = UserFactory("Alex", "X");
 let PlayerTwo = UserFactory("Gerbil", "O");



 let displayController = () => {
  setGameboard: () => {

  }
 }