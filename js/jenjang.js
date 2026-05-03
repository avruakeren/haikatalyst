const gradeMaterials = {
  1: [
    { label: 'Bahasa Indonesia - Menyusun Kalimat', href: 'game-kelas1.html', available: false },
    { label: 'Matematika Dasar', available: false }
  ],
  2: [
    { label: 'Bahasa Indonesia - Menyusun Kalimat (SPO/SPOK)', href: 'game-kelas2-bindo.html', available: true },
    { label: 'Matematika', available: false }
  ],
  3: [
    { label: 'Matematika', available: false },
    { label: 'IPS', available: false }
  ],
  4: [
    { label: 'Matematika', available: false },
    { label: 'Bahasa Indonesia', available: false }
  ],
  5: [
    { label: 'Matematika', href: 'game-kelas5-mat.html', available: true },
    { label: 'IPA', available: false }
  ],
  6: [
    { label: 'Matematika', available: false },
    { label: 'Bahasa Inggris', available: false }
  ]
};

const materialOverlay = document.getElementById('materialOverlay');
const materialSelect = document.getElementById('materialSelect');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const materialStatus = document.getElementById('materialStatus');
const startMaterialBtn = document.getElementById('startMaterialBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
let activeMaterials = [];

function openModal(grade) {
  activeMaterials = gradeMaterials[grade] || [];
  modalTitle.textContent = `Kelas ${grade} - Pilih Materi`;
  modalDescription.textContent = `Untuk kelas ${grade}, silakan pilih materi yang tersedia.`;

  materialSelect.innerHTML = '';
  activeMaterials.forEach((material, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = material.available ? material.label : `${material.label} (Coming Soon)`;
    materialSelect.appendChild(option);
  });

  materialStatus.textContent = '';
  materialOverlay.style.display = 'flex';
  materialSelect.focus();
}

function addClickBounce(button) {
  button.animate(
    [
      { transform: 'skewX(-14deg) translateY(0)' },
      { transform: 'skewX(-14deg) translateY(-6px)' },
      { transform: 'skewX(-14deg) translateY(0)' }
    ],
    {
      duration: 260,
      easing: 'ease-out'
    }
  );
}

document.querySelectorAll('.class-btn').forEach((button) => {
  button.addEventListener('click', () => {
    addClickBounce(button);
    openModal(button.dataset.grade);
  });
});

startMaterialBtn.addEventListener('click', () => {
  const selectedIndex = Number(materialSelect.value);
  const selectedMaterial = activeMaterials[selectedIndex];

  if (!selectedMaterial) {
    materialStatus.textContent = 'Materi belum dipilih.';
    return;
  }

  if (!selectedMaterial.available) {
    materialStatus.textContent = 'Materi ini masih coming soon. Pilih materi lain ya.';
    return;
  }

  window.location.href = selectedMaterial.href;
});

closeModalBtn.addEventListener('click', () => {
  materialOverlay.style.display = 'none';
});

materialOverlay.addEventListener('click', (event) => {
  if (event.target === materialOverlay) {
    materialOverlay.style.display = 'none';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    materialOverlay.style.display = 'none';
  }
});
