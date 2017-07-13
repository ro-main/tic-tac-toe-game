/* eslint-env browser */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

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

function updateOtherPlayerPossibleWins(OtherPlayer, lastMove) {
  console.log('FUNCTION UPDATE_OTHER_PLAYER_POSSIBLE_WINS()');
  const currMove = Number(lastMove);
  let stringifiedPossibleWins = '';
  const newPossibleWins = [];
  let stringifiedNewPossibleWins = '';
  let i;
  // for loop is only used for console log
  for (i = 0; i < OtherPlayer.possibleWins.length; i += 1) {
    stringifiedPossibleWins += `[${OtherPlayer.possibleWins[i]}] `;
  }
  console.log(`Other player is ${OtherPlayer.number} and his possible wins (before this move) are: ${stringifiedPossibleWins}`);
  console.log(`Last move is block ${currMove}`);
  console.log('Checking in each possible win if last move is present');
  OtherPlayer.possibleWins.forEach((e) => {
    console.log(`"e: "${e}, lastmove: ${currMove}`);
    if (!e.includes(currMove)) {
      console.log(`Checking if last move, ${currMove}, is in [${e}] => No, we keep it.`);
      newPossibleWins.push(e);
    } else {
      console.log(`Checking if last move, ${currMove}, is in [${e}] => Yes, we discard it.`);
    }
  });
  let f;
  for (f = 0; f < newPossibleWins.length; f += 1) {
    stringifiedNewPossibleWins += `[${newPossibleWins[f]}]`;
  }
  console.log(`Updated list of the other player possible wins: ${stringifiedNewPossibleWins}`);
  return newPossibleWins;
}

function winCheck(currentPlayer) {
  console.log('FUNCTION WIN_CHECK()');
  const joueur = currentPlayer;
  let yes;
  console.log(`Checking if the blocks played ${joueur.played} can match a win combination within the ${joueur.possibleWins.length} possible wins`);
  // we are going to check each possible wins until we find one matching the played ones
  let k;
  for (k = 0; k < joueur.possibleWins.length; k += 1) {
    console.log(`Checking possible wins option number ${k + 1}/${joueur.possibleWins.length}: ${joueur.possibleWins[k]}`);
    // we check if we find each
    yes = 0;
    let l;
    for (l = 0; l < joueur.played.length; l += 1) {
      console.log(`Checking if ${joueur.played[l]} (played in ${l + 1}/${joueur.played.length} position), is in ${joueur.possibleWins[k]}`);
      console.log(joueur.possibleWins[k].indexOf(joueur.played[Number(l)]));
      if (joueur.possibleWins[k].indexOf(joueur.played[Number(l)]) !== -1) {
        yes += 1;
        console.log(`Yes it is! We have ${yes} match in ${joueur.possibleWins[k]}`);
      } else {
        console.log('Nope it is not in it');
      }

      if (yes === 3) {
        console.log('We have a winner!');
        return 'winner';
      }
      console.log('End of loop on played for the current possible wins');
    }
  }
  console.log('End of loop on possible wins. No winner');
  return 'No winner yet. Let\'s keep play';
}

function updateVisual(turn, block, currentPlayer, nextTurn) {
  const currBlock = block;
  console.log('FUNCTION UPDATEVISUAL()');
  currBlock.className = `block , ${currentPlayer.color}`;
  console.log(`Adding the current PLayer's color (number ${currentPlayer.number}) to block ${block.id}`);
  document.getElementById('turn').innerHTML = `Player ${nextTurn}`;
  console.log(`Modifying the turn in the interface from ${currentPlayer.number} to ${nextTurn}`);
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

function reset() {
  console.log('FUNCTION RESET()');
  const blocks = document.querySelectorAll('div.block');
  blocks.forEach((block) => {
    const currBlock = block;
    currBlock.className = 'block available';
  });
  console.log('setting blocks class to block available');
  player1.possibleWins = winCombinations;
  player2.possibleWins = winCombinations;
  console.log('reset players possible wins');
  player1.played = [];
  player2.played = [];
  console.log('reset players played moves');
  document.getElementById('end').style.display = 'none';
  document.getElementById('board').style.display = 'block';
  document.getElementById('turn').innerHTML = 'Player 1';
  console.log('hide the banner and displayer the board');
  console.log('show that it\'s player 1 turn');
}

function end(status, currentPlayer) {
  const currPlayer = currentPlayer;
  if (status) {
    document.getElementById('end').innerHTML = `Player ${currentPlayer.number} wins!`;
    currPlayer.wins += 1;
    document.getElementById(`player${currentPlayer.number}-wins`).innerHTML = currentPlayer.wins;
  } else {
    document.getElementById('end').innerHTML = 'It\'s a draw!';
  }
  document.getElementById('end').style.display = 'block';
  document.getElementById('board').style.display = 'none';
  setTimeout(() => {
    reset();
  }, 3000);
}

function play(turn) {
  let nextTurn;
  let currentPlayer = {};
  let nextPlayer = {};
  const blocks = document.querySelectorAll('div.available');
  console.log(`FUNCTION PLAY() is called for Player ${turn}`);
  blocks.forEach((block) => {
    block.addEventListener('click', () => {
      if (turn === 1) {
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
      updateVisual(turn, block, currentPlayer, nextTurn);
      updateData(turn, Number(block.id), currentPlayer, nextPlayer);

      let status = 'no winner yet';
      console.log(`Back in FUNCTION PLAY() - Current player has played ${currentPlayer.played.length} times.`);
      if (currentPlayer.played.length >= 3 && currentPlayer.played.length <= 5) {
        console.log('It is between 3 and 5 => we are going to check if there is a win.');
        status = winCheck(currentPlayer);
        if (status === 'winner') {
          end(status, currentPlayer);
        } else {
          turn = nextTurn;
        }
      } else if (currentPlayer.played.length === 5) {
        console.log('It is equal to 5 => We are ending the game.');
        end(status, currentPlayer);
      } else {
        console.log('It is less than 3 => we are moving to the next player without checking if there is a win.');
        turn = nextTurn;
        console.log('=====================================');
        console.log(`IT IS NOW PLAYER'S ${turn} TURN.`);
      }
      // console.info(playedBy1, playedBy2);
    },
    { once: true },
    );
  });
}

document.getElementById('reset').addEventListener('click', () => {
  reset();
  play(1);
});
