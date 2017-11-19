/* eslint-env browser */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */

// list all possible ways to win
const winCombinations = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]];

// set default variables for both players
const player1 = { number: 1, played: [], possibleWins: winCombinations, color: 'player-1', wins: 0 };
const player2 = { number: 2, played: [], possibleWins: winCombinations, color: 'player-2', wins: 0 };

let playerStartingGame = 1;

const availableBlocks = document.querySelectorAll('div.available');

function updateOtherPlayerPossibleWins(OtherPlayer, lastMove) {
  console.log('FUNCTION UPDATE_OTHER_PLAYER_POSSIBLE_WINS()');
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
  let yes;
  let k;
  for (k = 0; k < joueur.possibleWins.length; k += 1) {
    yes = 0;
    let l;
    for (l = 0; l < joueur.played.length; l += 1) {
      const playerCurrPossibleWin = joueur.possibleWins[k];
      const playerCurrMove = joueur.played[Number(l)];
      const playerCurrMovePos = playerCurrPossibleWin.indexOf(playerCurrMove);
      if (playerCurrMovePos !== -1) {
        yes += 1;
      }

      if (yes === 3) {
        return 'winner';
      }
    }
  }
  console.log('End of loop on possible wins. No winner');
  return 'No winner yet';
}

function updateVisual(turn, block, currentPlayer, nextTurn) {
  const currBlock = block;
  currBlock.className = `block , ${currentPlayer.color}`;
  document.getElementById('turn-value').innerHTML = `Player ${nextTurn}`;
}

function updateData(turn, blockId, currentPlayer, nextPlayer) {
  let stringifiedNextPlayerPossibleWins = '';
  const nextPlayerz = nextPlayer;
  console.log('FUNCTION UPDATEDATA()');
  currentPlayer.played.push(blockId);
  console.log(`Adding the block played to the current player (${currentPlayer.number}) played's list: `);
  let i;
  for (i = 0; i < currentPlayer.played.length; i += 1) {
    const move = i + 1;
    console.log(`Move ${move} = ${currentPlayer.played[i]}`);
  }
  const playedLength = currentPlayer.played.length;
  const lastPlayed = currentPlayer.played[playedLength - 1];
  console.log(`Last move, number ${playedLength} = ${lastPlayed}`);
  nextPlayerz.possibleWins = updateOtherPlayerPossibleWins(nextPlayer, blockId);
  let f;
  for (f = 0; f < nextPlayer.possibleWins.length; f += 1) {
    stringifiedNextPlayerPossibleWins += `[ ${nextPlayer.possibleWins[f]} ]`;
  }
  console.log(`Back in FUNCTION UPDATEDATA() - Next player updated possiblewins are: ${stringifiedNextPlayerPossibleWins}`);
}

function cleanCurrGame() {
  console.log('FUNCTION CLEANCURRENTGAME()');
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
  console.log('FUNCTION CLEANCURRENTSESSION()');
  player1.wins = 0;
  player2.wins = 0;
  document.getElementById('player1-wins').innerHTML = '0';
  document.getElementById('player2-wins').innerHTML = '0';
}

function reset() {
  console.log('FUNCTION RESET()');
  cleanCurrGame();
  cleanCurrSession();
  document.getElementById('reset').innerHTML = 'Reset';
  document.getElementById('turn-wrapper').style.display = 'block';
  playerStartingGame = Math.floor((Math.random() * 2) + 1);
  if (playerStartingGame === 1) {
    document.getElementById('turn-value').innerHTML = 'Player 1';
  } else {
    document.getElementById('turn-value').innerHTML = 'Player 2';
  }
  console.log(`Selecting randomly the player who will start: ${playerStartingGame}. Starting the game.`);
  play(playerStartingGame);
}

function nextGame() {
  console.log('FUNCTION NEXTGAME()');
  console.log(`previous playerStartingGame is ${playerStartingGame}`);
  console.log('Calling function cleanCurrGame()');
  cleanCurrGame();
  console.log('Back in function nextGame()');

  if (playerStartingGame === 1) {
    document.getElementById('turn-value').innerHTML = 'Player 2';
    playerStartingGame = 2;
    console.log(`playerStartingGame is ${playerStartingGame} (should be 2)`);
    play(playerStartingGame);
  } else {
    document.getElementById('turn-value').innerHTML = 'Player 1';
    playerStartingGame = 1;
    console.log(`playerStartingGame is ${playerStartingGame} (should be 1)`);
    play(playerStartingGame);
  }
}

function endGame(status, currentPlayer) {
  console.log('FUNCTION ENDGAME()');
  availableBlocks.forEach((block) => {
    block.removeEventListener('click', () => {}, { once: true });
  });
  const currPlayer = currentPlayer;
  if (status === 'winner') {
    document.getElementById('end').innerHTML = `Player ${currentPlayer.number} wins!`;
    currPlayer.wins += 1;
    document.getElementById(`player${currentPlayer.number}-wins`).innerHTML = currentPlayer.wins;
  } else {
    document.getElementById('end').innerHTML = 'It\'s a draw!';
  }
  document.getElementById('end').style.display = 'block';
  document.getElementById('board').style.display = 'none';
  console.log('Setting timeout & calling function Nextgame()');
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
  console.log(`FUNCTION PLAY() is called for Player ${currTurn}`);
  availableBlocks.forEach((block) => {
    block.addEventListener('click', () => {
      if (currTurn === 1) {
        currentPlayer = player1;
        nextPlayer = player2;
        nextTurn = 2;
        console.log(`Current player is ${currentPlayer.number} (should be 1) - Next player is ${nextPlayer.number} (should be 2)`);
      } else {
        currentPlayer = player2;
        nextPlayer = player1;
        nextTurn = 1;
        console.log(`Current player is ${currentPlayer.number} (should be 2) - Next player is ${nextPlayer.number} (should be 1)`);
      }
      console.log(`Block ${block.id} has been clicked on`);
      updateVisual(currTurn, block, currentPlayer, nextTurn);
      updateData(currTurn, Number(block.id), currentPlayer, nextPlayer);

      let status = 'No winner yet';
      console.log(`Back in FUNCTION PLAY() - Current player has played ${currentPlayer.played.length} times.`);
      if (currentPlayer.played.length >= 3) {
        console.log('It is >= 3, we are going to check if there is a win.');
        status = winCheck(currentPlayer);
        if (status === 'winner') {
          console.log(`Status is "${status}" (should be winner)`);
          endGame(status, currentPlayer);
        } else if (status !== 'winner' && currentPlayer.played.length === 5) {
          console.log(`Status is "${status}" (should be "No winner yet") and player played ${currentPlayer.played.length} times (should be 5) => It's a draw, we are ending the game.`);
          endGame(status, currentPlayer);
        } else {
          console.log(`Status is "${status}" (should be "No winner yet") and player played
          ${currentPlayer.played.length} times (should not be 5). Player ${currTurn} just played, now it's player ${nextTurn}'s turn`);
          currTurn = nextTurn;
          console.log(`currTurn is now: ${currTurn}`);
        }
      } else {
        console.log('It is less than 3 => we are moving to the next player without checking if there is a win.');
        currTurn = nextTurn;
        console.log('=====================================');
        console.log(`IT IS NOW PLAYER'S ${currTurn} TURN.`);
      }
      console.log(`Waiting for next click by ${currTurn}`);
      // console.info(playedBy1, playedBy2);
    },
    { once: true },
    );
  });
}

document.getElementById('reset').addEventListener('click', () => {
  reset();
});
