
(() => {
  const style = document.createElement("style");
  style.textContent = `
    #puzzle-club {
      position: fixed;
      inset: 0;
      z-index: 9999;
      overflow-y: auto;
      background: #f5f1e9;
      color: #292820;
      font-family: inherit;
      padding: 28px 20px 40px;
    }

    #puzzle-club * { box-sizing: border-box; }

    .pc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 12px 0 36px;
    }

    .pc-logo {
      font-size: 25px;
      font-weight: 800;
      letter-spacing: -1px;
    }

    .pc-subtitle {
      color: #858174;
      font-size: 13px;
      margin-top: 5px;
    }

    .pc-label {
      font-size: 11px;
      letter-spacing: 2px;
      color: #999184;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .pc-heading {
      font-size: 29px;
      line-height: 1.15;
      letter-spacing: -1px;
      margin: 0 0 9px;
    }

    .pc-description {
      color: #858174;
      font-size: 14px;
      margin: 0 0 25px;
    }

    .pc-games {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 13px;
    }

    .pc-card {
      border: 0;
      border-radius: 22px;
      min-height: 175px;
      padding: 17px;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #292820;
      cursor: pointer;
      font: inherit;
      position: relative;
      overflow: hidden;
    }

    .pc-card:active { transform: scale(.97); }

    .pc-card.sudoku { background: #d9e3d1; }
    .pc-card.triple { background: #f0d8c8; }
    .pc-card.bus { background: #e8dfb9; }
    .pc-card.screw { background: #d9d7e8; }

    .pc-icon { font-size: 35px; }
    .pc-card-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -.5px;
    }

    .pc-card-note {
      font-size: 11px;
      opacity: .65;
      margin-top: 4px;
    }

    .pc-bottom {
      margin-top: 35px;
      padding: 19px;
      background: #eae5da;
      border-radius: 20px;
      font-size: 13px;
      color: #777164;
      line-height: 1.5;
    }

    .pc-back {
      position: fixed;
      z-index: 10001;
      top: 12px;
      left: 12px;
      border: 0;
      border-radius: 30px;
      padding: 11px 16px;
      background: #292820;
      color: white;
      font-size: 13px;
      font-weight: 700;
      display: none;
    }

    .pc-message {
      position: fixed;
      z-index: 10002;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 25px;
      background: #0006;
    }

    .pc-message-box {
      background: #f5f1e9;
      padding: 28px;
      border-radius: 22px;
      max-width: 300px;
      text-align: center;
    }

    .pc-message-box button {
      border: 0;
      border-radius: 20px;
      background: #292820;
      color: white;
      padding: 11px 25px;
      margin-top: 15px;
    }
  `;
  document.head.appendChild(style);

  const sudoku = document.querySelector(".app");
  if (!sudoku) {
    console.error("Puzzle Club: не найден элемент .app");
    return;
  }

  const menu = document.createElement("div");
  menu.id = "puzzle-club";

  menu.innerHTML = `
    <header class="pc-header">
      <div>
        <div class="pc-logo">puzzle club ✳</div>
        <div class="pc-subtitle">a little place for big puzzles</div>
      </div>
    </header>

    <div class="pc-label">YOUR GAME COLLECTION</div>
    <h1 class="pc-heading">Во что<br>поиграем?</h1>
    <p class="pc-description">Выбирай игру и немного отвлекись.</p>

    <div class="pc-games">
      <button class="pc-card sudoku" data-game="sudoku">
        <span class="pc-icon">▦</span>
        <span>
          <div class="pc-card-title">Sudoku</div>
          <div class="pc-card-note">Логика и числа</div>
        </span>
      </button>

      <button class="pc-card triple" data-game="triple">
        <span class="pc-icon">🍓</span>
        <span>
          <div class="pc-card-title">Triple Match</div>
          <div class="pc-card-note">Собери тройки</div>
        </span>
      </button>

      <button class="pc-card bus" data-game="bus">
        <span class="pc-icon">🚌</span>
        <span>
          <div class="pc-card-title">Bus Jam</div>
          <div class="pc-card-note">Разрули движение</div>
        </span>
      </button>

      <button class="pc-card screw" data-game="screw">
        <span class="pc-icon">🔩</span>
        <span>
          <div class="pc-card-title">Screw Jam</div>
          <div class="pc-card-note">Освободи детали</div>
        </span>
      </button>
    </div>

    <div class="pc-bottom">
      ✳ Четыре игры, разные механики и одна общая коллекция.
      <br>Выбирай настроение — остальное мы организуем.
    </div>

    <div class="pc-message" id="pc-message">
      <div class="pc-message-box">
        <div style="font-size:35px">✳</div>
        <h3 id="pc-message-title">Скоро!</h3>
        <p id="pc-message-text">Эта игра пока готовится.</p>
        <button id="pc-message-close">Понятно</button>
      </div>
    </div>
  `;

  document.body.appendChild(menu);

  const back = document.createElement("button");
  back.className = "pc-back";
  back.textContent = "← Все игры";
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
      const game = card.dataset.game;

      if (game === "sudoku") {
        openSudoku();
        return;
      }

      const names = {
        triple: "Triple Match",
        bus: "Bus Jam",
        screw: "Screw Jam"
      };

      menu.querySelector("#pc-message-title").textContent =
        names[game];

      menu.querySelector("#pc-message-text").textContent =
        "Сейчас собираем эту игру. Скоро здесь появится полноценный уровень!";

      menu.querySelector("#pc-message").style.display = "flex";
    });
  });

  menu.querySelector("#pc-message-close")
    .addEventListener("click", () => {
      menu.querySelector("#pc-message").style.display = "none";
    });

  openMenu();
})();
