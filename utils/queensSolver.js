const N = 8;

function isSafe(board, row, col) {
  for (let i = 0; i < row; i++) {
    if (board[i] === col || 
        Math.abs(board[i] - col) === row - i) {
      return false;
    }
  }
  return true;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function solveQueens(board, row) {
  if (row === N) return true;

  let cols = shuffleArray([...Array(N).keys()]);

  for (let i = 0; i < N; i++) {
    let col = cols[i];
    if (isSafe(board, row, col)) {
      board[row] = col;
      if (solveQueens(board, row + 1)) return true;
      board[row] = -1;
    }
  }
  return false;
}

export function generateSolution() {
  let board = Array(N).fill(-1);
  if (solveQueens(board, 0)) {
    return board;
  }
  return null;
}
