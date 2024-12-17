const N = 8;

function isSafe(board, row, col) {
  for (let i = 0; i < row; i++) {
    if (board[i] === col || Math.abs(board[i] - col) === row - i) {
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

function generateColorRegions(board) {
  let regions = Array(N).fill().map(() => Array(N).fill(0));
  let regionId = 1;

  for (let row = 0; row < N; row++) {
    let col = board[row];
    if (regions[row][col] === 0) {
      regions[row][col] = regionId;
      let size = Math.floor(Math.random() * 3) + 1; // Random size 1-3
      for (let i = 0; i < size; i++) {
        let newRow = row + (Math.random() < 0.5 ? 1 : -1);
        let newCol = col + (Math.random() < 0.5 ? 1 : -1);
        if (newRow >= 0 && newRow < N && newCol >= 0 && newCol < N && regions[newRow][newCol] === 0) {
          regions[newRow][newCol] = regionId;
        }
      }
      regionId++;
    }
  }

  // Fill remaining cells
  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      if (regions[row][col] === 0) {
        regions[row][col] = Math.floor(Math.random() * 8) + 1;
      }
    }
  }

  return regions;
}

export function generateSolution() {
  let board = Array(N).fill(-1);
  if (solveQueens(board, 0)) {
    let colorRegions = generateColorRegions(board);
    return { board, colorRegions };
  }
  return null;
}
