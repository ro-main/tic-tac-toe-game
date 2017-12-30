/* eslint-env browser */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */

const winCombinations = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]];

const player1 = { number: 1, played: [], possibleWins: winCombinations, color: '', wins: 0 };
const player2 = { number: 2, played: [], possibleWins: winCombinations, color: '', wins: 0 };

let playerStartingGame = 1;

const availableBlocks = document.querySelectorAll('div.available');

function chooseColor(selectedColor) {
  if (selectedColor === 'blue') {
    player1.color = 'blue';
    player2.color = 'red';
  } else if (selectedColor === 'red') {
    player1.color = 'red';
    player2.color = 'blue';
  } else {
    console.error('no color');
  }

  document.getElementById('chooseColor').style.display = 'none';
  document.getElementById('board').style.display = 'block';
  document.getElementById('reset').style.visibility = 'visible';
}

function updateOtherPlayerPossibleWins(OtherPlayer, lastMove) {
  const currMove = Number(lastMove);
  const newPossibleWins = [];

  OtherPlayer.possibleWins.forEach((e) => {
    if (!e.includes(currMove)) {
      newPossibleWins.push(e);
    }
  });
  return newPossibleWins;
}

function winCheck(currentPlayer) {
  const joueur = currentPlayer;
  let k;
  let winningCombination = [];
  for (k = 0; k < joueur.possibleWins.length; k += 1) {
    winningCombination = [];
    let l;
    for (l = 0; l < joueur.played.length; l += 1) {
      const playerCurrPossibleWin = joueur.possibleWins[k];
      const playerCurrMove = joueur.played[Number(l)];
      const playerCurrMovePos = playerCurrPossibleWin.indexOf(playerCurrMove);
      if (playerCurrMovePos !== -1) {
        winningCombination.push(playerCurrMove);
      }

      if (winningCombination.length === 3) {
        return 'winner';
      }
    }
  }
  return 'No winner yet';
}

function updateVisual(block, currentPlayer, nextTurn) {
  const currBlock = block;
  currBlock.className = `block , ${currentPlayer.color}`;
  document.getElementById('turn-value').innerHTML = `Player ${nextTurn}`;
}

function updateData(blockId, currentPlayer, nextPlayer) {
  const nextPlayerz = nextPlayer;
  const currentPlayerz = currentPlayer;
  currentPlayerz.played.push(blockId);
  nextPlayerz.possibleWins = updateOtherPlayerPossibleWins(nextPlayerz, blockId);
}

function cleanCurrGame() {
  const playedBlocks = document.querySelectorAll('div.block');
  playedBlocks.forEach((block) => {
    const currBlock = block;
    currBlock.className = 'block available';
  });
  player1.possibleWins = winCombinations;
  player2.possibleWins = winCombinations;
  player1.played = [];
  player2.played = [];
  document.getElementById('end').style.display = 'none';
  document.getElementById('board').style.display = 'block';
}

function cleanCurrSession() {
  player1.wins = 0;
  player2.wins = 0;
  document.getElementById('player1-wins').innerHTML = '0';
  document.getElementById('player2-wins').innerHTML = '0';
}

function reset() {
  cleanCurrGame();
  cleanCurrSession();
  document.getElementById('reset').innerHTML = 'Reset';
  document.getElementById('turn-wrapper').style.display = 'block';
  document.getElementById('chooseColor').style.display = 'block';
  document.getElementById('board').style.display = 'none';
  start();
}

function start() {
  playerStartingGame = Math.floor((Math.random() * 2) + 1);
  if (playerStartingGame === 1) {
    document.getElementById('turn-value').innerHTML = 'Player 1';
  } else {
    document.getElementById('turn-value').innerHTML = 'Player 2';
  }
  play(playerStartingGame);
}

function nextGame() {
  cleanCurrGame();
  if (playerStartingGame === 1) {
    document.getElementById('turn-value').innerHTML = 'Player 2';
    playerStartingGame = 2;
    play(playerStartingGame);
  } else {
    document.getElementById('turn-value').innerHTML = 'Player 1';
    playerStartingGame = 1;
    play(playerStartingGame);
  }
}

function endGame(status, currentPlayer) {
  availableBlocks.forEach((block) => {
    block.removeEventListener('click', () => {}, { once: true });
  });
  const currPlayer = currentPlayer;
  if (status === 'winner') {
    document.getElementById('end').innerHTML = `Player ${currentPlayer.number} wins!`;
    currPlayer.wins += 1;
    document.getElementById(`player${currentPlayer.number}-wins`).innerHTML = currentPlayer.wins;
    document.getElementById('end').style.display = 'block';
    document.getElementById('end').className = 'winner';
  } else {
    document.getElementById('end').innerHTML = 'It\'s a draw!';
    document.getElementById('end').style.display = 'block';
    document.getElementById('end').className = 'draw';
  }
  document.getElementById('board').style.display = 'none';
  setTimeout(() => {
    nextGame();
  }, 3000);
}

function play(turn) {
  let currTurn;
  if (player1.played.length === 0 && player2.played.length === 0) {
    currTurn = turn;
  }
  let nextTurn;
  let currentPlayer = {};
  let nextPlayer = {};
  availableBlocks.forEach((block) => {
    block.addEventListener('click', () => {
      if (currTurn === 1) {
        currentPlayer = player1;
        nextPlayer = player2;
        nextTurn = 2;
      } else {
        currentPlayer = player2;
        nextPlayer = player1;
        nextTurn = 1;
      }
      updateVisual(block, currentPlayer, nextTurn);
      updateData(Number(block.id), currentPlayer, nextPlayer);
      console.log(`player1 || played: ${player1.played} || possibleWins ${player1.possibleWins.length}`);
      console.log(`player2 || played: ${player2.played} || possibleWins ${player2.possibleWins.length}`);
      let status = 'No winner yet';
      if (currentPlayer.played.length >= 3) {
        status = winCheck(currentPlayer);
        if (status === 'winner') {
          endGame(status, currentPlayer);
        } else if (status !== 'winner' && player1.possibleWins.length === 0 && player2.possibleWins.length === 0) {
          endGame(status, currentPlayer);
        } else {
          currTurn = nextTurn;
        }
      } else {
        currTurn = nextTurn;
      }
    },
    { once: true },
    );
  });
}

document.getElementById('blue').addEventListener('click', () => {
  chooseColor('blue');
  start();
});

document.getElementById('red').addEventListener('click', () => {
  chooseColor('red');
  start();
});

document.getElementById('reset').addEventListener('click', () => {
  reset();
});
