/* Pixel Art Icons Library - Haikatalyst Premium */

(function () {
  // Mapping of Unicode Emojis to pixel-art SVGs
  // Grid size: 16x16 for retro-authenticity
  const pixelIcons = {
    // ➕ PLUS (Addition)
    '➕': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-bounce pixel-outline-retro">
        <!-- Inner Sky-Blue Plus -->
        <path d="M6 3h4v10H6z" fill="var(--pixel-blue)" />
        <path d="M3 6h10v4H3z" fill="var(--pixel-blue)" />
        <!-- Highlight -->
        <path d="M6 3h1v10H6z" fill="var(--pixel-blue-light)" />
        <path d="M3 6h10v1H3z" fill="var(--pixel-blue-light)" />
        <!-- Center core highlight -->
        <rect x="7" y="7" width="2" height="2" fill="var(--pixel-white)" />
      </svg>
    `,

    // ➖ MINUS (Subtraction)
    '➖': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-bounce pixel-outline-retro" style="animation-delay: 0.3s">
        <!-- Inner Orange Bar -->
        <path d="M3 6h10v4H3z" fill="var(--pixel-orange)" />
        <!-- Highlight -->
        <path d="M3 6h10v1H3z" fill="var(--pixel-orange-light)" />
        <rect x="5" y="7" width="6" height="1" fill="var(--pixel-white)" />
      </svg>
    `,

    // ✖️ MULTIPLY (Multiplication)
    '✖️': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-spin-hover pixel-outline-retro">
        <!-- Inner Green X -->
        <path d="M3 3h3v3H3zm7 0h3v3h-3zM6 6h4v4H6zm-3 7h3v-3H3zm7 0h3v-3h-3z" fill="var(--pixel-green)" />
        <!-- Highlights -->
        <path d="M4 3h1v2H4zm7 0h1v2h-1zm-4 4h1v2H7zm-3 3h1v2H4zm7 0h1v2h-1z" fill="var(--pixel-green-light)" />
        <rect x="7" y="7" width="1" height="1" fill="var(--pixel-white)" />
      </svg>
    `,

    // ➗ DIVIDE (Division)
    '➗': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-wobble pixel-outline-retro">
        <!-- Inner Red Division -->
        <rect x="7" y="3" width="2" height="2" fill="var(--pixel-red)" />
        <rect x="3" y="7" width="10" height="2" fill="var(--pixel-red)" />
        <rect x="7" y="11" width="2" height="2" fill="var(--pixel-red)" />
        <!-- Highlights -->
        <rect x="7" y="3" width="1" height="1" fill="var(--pixel-red-light)" />
        <rect x="3" y="7" width="10" height="1" fill="var(--pixel-red-light)" />
        <rect x="7" y="11" width="1" height="1" fill="var(--pixel-red-light)" />
      </svg>
    `,

    // 🔁 LOOP (Pola Bilangan)
    '🔁': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-spin-slow pixel-outline-retro">
        <!-- Cyan loop arrow paths -->
        <path d="M4 3h8v2H4v3H2V5a2 2 0 0 1 2-2zm8 10H4v-2h8V8h2v3a2 2 0 0 1-2 2z" fill="var(--pixel-cyan)" />
        <!-- Arrow heads -->
        <path d="M10 2h3v3h-1V3h-2zm-4 9H3v3h1v-2h2z" fill="var(--pixel-cyan-light)" />
      </svg>
    `,

    // 💰 MONEY / TREASURE CHEST (Kembalian Uang)
    '💰': `
      <div class="pixel-coin-particle pixel-coin-p1"></div>
      <div class="pixel-coin-particle pixel-coin-p2"></div>
      <div class="pixel-coin-particle pixel-coin-p3"></div>
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-bounce pixel-outline-retro">
        <!-- Treasure Chest Base -->
        <path d="M2 7h12v7H2z" fill="#78350f" />
        <path d="M2 3h12v4H2z" fill="#b45309" />
        <!-- Gold Trim -->
        <path d="M2 7h12v1H2zm3 1v5H4V8zm8 0v5h-1V8z" fill="var(--pixel-gold)" />
        <!-- Lock -->
        <rect x="7" y="7" width="2" height="2" fill="var(--pixel-white)" />
        <!-- Inside darkness when opened slightly -->
        <rect x="3" y="6" width="10" height="1" fill="#1e293b" />
      </svg>
    `,

    // 🎲 DICE (Dadu Roll)
    '🎲': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-outline-retro">
        <!-- White Rounded Cube Base -->
        <path d="M2 1h12v14H2z" fill="var(--pixel-white)" />
        <!-- Isometric shading for premium feel -->
        <path d="M2 14h12v1H2zM13 1h1v14h-1z" fill="#e2e8f0" />
        <!-- Red Center Dot (Japanese Style 1) -->
        <rect x="7" y="7" width="2" height="2" fill="var(--pixel-red)" />
        <rect x="6" y="8" width="4" height="1" fill="var(--pixel-red-light)" />
        <!-- Corner minor pips for 5 decoration -->
        <rect x="3" y="3" width="2" height="2" fill="var(--pixel-border)" />
        <rect x="11" y="3" width="2" height="2" fill="var(--pixel-border)" />
        <rect x="3" y="11" width="2" height="2" fill="var(--pixel-border)" />
        <rect x="11" y="11" width="2" height="2" fill="var(--pixel-border)" />
      </svg>
    `,

    // 🏆 TROPHY (Normal length mode / Winner)
    '🏆': `
      <div class="pixel-glare-overlay"><div class="pixel-glare-effect"></div></div>
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-wobble pixel-outline-retro">
        <!-- Gold Trophy Cup -->
        <path d="M3 2h10v6H9v3h3v2H4v-2h3V8H3V2zm0 2H1v2h2V4zm10 0h2v2h-2V4z" fill="var(--pixel-gold)" />
        <!-- Pedestal / Base -->
        <path d="M2 13h12v2H2z" fill="#4b5563" />
        <!-- Glare Highlights -->
        <path d="M4 3h1v4H4V3zm5 0h1v2H9V3z" fill="var(--pixel-gold-light)" />
      </svg>
    `,

    // 🚀 ROCKET (Mode Cepat)
    '🚀': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-wobble pixel-outline-retro">
        <!-- Thruster Fire -->
        <path class="pixel-thruster" d="M7 13h2v3H7z" fill="var(--pixel-orange)" />
        <path class="pixel-thruster" d="M8 14h1v1H8z" fill="var(--pixel-gold)" style="animation-delay: 0.1s" />
        <!-- Rocket Body (Diagonal upwards right) -->
        <path d="M6 12V6l6-1v6H6zm1-5h4v1H7V7z" fill="#e2e8f0" />
        <!-- Red Tip and Fins -->
        <path d="M12 5V2h-3v3h3zM5 10v2h1v-2H5zm7 0v2h-1v-2h1z" fill="var(--pixel-red)" />
        <!-- Glass Window -->
        <rect x="9" y="6" width="2" height="2" fill="var(--pixel-cyan-light)" />
      </svg>
    `,

    // ⚡ HAZARD (Lightning)
    '⚡': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-glow-yellow pixel-outline-retro">
        <!-- Bright Yellow Lighting Bolt -->
        <path d="M9 1H4L2 9h5v6l5-8H7l2-6z" fill="var(--pixel-gold)" />
        <!-- Inner glow highlight -->
        <path d="M8 2H5L3 8h5v5l3-6H7l1-5z" fill="var(--pixel-gold-light)" />
      </svg>
    `,

    // 🎯 TARGET (Plain mode)
    '🎯': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-glow-cyan pixel-outline-retro">
        <!-- Outer Red Ring -->
        <path d="M4 1h8v1H4zm8 1h2v2h-2zm2 2v8h-1V4zm-1 8h-1v2h-8v-1H4v-1H2V4h2v8h8z" fill="var(--pixel-red)" />
        <!-- White Ring -->
        <path d="M5 3h6v1H5zm6 1h2v6h-2zm1 6v2h-8v-2zm-8-6v6H3V4h1z" fill="var(--pixel-white)" />
        <!-- Cyan Center Bullseye -->
        <rect x="7" y="7" width="2" height="2" fill="var(--pixel-cyan)" />
        <rect x="6" y="6" width="4" height="4" fill="var(--pixel-cyan-light)" opacity="0.4" />
      </svg>
    `,

    // 🎉 CONFETTI / SUCCESS PARTY POPPER
    '🎉': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-bounce pixel-outline-retro">
        <!-- Retro Party Popper Cone -->
        <path d="M1 15l4-4 2 2-2 2-4-2z" fill="var(--pixel-orange)" />
        <!-- Inner Cone Shade -->
        <path d="M2 14l2-2 1 1-2 2-1-1z" fill="var(--pixel-orange-light)" />
        <!-- Popper Streamers -->
        <path d="M8 8h1v1H8zm4-4h1v1h-1zm-2 2h1v1h-1z" fill="var(--pixel-green)" />
        <path d="M6 6h1v1H6zm4-2h1v1h-1zm-2 4h1v1H8z" fill="var(--pixel-blue-light)" />
        <path d="M12 8h1v1h-1zm-4-6h1v1H8z" fill="var(--pixel-red)" />
      </svg>
    `,

    // ⏰ TIMEOUT / CLOCK
    '⏰': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-wobble pixel-outline-retro">
        <!-- Red Clock Bell Tops -->
        <rect x="2" y="1" width="3" height="2" fill="var(--pixel-red)" />
        <rect x="11" y="1" width="3" height="2" fill="var(--pixel-red)" />
        <!-- Main Circular Face -->
        <path d="M4 3h8v1H4zm8 1h1v8h-1zm0 8H4v1h8v-1H4V3h8z" fill="#4b5563" />
        <rect x="4" y="4" width="8" height="8" fill="var(--pixel-white)" />
        <!-- Clock Hands -->
        <rect x="7" y="5" width="2" height="3" fill="var(--pixel-border)" />
        <rect x="8" y="7" width="3" height="2" fill="var(--pixel-border)" />
      </svg>
    `,

    // ✅ CHECK (Success)
    '✅': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-anim-bounce pixel-outline-retro">
        <!-- Pixel Checkmark -->
        <path d="M13 3l1 1-7 9-4-4 1-2 3 3 6-7z" fill="var(--pixel-green)" />
        <path d="M13 3l1 1-7 9-1-1 6-7-1-1-5 6-2-2-1 1 3 3 7-9z" fill="var(--pixel-green-light)" />
      </svg>
    `,

    // ❌ CROSS (Error)
    '❌': `
      <svg viewBox="0 0 16 16" class="pixel-icon-svg pixel-outline-retro" style="animation: shakeEl 0.4s ease">
        <!-- Red Cross X -->
        <path d="M3 3h3v3H3zm7 0h3v3h-3zM6 6h4v4H6zm-3 7h3v-3H3zm7 0h3v-3h-3z" fill="var(--pixel-red)" />
        <path d="M4 3h1v2H4zm7 0h1v2h-1zm-4 4h1v2H7zm-3 3h1v2H4zm7 0h1v2h-1z" fill="var(--pixel-red-light)" />
      </svg>
    `
  };

  /**
   * Generates a Pixel Art SVG wrapped in a gorgeous retro container.
   * @param {string} emoji - The emoji string to check.
   * @param {number} size - Visual width/height of the icon wrapper in pixels.
   * @param {string} classes - Additional custom classes for styling/layout.
   */
  window.getPixelIcon = function (emoji, size = 32, classes = '') {
    const cleanEmoji = String(emoji).trim();
    if (pixelIcons[cleanEmoji]) {
      return `<div class="pixel-icon-wrapper ${classes}" style="width: ${size}px; height: ${size}px;" data-emoji="${cleanEmoji}">
        ${pixelIcons[cleanEmoji]}
      </div>`;
    }
    // Fallback: render text emoji if we don't have SVG coordinates
    return emoji;
  };

  /**
   * Explodes pixel success confetti across the user screen!
   */
  window.triggerPixelConfetti = function () {
    const container = document.createElement('div');
    container.className = 'pixel-confetti-container';
    const colors = ['#3b82f6', '#06b6d4', '#10b981', '#fbbf24', '#f97316', '#ef4444'];
    const particleCount = window.innerWidth < 768 ? 40 : 100;

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'pixel-confetti-particle';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = '-10px';
      
      const duration = Math.random() * 3 + 2; // 2s to 5s
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = Math.random() * 2 + 's';
      
      const size = Math.floor(Math.random() * 6) + 4; // 4px to 10px
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      
      container.appendChild(p);
    }

    document.body.appendChild(container);
    // Auto-remove confetti elements after completion to free resources
    setTimeout(() => {
      container.remove();
    }, 7000);
  };

  // Helper function to scan DOM nodes recursively and replace emojis
  function replaceEmojisInDOM(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      let newHtml = text;
      let hasReplacements = false;

      // Scan for known emoji strings
      for (const emoji of Object.keys(pixelIcons)) {
        if (text.includes(emoji)) {
          // Replace it with temporary placeholders to prevent double parsing
          const placeholder = `__PIXEL_${emoji}__`;
          newHtml = newHtml.split(emoji).join(placeholder);
          hasReplacements = true;
        }
      }

      if (hasReplacements) {
        const span = document.createElement('span');
        span.style.display = 'inline';
        
        let processedHtml = newHtml;
        for (const emoji of Object.keys(pixelIcons)) {
          const placeholder = `__PIXEL_${emoji}__`;
          if (processedHtml.includes(placeholder)) {
            // Render at standard sizes depending on context
            let size = 20; // default for text inline
            if (node.parentElement && (node.parentElement.classList.contains('qemoji') || node.parentElement.id === 'dice')) {
              size = 32;
            }
            const iconHtml = window.getPixelIcon(emoji, size);
            processedHtml = processedHtml.split(placeholder).join(iconHtml);
          }
        }
        
        span.innerHTML = processedHtml;
        node.parentNode.replaceChild(span, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Don't parse script or style elements, and don't re-parse already replaced wrappers
      if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && !node.classList.contains('pixel-icon-wrapper')) {
        // If element is one of our containers, we can directly format its content
        if (node.classList.contains('qemoji') || node.classList.contains('mode-icon') || node.classList.contains('start-badge') || node.id === 'dice') {
          const emojiText = node.textContent.trim();
          if (pixelIcons[emojiText]) {
            let size = 28;
            if (node.classList.contains('start-badge')) size = 48;
            if (node.id === 'dice') size = 64;
            if (node.classList.contains('qemoji')) size = 36;
            node.innerHTML = window.getPixelIcon(emojiText, size);
            return;
          }
        }
        
        // Traverse child nodes
        const children = [...node.childNodes];
        for (const child of children) {
          replaceEmojisInDOM(child);
        }
      }
    }
  }

  // Hook automatically once script is loaded
  function initAutoParser() {
    replaceEmojisInDOM(document.body);

    // Setup MutationObserver to watch for dynamic DOM modifications (e.g. gameplay logs, next turns, dice roll updates)
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (addedNode) {
          // Prevent infinite loops by avoiding re-parsing nodes we created
          if (addedNode.nodeType === Node.ELEMENT_NODE && (addedNode.classList.contains('pixel-icon-wrapper') || addedNode.classList.contains('pixel-confetti-container'))) {
            return;
          }
          replaceEmojisInDOM(addedNode);
        });

        // Watch for character data modifications (when textContent is reassigned)
        if (mutation.type === 'characterData') {
          const parent = mutation.target.parentNode;
          if (parent && !parent.classList.contains('pixel-icon-wrapper')) {
            replaceEmojisInDOM(parent);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoParser);
  } else {
    initAutoParser();
  }
})();
