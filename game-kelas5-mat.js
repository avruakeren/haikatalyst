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
const lengthOptions = [...document.querySelectorAll('.length-option')];
const autoQuestionToggle = document.getElementById('autoQuestionToggle');

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
const openSetupGuide = document.getElementById('openSetupGuide');
const setupGuidePopup = document.getElementById('setupGuidePopup');
const closeSetupGuide = document.getElementById('closeSetupGuide');

const randomBoostBtn = document.getElementById('randomBoost');
const winPopup = document.getElementById('winPopup');
const winText = document.getElementById('winText');
const restartBtn = document.getElementById('restartBtn');

let pendingPlayer = null;
let pendingMove = 0;

let totalBlocks = 100;
const colors = ['#ff5d73', '#ffd166', '#06d6a0', '#6ecbff', '#b694ff', '#4d3051', '#ff9f5f'];
let players = [];
let currentPlayer = 0;
let gameFinished = false;

const blockInstructions = {};
let activeBlock = null;
let lastActiveBlock = null;
let gameMode = 'plain';
let gameLengthMode = '100';
let hazardBlocks = {};
let autoGenerateQuestions = false;
let autoQuestionBlocks = {};

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

function setupAutoQuestionToggle() {
  if (!autoQuestionToggle) return;

  autoGenerateQuestions = autoQuestionToggle.checked;
  autoQuestionToggle.addEventListener('change', (event) => {
    autoGenerateQuestions = event.target.checked;
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

function setupLengthSelect() {
  if (!lengthOptions.length) return;

  const selectLength = (lengthMode) => {
    gameLengthMode = lengthMode;
    totalBlocks = Number(lengthMode);

    lengthOptions.forEach((option) => {
      const isSelected = option.dataset.length === lengthMode;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-pressed', String(isSelected));
    });
  };

  lengthOptions.forEach((option) => {
    option.addEventListener('click', () => selectLength(option.dataset.length));
  });

  selectLength(gameLengthMode);
}

// ============================================================
// SISTEM SOAL INTERAKTIF - BILANGAN CACAH KELAS 5 SD
// Tipe: pilihan ganda, tebak angka, susun nilai tempat,
//       timbangan bilangan, soal uang/kembalian
// ============================================================

function angkaDalamKata(n) {
  const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan',
    'sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas',
    'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  const puluhan = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh',
    'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
  if (n === 0) return 'nol';
  if (n < 20) return satuan[n];
  if (n < 100) return puluhan[Math.floor(n / 10)] + (n % 10 ? ' ' + satuan[n % 10] : '');
  if (n < 200) return 'seratus' + (n % 100 ? ' ' + angkaDalamKata(n % 100) : '');
  if (n < 1000) return satuan[Math.floor(n / 100)] + ' ratus' + (n % 100 ? ' ' + angkaDalamKata(n % 100) : '');
  if (n < 2000) return 'seribu' + (n % 1000 ? ' ' + angkaDalamKata(n % 1000) : '');
  if (n < 1000000) {
    const ribuan = Math.floor(n / 1000);
    const sisa = n % 1000;
    return angkaDalamKata(ribuan) + ' ribu' + (sisa ? ' ' + angkaDalamKata(sisa) : '');
  }
  return n.toLocaleString('id-ID');
}

// Inject shared quiz styles sekali saja
(function injectQuizStyles() {
  if (document.getElementById('quizStyles')) return;
  const s = document.createElement('style');
  s.id = 'quizStyles';
  s.textContent = `
    @keyframes quizPop { from{transform:scale(0.82) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
    @keyframes shakeEl { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
    @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
    @keyframes bounceIn { 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
    .qoverlay {
      position:fixed;inset:0;background:rgba(0,0,0,0.72);
      display:flex;align-items:center;justify-content:center;
      z-index:9999;font-family:inherit;padding:12px;box-sizing:border-box;
    }
    .qbox {
      background:#16162a;border-radius:22px;padding:22px 20px 18px;
      max-width:460px;width:100%;box-shadow:0 16px 60px rgba(0,0,0,0.7);
      animation:quizPop 0.28s cubic-bezier(.34,1.3,.64,1);
      max-height:92vh;overflow-y:auto;
    }
    .qheader {
      display:flex;align-items:center;gap:10px;margin-bottom:14px;
      padding-bottom:12px;border-bottom:1px solid #252540;
    }
    .qemoji{font-size:30px;line-height:1;flex-shrink:0;}
    .qtipe{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;}
    .qrule{font-size:11px;color:#555;margin-top:3px;}
    .qsoal{font-size:15px;font-weight:700;color:#eee;line-height:1.6;margin-bottom:16px;white-space:pre-line;}
    /* PILIHAN GANDA */
    .qchoice{
      display:block;width:100%;text-align:left;
      padding:11px 15px;margin:5px 0;border-radius:13px;
      border:2px solid #252540;background:#1e1e38;color:#ccc;
      font-size:14px;cursor:pointer;transition:all 0.15s;font-family:inherit;
    }
    .qchoice:hover:not(:disabled){background:#28284a;border-color:var(--pc);}
    .qchoice.benar{background:#0d2e1e;border-color:#27ae60;color:#2ecc71!important;}
    .qchoice.salah{background:#2e0d0d;border-color:#c0392b;color:#e74c3c!important;}
    .qchoice:disabled{cursor:default;}
    /* TEBAK ANGKA */
    .qclue{
      background:#1c1c34;border-radius:12px;padding:10px 13px;
      margin:7px 0;font-size:14px;color:#ccc;border-left:3px solid var(--pc);
      animation:popIn 0.2s ease;
    }
    .qclue-badge{
      display:inline-block;background:var(--pc);color:#000;
      border-radius:5px;font-size:10px;font-weight:800;
      padding:1px 6px;margin-right:6px;
    }
    .qmore-btn{
      margin-top:10px;padding:9px 16px;border-radius:11px;
      border:none;background:#222240;color:#aaa;font-size:13px;
      cursor:pointer;transition:all 0.15s;font-family:inherit;display:inline-flex;align-items:center;gap:6px;
    }
    .qmore-btn:hover{background:#303058;color:#fff;}
    /* SUSUN NILAI TEMPAT */
    .qnt-wrap{margin:10px 0;}
    .qnt-slots{
      display:flex;gap:6px;justify-content:center;margin-bottom:14px;flex-wrap:wrap;
    }
    .qnt-slot{
      min-width:44px;height:50px;border-radius:10px;border:2px dashed #2e2e50;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:#111128;transition:all 0.15s;
    }
    .qnt-slot-digit{font-size:20px;font-weight:800;color:#555;}
    .qnt-slot-label{font-size:8px;color:#444;text-transform:uppercase;margin-top:2px;}
    .qnt-slot.filled .qnt-slot-digit{color:var(--pc);}
    .qnt-slot.filled{border-color:var(--pc);background:#1a1a30;}
    .qnt-slot.correct{border-color:#27ae60;background:#0d2e1e;}
    .qnt-slot.correct .qnt-slot-digit{color:#2ecc71;}
    .qnt-slot.wrong{border-color:#c0392b;background:#2e0d0d;}
    .qnt-slot.wrong .qnt-slot-digit{color:#e74c3c;}
    .qnt-chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}
    .qnt-chip{
      padding:10px 16px;border-radius:11px;border:2px solid #2e2e50;
      background:#1e1e38;color:#ddd;font-size:16px;font-weight:800;
      cursor:pointer;transition:all 0.15s;font-family:inherit;
    }
    .qnt-chip:hover:not(.placed){background:#28284a;border-color:var(--pc);transform:translateY(-2px);}
    .qnt-chip.placed{opacity:0.3;pointer-events:none;}
    /* TIMBANGAN */
    .qtimb-wrap{display:flex;flex-direction:column;align-items:center;margin:8px 0 16px;}
    .qtimb-visual{position:relative;width:240px;height:110px;margin-bottom:8px;}
    .qtimb-pivot{
      position:absolute;left:50%;bottom:0;transform:translateX(-50%);
      width:10px;height:70px;background:#777;border-radius:5px;
    }
    .qtimb-arm{
      position:absolute;left:10px;right:10px;top:8px;height:6px;
      background:#999;border-radius:3px;transform-origin:center;
      transition:transform 0.6s cubic-bezier(.34,1.3,.64,1);
    }
    .qtimb-panL,.qtimb-panR{
      position:absolute;top:-4px;width:60px;height:8px;
      background:#bbb;border-radius:4px;
    }
    .qtimb-panL{left:-4px;}
    .qtimb-panR{right:-4px;}
    .qtimb-valL,.qtimb-valR{
      position:absolute;top:14px;font-size:13px;font-weight:800;color:#eee;
      width:60px;text-align:center;line-height:1.3;
    }
    .qtimb-valL{left:-4px;}
    .qtimb-valR{right:-4px;}
    .qtimb-choices{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:4px;}
    .qtimb-btn{
      padding:10px 15px;border-radius:12px;border:2px solid #2e2e50;
      background:#1e1e38;color:#ddd;font-size:14px;font-weight:700;
      cursor:pointer;transition:all 0.15s;font-family:inherit;
    }
    .qtimb-btn:hover:not(:disabled){background:#28284a;border-color:var(--pc);transform:translateY(-2px);}
    .qtimb-btn.benar{background:#0d2e1e;border-color:#27ae60;color:#2ecc71;}
    .qtimb-btn.salah{background:#2e0d0d;border-color:#c0392b;color:#e74c3c;}
    .qtimb-btn:disabled{cursor:default;}
    /* UANG */
    .quang-scene{margin:8px 0;}
    .quang-info{
      background:#1c1c34;border-radius:12px;padding:12px;margin-bottom:12px;
      display:flex;justify-content:space-between;align-items:center;
    }
    .quang-label{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;}
    .quang-amount{font-size:20px;font-weight:800;color:#fff;}
    .quang-kembalian{font-size:24px;font-weight:900;color:var(--pc);}
    .quang-chips{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-bottom:12px;}
    .quang-chip{
      padding:9px 14px;border-radius:11px;border:2px solid #2e2e50;
      background:#1e1e38;color:#eee;font-size:13px;font-weight:700;
      cursor:pointer;transition:all 0.2s;font-family:inherit;user-select:none;
    }
    .quang-chip:hover:not(:disabled){background:#28284a;border-color:var(--pc);transform:translateY(-2px);}
    .quang-chip:disabled{opacity:0.35;cursor:default;}
    .quang-chip.selected{background:#1a2e3a;border-color:var(--pc);color:var(--pc);}
    .quang-progress{
      text-align:center;font-size:28px;font-weight:900;color:var(--pc);
      margin:8px 0 2px;letter-spacing:1px;
    }
    .quang-hint{text-align:center;font-size:12px;color:#555;}
    /* FEEDBACK */
    .qfeedback{
      margin-top:14px;padding:13px 16px;border-radius:14px;
      font-weight:700;font-size:15px;text-align:center;
    }
    .qfeedback.benar{background:#0d2e1e;color:#2ecc71;animation:bounceIn 0.4s ease;}
    .qfeedback.salah{background:#2e0d0d;color:#e74c3c;animation:shakeEl 0.3s ease;}
    /* SUBMIT */
    .qsubmit{
      width:100%;margin-top:12px;padding:13px;border-radius:14px;
      border:none;font-size:15px;font-weight:800;cursor:pointer;
      background:var(--pc);color:#000;transition:opacity 0.15s;font-family:inherit;
    }
    .qsubmit:disabled{opacity:0.3;cursor:default;}
    .qsubmit:not(:disabled):hover{opacity:0.85;}
  `;
  document.head.appendChild(s);
})();

// ── GENERATOR SOAL ──────────────────────────────────────────

function generateAutoQuestion() {
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const fmt = n => n.toLocaleString('id-ID');
  const shuffle = a => { for (let i = a.length-1; i>0; i--) { const j=rnd(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; };

  function buatPilihan(jawaban, skala) {
    skala = skala || Math.max(100, Math.round(jawaban * 0.15 / 100) * 100 || 500);
    const set = new Set([jawaban]);
    const cands = [];
    for (let m of [1,2,3,4,5,7,10]) {
      cands.push(jawaban + m*skala, jawaban - m*skala);
    }
    const filtered = shuffle(cands.filter(v => v > 0 && v !== jawaban));
    for (const v of filtered) { if (set.size === 4) break; set.add(v); }
    while (set.size < 4) { const v = jawaban + rnd(-5,5)*skala; if (v>0 && v!==jawaban) set.add(v); }
    return shuffle([...set]);
  }

  const TIPE_LIST = ['pilihan', 'tebak', 'nilaitempat', 'timbangan', 'uang'];
  const tipe = TIPE_LIST[rnd(0, TIPE_LIST.length - 1)];

  // ── TIPE 1: PILIHAN GANDA ──────────────────────────────
  if (tipe === 'pilihan') {
    const subtipe = rnd(0, 5);

    // Penjumlahan: kelipatan ratusan, mudah dihitung
    if (subtipe === 0) {
      const a = rnd(1, 50) * 100; const b = rnd(1, 50) * 100;
      const jawaban = a + b;
      return { tipe:'pilihan', emoji:'➕', judul:'Penjumlahan',
        soal:`${fmt(a)} + ${fmt(b)} = ?`,
        pilihan: buatPilihan(jawaban, 100).map(fmt), jawaban: fmt(jawaban) };
    }
    // Pengurangan: kelipatan ratusan, hasil selalu positif
    if (subtipe === 1) {
      const b = rnd(1, 30) * 100; const a = b + rnd(1, 30) * 100;
      const jawaban = a - b;
      return { tipe:'pilihan', emoji:'➖', judul:'Pengurangan',
        soal:`${fmt(a)} - ${fmt(b)} = ?`,
        pilihan: buatPilihan(jawaban, 100).map(fmt), jawaban: fmt(jawaban) };
    }
    // Perkalian: satu angka kecil (2-9), satu angka max 3 digit
    if (subtipe === 2) {
      const a = rnd(10, 200); const b = rnd(2, 9);
      const jawaban = a * b;
      return { tipe:'pilihan', emoji:'✖️', judul:'Perkalian',
        soal:`${fmt(a)} × ${b} = ?`,
        pilihan: buatPilihan(jawaban, Math.max(10, a)).map(fmt),
        jawaban: fmt(jawaban) };
    }
    // Pembagian: hasil pasti bulat, max 3 digit
    if (subtipe === 3) {
      const b = rnd(2, 9); const jawaban = rnd(10, 200);
      const a = b * jawaban;
      return { tipe:'pilihan', emoji:'➗', judul:'Pembagian',
        soal:`${fmt(a)} ÷ ${b} = ?`,
        pilihan: buatPilihan(jawaban, Math.max(10, jawaban)).map(fmt),
        jawaban: fmt(jawaban) };
    }
    // Nilai tempat
    if (subtipe === 4) {
      const labels = ['satuan','puluhan','ratusan','ribuan','puluhan ribuan','ratusan ribuan'];
      const nilai  = [1, 10, 100, 1000, 10000, 100000];
      const idx = rnd(1, 5);
      const n = rnd(10000, 999999);
      const digit = Math.floor(n / nilai[idx]) % 10;
      const jawaban = labels[idx];
      const pool = shuffle([...labels]);
      return { tipe:'pilihan', emoji:'🏠', judul:'Nilai Tempat',
        soal:`Angka ${digit} pada bilangan ${fmt(n)}\nmenempati nilai tempat...`,
        pilihan: pool.slice(0,4), jawaban };
    }
    // Pola bilangan: angka kecil dan selisih sederhana
    const awal = rnd(1, 20) * 100; const selisih = rnd(1, 10) * 100;
    const pola = [0,1,2,3].map(i => awal + i*selisih);
    const jawaban = awal + 4*selisih;
    return { tipe:'pilihan', emoji:'🔁', judul:'Pola Bilangan',
      soal:`Lanjutkan pola:\n${pola.map(fmt).join(', ')}, ...?`,
      pilihan: buatPilihan(jawaban, selisih).map(fmt), jawaban: fmt(jawaban) };
  }
  // ── TIPE 2: TEBAK ANGKA (clue bertahap) ───────────────
  if (tipe === 'tebak') {
    const labels = ['satuan','puluhan','ratusan','ribuan','puluhan ribuan','ratusan ribuan'];
    const nilai  = [1, 10, 100, 1000, 10000, 100000];
    const n = rnd(10000, 999999);
    const digits = labels.map((lbl, i) => ({ lbl, digit: Math.floor(n / nilai[i]) % 10 }))
      .reverse().filter(d => d.digit > 0);
    // Buat clue dalam urutan acak
    const clues = shuffle([...digits]).map(d =>
      `Angka ${d.digit} ada di tempat ${d.lbl}`
    );
    // Tambah clue konteks
    const nilaiSebelum = rnd(1,3) * 10000;
    const batasAtas = Math.ceil(n / 10000) * 10000;
    const batasBawah = Math.floor(n / 10000) * 10000;
    clues.push(`Aku berada di antara ${fmt(batasBawah)} dan ${fmt(batasAtas)}`);

    const jawaban = fmt(n);
    const distractor = buatPilihan(n, 1000).filter(v => v !== n).slice(0,3).map(fmt);
    const pilihan = shuffle([jawaban, ...distractor]);
    return { tipe:'tebak', emoji:'🎰', judul:'Tebak Angka',
      soal:'Siapakah aku? Baca petunjuknya satu per satu!',
      clues, pilihan, jawaban };
  }

  // ── TIPE 3: SUSUN NILAI TEMPAT ────────────────────────
  if (tipe === 'nilaitempat') {
    const n = rnd(10000, 999999);
    const strukturLabels = ['Ratusan\nRibu','Puluhan\nRibu','Ribuan','Ratusan','Puluhan','Satuan'];
    const strukturNilai  = [100000, 10000, 1000, 100, 10, 1];
    // Ambil hanya kolom yang relevan (digit non-leading-zero)
    const cols = [];
    let mulai = false;
    for (let i = 0; i < 6; i++) {
      const d = Math.floor(n / strukturNilai[i]) % 10;
      if (!mulai && i < 5 && Math.floor(n / strukturNilai[i]) === 0) continue;
      mulai = true;
      cols.push({ label: strukturLabels[i], nilai: strukturNilai[i], digit: d });
    }
    // Digit-digit untuk chip (diacak)
    const chips = shuffle(cols.map(c => c.digit));
    return { tipe:'nilaitempat', emoji:'🧩', judul:'Susun Nilai Tempat',
      soal:`Letakkan angka yang benar di setiap kolom nilai tempat\nbilangan: ${fmt(n)}`,
      n, cols, chips };
  }

  // ── TIPE 4: TIMBANGAN BILANGAN ────────────────────────
  // Operasi sederhana: penjumlahan/pengurangan bilangan kecil
  if (tipe === 'timbangan') {
    const ops = [
      () => {
        const a = rnd(1, 40) * 100; const b = rnd(1, 40) * 100;
        const hasil = a + b;
        return { kiriLabel: `${fmt(a)} + ${fmt(b)}`, kiriNilai: hasil,
          pilihan: shuffle([hasil, ...buatPilihan(hasil,100).filter(v=>v!==hasil).slice(0,3)]) };
      },
      () => {
        const b = rnd(1, 20) * 100; const hasil = b + rnd(1, 30) * 100;
        return { kiriLabel: `${fmt(hasil)} - ${fmt(b)}`, kiriNilai: hasil - b,
          pilihan: shuffle([hasil-b, ...buatPilihan(hasil-b,100).filter(v=>v!==hasil-b).slice(0,3)]) };
      },
      () => {
        const a = rnd(10, 99); const b = rnd(2, 9);
        const hasil = a * b;
        return { kiriLabel: `${a} × ${b}`, kiriNilai: hasil,
          pilihan: shuffle([hasil, ...buatPilihan(hasil, Math.max(10,a)).filter(v=>v!==hasil).slice(0,3)]) };
      },
    ];
    const op = ops[rnd(0, ops.length - 1)]();
    return { tipe:'timbangan', emoji:'⚖️', judul:'Timbangan Bilangan',
      soal:`Pilih angka yang membuat timbangan seimbang!`,
      kiriLabel: op.kiriLabel, kiriNilai: op.kiriNilai,
      pilihan: op.pilihan.map(v => ({ val: v, label: fmt(v) })),
      jawaban: fmt(op.kiriNilai) };
  }
  // ── TIPE 5: SOAL UANG / KEMBALIAN ─────────────────────
  {
    const PECAHAN = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100];
    const FMT_RP = n => `Rp${fmt(n)}`;

    // Generate harga yang wajar
    const hargaRaw = rnd(1, 19) * 5000 + rnd(0, 4) * 1000;
    const harga = Math.max(1000, hargaRaw);

    // Bayar dengan pecahan yang lebih besar
    const pecahanBayar = PECAHAN.filter(p => p > harga);
    const bayar = pecahanBayar.length ? pecahanBayar[rnd(0, Math.min(2, pecahanBayar.length-1))] : harga * 2;
    const kembalian = bayar - harga;

    // Pecahan yang tersedia untuk kembalian (tidak lebih dari kembalian)
    const tersedia = PECAHAN.filter(p => p <= kembalian);
    // Pastikan solusi bisa dirakit
    let sisa = kembalian;
    const jawabanPecahan = [];
    for (const p of tersedia) {
      while (sisa >= p && jawabanPecahan.length < 6) {
        jawabanPecahan.push(p);
        sisa -= p;
      }
      if (sisa === 0) break;
    }

    // Kalau tidak bisa dirakit persis, fallback ke pilihan ganda biasa
    if (sisa !== 0 || jawabanPecahan.length === 0) {
      const a = rnd(5000, 50000); const b = rnd(1000, a-1);
      const km = a - b;
      return { tipe:'pilihan', emoji:'💰', judul:'Soal Uang',
        soal:`🛍️ Harga barang ${FMT_RP(b)}.\nDibayar ${FMT_RP(a)}.\nBerapa kembaliannya?`,
        pilihan: buatPilihan(km, 1000).map(fmt), jawaban: fmt(km) };
    }

    // Chip pecahan yang ditampilkan (jawaban + distraktor)
    const chipsSet = new Set(jawabanPecahan);
    const extra = shuffle(PECAHAN.filter(p => p <= kembalian && !chipsSet.has(p)));
    extra.slice(0, 3).forEach(p => chipsSet.add(p));
    const chipsArr = shuffle([...chipsSet]);

    return { tipe:'uang', emoji:'💰', judul:'Kembalian Uang',
      soal:`🛒 Harga: ${FMT_RP(harga)}\n💵 Dibayar: ${FMT_RP(bayar)}\n\nPilih uang kembalian yang tepat!`,
      kembalian, jawabanPecahan, chips: chipsArr };
  }
}


// ── POPUP CONTROLLER ────────────────────────────────────────

function showQuizPopup(quiz, player) {
  const playerColor = colors[player.index];
  document.getElementById('quizOverlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'quizOverlay';
  overlay.className = 'qoverlay';
  overlay.style.setProperty('--pc', playerColor);

  const box = document.createElement('div');
  box.className = 'qbox';
  box.style.setProperty('--pc', playerColor);

  // Header
  const header = document.createElement('div');
  header.className = 'qheader';
  header.innerHTML = `
    <span class="qemoji">${quiz.emoji}</span>
    <div>
      <div class="qtipe" style="color:${playerColor}">${quiz.judul} — ${player.label}</div>
      <div class="qrule">✅ Benar → maju +2 &nbsp;|&nbsp; ❌ Salah → mundur -1</div>
    </div>`;

  const soalEl = document.createElement('div');
  soalEl.className = 'qsoal';
  soalEl.textContent = quiz.soal;

  box.appendChild(header);
  box.appendChild(soalEl);

  // ── Render berdasarkan tipe ──────────────────
  if (quiz.tipe === 'pilihan') {
    renderPilihanGanda(box, quiz, player, playerColor, overlay);
  } else if (quiz.tipe === 'tebak') {
    renderTebakAngka(box, quiz, player, playerColor, overlay);
  } else if (quiz.tipe === 'nilaitempat') {
    renderNilaiTempat(box, quiz, player, playerColor, overlay);
  } else if (quiz.tipe === 'timbangan') {
    renderTimbangan(box, quiz, player, playerColor, overlay);
  } else if (quiz.tipe === 'uang') {
    renderUang(box, quiz, player, playerColor, overlay);
  }

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

function selesaiQuiz(benar, quiz, player, playerColor, overlay) {
  const move = benar ? 2 : -1;
  const fb = document.createElement('div');
  fb.className = `qfeedback ${benar ? 'benar' : 'salah'}`;
  fb.textContent = benar
    ? `🎉 Benar! ${player.label} maju +2 langkah!`
    : `😅 Salah! Jawaban: ${quiz.jawaban}. ${player.label} mundur -1.`;
  overlay.querySelector('.qbox').appendChild(fb);

  addLog(`${player.label} ${benar ? 'BENAR ✅' : 'SALAH ❌'} (${quiz.judul}) → ${move>=0?'+':''}${move} langkah.`);

  setTimeout(() => {
    overlay.remove();
    player.position = Math.max(1, Math.min(totalBlocks, player.position + move));
    updatePawn(player);
    updateLeader();
    updateProgress();
    burstAtBlock(player.position, playerColor);
    if (!checkWinner()) nextTurn();
  }, 2000);
}

// ── RENDER: PILIHAN GANDA ────────────────────────────────
function renderPilihanGanda(box, quiz, player, playerColor, overlay) {
  const wrap = document.createElement('div');
  const letters = ['A','B','C','D'];
  let answered = false;

  quiz.pilihan.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = 'qchoice';
    btn.style.setProperty('--pc', playerColor);
    btn.textContent = `${letters[i]}. ${p}`;
    btn.onclick = () => {
      if (answered) return;
      answered = true;
      wrap.querySelectorAll('.qchoice').forEach(b => b.disabled = true);
      const benar = p === quiz.jawaban;
      btn.classList.add(benar ? 'benar' : 'salah');
      if (!benar) {
        wrap.querySelectorAll('.qchoice').forEach(b => {
          if (b.textContent.slice(3) === quiz.jawaban) b.classList.add('benar');
        });
      }
      selesaiQuiz(benar, quiz, player, playerColor, overlay);
    };
    wrap.appendChild(btn);
  });
  box.appendChild(wrap);
}

// ── RENDER: TEBAK ANGKA ──────────────────────────────────
function renderTebakAngka(box, quiz, player, playerColor, overlay) {
  let clueIdx = 0;
  let answered = false;
  const clueWrap = document.createElement('div');

  function showNextClue() {
    if (clueIdx >= quiz.clues.length) return;
    const d = document.createElement('div');
    d.className = 'qclue';
    d.style.setProperty('--pc', playerColor);
    d.innerHTML = `<span class="qclue-badge">Petunjuk ${clueIdx+1}</span>${quiz.clues[clueIdx]}`;
    clueWrap.appendChild(d);
    clueIdx++;
    moreBtn.textContent = clueIdx >= quiz.clues.length
      ? '✅ Semua petunjuk ditampilkan' : `💡 Petunjuk ${clueIdx+1}`;
    if (clueIdx >= quiz.clues.length) moreBtn.disabled = true;
  }

  const moreBtn = document.createElement('button');
  moreBtn.className = 'qmore-btn';
  moreBtn.style.setProperty('--pc', playerColor);
  moreBtn.textContent = '💡 Petunjuk 1';
  moreBtn.onclick = showNextClue;

  box.appendChild(clueWrap);
  box.appendChild(moreBtn);

  // Pilihan jawaban
  const choiceWrap = document.createElement('div');
  choiceWrap.style.marginTop = '14px';
  const letters = ['A','B','C','D'];
  quiz.pilihan.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = 'qchoice';
    btn.style.setProperty('--pc', playerColor);
    btn.textContent = `${letters[i]}. ${p}`;
    btn.onclick = () => {
      if (answered) return;
      answered = true;
      moreBtn.disabled = true;
      choiceWrap.querySelectorAll('.qchoice').forEach(b => b.disabled = true);
      const benar = p === quiz.jawaban;
      btn.classList.add(benar ? 'benar' : 'salah');
      if (!benar) {
        choiceWrap.querySelectorAll('.qchoice').forEach(b => {
          if (b.textContent.slice(3) === quiz.jawaban) b.classList.add('benar');
        });
      }
      selesaiQuiz(benar, quiz, player, playerColor, overlay);
    };
    choiceWrap.appendChild(btn);
  });
  box.appendChild(choiceWrap);
}

// ── RENDER: SUSUN NILAI TEMPAT ───────────────────────────
function renderNilaiTempat(box, quiz, player, playerColor, overlay) {
  const wrap = document.createElement('div');
  wrap.className = 'qnt-wrap';
  wrap.style.setProperty('--pc', playerColor);

  // Slot kotak
  const slotsEl = document.createElement('div');
  slotsEl.className = 'qnt-slots';
  const slotEls = quiz.cols.map(col => {
    const slot = document.createElement('div');
    slot.className = 'qnt-slot';
    slot.dataset.digit = col.digit;
    const digitEl = document.createElement('div');
    digitEl.className = 'qnt-slot-digit';
    digitEl.textContent = '_';
    const labelEl = document.createElement('div');
    labelEl.className = 'qnt-slot-label';
    labelEl.style.whiteSpace = 'pre';
    labelEl.textContent = col.label;
    slot.appendChild(digitEl);
    slot.appendChild(labelEl);
    slotsEl.appendChild(slot);
    return { slot, digitEl, col, filled: false, filledWith: null };
  });

  // Chip angka
  const chipsEl = document.createElement('div');
  chipsEl.className = 'qnt-chips';
  quiz.chips.forEach(digit => {
    const chip = document.createElement('button');
    chip.className = 'qnt-chip';
    chip.style.setProperty('--pc', playerColor);
    chip.textContent = digit;
    chip.dataset.digit = digit;

    chip.onclick = () => {
      if (chip.classList.contains('placed')) return;
      // Cari slot kosong pertama
      const target = slotEls.find(s => !s.filled);
      if (!target) return;
      target.filled = true;
      target.filledWith = digit;
      target.digitEl.textContent = digit;
      target.slot.classList.add('filled');
      chip.classList.add('placed');

      // Kalau semua slot terisi, cek jawaban
      if (slotEls.every(s => s.filled)) {
        let benar = true;
        slotEls.forEach(s => {
          const ok = parseInt(s.filledWith) === s.col.digit;
          s.slot.classList.remove('filled');
          s.slot.classList.add(ok ? 'correct' : 'wrong');
          if (!ok) benar = false;
        });
        chipsEl.querySelectorAll('.qnt-chip').forEach(c => c.disabled = true);
        quiz.jawaban = benar ? 'BENAR' : 'SALAH'; // dummy
        selesaiQuiz(benar, { ...quiz, jawaban: quiz.cols.map(c=>c.digit).join('') }, player, playerColor, overlay);
      }
    };
    chipsEl.appendChild(chip);
  });

  wrap.appendChild(slotsEl);
  wrap.appendChild(chipsEl);
  box.appendChild(wrap);
}

// ── RENDER: TIMBANGAN ───────────────────────────────────
function renderTimbangan(box, quiz, player, playerColor, overlay) {
  const wrap = document.createElement('div');
  wrap.style.setProperty('--pc', playerColor);

  // Visual timbangan
  const visual = document.createElement('div');
  visual.className = 'qtimb-wrap';
  visual.innerHTML = `
    <div class="qtimb-visual">
      <div class="qtimb-pivot"></div>
      <div class="qtimb-arm" id="qtimbArm">
        <div class="qtimb-panL"></div>
        <div class="qtimb-panR"></div>
        <div class="qtimb-valL">${quiz.kiriLabel}</div>
        <div class="qtimb-valR" id="qtimbValR">?</div>
      </div>
    </div>
  `;
  wrap.appendChild(visual);

  // Timbangan visual: condong ke kiri karena kanan belum ada
  const arm = visual.querySelector('#qtimbArm');
  arm.style.transform = 'rotate(-12deg)';

  // Pilihan
  const choicesEl = document.createElement('div');
  choicesEl.className = 'qtimb-choices';
  let answered = false;

  quiz.pilihan.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'qtimb-btn';
    btn.style.setProperty('--pc', playerColor);
    btn.textContent = p.label;
    btn.onclick = () => {
      if (answered) return;
      answered = true;
      choicesEl.querySelectorAll('.qtimb-btn').forEach(b => b.disabled = true);
      const benar = p.label === quiz.jawaban;
      btn.classList.add(benar ? 'benar' : 'salah');
      if (!benar) {
        choicesEl.querySelectorAll('.qtimb-btn').forEach(b => {
          if (b.textContent === quiz.jawaban) b.classList.add('benar');
        });
      }
      // Animasi timbangan
      visual.querySelector('#qtimbValR').textContent = p.label;
      arm.style.transform = benar ? 'rotate(0deg)' : 'rotate(8deg)';
      selesaiQuiz(benar, quiz, player, playerColor, overlay);
    };
    choicesEl.appendChild(btn);
  });

  wrap.appendChild(choicesEl);
  box.appendChild(wrap);
}

// ── RENDER: UANG / KEMBALIAN ─────────────────────────────
function renderUang(box, quiz, player, playerColor, overlay) {
  const fmt = n => n.toLocaleString('id-ID');
  const wrap = document.createElement('div');
  wrap.className = 'quang-scene';
  wrap.style.setProperty('--pc', playerColor);

  // Progress kembalian
  const progressEl = document.createElement('div');
  progressEl.className = 'quang-progress';
  progressEl.textContent = `Rp0`;

  const hintEl = document.createElement('div');
  hintEl.className = 'quang-hint';
  hintEl.textContent = `Target kembalian: Rp${fmt(quiz.kembalian)}`;

  // Chips pecahan
  const chipsEl = document.createElement('div');
  chipsEl.className = 'quang-chips';

  let totalDipilih = 0;
  let selected = [];
  let finished = false;

  const updateProgress = () => {
    progressEl.textContent = `Rp${fmt(totalDipilih)}`;
    progressEl.style.color = totalDipilih === quiz.kembalian ? '#2ecc71'
      : totalDipilih > quiz.kembalian ? '#e74c3c' : playerColor;
  };

  quiz.chips.forEach(pecahan => {
    const chip = document.createElement('button');
    chip.className = 'quang-chip';
    chip.style.setProperty('--pc', playerColor);
    chip.textContent = `Rp${fmt(pecahan)}`;
    chip.onclick = () => {
      if (finished) return;
      totalDipilih += pecahan;
      selected.push(pecahan);
      chip.classList.add('selected');
      chip.disabled = true;
      updateProgress();

      if (totalDipilih === quiz.kembalian) {
        finished = true;
        chipsEl.querySelectorAll('.quang-chip').forEach(c => c.disabled = true);
        quiz.jawaban = 'TEPAT';
        selesaiQuiz(true, { ...quiz, jawaban:'kembalian tepat' }, player, playerColor, overlay);
      } else if (totalDipilih > quiz.kembalian) {
        finished = true;
        chipsEl.querySelectorAll('.quang-chip').forEach(c => c.disabled = true);
        quiz.jawaban = `Rp${fmt(quiz.kembalian)}`;
        selesaiQuiz(false, { ...quiz, jawaban:`Rp${fmt(quiz.kembalian)}` }, player, playerColor, overlay);
      }
    };
    chipsEl.appendChild(chip);
  });

  wrap.appendChild(progressEl);
  wrap.appendChild(hintEl);
  wrap.appendChild(chipsEl);
  box.appendChild(wrap);
}
function generateAutoQuestionBlocks() {
  autoQuestionBlocks = {};
  if (!autoGenerateQuestions) return;

  const questionCount = Math.max(6, Math.floor(totalBlocks * 0.12));
  const used = new Set([1, totalBlocks]);

  Object.keys(hazardBlocks).forEach((position) => used.add(Number(position)));

  while (Object.keys(autoQuestionBlocks).length < questionCount) {
    const pos = Math.floor(Math.random() * (totalBlocks - 2)) + 2;
    if (used.has(pos)) continue;

    used.add(pos);
    const quiz = generateAutoQuestion();
    autoQuestionBlocks[pos] = { text: quiz.soal, move: 0, quiz };
  }
}

function generateHazardBlocks() {
  hazardBlocks = {};
  if (gameMode !== 'hazard') return;

  const hazardCount = Math.max(6, Math.floor(totalBlocks * 0.12));
  const used = new Set();

  while (Object.keys(hazardBlocks).length < hazardCount) {
    const minBlock = Math.max(5, Math.floor(totalBlocks * 0.1));
    const pos = Math.floor(Math.random() * (totalBlocks - minBlock)) + minBlock;
    if (used.has(pos)) continue;

    used.add(pos);
    const backSteps = -(Math.floor(Math.random() * 5) + 2);
    hazardBlocks[pos] = backSteps;
  }
}

function paintSpecialBlocks() {
  Array.from(board.querySelectorAll('.block')).forEach((block) => {
    block.classList.remove('hazard-block');

    if (block.dataset.autoQuestion === 'true') {
      block.classList.remove('has-instruction');
      delete block.dataset.autoQuestion;
    }

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

  Object.keys(autoQuestionBlocks).forEach((position) => {
    const block = document.getElementById(`block-${position}`);
    if (!block) return;

    block.classList.add('has-instruction');
    block.dataset.autoQuestion = 'true';
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
  const rows = Math.ceil(totalBlocks / 10);
  for (let row = 0; row < rows; row++) {
    const from = row * 10 + 1;
    const rowLength = Math.min(10, totalBlocks - row * 10);
    const sequence = Array.from({ length: rowLength }, (_, idx) => from + idx);
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
  const data = blockInstructions[num] || autoQuestionBlocks[num];
  instructionText.value = data ? data.text : '';
  instructionMove.value = data ? data.move : '';
  instructionPopup.classList.remove('hidden');
}

saveInstruction.onclick = () => {
  const text = instructionText.value.trim();
  const move = Number(instructionMove.value || 0);

  if (!text) {
    delete blockInstructions[activeBlock];
    const activeEl = document.getElementById(`block-${activeBlock}`);
    if (!autoQuestionBlocks[activeBlock]) {
      activeEl.classList.remove('has-instruction');
    }
    addLog(`Instruksi blok ${activeBlock} dihapus.`);
  } else {
    blockInstructions[activeBlock] = { text, move };
    delete autoQuestionBlocks[activeBlock];

    const activeEl = document.getElementById(`block-${activeBlock}`);
    activeEl.classList.add('has-instruction');
    delete activeEl.dataset.autoQuestion;

    addLog(`Blok ${activeBlock} di-set: "${text}" (${move >= 0 ? '+' : ''}${move})`);
  }

  instructionPopup.classList.add('hidden');
};

closeInstruction.onclick = () => instructionPopup.classList.add('hidden');
openTutorial.onclick = () => tutorialPopup.classList.remove('hidden');
closeTutorial.onclick = () => tutorialPopup.classList.add('hidden');

if (openSetupGuide && setupGuidePopup) {
  openSetupGuide.onclick = () => setupGuidePopup.classList.remove('hidden');
}

if (closeSetupGuide && setupGuidePopup) {
  closeSetupGuide.onclick = () => setupGuidePopup.classList.add('hidden');
  setupGuidePopup.addEventListener('click', (event) => {
    if (event.target === setupGuidePopup) {
      setupGuidePopup.classList.add('hidden');
    }
  });
}

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
  generateAutoQuestionBlocks();
  paintSpecialBlocks();

  updateLeader();
  updateProgress();
  updateTurnInfo();
  addLog(`Game dimulai dengan ${count} pemain (${gameMode === 'hazard' ? 'Mode Gangguan Acak' : 'Mode Polos'}).`);
  addLog(`Auto generate soal: ${autoGenerateQuestions ? 'Aktif' : 'Nonaktif'}.`);
  if (gameMode === 'hazard') {
    addLog('Blok berbahaya ditandai ikon ⚠ di papan.');
  }

  if (autoGenerateQuestions) {
    addLog(`${Object.keys(autoQuestionBlocks).length} blok soal otomatis ditandai seperti blok instruksi.`);
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

  // Cek dulu autoQuestionBlocks (quiz pilihan ganda)
  const autoData = autoQuestionBlocks[player.position];
  if (autoData && autoData.quiz) {
    player.el.classList.add('shake');
    setTimeout(() => player.el.classList.remove('shake'), 320);
    addLog(`${player.label} mendapat soal di blok ${player.position}!`);
    showQuizPopup(autoData.quiz, player);
    return;
  }

  // Blok instruksi manual (teks biasa)
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
  await wait(450);
  await movePlayer(player, roll);
};

startBtn.onclick = () => {
  createBoard();
  initPlayers(Number(playerSelect?.dataset.value || 2));
  startPopup.classList.add('hidden');
  setupGuidePopup?.classList.add('hidden');
  rollBtn.disabled = false;
};

restartBtn.onclick = () => window.location.reload();

window.addEventListener('resize', () => {
  players.forEach(updatePawn);
});

createBoard();
setupPlayerSelect();
setupModeSelect();
setupLengthSelect();
setupAutoQuestionToggle();