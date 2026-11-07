
(() => {
  const old = document.querySelector("#puzzle-club");
  const oldStyle = document.querySelector("#mindless-style");
  const oldBack = document.querySelector("#mindless-back");
  if (old) old.remove();
  if (oldStyle) oldStyle.remove();
  if (oldBack) oldBack.remove();

  const css = document.createElement("style");
  css.id = "mindless-style";
  css.textContent = `
    #puzzle-club {
      position: fixed;
      inset: 0;
      z-index: 9999;
      overflow-y: auto;
      background: #F5F4F0;
      color: #34352F;
      font-family: inherit;
      padding: max(30px, env(safe-area-inset-top)) 20px 40px;
    }

    #puzzle-club * { box-sizing: border-box; }

    .ml-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 12px 0 30px;
    }

    .ml-logo {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: -1.8px;
      color: #373930;
      text-shadow: 0 1px 0 #fff, 0 2px 0 #d8d7cf;
    }

    .ml-settings {
      width: 42px;
      height: 42px;
      border: 1px solid #DAD8D0;
      border-radius: 50%;
      background: #FAF9F6;
      color: #818777;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .ml-settings:active {
      transform: scale(.96);
      background: #F0EFEA;
    }

    .ml-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 13px;
    }

    .ml-card {
      aspect-ratio: 1 / 1;
      min-width: 0;
      padding: 18px 15px 16px;
      border: 1px solid #DAD8D0;
      border-radius: 23px;
      background: #FAF9F6;
      color: #34352F;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      font: inherit;
      cursor: pointer;
      transition: transform .15s ease, background .15s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .ml-card:active {
      transform: scale(.97);
      background: #F0EFEA;
    }

    .ml-art {
      width: 76px;
      height: 76px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto 0;
    }

    .ml-art svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .ml-card-name {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -.45px;
      padding-top: 10px;
    }

    .ml-back {
      position: fixed;
      z-index: 10001;
      top: max(12px, env(safe-area-inset-top));
      left: 12px;
      padding: 10px 16px;
      border: 1px solid #DAD8D0;
      border-radius: 30px;
      background: #FAF9F6;
      color: #34352F;
      font-size: 13px;
      font-weight: 700;
      display: none;
    }

    .ml-overlay {
      position: fixed;
      inset: 0;
      z-index: 10002;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: #34352F55;
    }

    .ml-dialog {
      max-width: 300px;
      width: 100%;
      padding: 28px;
      border: 1px solid #DAD8D0;
      border-radius: 24px;
      background: #FAF9F6;
      text-align: center;
    }

    .ml-dialog button {
      border: 1px solid #DAD8D0;
      border-radius: 20px;
      padding: 10px 24px;
      background: #F0EFEA;
      color: #34352F;
      margin-top: 12px;
    }
  `;

  document.head.appendChild(css);

  const sudoku = document.querySelector(".app");

  if (!sudoku) {
    console.error("Mindless: Sudoku container .app not found");
    return;
  }

  const icons = {
    sudoku: `
      <svg viewBox="0 0 80 80" fill="none"
        stroke="#818777" stroke-width="1.8"
        stroke-linecap="round">
        <rect x="9" y="9" width="62" height="62" rx="5"/>
        <path d="M29.7 9V71 M50.3 9V71 M9 29.7H71 M9 50.3H71"/>
        <g fill="#687160" stroke="none"
          font-size="12" font-weight="600"
          text-anchor="middle">
          <text x="19" y="24">2</text>
          <text x="40" y="44">5</text>
          <text x="60" y="64">8</text>
          <text x="60" y="24">7</text>
        </g>
      </svg>
    `,

    strawberry: `
      <svg viewBox="0 0 80 80" fill="none"
        stroke="#818777" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 22
          C31 22 20 28 19 40
          C18 52 31 68 40 72
          C49 68 62 52 61 40
          C60 28 49 22 40 22Z"/>
        <path d="M40 24
          C32 12 23 15 25 22
          C30 23 35 23 40 24Z"
          fill="#E7E8E0"/>
        <path d="M40 24
          C42 12 54 13 54 20
          C50 23 45 24 40 24Z"
          fill="#E7E8E0"/>
        <path d="M40 24
          C37 13 39 9 42 9
          C46 14 43 20 40 24Z"
          fill="#E7E8E0"/>
        <g fill="#818777" stroke="none">
          <ellipse cx="31" cy="36" rx="1.4" ry="2"/>
          <ellipse cx="46" cy="35" rx="1.4" ry="2"/>
          <ellipse cx="25" cy="47" rx="1.4" ry="2"/>
          <ellipse cx="39" cy="46" rx="1.4" ry="2"/>
          <ellipse cx="54" cy="46" rx="1.4" ry="2"/>
          <ellipse cx="33" cy="57" rx="1.4" ry="2"/>
          <ellipse cx="46" cy="57" rx="1.4" ry="2"/>
        </g>
      </svg>
    `,

    bus: `
      <svg viewBox="0 0 80 80" fill="none"
        stroke="#818777" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 57V28
          C17 22 21 18 27 18H58
          C64 18 67 22 67 28V57
          H17Z"/>
        <path d="M17 47H67"/>
        <path d="M24 25H38V41H24Z"/>
        <path d="M44 25H60V41H44Z"/>
        <path d="M22 49H62"/>
        <path d="M25 57V62 M59 57V62"/>
        <circle cx="28" cy="59" r="5" fill="#F5F4F0"/>
        <circle cx="56" cy="59" r="5" fill="#F5F4F0"/>
        <path d="M17 44H13 M67 44H71"/>
        <path d="M25 12H59" stroke-width="1.5"/>
      </svg>
    `,

    screw: `
      <svg viewBox="0 0 80 80" fill="none"
        stroke="#818777" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <g transform="rotate(-35 40 40)">
          <path d="M34 22H46V32H34Z"
            fill="#E7E8E0"/>
          <path d="M37 25H43 M40 22V32"
            stroke-width="1.5"/>
          <path d="M36 32V61L40 69L44 61V32"/>
          <path d="M36 39L44 43
            M36 46L44 50
            M36 53L44 57"
            stroke-width="1.6"/>
        </g>
      </svg>
    `
  };

  const menu = document.createElement("div");
  menu.id = "puzzle-club";

  menu.innerHTML = `
    <header class="ml-header">
      <div class="ml-logo">Mindless.</div>

      <button class="ml-settings" aria-label="Settings">
        <svg viewBox="0 0 24 24" width="21" height="21"
          fill="none" stroke="currentColor" stroke-width="1.7"
          stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true">
          <path d="M10 2.8h4l.55 2.35a7.4 7.4 0 0 1 1.65.96l2.3-.7 2 3.46-1.75 1.65a7.7 7.7 0 0 1 0 1.92l1.75 1.65-2 3.46-2.3-.7a7.4 7.4 0 0 1-1.65.96L14 20.2h-4l-.55-2.35a7.4 7.4 0 0 1-1.65-.96l-2.3.7-2-3.46 1.75-1.65a7.7 7.7 0 0 1 0-1.92L3.5 8.91l2-3.46 2.3.7a7.4 7.4 0 0 1 1.65-.96L10 2.8Z"/>
          <circle cx="12" cy="11.95" r="3.05"/>
        </svg>
      </button>
    </header>

    <div class="ml-grid">
      <button class="ml-card" data-game="sudoku">
        <span class="ml-art">${icons.sudoku}</span>
        <span class="ml-card-name">Sudoku</span>
      </button>

      <button class="ml-card" data-game="triple">
        <span class="ml-art">${icons.strawberry}</span>
        <span class="ml-card-name">Triple Match</span>
      </button>

      <button class="ml-card" data-game="bus">
        <span class="ml-art">${icons.bus}</span>
        <span class="ml-card-name">Bus Jam</span>
      </button>

      <button class="ml-card" data-game="screw">
        <span class="ml-art">${icons.screw}</span>
        <span class="ml-card-name">Screw Puzzle</span>
      </button>
    </div>

    <div class="ml-overlay" id="ml-overlay">
      <div class="ml-dialog">
        <h3 id="ml-dialog-title">Coming soon</h3>
        <p id="ml-dialog-text">This game is being prepared.</p>
        <button id="ml-dialog-close">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(menu);

  const back = document.createElement("button");
  back.className = "ml-back";
  back.textContent = "← Mindless";
  back.id = "mindless-back";
  document.body.appendChild(back);

  function openMenu() {
    menu.style.display = "block";
    sudoku.style.display = "none";
    back.style.display = "none";
  }

  function openSudoku() {
    menu.style.display = "none";
    sudoku.style.display = "";
    back.style.display = "block";
  }

  back.addEventListener("click", openMenu);

  menu.querySelectorAll("[data-game]").forEach(card => {
    card.addEventListener("click", () => {
      if (card.dataset.game === "sudoku") {
        openSudoku();
        return;
      }

      const names = {
        triple: "Triple Match",
        bus: "Bus Jam",
        screw: "Screw Puzzle"
      };

      menu.querySelector("#ml-dialog-title").textContent =
        names[card.dataset.game];

      menu.querySelector("#ml-overlay").style.display = "flex";
    });
  });

  menu.querySelector("#ml-dialog-close")
    .addEventListener("click", () => {
      menu.querySelector("#ml-overlay").style.display = "none";
    });

  openMenu();
})();
