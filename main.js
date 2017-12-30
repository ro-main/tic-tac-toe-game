/* eslint-env browser */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */
let gameType = '';

let remainingMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const winCombinations = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]];

const player1 = { number: 1, played: [], possibleWins: winCombinations, XO: '', wins: 0 };
const player2 = { number: 2, played: [], possibleWins: winCombinations, XO: '', wins: 0 };

const O = '<svg class="item O" viewBox="0 0 128 128"><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16"></path></svg>';
const X = '<svg class="item X" viewBox="0 0 128 128"><path d="M16,16L112,112"></path><path d="M112,16L16,112"></path></svg>';

const availableBlocks = document.querySelectorAll('[status="available"]');

let playerStartingGame;
let currTurn;
let nextTurn;
let currentPlayer = {};
let nextPlayer = {};
let blockPlayed;
let status = 'No winner yet';

function chooseOX(selected) {
  if (selected === 'O') {
    player1.XO = O;
    player2.XO = X;
  } else if (selected === 'X') {
    player1.XO = X;
    player2.XO = O;
  } else {
    console.error('nothing selected');
  }

  document.getElementById('chooseColor').style.display = 'none';
  document.getElementById('board').style.display = 'block';
  document.getElementById('reset').style.visibility = 'visible';
}

function gameSetup() {
  document.getElementById('chooseGame').style.display = 'none';
  document.getElementById('chooseColor').style.display = 'block';
}

function updateRemainingMoves(currentBlockId) {
  const newRemainingMoves = [];
  let i;
  for (i = 0; i < remainingMoves.length; i += 1) {
    if (!remainingMoves[i] === currentBlockId) {
      newRemainingMoves.push(currentBlockId);
    }
  }
  return newRemainingMoves;
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

function winCheck() {
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

function updateVisual(blockId) {
  const currBlock = blockId;
  document.getElementById(currBlock).setAttribute('status', 'block');
  document.getElementById(currBlock).innerHTML = `${currentPlayer.XO}`;
  document.getElementById('turn-value').innerHTML = `Player ${nextTurn}`;
}

function updateData(blockId) {
  const nextPlayerz = nextPlayer;
  const currentPlayerz = currentPlayer;
  currentPlayerz.played.push(blockId);
  nextPlayerz.possibleWins = updateOtherPlayerPossibleWins(nextPlayerz, blockId);
  remainingMoves = updateRemainingMoves(blockId);
  console.log(`player1 || played: ${player1.played} || possibleWins ${player1.possibleWins.length}`);
  console.log(`player2 || played: ${player2.played} || possibleWins ${player2.possibleWins.length}`);
}

function computerPlaying() {
  let choice;
  let k;
  // first check if player 1 is about to win
  for (k = 0; k < player1.possibleWins.length; k += 1) {
    const player1OrderedwinningCombination = [
      {
        combination: [1, 2, 3],
        has: [1, 2],
        needs: [3],
      },
    ];
    let l;
    for (l = 0; l < player1.played.length; l += 1) {
      const player1PossibleWin = player1.possibleWins[k];
      const playerCurrMovePos = player1PossibleWin.indexOf(playerCurrMove);
      if (playerCurrMovePos !== -1) {
        player1OrderedwinningCombination.push(playerCurrMove);
      }

      if (winningCombination.length === 3) {
        return 'winner';
      }
    }
  }


  // rank my possible wins based on number of
  //
  // for each possible combination, check each value
    // if value hasn't been played, play it.
    // else go to next value
  // when ending, go to next
  updateVisual(choice);
  updateData(choice);
  if (currentPlayer.played.length >= 3) {
    sessionStatus();
  }
  updateTurn();
}

function cleanCurrGame() {
  const playedBlocks = document.querySelectorAll('[status="block"]');
  playedBlocks.forEach((block) => {
    const currBlock = block;
    currBlock.innerHTML = '';
    currBlock.setAttribute('status', 'available');
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
  gameType = '';
  document.getElementById('reset').style.visibility = 'hidden';
  document.getElementById('turn-wrapper').style.visibility = 'hidden';
  document.getElementById('score').style.visibility = 'hidden';
  document.getElementById('board').style.display = 'none';
  document.getElementById('chooseGame').style.display = 'block';
}

function start() {
  playerStartingGame = Math.floor((Math.random() * 2) + 1);
  if (playerStartingGame === 1) {
    document.getElementById('turn-value').innerHTML = 'Player 1';
    currentPlayer = player1;
    nextPlayer = player2;
    currTurn = 1;
    nextTurn = 2;
  } else {
    document.getElementById('turn-value').innerHTML = 'Player 2';
    currentPlayer = player2;
    nextPlayer = player1;
    currTurn = 2;
    nextTurn = 1;
  }
  document.getElementById('turn-wrapper').style.visibility = 'visible';
  document.getElementById('score').style.visibility = 'visible';
  document.getElementById('reset').style.visibility = 'visible';
  play();
}

function nextGame() {
  cleanCurrGame();
  if (playerStartingGame === 1) {
    document.getElementById('turn-value').innerHTML = 'Player 2';
    playerStartingGame = 2;
    start();
  } else {
    document.getElementById('turn-value').innerHTML = 'Player 1';
    playerStartingGame = 1;
    start();
  }
}

function endGame() {
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

function updateTurn() {
  if (currTurn === 2) {
    currentPlayer = player1;
    nextPlayer = player2;
    currTurn = 1;
    nextTurn = 2;
  } else {
    currentPlayer = player2;
    nextPlayer = player1;
    currTurn = 2;
    nextTurn = 1;
  }
}

function sessionStatus() {
  status = winCheck(currentPlayer);
  if (status === 'winner') {
    endGame();
  } else if (status !== 'winner' && player1.possibleWins.length === 0 && player2.possibleWins.length === 0) {
    endGame();
  }
}

document.getElementById('vsComputer').addEventListener('click', () => {
  gameType = 'vsComputer';
  gameSetup();
});

document.getElementById('playerVsPlayer').addEventListener('click', () => {
  gameType = 'playerVsPlayer';
  gameSetup();
});


document.getElementById('O').addEventListener('click', () => {
  chooseOX('O');
  start();
});

document.getElementById('X').addEventListener('click', () => {
  chooseOX('X');
  start();
});

document.getElementById('reset').addEventListener('click', () => {
  reset();
});
function play() {
  if ((gameType === 'vsComputer' && currentPlayer === 'player 1') || (gameType === 'playerVsPlayer')) {
    console.log('in if condition');
    availableBlocks.forEach((block) => {
      block.addEventListener('click', () => {
        blockPlayed = Number(block.id);
        updateVisual(blockPlayed);
        updateData(blockPlayed);
        if (currentPlayer.played.length >= 3) {
          sessionStatus();
        }
        updateTurn();
        if (gameType === 'vsComputer' && currentPlayer === 'player 2') {
          computerPlaying();
        }
      },
      { once: true },
    );
    });
  }
}
