/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//columns
const WIDTH = 7;
//rows
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    //make an array copy from the width and use the push method to add onto and return new length
    board.push(Array.from({
      length: WIDTH
    }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  //get the board element
  const board = document.getElementById('board');

  //create the top columns and set the id and add a click event
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  //create the table in place and add an id and append the table to the top column
  for (let x = 0; x < WIDTH; x++) {
    const placeInTable = document.createElement('td');
    placeInTable.setAttribute('id', x);
    top.append(placeInTable);
  }
  //append the top to the board
  board.append(top);

  // create the table rows and table data and ad id to td and append td to the tr then append the tr to the boad 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {
      const cellData = document.createElement('td');
      cellData.setAttribute('id', `${y}-${x}`);
      row.append(cellData);
    }

    board.append(row);
  }
}

const restartBtn = document.getElementById('btn');
restartBtn.addEventListener('click', function () {
  board = [];
  makeBoard();
  const board2 = document.getElementById('board');
  board2.innerHTML = '';
  makeHtmlBoard();
});

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const divPiece = document.createElement('div');
  divPiece.classList.add('piece');
  divPiece.classList.add(`p${currPlayer}`);
  divPiece.style.top = -50 * (y + 2);

  const placeInTable = document.getElementById(`${y}-${x}`);
  placeInTable.append(divPiece);
}

/** endGame: announce game end */


function endGame(msg) {
  setTimeout(() => alert(msg), 1000)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // next spot in column if none then ignore
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  //put div piece in board and add to table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for a winner
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for a tie
  if (board.every(row => row.every(cellData => cellData))) {
    return endGame('TIE!');
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
      y >= 0 &&
      y < HEIGHT &&
      x >= 0 &&
      x < WIDTH &&
      board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //different ways to win checklist
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];

      // find winner 
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();