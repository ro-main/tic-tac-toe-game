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

let availableBlocks = document.querySelectorAll('[status="available"]');

let playerStartingGame;
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

function updateOtherPlayerPossibleWins(lastMove) {
  const currMove = Number(lastMove);
  const newPossibleWins = [];

  nextPlayer.possibleWins.forEach((e) => {
    if (!e.includes(currMove)) {
      newPossibleWins.push(e);
    }
  });
  return newPossibleWins;
}

function winCheck() {
  let k;
  let winningCombination = [];
  for (k = 0; k < currentPlayer.possibleWins.length; k += 1) {
    winningCombination = [];
    let l;
    for (l = 0; l < currentPlayer.played.length; l += 1) {
      const playerCurrPossibleWin = currentPlayer.possibleWins[k];
      const playerCurrMove = currentPlayer.played[Number(l)];
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
  availableBlocks = document.querySelectorAll('[status="available"]');
}

function updateData(blockId) {
  currentPlayer.played.push(blockId);
  nextPlayer.possibleWins = updateOtherPlayerPossibleWins(blockId);
  remainingMoves = updateRemainingMoves(blockId);
}

function aboutToWin(player) {
  let result;
  let winningCombination = [];
  let k;
  for (k = 0; k < player.possibleWins.length; k += 1) {
    winningCombination = [];

    let l;
    for (l = 0; l < player.played.length; l += 1) {
      const playerCurrPossibleWin = player.possibleWins[k];
      const playerCurrMove = player.played[Number(l)];
      const playerCurrMovePos = playerCurrPossibleWin.indexOf(playerCurrMove);
      if (playerCurrMovePos !== -1) {
        winningCombination.push(playerCurrMove);
      }

      if (winningCombination.length === 2) {
        let m;
        for (m = 0; m < playerCurrPossibleWin.length; m += 1) {
          const isInWinningCombination = winningCombination.includes(playerCurrPossibleWin[m]);
          if (!isInWinningCombination) {
            return Number(playerCurrPossibleWin[m]);
          }
        }
      }
    }
  }
  return Number(result);
}

function checkNextMovesToWin(combination) {
  const combinationObject = {
    currentCombination: combination,
    numberOfMoveToWin: 0,
    nextMoves: [],
  };
  // calculate the remaining number of moves to complete the current combination
  combination.forEach((e) => {
    if (!currentPlayer.played.includes(e)) {
      combinationObject.numberOfMoveToWin += 1;
      combinationObject.nextMoves.push(e);
    }
  });

  return combinationObject;
}

function chooseBestOption(combinations) {
  let bestCombinations = [combinations[0]];
  let selectedOption;
  let i;
  for (i = 1; i < combinations.length; i += 1) {
    if (combinations[i].numberOfMoveToWin < bestCombinations[0].numberOfMoveToWin) {
      bestCombinations = [combinations[i]];
    } else if (combinations[i].numberOfMoveToWin === bestCombinations[0].numberOfMoveToWin) {
      bestCombinations.push(combinations[i]);
    }
  }
  if (bestCombinations.length === 1) {
    selectedOption = bestCombinations[0].nextMoves[0];
  } else {
    const orderedBestMoves = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    let j;
    for (j = 0; j < bestCombinations.length; j += 1) {
      let k;
      const moves = bestCombinations[j].nextMoves;
      for (k = 0; k < moves.length; k += 1) {
        orderedBestMoves[moves[k]] += 1;
      }
    }

    selectedOption = Object.keys(orderedBestMoves).reduce((a, b) =>
       orderedBestMoves[a] > orderedBestMoves[b] ? a : b);
  }

  return selectedOption;
}

function bestOption(player) {
  const winningCombination = player.possibleWins;
  const rankedWinningCombination = [];

  winningCombination.forEach((e) => {
    const combination = checkNextMovesToWin(e);
    rankedWinningCombination.push(combination);
  });

  return Number(chooseBestOption(rankedWinningCombination));
}

function humanPlaying(val) {
  blockPlayed = val;
  updateVisual(blockPlayed);
  updateData(blockPlayed);
  if (currentPlayer.played.length >= 3) {
    status = winCheck(currentPlayer);
    if (status === 'winner') {
      endGame();
    } else if (status !== 'winner' && player1.possibleWins.length === 0 && player2.possibleWins.length === 0) {
      endGame();
    } else {
      updateTurn();
      if (gameType === 'vsComputer') {
        computerPlaying();
      }
    }
  } else {
    updateTurn();
    if (gameType === 'vsComputer') {
      computerPlaying();
    }
  }
}

function computerPlaying() {
  setTimeout(() => {
    let nextMove;
    // first if it's the first move of the game we play the optimal move (5)
    if (player1.played.length < 1 && player2.played.length < 1) {
      nextMove = 5;
    } else {
    // else we check if computer is about to win if not check if player 1 is about to win

      const isComputerAboutToWin = aboutToWin(player2);
      if (isComputerAboutToWin) {
        nextMove = isComputerAboutToWin;
      } else {
        const isPlayer1AboutToWin = aboutToWin(player1);
        if (isPlayer1AboutToWin) {
          nextMove = isPlayer1AboutToWin;
        } else {
          nextMove = bestOption(player2);
        }
      }
    }

    updateVisual(nextMove);
    updateData(nextMove);
    if (currentPlayer.played.length >= 3) {
      status = winCheck(currentPlayer);
      if (status === 'winner') {
        endGame();
      } else if (status !== 'winner' && player1.possibleWins.length === 0 && player2.possibleWins.length === 0) {
        endGame();
      } else {
        updateTurn();
      }
    } else {
      updateTurn();
    }
  }, 1000);
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
  } else {
    document.getElementById('turn-value').innerHTML = 'Player 2';
    currentPlayer = player2;
    nextPlayer = player1;
  }
  document.getElementById('turn-wrapper').style.visibility = 'visible';
  document.getElementById('score').style.visibility = 'visible';
  document.getElementById('reset').style.visibility = 'visible';

  if (gameType === 'vsComputer' && playerStartingGame === 2) {
    computerPlaying();
  }
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
  /* availableBlocks.forEach((block) => {
    block.removeEventListener('click', () => {}, { once: true });
  }); */

  if (status === 'winner') {
    document.getElementById('end').innerHTML = `Player ${currentPlayer.number} wins!`;
    currentPlayer.wins += 1;
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
  if (currentPlayer.number === 2) {
    currentPlayer = player1;
    nextPlayer = player2;
  } else {
    currentPlayer = player2;
    nextPlayer = player1;
  }
  document.getElementById('turn-value').innerHTML = `Player ${currentPlayer.number}`;
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

availableBlocks.forEach((block) => {
  block.addEventListener('click', () => {
    humanPlaying(Number(block.id));
  },
  { once: true },
  );
});
