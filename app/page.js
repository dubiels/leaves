"use client";

import { useState, useEffect } from "react";
import { generateSolution } from "../utils/queensSolver";

const N = 8;

export default function Home() {
  const [solution, setSolution] = useState(null);

  const generateNewSolution = () => {
    const newSolution = generateSolution();
    console.log("Generated new solution:", newSolution);
    setSolution(newSolution);
  };

  useEffect(() => {
    generateNewSolution();
  }, []);

  if (!solution) {
    return (
      <div style={styles.loadingContainer}>
        <h1 style={styles.title}>Generating Solution...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>8 Queens Solution</h1>
      <div style={styles.grid}>
        {Array.from({ length: N }).map((_, row) =>
          Array.from({ length: N }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              style={{
                ...styles.cell,
                backgroundColor: (row + col) % 2 === 0 ? "#f0d9b5" : "#b58863",
                color: solution[row] === col ? "black" : "transparent",
              }}
            >
              {solution[row] === col ? "🥬" : ""}
            </div>
          ))
        )}
      </div>
      <button onClick={generateNewSolution} style={styles.button}>
        Generate New Solution
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    textAlign: "center",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: `repeat(${N}, 60px)`,
    gridTemplateRows: `repeat(${N}, 60px)`,
    gap: "2px",
    border: "4px solid #333",
    borderRadius: "8px",
  },
  cell: {
    width: "60px",
    height: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "36px",
    fontWeight: "bold",
  },
  button: {
    marginTop: "30px",
    padding: "12px 24px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  buttonHover: {
    backgroundColor: "#45a049",
    transform: "scale(1.05)",
  },
};
