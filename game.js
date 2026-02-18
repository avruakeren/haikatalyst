const board = document.getElementById('board');
const rollBtn = document.getElementById('rollBtn');
const dice = document.getElementById('dice');
const info = document.getElementById('info');
const lastRoll = document.getElementById('lastRoll');
const leaderText = document.getElementById('leaderText');
const progressFill = document.getElementById('progressFill');
const logList = document.getElementById('logList');

const startPopup = document.getElementById('startPopup');
const startBtn = document.getElementById('startBtn');
const playerSelect = document.getElementById('playerSelect');
const playerSelectTrigger = document.getElementById('playerSelectTrigger');
const playerSelectMenu = document.getElementById('playerSelectMenu');
const playerSelectLabel = document.getElementById('playerSelectLabel');
const modeOptions = [...document.querySelectorAll('.mode-option')];

const instructionPopup = document.getElementById('instructionPopup');
const instructionText = document.getElementById('instructionText');
const instructionMove = document.getElementById('instructionMove');
const saveInstruction = document.getElementById('saveInstruction');
const closeInstruction = document.getElementById('closeInstruction');

const customPopup = document.getElementById('customPopup');
const popupMessage = document.getElementById('popupMessage');
const popupOk = document.getElementById('popupOk');

const openTutorial = document.getElementById('openTutorial');
const tutorialPopup = document.getElementById('tutorialPopup');
const closeTutorial = document.getElementById('closeTutorial');

const randomBoostBtn = document.getElementById('randomBoost');
const winPopup = document.getElementById('winPopup');
const winText = document.getElementById('winText');
const restartBtn = document.getElementById('restartBtn');

let pendingPlayer = null;
let pendingMove = 0;

const totalBlocks = 100;
const colors = ['#ff5d73', '#ffd166', '#06d6a0', '#6ecbff', '#b694ff', '#4d3051', '#ff9f5f'];
let players = [];
let currentPlayer = 0;
let gameFinished = false;

const blockInstructions = {};
let activeBlock = null;
let lastActiveBlock = null;
let gameMode = 'plain';
let hazardBlocks = {};

function setupPlayerSelect() {
  if (!playerSelect || !playerSelectTrigger || !playerSelectMenu || !playerSelectLabel) return;

  const options = [...playerSelectMenu.querySelectorAll('.player-option')];

  const closeMenu = () => {
    playerSelect.classList.remove('open');
    playerSelectMenu.classList.add('hidden');
    playerSelectTrigger.setAttribute('aria-expanded', 'false');
  };

  const selectValue = (value) => {
    const activeOption = options.find((option) => option.dataset.value === String(value));
    if (!activeOption) return;

    options.forEach((option) => {
      const isSelected = option === activeOption;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-selected', String(isSelected));
    });

    playerSelect.dataset.value = activeOption.dataset.value;
    playerSelectLabel.textContent = activeOption.textContent;
    closeMenu();
  };

  playerSelectTrigger.addEventListener('click', () => {
    const isOpen = playerSelect.classList.toggle('open');
    playerSelectMenu.classList.toggle('hidden', !isOpen);
    playerSelectTrigger.setAttribute('aria-expanded', String(isOpen));
  });

  options.forEach((option) => {
    option.addEventListener('click', () => selectValue(option.dataset.value));
  });

  document.addEventListener('click', (event) => {
    if (!playerSelect.contains(event.target)) {
      closeMenu();
    }
  });
}


function setupModeSelect() {
  if (!modeOptions.length) return;

  const selectMode = (mode) => {
    gameMode = mode;
    modeOptions.forEach((option) => {
      const isSelected = option.dataset.mode === mode;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-pressed', String(isSelected));
    });
  };

  modeOptions.forEach((option) => {
    option.addEventListener('click', () => selectMode(option.dataset.mode));
  });

  selectMode(gameMode);
}

function generateHazardBlocks() {
  hazardBlocks = {};
  if (gameMode !== 'hazard') return;

  const hazardCount = 12;
  const used = new Set();

  while (Object.keys(hazardBlocks).length < hazardCount) {
    const pos = Math.floor(Math.random() * 88) + 10;
    if (used.has(pos)) continue;

    used.add(pos);
    const backSteps = -(Math.floor(Math.random() * 5) + 2);
    hazardBlocks[pos] = backSteps;
  }
}

function paintSpecialBlocks() {
  Array.from(board.querySelectorAll('.block')).forEach((block) => {
    block.classList.remove('hazard-block');
    const oldTag = block.querySelector('.hazard-tag');
    if (oldTag) oldTag.remove();
  });

  Object.entries(hazardBlocks).forEach(([position, move]) => {
    const block = document.getElementById(`block-${position}`);
    if (!block) return;

    block.classList.add('hazard-block');
    const tag = document.createElement('span');
    tag.className = 'hazard-tag';
    tag.textContent = `⚠ ${move}`;
    block.appendChild(tag);
  });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function addLog(message) {
  const item = document.createElement('li');
  item.textContent = message;
  logList.prepend(item);
  while (logList.children.length > 8) {
    logList.removeChild(logList.lastChild);
  }
}

function createBoard() {
  board.innerHTML = '';
  for (let row = 0; row < 10; row++) {
    const from = row * 10 + 1;
    const sequence = Array.from({ length: 10 }, (_, idx) => from + idx);
    const visualRow = row % 2 === 0 ? sequence : sequence.reverse();

    visualRow.forEach((num) => {
      const block = document.createElement('button');
      block.type = 'button';
      block.className = 'block';
      block.id = `block-${num}`;
      block.textContent = num;
      block.addEventListener('click', () => openInstructionEditor(num));
      board.appendChild(block);
    });
  }
}

function openInstructionEditor(num) {
  if (!players.length || gameFinished) return;

  activeBlock = num;
  const data = blockInstructions[num];
  instructionText.value = data ? data.text : '';
  instructionMove.value = data ? data.move : '';
  instructionPopup.classList.remove('hidden');
}

saveInstruction.onclick = () => {
  const text = instructionText.value.trim();
  const move = Number(instructionMove.value || 0);

  if (!text) {
    delete blockInstructions[activeBlock];
    document.getElementById(`block-${activeBlock}`).classList.remove('has-instruction');
    addLog(`Instruksi blok ${activeBlock} dihapus.`);
  } else {
    blockInstructions[activeBlock] = { text, move };
    document.getElementById(`block-${activeBlock}`).classList.add('has-instruction');
    addLog(`Blok ${activeBlock} di-set: "${text}" (${move >= 0 ? '+' : ''}${move})`);
  }

  instructionPopup.classList.add('hidden');
};

closeInstruction.onclick = () => instructionPopup.classList.add('hidden');
openTutorial.onclick = () => tutorialPopup.classList.remove('hidden');
closeTutorial.onclick = () => tutorialPopup.classList.add('hidden');

function initPlayers(count) {
  players = [];
  currentPlayer = 0;
  gameFinished = false;

  Array.from(board.querySelectorAll('.pawn')).forEach((pawn) => pawn.remove());

  for (let i = 0; i < count; i++) {
    const pawn = document.createElement('div');
    pawn.className = 'pawn';
    pawn.style.background = colors[i];
    board.appendChild(pawn);

    players.push({ index: i, position: 1, el: pawn, label: `Pemain ${i + 1}` });
    updatePawn(players[i]);
  }

  generateHazardBlocks();
  paintSpecialBlocks();

  updateLeader();
  updateProgress();
  updateTurnInfo();
  addLog(`Game dimulai dengan ${count} pemain (${gameMode === 'hazard' ? 'Mode Gangguan Acak' : 'Mode Polos'}).`);
  if (gameMode === 'hazard') {
    addLog('Blok berbahaya ditandai ikon ⚠ di papan.');
  }
}

function updateTurnInfo() {
  info.textContent = `Giliran ${players[currentPlayer].label}`;
}

function updateLeader() {
  const leader = [...players].sort((a, b) => b.position - a.position)[0];
  leaderText.textContent = `${leader.label} (blok ${leader.position})`;
}

function updateProgress() {
  const maxPos = Math.max(...players.map((p) => p.position));
  const progress = Math.max(1, Math.round((maxPos / totalBlocks) * 100));
  progressFill.style.width = `${progress}%`;
}

function updatePawn(player) {
  const block = document.getElementById(`block-${player.position}`);
  const rectBoard = board.getBoundingClientRect();
  const rectBlock = block.getBoundingClientRect();

  const ringRadius = 11;
  const angle = (Math.PI * 2 * player.index) / players.length;
  const offsetX = Math.cos(angle) * ringRadius;
  const offsetY = Math.sin(angle) * ringRadius;

  player.el.style.left = `${rectBlock.left - rectBoard.left + rectBlock.width / 2 - 7 + offsetX}px`;
  player.el.style.top = `${rectBlock.top - rectBoard.top + rectBlock.height / 2 - 7 + offsetY}px`;
}

function burstAtBlock(position, color = '#ffffff') {
  const block = document.getElementById(`block-${position}`);
  const rectBoard = board.getBoundingClientRect();
  const rectBlock = block.getBoundingClientRect();
  const centerX = rectBlock.left - rectBoard.left + rectBlock.width / 2;
  const centerY = rectBlock.top - rectBoard.top + rectBlock.height / 2;

  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.background = color;
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 42}px`);
    particle.style.setProperty('--dy', `${(Math.random() - 0.5) * 42}px`);

    board.appendChild(particle);
    setTimeout(() => particle.remove(), 620);
  }
}

async function animateDiceRoll() {
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  for (let i = 0; i < 8; i++) {
    dice.textContent = faces[Math.floor(Math.random() * 6)];
    await wait(70);
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  dice.textContent = faces[roll - 1];
  lastRoll.textContent = `Roll terakhir: ${roll}`;
  return roll;
}

async function movePlayer(player, steps) {
  let moved = 0;

  while (moved < steps && player.position < totalBlocks) {
    player.position++;
    updatePawn(player);
    burstAtBlock(player.position, colors[player.index]);
    moved++;
    await wait(170);
  }

  handleBlock(player);
}

function showCustomPopup(message, player, move) {
  popupMessage.textContent = message;
  pendingPlayer = player;
  pendingMove = move;
  customPopup.classList.remove('hidden');
}

popupOk.onclick = () => {
  if (pendingPlayer) {
    pendingPlayer.position += pendingMove;
    pendingPlayer.position = Math.max(1, Math.min(totalBlocks, pendingPlayer.position));

    updatePawn(pendingPlayer);
    updateLeader();
    updateProgress();

    burstAtBlock(pendingPlayer.position, colors[pendingPlayer.index]);
    addLog(`${pendingPlayer.label} kena efek ${pendingMove >= 0 ? '+' : ''}${pendingMove}.`);
  }

  pendingPlayer = null;
  pendingMove = 0;
  customPopup.classList.add('hidden');

  if (!checkWinner()) {
    nextTurn();
  }
};

function handleBlock(player) {
  const block = document.getElementById(`block-${player.position}`);

  player.el.classList.add('bounce');
  setTimeout(() => player.el.classList.remove('bounce'), 350);

  if (lastActiveBlock) lastActiveBlock.classList.remove('active-block');
  block.classList.add('active-block');
  lastActiveBlock = block;

  updateLeader();
  updateProgress();

  if (checkWinner()) return;

 const hazardMove = hazardBlocks[player.position];
  if (hazardMove) {
    player.el.classList.add('shake');
    setTimeout(() => player.el.classList.remove('shake'), 320);
    addLog(`${player.label} kena gangguan di blok ${player.position}: mundur ${Math.abs(hazardMove)} langkah.`);
    showCustomPopup(`⚠ Blok berbahaya! ${player.label} harus mundur ${Math.abs(hazardMove)} langkah.`, player, hazardMove);
    return;
  }

  const data = blockInstructions[player.position];
  if (data) {
    player.el.classList.add('shake');
    setTimeout(() => player.el.classList.remove('shake'), 320);
    addLog(`${player.label} mendarat di blok ${player.position}: ${data.text}`);
    showCustomPopup(`${data.text} (Efek langkah: ${data.move >= 0 ? '+' : ''}${data.move})`, player, data.move);
  } else {
    addLog(`${player.label} berhenti di blok ${player.position}.`);
    nextTurn();
  }
}

function nextTurn() {
  currentPlayer = (currentPlayer + 1) % players.length;
  updateTurnInfo();
  rollBtn.disabled = false;
}

function checkWinner() {
  const winner = players.find((p) => p.position >= totalBlocks);
  if (!winner) return false;

  gameFinished = true;
  rollBtn.disabled = true;
  winText.textContent = `🏆 ${winner.label} Menang!`;
  winPopup.classList.remove('hidden');
  addLog(`${winner.label} memenangkan permainan!`);
  burstAtBlock(totalBlocks, '#ffffff');
  return true;
}

rollBtn.onclick = async () => {
  if (gameFinished) return;

  rollBtn.disabled = true;
  const player = players[currentPlayer];
  const roll = await animateDiceRoll();
  addLog(`${player.label} roll ${roll}.`);
  await movePlayer(player, roll);
};

startBtn.onclick = () => {
  initPlayers(Number(playerSelect?.dataset.value || 2));
  startPopup.classList.add('hidden');
  rollBtn.disabled = false;
};

restartBtn.onclick = () => window.location.reload();

window.addEventListener('resize', () => {
  players.forEach(updatePawn);
});

createBoard();
setupPlayerSelect();
setupModeSelect();