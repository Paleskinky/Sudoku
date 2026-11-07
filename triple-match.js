
(() => {
  const symbols = [
    ["●", "#D78F83"],
    ["◆", "#9B9BB8"],
    ["▲", "#91A58A"],
    ["✿", "#D5AC72"],
    ["■", "#8FAEB0"],
    ["♥", "#C58C9C"],
    ["✦", "#B49A79"],
    ["⬟", "#929B83"]
  ];

  const style = document.createElement("style");
  style.textContent = `
    #triple-game {
      position: fixed;
      inset: 0;
      z-index: 10000;
      overflow-y: auto;
      padding: max(65px, env(safe-area-inset-top) + 45px) 18px 35px;
      background: #F5F4F0;
      color: #34352F;
      font-family: inherit;
    }
    #triple-game * { box-sizing: border-box; }
    .tm-top {
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:12px;
      margin-bottom:22px;
    }
    .tm-top h2 {
      font-size:25px;
      margin:0;
      letter-spacing:-1px;
    }
    .tm-sub {
      color:#898A80;
      font-size:12px;
      margin-top:4px;
    }
    .tm-restart {
      border:1px solid #DAD8D0;
      border-radius:20px;
      background:#FAF9F6;
      padding:10px 14px;
      color:#34352F;
      font:inherit;
      font-size:12px;
    }
    .tm-progress {
      height:5px;
      background:#E4E2DB;
      border-radius:9px;
      overflow:hidden;
      margin:16px 0 22px;
    }
    .tm-progress span {
      display:block;
      height:100%;
      width:0;
      background:#89927F;
      transition:width .2s ease;
    }
    .tm-board {
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:9px;
      margin:0 auto 24px;
      max-width:430px;
    }
    .tm-tile {
      aspect-ratio:1;
      border:1px solid #E0DED6;
      border-radius:15px;
      background:#FAF9F6;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:30px;
      font-weight:500;
      cursor:pointer;
      -webkit-tap-highlight-color:transparent;
      transition:transform .15s, opacity .15s;
    }
    .tm-tile:active { transform:scale(.92); }
    .tm-tile.empty {
      visibility:hidden;
      pointer-events:none;
    }
    .tm-tray-title {
      font-size:12px;
      color:#898A80;
      margin-bottom:10px;
    }
    .tm-tray {
      display:grid;
      grid-template-columns:repeat(7,minmax(0,1fr));
      gap:6px;
      padding:10px;
      border:1px solid #DAD8D0;
      border-radius:17px;
      background:#EFEEE9;
      min-height:66px;
    }
    .tm-slot {
      aspect-ratio:1;
      border-radius:10px;
      background:#FAF9F6;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:22px;
      min-width:0;
    }
    .tm-controls {
      display:flex;
      justify-content:center;
      gap:9px;
      margin-top:18px;
    }
    .tm-controls button {
      border:1px solid #DAD8D0;
      border-radius:20px;
      background:#FAF9F6;
      color:#34352F;
      padding:10px 17px;
      font:inherit;
      font-size:12px;
    }
    .tm-message {
      text-align:center;
      color:#818777;
      font-size:13px;
      min-height:20px;
      margin:14px 0;
    }
    .tm-result {
      position:fixed;
      inset:0;
      z-index:10005;
      background:#34352F66;
      display:none;
      align-items:center;
      justify-content:center;
      padding:24px;
    }
    .tm-result-box {
      width:100%;
      max-width:300px;
      padding:28px;
      border-radius:23px;
      background:#FAF9F6;
      text-align:center;
    }
    .tm-result-box h3 { margin:0 0 8px; }
    .tm-result-box p {
      color:#898A80;
      font-size:13px;
      line-height:1.5;
    }
    .tm-result-box button {
      border:0;
      border-radius:20px;
      padding:12px 22px;
      background:#E8E9E1;
      color:#34352F;
      font:inherit;
      margin-top:10px;
    }
    .tm-difficulty {
      display:flex;
      gap:7px;
      margin:0 0 18px;
    }
    .tm-difficulty button {
      flex:1;
      border:1px solid #DAD8D0;
      border-radius:18px;
      background:#FAF9F6;
      color:#77796F;
      padding:9px 4px;
      font:inherit;
      font-size:11px;
    }
    .tm-difficulty button.active {
      background:#E8E9E1;
      color:#34352F;
      border-color:#A6AA9B;
    }
  `;
  document.head.appendChild(style);

  const game = document.createElement("div");
  game.id = "triple-game";
  game.style.display = "none";
  game.innerHTML = `
    <div class="tm-top">
      <div>
        <h2>Triple Match</h2>
        <div class="tm-sub">Собери три одинаковых элемента</div>
      </div>
      <button class="tm-restart" id="tm-restart">↻ Заново</button>
    </div>

    <div class="tm-difficulty">
      <button data-level="easy">Легко</button>
      <button data-level="normal" class="active">Средне</button>
      <button data-level="hard">Сложно</button>
    </div>

    <div class="tm-progress"><span id="tm-progress"></span></div>
    <div class="tm-board" id="tm-board"></div>

    <div class="tm-tray-title">ТВОЯ ПАНЕЛЬ · <span id="tm-count">0/7</span></div>
    <div class="tm-tray" id="tm-tray"></div>
    <div class="tm-message" id="tm-message">Найди три одинаковых элемента</div>

    <div class="tm-controls">
      <button id="tm-undo">Отменить ход</button>
      <button id="tm-new">Новая игра</button>
    </div>

    <div class="tm-result" id="tm-result">
      <div class="tm-result-box">
        <h3 id="tm-result-title"></h3>
        <p id="tm-result-text"></p>
        <button id="tm-result-button">Продолжить</button>
      </div>
    </div>
  `;
  document.body.appendChild(game);

  const $ = id => game.querySelector("#" + id);

  let level = "normal";
  let board = [];
  let tray = [];
  let history = [];
  let removed = 0;
  let locked = false;

  const settings = {
    easy: { types: 4, copies: 3 },
    normal: { types: 6, copies: 3 },
    hard: { types: 8, copies: 3 }
  };

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function start() {
    const cfg = settings[level];
    board = [];

    for (let i = 0; i < cfg.types; i++) {
      for (let j = 0; j < cfg.copies; j++) {
        board.push(i);
      }
    }

    shuffle(board);
    tray = [];
    history = [];
    removed = 0;
    locked = false;
    $("tm-result").style.display = "none";
    $("tm-message").textContent = "Найди три одинаковых элемента";
    render();
  }

  function render() {
    const boardEl = $("tm-board");
    boardEl.innerHTML = "";

    const cols = level === "hard" ? 4 : 4;
    boardEl.style.gridTemplateColumns = `repeat(${cols}, minmax(0,1fr))`;

    board.forEach((item, index) => {
      const tile = document.createElement("button");
      tile.className = "tm-tile" + (item === null ? " empty" : "");
      tile.textContent = item === null ? "" : symbols[item][0];
      tile.style.color = item === null ? "transparent" : symbols[item][1];
      tile.disabled = item === null || locked;
      tile.addEventListener("click", () => take(index));
      boardEl.appendChild(tile);
    });

    const trayEl = $("tm-tray");
    trayEl.innerHTML = "";

    for (let i = 0; i < 7; i++) {
      const slot = document.createElement("div");
      slot.className = "tm-slot";
      const item = tray[i];
      slot.textContent = item === undefined ? "" : symbols[item][0];
      if (item !== undefined) slot.style.color = symbols[item][1];
      trayEl.appendChild(slot);
    }

    $("tm-count").textContent = `${tray.length}/7`;
    $("tm-progress").style.width =
      (removed / (settings[level].types * 3) * 100) + "%";
  }

  function take(index) {
    if (locked || board[index] === null) return;

    history.push({
      index,
      item: board[index],
      tray: [...tray],
      removed
    });

    const item = board[index];
    board[index] = null;
    tray.push(item);

    const matches = tray.filter(x => x === item).length;

    if (matches === 3) {
      tray = tray.filter(x => x !== item);
      removed += 3;
      $("tm-message").textContent = "Отлично! Тройка собрана";
    } else {
      $("tm-message").textContent = "Продолжай искать совпадения";
    }

    render();

    if (removed === settings[level].types * 3) {
      finish(true);
    } else if (tray.length >= 7) {
      finish(false);
    }
  }

  function finish(won) {
    locked = true;
    $("tm-result-title").textContent = won ? "Уровень пройден!" : "Панель заполнена";
    $("tm-result-text").textContent = won
      ? "Ты собрала все тройки. Отличная работа!"
      : "Не хватило места. Попробуй ещё раз!";
    $("tm-result-button").textContent = won ? "Ещё уровень" : "Повторить";
    $("tm-result").style.display = "flex";
  }

  function undo() {
    if (!history.length || locked) return;
    const last = history.pop();
    board[last.index] = last.item;
    tray = last.tray;
    removed = last.removed;
    $("tm-message").textContent = "Ход отменён";
    render();
  }

  $("tm-restart").addEventListener("click", start);
  $("tm-new").addEventListener("click", start);
  $("tm-undo").addEventListener("click", undo);
  $("tm-result-button").addEventListener("click", start);

  game.querySelectorAll("[data-level]").forEach(button => {
    button.addEventListener("click", () => {
      level = button.dataset.level;
      game.querySelectorAll("[data-level]").forEach(b =>
        b.classList.toggle("active", b === button)
      );
      start();
    });
  });

  window.startTripleMatch = () => {
    game.style.display = "block";
    start();
  };

  const back = document.getElementById("mindless-back");
  if (back) {
    back.addEventListener("click", () => {
      game.style.display = "none";
    });
  }
})();
