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

  // Helper function to check if a cell is valid and unassigned
  function isValidCell(row, col) {
    return row >= 0 && row < N && col >= 0 && col < N && regions[row][col] === 0;
  }

  // Directions for expanding regions
  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];

  // Create regions around each queen
  for (let row = 0; row < N; row++) {
    let col = board[row];
    
    // Mark queen's cell
    regions[row][col] = regionId;

    // Attempt to expand region
    let expandedCells = 0;
    for (let [dx, dy] of directions) {
      let newRow = row + dx;
      let newCol = col + dy;

      if (isValidCell(newRow, newCol) && expandedCells < 3) {
        regions[newRow][newCol] = regionId;
        expandedCells++;
      }
    }

    regionId++;
  }

  // Fill remaining unassigned cells using flood fill approach
  let changed = true;
  while (changed) {
    changed = false;
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        if (regions[row][col] === 0) {
          // Find a neighboring cell's region
          for (let [dx, dy] of directions) {
            let newRow = row + dx;
            let newCol = col + dy;

            if (newRow >= 0 && newRow < N && newCol >= 0 && newCol < N && regions[newRow][newCol] !== 0) {
              regions[row][col] = regions[newRow][newCol];
              changed = true;
              break;
            }
          }
        }
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
