const questions = [
      {
        target: 'Saya suka membaca buku',
        hint: 'Aktivitas yang dilakukan di rumah atau sekolah.',
        words: ['membaca', 'Saya', 'suka', 'buku']
      },
      {
        target: 'Ibu pergi ke pasar',
        hint: 'Kalimat tentang aktivitas Ibu.',
        words: ['pasar', 'ke', 'Ibu', 'pergi']
      },
      {
        target: 'Adik minum susu hangat',
        hint: 'Kalimat tentang minuman.',
        words: ['hangat', 'susu', 'Adik', 'minum']
      },
      {
        target: 'Kami bermain bola bersama',
        hint: 'Kalimat kegiatan bersama teman.',
        words: ['bersama', 'Kami', 'bola', 'bermain']
      },
      {
        target: 'Ayah bekerja setiap pagi',
        hint: 'Kalimat tentang kegiatan Ayah.',
        words: ['pagi', 'Ayah', 'bekerja', 'setiap']
      }
    ];

    const dropZone = document.getElementById('dropZone');
    const wordBank = document.getElementById('wordBank');
    const sentenceTarget = document.getElementById('sentenceTarget');
    const hintText = document.getElementById('hintText');
    const feedback = document.getElementById('feedback');
    const levelText = document.getElementById('levelText');
    const scoreText = document.getElementById('scoreText');
    const livesText = document.getElementById('livesText');

    let level = 0;
    let score = 0;
    let lives = 3;
    let draggedId = null;

    function shuffle(words) {
      const arr = [...words];
      for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
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

    function renderQuestion() {
      if (level >= questions.length) {
        sentenceTarget.textContent = 'Selamat!';
        hintText.textContent = 'Kamu sudah menyelesaikan semua soal kelas 1.';
        wordBank.innerHTML = '';
        dropZone.innerHTML = '';
        refreshDropZoneState();
        feedback.textContent = `Game selesai! Skor akhir kamu: ${score}`;
        feedback.className = 'success';
        return;
      }

      const question = questions[level];
      sentenceTarget.textContent = `Kalimat ${level + 1}`;
      hintText.textContent = `Hint: ${question.hint}`;
      wordBank.innerHTML = '';
      dropZone.innerHTML = '';
      feedback.textContent = '';
      feedback.className = '';

      shuffle(question.words).forEach((word, index) => {
        wordBank.appendChild(createChip(word, index));
      });

      refreshDropZoneState();
      levelText.textContent = String(level + 1);
      scoreText.textContent = String(score);
      livesText.textContent = String(lives);
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

    document.getElementById('checkBtn').addEventListener('click', () => {
      if (level >= questions.length) return;

      const userSentence = Array.from(dropZone.querySelectorAll('.word-chip'))
        .map((chip) => chip.textContent)
        .join(' ')
        .trim();

      const expected = questions[level].target;

      if (userSentence === expected) {
        score += 20;
        feedback.textContent = 'Benar! Keren 🎉 Lanjut ke soal berikutnya.';
        feedback.className = 'success';
        level += 1;
        setTimeout(renderQuestion, 850);
      } else {
        lives -= 1;
        feedback.textContent = 'Belum tepat, coba lagi ya.';
        feedback.className = 'error';

        if (lives <= 0) {
          feedback.textContent = `Game over! Kalimat yang benar: "${expected}". Klik Ulang Susunan atau refresh untuk main lagi.`;
          feedback.className = 'error';
          document.getElementById('checkBtn').disabled = true;
          document.getElementById('skipBtn').disabled = true;
        }

        scoreText.textContent = String(score);
        livesText.textContent = String(lives);
      }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      if (level >= questions.length) return;
      Array.from(dropZone.querySelectorAll('.word-chip')).forEach((chip) => wordBank.appendChild(chip));
      refreshDropZoneState();
      feedback.textContent = 'Susunan direset, ayo coba lagi.';
      feedback.className = '';
    });

    document.getElementById('skipBtn').addEventListener('click', () => {
      if (level >= questions.length) return;
      lives -= 1;
      level += 1;
      feedback.textContent = 'Soal dilewati. Nyawa berkurang 1.';
      feedback.className = 'error';
      livesText.textContent = String(lives);
      if (lives <= 0) {
        document.getElementById('checkBtn').disabled = true;
        document.getElementById('skipBtn').disabled = true;
        feedback.textContent = 'Nyawa habis. Refresh halaman untuk mulai ulang.';
        return;
      }
      setTimeout(renderQuestion, 600);
    });

    renderQuestion();
  