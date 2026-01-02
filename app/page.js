"use client";

import { useState, useEffect } from "react";
import { generateSolution } from "../utils/queensSolver";

const N = 8;

const colorPalettes = {
  classic: {
    name: "Classic",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#F1948A"]
  },
  pastel: {
    name: "Pastel",
    colors: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E0BBE4", "#FFDFD3", "#C9E4DE"]
  },
  ocean: {
    name: "Ocean",
    colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#06A77D", "#1D84B5", "#76C893"]
  },
  candy: {
    name: "Candy",
    colors: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF", "#FF006E", "#06FFA5", "#FF1654"]
  }
};

export default function Home() {
  const [solution, setSolution] = useState(null);
  const [playerBoard, setPlayerBoard] = useState(Array(N).fill().map(() => Array(N).fill(false)));
  const [errors, setErrors] = useState({ rows: new Set(), cols: new Set(), diagonals: new Set(), regions: new Set() });
  const [hasWon, setHasWon] = useState(false);
  const [showingSolution, setShowingSolution] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState("classic");
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const colors = colorPalettes[selectedPalette].colors;

  const generateNewPuzzle = () => {
    const newSolution = generateSolution();
    console.log("Generated new puzzle:", newSolution);
    setSolution(newSolution);
    setPlayerBoard(Array(N).fill().map(() => Array(N).fill(false)));
    setErrors({ rows: new Set(), cols: new Set(), diagonals: new Set(), regions: new Set() });
    setHasWon(false);
    setShowingSolution(false);
  };

  const handleGiveUp = () => {
    setShowingSolution(true);
  };

  useEffect(() => {
    generateNewPuzzle();
  }, []);

  // Check if queens attack each other
  const checkAttacks = (board) => {
    const newErrors = { rows: new Set(), cols: new Set(), diagonals: new Set(), regions: new Set() };

    // Count queens in each region
    const regionQueens = {};
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c]) {
          const regionId = solution.colorRegions[r][c];
          if (!regionQueens[regionId]) {
            regionQueens[regionId] = [];
          }
          regionQueens[regionId].push([r, c]);
        }
      }
    }

    // Check for multiple queens in same region
    Object.entries(regionQueens).forEach(([regionId, positions]) => {
      if (positions.length > 1) {
        newErrors.regions.add(parseInt(regionId));
      }
    });

    // Check each queen
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c]) {
          // Check row conflicts
          for (let c2 = 0; c2 < N; c2++) {
            if (c2 !== c && board[r][c2]) {
              newErrors.rows.add(r);
            }
          }

          // Check column conflicts
          for (let r2 = 0; r2 < N; r2++) {
            if (r2 !== r && board[r2][c]) {
              newErrors.cols.add(c);
            }
          }

          // Check diagonal touching (only adjacent diagonals, i = 1 only)
          // Top-left
          if (r - 1 >= 0 && c - 1 >= 0 && board[r - 1][c - 1]) {
            newErrors.diagonals.add(`${r},${c}`);
            newErrors.diagonals.add(`${r - 1},${c - 1}`);
          }
          // Top-right
          if (r - 1 >= 0 && c + 1 < N && board[r - 1][c + 1]) {
            newErrors.diagonals.add(`${r},${c}`);
            newErrors.diagonals.add(`${r - 1},${c + 1}`);
          }
          // Bottom-left
          if (r + 1 < N && c - 1 >= 0 && board[r + 1][c - 1]) {
            newErrors.diagonals.add(`${r},${c}`);
            newErrors.diagonals.add(`${r + 1},${c - 1}`);
          }
          // Bottom-right
          if (r + 1 < N && c + 1 < N && board[r + 1][c + 1]) {
            newErrors.diagonals.add(`${r},${c}`);
            newErrors.diagonals.add(`${r + 1},${c + 1}`);
          }
        }
      }
    }

    return newErrors;
  };

  const checkWin = (board) => {
    // Count total queens
    let queenCount = 0;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c]) queenCount++;
      }
    }

    // Must have exactly 8 queens
    if (queenCount !== 8) return false;

    // Check for no errors
    const newErrors = checkAttacks(board);
    return newErrors.rows.size === 0 &&
           newErrors.cols.size === 0 &&
           newErrors.diagonals.size === 0 &&
           newErrors.regions.size === 0;
  };

  const handleCellClick = (row, col) => {
    if (hasWon || showingSolution) return;

    const newBoard = playerBoard.map(r => [...r]);
    newBoard[row][col] = !newBoard[row][col];
    setPlayerBoard(newBoard);

    const newErrors = checkAttacks(newBoard);
    setErrors(newErrors);

    if (checkWin(newBoard)) {
      setHasWon(true);
    }
  };

  if (!solution) {
    return (
      <div style={styles.loadingContainer}>
        <h1 style={styles.title}>Generating Puzzle...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Leaves</h1>

      <div style={styles.paletteMenu}>
        {Object.entries(colorPalettes).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => setSelectedPalette(key)}
            style={{
              ...styles.paletteOption,
              backgroundColor: selectedPalette === key ? "#6B7A99" : "white",
              color: selectedPalette === key ? "white" : "#444",
            }}
          >
            {palette.name}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowHowToPlay(!showHowToPlay)}
        style={styles.howToPlayButton}
      >
        {showHowToPlay ? "Hide" : "How to play"}
      </button>

      {showHowToPlay && (
        <div style={styles.howToPlayContent}>
          <p style={styles.howToPlayText}>
            Your goal is to have exactly one 🥬 in each row, column, and color region.
          </p>
          <p style={styles.howToPlayText}>
            Click once to place a 🥬.
          </p>
          <p style={styles.howToPlayText}>
            Two 🥬 cannot touch each other, not even diagonally.
          </p>
        </div>
      )}

      {hasWon && (
        <div style={styles.winMessage}>
          🎉 Congratulations! You solved it! 🎉
        </div>
      )}

      {showingSolution && !hasWon && (
        <div style={styles.giveUpMessage}>
          
        </div>
      )}

      <div style={styles.grid}>
        {Array.from({ length: N }).map((_, row) =>
          Array.from({ length: N }).map((_, col) => {
            const regionId = solution.colorRegions[row][col];
            const color = colors[(regionId - 1) % colors.length];
            const hasQueen = showingSolution ? solution.board[row] === col : playerBoard[row][col];

            // Check if this cell should show error stripes
            const isInErrorRow = !showingSolution && errors.rows.has(row);
            const isInErrorCol = !showingSolution && errors.cols.has(col);
            const isInErrorDiagonal = !showingSolution && errors.diagonals.has(`${row},${col}`);
            const isInErrorRegion = !showingSolution && errors.regions.has(regionId);
            const showErrorStripes = isInErrorRow || isInErrorCol || isInErrorDiagonal || isInErrorRegion;

            // Check adjacent cells for region borders
            const topDifferent = row === 0 || solution.colorRegions[row - 1][col] !== regionId;
            const bottomDifferent = row === N - 1 || solution.colorRegions[row + 1][col] !== regionId;
            const leftDifferent = col === 0 || solution.colorRegions[row][col - 1] !== regionId;
            const rightDifferent = col === N - 1 || solution.colorRegions[row][col + 1] !== regionId;

            const borderWidth = "2px";
            const regionBorderColor = "#000000";

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => handleCellClick(row, col)}
                style={{
                  ...styles.cell,
                  backgroundColor: color,
                  cursor: hasWon || showingSolution ? "default" : "pointer",
                  borderTop: topDifferent ? `${borderWidth} solid ${regionBorderColor}` : "none",
                  borderBottom: bottomDifferent ? `${borderWidth} solid ${regionBorderColor}` : "none",
                  borderLeft: leftDifferent ? `${borderWidth} solid ${regionBorderColor}` : "none",
                  borderRight: rightDifferent ? `${borderWidth} solid ${regionBorderColor}` : "none",
                  backgroundImage: showErrorStripes
                    ? 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255, 0, 0, 0.8) 8px, rgba(255, 0, 0, 0.3) 10px)'
                    : 'none',
                }}
              >
                {hasQueen ? "🥬" : ""}
              </div>
            );
          })
        )}
      </div>

      <div style={styles.buttonContainer}>
        {!hasWon && !showingSolution && (
          <button onClick={handleGiveUp} style={styles.giveUpButton}>
            Give Up
          </button>
        )}
        <button onClick={generateNewPuzzle} style={styles.button}>
          New Game
        </button>
      </div>

      <div style={styles.footer}>
        <hr style={styles.footerHr} />
        <a href="https://karolina.mgdubiel.com" style={styles.backLink}>
          ← Back to main site
        </a>
        <p style={styles.footerText}>
          Made with love by Karolina Dubiel using Next.js, React, and Tailwind CSS.
        </p>
      </div>
    </div>
  );
}



const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh",
    backgroundColor: "#fffaf0",
    fontFamily: "'DM Sans', 'Inter', sans-serif",
    padding: "20px",
    paddingTop: "40px",
    textAlign: "center",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#fffaf0",
    fontFamily: "'DM Sans', 'Inter', sans-serif",
  },
  title: {
    fontSize: "4vmin",
    fontWeight: "900",
    fontFamily: "'Inter', sans-serif",
    color: "#111",
    margin: "0",
    marginBottom: "12px",
  },
  paletteMenu: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "0.8em",
    boxShadow: "2px 2px 8px lightgray",
    maxWidth: "400px",
  },
  paletteOption: {
    padding: "8px 16px",
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "600",
    border: "2px solid lightgray",
    borderRadius: "0.6em",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  howToPlayButton: {
    padding: "8px 16px",
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "600",
    backgroundColor: "white",
    color: "#444",
    border: "2px solid lightgray",
    borderRadius: "0.6em",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "10px",
  },
  howToPlayContent: {
    backgroundColor: "white",
    borderRadius: "0.8em",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "2px 2px 8px lightgray",
    maxWidth: "400px",
  },
  howToPlayText: {
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "500",
    color: "#444",
    margin: "8px 0",
    lineHeight: "1.5em",
    textAlign: "left",
  },
  winMessage: {
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "'Inter', sans-serif",
    color: "#a7b0ca",
    marginBottom: "15px",
    textShadow: "0px 0px 10px #a7b0ca",
  },
  giveUpMessage: {
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    color: "#444",
    marginBottom: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: `repeat(${N}, 50px)`,
    gridTemplateRows: `repeat(${N}, 50px)`,
    gap: "2px",
    border: "3px solid #a7b0ca",
    borderRadius: "0.8em",
    boxShadow: "2px 2px 8px 2px lightgray",
  },
  cell: {
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: "normal",
    transition: "transform 0.1s ease",
    boxSizing: "border-box",
  },
  buttonContainer: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: "10px 20px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "bold",
    backgroundColor: "#6B7A99",
    color: "#fffaf0",
    border: "none",
    borderRadius: "0.8em",
    cursor: "pointer",
    boxShadow: "2px 2px 8px lightgray",
    transition: "all 0.3s ease",
  },
  giveUpButton: {
    padding: "10px 20px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "bold",
    backgroundColor: "white",
    color: "#444",
    border: "2px solid lightgray",
    borderRadius: "0.8em",
    cursor: "pointer",
    boxShadow: "2px 2px 8px lightgray inset",
    transition: "all 0.3s ease",
  },
  footer: {
    marginTop: "40px",
    textAlign: "center",
    width: "100%",
    maxWidth: "600px",
  },
  footerHr: {
    border: "none",
    borderTop: "1px solid lightgray",
    marginBottom: "20px",
  },
  backLink: {
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "600",
    color: "#a7b0ca",
    textDecoration: "none",
    display: "block",
    marginBottom: "10px",
    transition: "color 0.2s ease",
  },
  footerText: {
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "500",
    color: "#444",
    margin: "0",
    lineHeight: "1.5em",
  },
};
