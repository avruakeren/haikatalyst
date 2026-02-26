const TOTAL_QUESTIONS_PER_PLAY = 5;

const questionBank = [
  { pattern: 'SPO', answer: 'Rina membaca buku', hint: 'S = pelaku, P = kegiatan, O = objek.', words: ['buku', 'Rina', 'membaca'] },
  { pattern: 'SPOK', answer: 'Budi menulis surat di rumah', hint: 'Tambahkan keterangan tempat di akhir.', words: ['di rumah', 'surat', 'menulis', 'Budi'] },
  { pattern: 'SPO', answer: 'Andi menendang bola', hint: 'Kalimat aksi sederhana.', words: ['Andi', 'bola', 'menendang'] },
  { pattern: 'SPOK', answer: 'Sinta menyapu lantai setiap pagi', hint: 'Keterangan waktu diletakkan di akhir.', words: ['setiap pagi', 'Sinta', 'menyapu', 'lantai'] },
  { pattern: 'SPOK', answer: 'Kami belajar matematika di kelas', hint: 'Keterangan tempat: di kelas.', words: ['matematika', 'Kami', 'belajar', 'di kelas'] },
  { pattern: 'SPO', answer: 'Ibu memasak sayur', hint: 'SPO tanpa keterangan.', words: ['sayur', 'Ibu', 'memasak'] },
  { pattern: 'SPO', answer: 'Dina menggambar pemandangan', hint: 'Objeknya adalah gambar yang dibuat.', words: ['pemandangan', 'Dina', 'menggambar'] },
  { pattern: 'SPOK', answer: 'Ayah memperbaiki sepeda di garasi', hint: 'Keterangan tempat: di garasi.', words: ['sepeda', 'Ayah', 'memperbaiki', 'di garasi'] },
  { pattern: 'SPOK', answer: 'Mereka bermain kasti di lapangan', hint: 'Keterangan tempat: di lapangan.', words: ['di lapangan', 'Mereka', 'bermain', 'kasti'] },
  { pattern: 'SPO', answer: 'Lani membawa bekal', hint: 'Objeknya benda yang dibawa.', words: ['membawa', 'Lani', 'bekal'] },
  { pattern: 'SPOK', answer: 'Tono menyiram tanaman sore hari', hint: 'Keterangan waktu: sore hari.', words: ['tanaman', 'Tono', 'sore hari', 'menyiram'] },
  { pattern: 'SPO', answer: 'Nina mencuci piring', hint: 'Aktivitas membantu di rumah.', words: ['piring', 'Nina', 'mencuci'] },
  { pattern: 'SPOK', answer: 'Rudi membaca komik di perpustakaan', hint: 'Keterangan tempat: di perpustakaan.', words: ['komik', 'Rudi', 'di perpustakaan', 'membaca'] },
  { pattern: 'SPO', answer: 'Kakak merapikan kamar', hint: 'Objeknya bagian rumah.', words: ['kamar', 'Kakak', 'merapikan'] },
  { pattern: 'SPOK', answer: 'Siswa mengerjakan tugas di kelas', hint: 'Ada keterangan tempat di akhir.', words: ['di kelas', 'Siswa', 'mengerjakan', 'tugas'] }
];

const dropZone = document.getElementById('dropZone');
const wordBank = document.getElementById('wordBank');
const patternTarget = document.getElementById('patternTarget');
const hintText = document.getElementById('hintText');
const feedback = document.getElementById('feedback');
const levelText = document.getElementById('levelText');
const scoreText = document.getElementById('scoreText');
const livesText = document.getElementById('livesText');
const finishPopup = document.getElementById('finishPopup');
const finishMessage = document.getElementById('finishMessage');
const checkBtn = document.getElementById('checkBtn');
const skipBtn = document.getElementById('skipBtn');

let questions = [];
let level = 0;
let score = 0;
let lives = 3;
let draggedId = null;

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateQuestions() {
  questions = shuffle(questionBank).slice(0, TOTAL_QUESTIONS_PER_PLAY);
}

function createChip(text, index) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'word-chip';
  chip.draggable = true;
  chip.textContent = text;
  chip.dataset.id = `${text}-${index}-${Math.random().toString(16).slice(2)}`;

  chip.addEventListener('dragstart', () => {
    draggedId = chip.dataset.id;
  });

  chip.addEventListener('dragend', () => {
    draggedId = null;
  });

  return chip;
}

function refreshDropZoneState() {
  dropZone.classList.toggle('empty', dropZone.children.length === 0);
}

function updateStats() {
  levelText.textContent = `${Math.min(level + 1, questions.length)} / ${questions.length}`;
  scoreText.textContent = score;
  livesText.textContent = lives;
}

function showFinishPopup() {
  finishMessage.textContent = `Kerja bagus! Kamu menyelesaikan ${questions.length} soal dengan skor akhir ${score}.`;
  finishPopup.classList.remove('hidden');
}

function renderQuestion() {
  if (level >= questions.length) {
    wordBank.innerHTML = '';
    dropZone.innerHTML = '';
    refreshDropZoneState();
    feedback.textContent = '';
    showFinishPopup();
    return;
  }

  const question = questions[level];
  patternTarget.textContent = `Pola: ${question.pattern}`;
  hintText.textContent = `Hint: ${question.hint}`;
  wordBank.innerHTML = '';
  dropZone.innerHTML = '';
  feedback.textContent = '';
  feedback.className = '';

  shuffle(question.words).forEach((word, index) => {
    wordBank.appendChild(createChip(word, index));
  });

  refreshDropZoneState();
  updateStats();
}

function findChipById(id) {
  return document.querySelector(`.word-chip[data-id="${id}"]`);
}

function handleDrop(targetContainer) {
  if (!draggedId) return;
  const chip = findChipById(draggedId);
  if (!chip) return;
  targetContainer.appendChild(chip);
  refreshDropZoneState();
}

[dropZone, wordBank].forEach((container) => {
  container.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  container.addEventListener('drop', (event) => {
    event.preventDefault();
    handleDrop(container);
  });
});

checkBtn.addEventListener('click', () => {
  if (level >= questions.length) return;

  const userSentence = Array.from(dropZone.querySelectorAll('.word-chip'))
    .map((chip) => chip.textContent)
    .join(' ')
    .trim();

  const expected = questions[level].answer;

  if (userSentence === expected) {
    score += 20;
    feedback.textContent = 'Benar! Lanjut ke level berikutnya.';
    feedback.className = 'success';
    level += 1;
    setTimeout(renderQuestion, 700);
  } else {
    lives -= 1;
    feedback.textContent = 'Belum tepat, coba lagi ya.';
    feedback.className = 'error';
    updateStats();

    if (lives <= 0) {
      checkBtn.disabled = true;
      skipBtn.disabled = true;
      finishMessage.textContent = `Nyawa habis. Skor akhir kamu ${score}. Coba ulang lagi ya!`;
      finishPopup.classList.remove('hidden');
    }
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (level >= questions.length) return;
  Array.from(dropZone.querySelectorAll('.word-chip')).forEach((chip) => wordBank.appendChild(chip));
  refreshDropZoneState();
  feedback.textContent = 'Susunan direset, ayo coba lagi.';
  feedback.className = '';
});

skipBtn.addEventListener('click', () => {
  if (level >= questions.length) return;
  lives -= 1;
  level += 1;
  feedback.textContent = 'Soal dilewati. Nyawa berkurang 1.';
  feedback.className = 'error';
  updateStats();

  if (lives <= 0) {
    checkBtn.disabled = true;
    skipBtn.disabled = true;
    finishMessage.textContent = `Nyawa habis. Skor akhir kamu ${score}. Coba ulang lagi ya!`;
    finishPopup.classList.remove('hidden');
    return;
  }

  setTimeout(renderQuestion, 600);
});

document.getElementById('playAgainBtn').addEventListener('click', () => {
  window.location.reload();
});

generateQuestions();
renderQuestion();