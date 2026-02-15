const board = document.getElementById("board");
const rollBtn = document.getElementById("rollBtn");
const dice = document.getElementById("dice");
const info = document.getElementById("info");

const startPopup = document.getElementById("startPopup");
const startBtn = document.getElementById("startBtn");
const playerCountSelect = document.getElementById("playerCount");

const instructionPopup = document.getElementById("instructionPopup");
const instructionText = document.getElementById("instructionText");
const instructionMove = document.getElementById("instructionMove");
const saveInstruction = document.getElementById("saveInstruction");
const closeInstruction = document.getElementById("closeInstruction");
const customPopup = document.getElementById("customPopup");
const popupMessage = document.getElementById("popupMessage");
const popupOk = document.getElementById("popupOk");
const openTutorial = document.getElementById("openTutorial");
const tutorialPopup = document.getElementById("tutorialPopup");
const closeTutorial = document.getElementById("closeTutorial");


let pendingPlayer = null;
let pendingMove = 0;

const totalBlocks = 100;
let players = [];
let currentPlayer = 0;

const blockInstructions = {};
let activeBlock = null;
let lastActiveBlock = null;


/* BOARD */
for (let i = 1; i <= totalBlocks; i++) {
  const block = document.createElement("div");
  block.className = "block";
  block.id = `block-${i}`;
  block.innerText = i;

  block.onclick = () => openInstructionEditor(i);

  board.appendChild(block);
}

/* START */
startBtn.onclick = () => {
  initPlayers(Number(playerCountSelect.value));
  startPopup.style.display = "none";
  info.innerText = "Giliran Pemain 1";
  rollBtn.disabled = false;
};

/* INSTRUCTION POPUP */
function openInstructionEditor(num) {
  activeBlock = num;
  const data = blockInstructions[num];
  instructionText.value = data ? data.text : "";
  instructionMove.value = data ? data.move : "";
  instructionPopup.classList.remove("hidden");
}

closeInstruction.onclick = () => {
  instructionPopup.classList.add("hidden");
};

saveInstruction.onclick = () => {
  blockInstructions[activeBlock] = {
    text: instructionText.value,
    move: Number(instructionMove.value)
  };
  instructionPopup.classList.add("hidden");
};

/* PLAYER */
function initPlayers(count) {
  players = [];
  for (let i = 0; i < count; i++) {
    const pawn = document.createElement("div");
    pawn.className = "pawn";
    pawn.style.background = ["red","yellow","lime","cyan"][i];
    board.appendChild(pawn);

    players.push({ index: i, position: 1, el: pawn });
    updatePawn(players[i]);
  }
}

/* ROLL */
rollBtn.onclick = () => {
  rollBtn.disabled = true;
  const roll = Math.floor(Math.random() * 6) + 1;
  dice.innerText = roll;
  movePlayer(players[currentPlayer], roll);
};

/* MOVE */
function movePlayer(player, steps) {
  let moved = 0;
  const interval = setInterval(() => {
    if (player.position < totalBlocks) {
      player.position++;
      updatePawn(player);
    }
    moved++;
    if (moved === steps) {
      clearInterval(interval);
      handleBlock(player);
    }
  }, 280);
}

function handleBlock(player) {
  const block = document.getElementById(`block-${player.position}`);

  player.el.classList.add("bounce");

  setTimeout(() => {
    player.el.classList.remove("bounce");
  }, 350);

  if (lastActiveBlock) {
    lastActiveBlock.classList.remove("active-block");
  }

  block.classList.add("active-block");
  lastActiveBlock = block;

  const data = blockInstructions[player.position];
  if (data) {
    player.el.classList.add("shake");

    setTimeout(() => {
      player.el.classList.remove("shake");
    }, 300);
  }

  if (lastActiveBlock) {
    lastActiveBlock.classList.remove("active-block");
  }

  block.classList.add("active-block");
  lastActiveBlock = block;

  if (data) {
    showCustomPopup(data.text, player, data.move);
  } else {
    nextTurn();
  }
}

function nextTurn() {
  currentPlayer = (currentPlayer + 1) % players.length;
  info.innerText = `Giliran Pemain ${currentPlayer + 1}`;
  rollBtn.disabled = false;
}

function updatePawn(player) {
  const block = document.getElementById(`block-${player.position}`);
  const offset = player.index * 12;
  player.el.style.left = block.offsetLeft + offset + "px";
  player.el.style.top = block.offsetTop + offset + "px";
}

function showCustomPopup(message, player, move) {
  popupMessage.innerText = message;
  pendingPlayer = player;
  pendingMove = move;
  customPopup.classList.remove("hidden");
}

popupOk.onclick = () => {
  if (pendingPlayer) {
    pendingPlayer.position += pendingMove;

    if (pendingPlayer.position < 1) pendingPlayer.position = 1;
    if (pendingPlayer.position > totalBlocks) pendingPlayer.position = totalBlocks;

    updatePawn(pendingPlayer);
  }

  pendingPlayer = null;
  pendingMove = 0;

  customPopup.classList.add("hidden");
  nextTurn();
};

openTutorial.onclick = () => {
  tutorialPopup.classList.remove("hidden");
};

closeTutorial.onclick = () => {
  tutorialPopup.classList.add("hidden");
};