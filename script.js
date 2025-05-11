// Gameboard Module
const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  let moves = 0;

  const updateCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      displayDom.showMarker(marker, index);
      moves++;
      return true;
    } else {
      return false;
    }
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    moves = 0;

    // DOM Reset
    const btns = document.querySelectorAll(".btn");
    btns.forEach((btn) => {
      btn.textContent = "";
    });

    displayDom.enableBtns();
  };

  const getMoves = () => moves;

  return { getBoard, updateCell, reset, getMoves };
})();

// Player Factory
const Player = (name, marker) => {
  return { name, marker };
};

// Game Controller
const gameController = (() => {
  let player1 = Player("Player 1", "X");
  let player2 = Player("Player 2", "O");
  let player1Score = 0;
  let player2Score = 0;
  let tieScore = 0;

  let currentPlayer = player1;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    displayDom.updateTurn(currentPlayer.marker);
  };

  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  const checkWinner = (board, marker) => {
    return winningPatterns.some((pattern) => {
      return pattern.every((index) => board[index] === marker);
    });
  };

  const checkTie = () => {
    if (gameBoard.getMoves() === 9) {
      console.log("Game Tie");
      return "Game Tie";
    }
    return false;
  };

  const playRound = (index) => {
    if (!gameBoard.updateCell(index, currentPlayer.marker)) return;

    if (checkWinner(gameBoard.getBoard(), currentPlayer.marker)) {
      console.log("Winner is " + currentPlayer.name);
      displayDom.showWinner(currentPlayer.marker);
      displayDom.disableBtns();
      if (currentPlayer.marker === "X") {
        player1Score++;
      } else {
        player2Score++;
      }
      displayDom.hideTurn();
      displayDom.updatePlayersScore();
      return;
    }
    if (checkTie()) {
      displayDom.showTie();
      tieScore++;
      displayDom.hideTurn();
      displayDom.disableBtns();
      displayDom.updatePlayersScore();
      return;
    }

    switchPlayer();
  };

  const getPlayer1Score = () => player1Score;
  const getPlayer2Score = () => player2Score;
  const getTieScore = () => tieScore;

  const getCurrentPlayer = () => currentPlayer;

  return {
    playRound,
    getCurrentPlayer,
    checkWinner,
    checkTie,
    getPlayer1Score,
    getPlayer2Score,
    getTieScore,
  };
})();

// DOM Display
const displayDom = (() => {
  let turn = document.querySelector(".turn");
  const btns = document.querySelectorAll(".btn");
  let winner = document.querySelector(".winner");
  const scoreX = document.querySelector(".scoreX");
  const scoreO = document.querySelector(".scoreO");
  const scoreTie = document.querySelector(".scoreTie");

  turn.textContent =
    "Player '" + gameController.getCurrentPlayer().marker + "' turn";

  const defaultTurn = () => {
    turn.textContent =
    "Player '" + gameController.getCurrentPlayer().marker + "' turn";
  }
  const showWinner = (winnerMarker) => {
    winner.textContent = `Congratulations Player ${winnerMarker} win 🎉🎉`;
  };
  const hideWinner = () => {
    winner.textContent = "";
  };

  const showTie = () => {
    winner.textContent = "Game Tied 🙃🙃";
  };

  const showMarker = (marker, index) => {
    btns[index].textContent = marker;
  };

  const disableBtns = () => {
    btns.forEach((btn) => {
      btn.disabled = true;
    });
  };

  const enableBtns = () => {
    btns.forEach((btn) => {
      btn.disabled = false;
    });
  };

  const updateTurn = (marker) => {
    turn.textContent = `Player '${marker}' turn`;
  };
  const hideTurn = () => {
    turn.textContent = "";
  };
  

  const updatePlayersScore = () => {
    scoreX.textContent = gameController.getPlayer1Score();
    scoreO.textContent = gameController.getPlayer2Score();
    scoreTie.textContent = gameController.getTieScore();
  };

  return {
    showWinner,
    showTie,
    showMarker,
    disableBtns,
    enableBtns,
    updateTurn,
    hideTurn,
    defaultTurn,
    hideWinner,
    updatePlayersScore,
  };
})();

// Event Listeners
const container = document.querySelector(".grid-container");

const handleConatinerClick = (e) => {
  let index = e.target.getAttribute("data-btn");
  gameController.playRound(index);
};

container.addEventListener("click", (e) => {
  handleConatinerClick(e);
});

const newGame = document.querySelector(".restart");

const handleReset = () => {
  gameBoard.reset();
  displayDom.hideWinner();
  displayDom.defaultTurn();
};

newGame.addEventListener("click", handleReset);
