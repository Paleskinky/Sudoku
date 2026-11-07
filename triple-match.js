
(() => {
  const symbols = [
    ["●", "#D78F83"], ["◆", "#9B9BB8"], ["▲", "#91A58A"], ["✿", "#D5AC72"],
    ["■", "#8FAEB0"], ["♥", "#C58C9C"], ["✦", "#B49A79"], ["⬟", "#929B83"]
  ];
  const style = document.createElement("style");
  style.textContent = `
    #triple-game {
      position:fixed; inset:0; z-index:10000; overflow-y:auto;
      padding:max(65px,env(safe-area-inset-top) + 45px) 16px 35px;
      background:#F5F4F0; color:#34352F; font-family:inherit;
    }
    #triple-game * { box-sizing:border-box; }
    .tm-top { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:17px; }
    .tm-top h2 { font-size:25px; margin:0; letter-spacing:-1px; }
    .tm-sub { color:#898A80; font-size:12px; margin-top:4px; }
    .tm-restart,.tm-controls button {
      border:1px solid #DAD8D0; border-radius:20px; background:#FAF9F6;
      padding:10px 14px; color:#34352F; font:inherit; font-size:12px;
    }
    .tm-mode-title,.tm-tray-title { color:#898A80; font-size:10px; letter-spacing:.08em; margin:14px 0 8px; }
    .tm-difficulty { display:flex; gap:7px; margin-bottom:10px; }
    .tm-difficulty button,.tm-stages button {
      border:1px solid #DAD8D0; border-radius:18px; background:#FAF9F6;
      color:#77796F; padding:9px 5px; font:inherit; font-size:11px;
    }
    .tm-difficulty button { flex:1; }
    .tm-difficulty button.active,.tm-stages button.active {
      background:#E8E9E1; color:#34352F; border-color:#A6AA9B;
    }
    .tm-stages { display:none; gap:6px; overflow-x:auto; padding:2px 0 10px; }
    .tm-stages.visible { display:flex; }
    .tm-stages button { flex:0 0 auto; min-width:43px; }
    .tm-status { display:flex; justify-content:space-between; color:#85867D; font-size:11px; margin:9px 2px; }
    .tm-progress { height:5px; background:#E4E2DB; border-radius:9px; overflow:hidden; margin:10px 0 16px; }
    .tm-progress span { display:block; height:100%; width:0; background:#89927F; transition:width .2s ease; }
    .tm-board-wrap { width:min(100%,410px); margin:0 auto 18px; }
    .tm-board {
      position:relative; width:100%; aspect-ratio:1; max-height:410px;
      border-radius:20px; background:#EEEDE7; border:1px solid #E1DFD7;
      overflow:hidden; isolation:isolate;
    }
    .tm-tile {
      position:absolute; width:14.1%; height:14.1%; padding:0;
      border:1px solid #D8D5CC; border-radius:11px; background:#FCFBF8;
      display:flex; align-items:center; justify-content:center;
      font-size:clamp(19px,6vw,29px); font-weight:500;
      box-shadow:0 3px 0 #D8D5CC,0 5px 9px #5D594D20;
      -webkit-tap-highlight-color:transparent;
      transition:transform .12s,opacity .12s,filter .12s;
    }
    .tm-tile:active:not(:disabled) { transform:scale(.94); }
    .tm-tile.blocked {
      filter:grayscale(.65); opacity:.72;
      box-shadow:0 2px 0 #D8D5CC,0 3px 5px #5D594D12;
    }
    .tm-tile.blocked:after {
      content:''; position:absolute; inset:0; border-radius:10px;
      background:linear-gradient(135deg,#6C6B6320,#6C6B6308);
    }
    .tm-tile:disabled { cursor:default; }
    .tm-tray-title { margin-top:14px; }
    .tm-tray {
      display:grid; grid-template-columns:repeat(7,minmax(0,1fr));
      gap:6px; padding:9px; border:1px solid #DAD8D0;
      border-radius:17px; background:#EFEEE9; min-height:62px;
    }
    .tm-slot {
      aspect-ratio:1; border-radius:9px; background:#FAF9F6;
      display:flex; align-items:center; justify-content:center;
      font-size:clamp(17px,5vw,23px); min-width:0;
    }
    .tm-message { text-align:center; color:#818777; font-size:12px; min-height:18px; margin:12px 0; }
    .tm-controls { display:flex; justify-content:center; gap:9px; margin-top:14px; }
    .tm-result {
      position:fixed; inset:0; z-index:10005; background:#34352F66;
      display:none; align-items:center; justify-content:center; padding:24px;
    }
    .tm-result-box {
      width:100%; max-width:300px; padding:28px; border-radius:23px;
      background:#FAF9F6; text-align:center; box-shadow:0 12px 40px #0002;
    }
    .tm-result-box h3 { margin:0 0 8px; }
    .tm-result-box p { color:#898A80; font-size:13px; line-height:1.5; }
    .tm-result-box button {
      border:0; border-radius:20px; padding:12px 22px;
      background:#E8E9E1; color:#34352F; font:inherit; margin-top:10px;
    }
    @media(max-width:360px) {
      #triple-game { padding-left:11px; padding-right:11px; }
      .tm-tile { border-radius:8px; }
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
        <div class="tm-sub">Разбирай слои и собирай тройки</div>
      </div>
      <button class="tm-restart" id="tm-restart">↻ Заново</button>
    </div>

    <div class="tm-mode-title">РЕЖИМ</div>
    <div class="tm-difficulty">
      <button data-mode="easy">Легко</button>
      <button data-mode="normal" class="active">Средне</button>
      <button data-mode="hard">Хард</button>
    </div>

    <div class="tm-stages" id="tm-stages">
      <button data-stage="5" class="active">5 слоёв</button>
      <button data-stage="6">6</button>
      <button data-stage="7">7</button>
      <button data-stage="8">8</button>
      <button data-stage="9">9</button>
      <button data-stage="10">10</button>
    </div>

    <div class="tm-status">
      <span id="tm-level-label">Уровень 1</span>
      <span id="tm-layer-label">Слоёв: 4</span>
    </div>
    <div class="tm-progress"><span id="tm-progress"></span></div>
    <div class="tm-board-wrap">
      <div class="tm-board" id="tm-board"></div>
    </div>

    <div class="tm-tray-title">ТВОЯ ПАНЕЛЬ · <span id="tm-count">0/7</span></div>
    <div class="tm-tray" id="tm-tray"></div>
    <div class="tm-message" id="tm-message">Сначала открывай верхние карточки</div>

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

  let mode = "normal";
  let hardStage = 5;
  let levelNumber = 1;
  let tiles = [];
  let tray = [];
  let history = [];
  let removed = 0;
  let locked = false;
  let nextAction = "restart";

  const shapes = ["pyramid", "checker", "ring", "maze", "tower"];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function cellsFor(shape, count, variant) {
    const cells = [];
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) cells.push({x,y});
    }

    const center = p => Math.abs(p.x - 3) + Math.abs(p.y - 3);

    if (shape === "pyramid") {
      cells.sort((a,b) =>
        center(a)-center(b) ||
        ((a.x+a.y+variant)%2)-((b.x+b.y+variant)%2)
      );
    } else if (shape === "checker") {
      cells.sort((a,b) =>
        ((a.x+a.y+variant)%2)-((b.x+b.y+variant)%2) ||
        center(a)-center(b)
      );
    } else if (shape === "ring") {
      cells.sort((a,b) =>
        Math.max(Math.abs(b.x-3),Math.abs(b.y-3)) -
        Math.max(Math.abs(a.x-3),Math.abs(a.y-3)) ||
        Math.atan2(a.y-3,a.x-3)-Math.atan2(b.y-3,b.x-3)
      );
    } else if (shape === "maze") {
      cells.sort((a,b) =>
        ((a.y+variant)%2) ? b.x-a.x : a.x-b.x
      );
    } else {
      cells.sort((a,b) =>
        Math.abs(a.x-3)-Math.abs(b.x-3) ||
        Math.abs(a.y-3)-Math.abs(b.y-3)
      );
    }

    const selected = cells.slice(0,count);
    if (variant % 2) selected.reverse();
    return selected;
  }

  function makeLevel() {
    let layerCount;

    if (mode === "hard") {
      layerCount = hardStage;
    } else if (mode === "easy") {
      layerCount = 2 + ((levelNumber-1)%2);
    } else {
      layerCount = 4 + ((levelNumber-1)%2);
    }

    const counts = Array.from({length:layerCount}, () => 12);

    if (layerCount % 2) {
      counts[Math.floor(layerCount/2)] = 24;
    }

    const total = counts.reduce((a,b) => a+b,0);
    const bag = [];

    for (let type=0; type<8; type++) {
      for (let n=0; n<total/8; n++) bag.push(type);
    }

    shuffle(bag);

    tiles = [];
    let cursor = 0;

    counts.forEach((count,layer) => {
      const shape = shapes[
        (layer + (mode === "hard" ? hardStage-5 : levelNumber-1)) %
        shapes.length
      ];

      cellsFor(shape,count,layer+levelNumber).forEach((p,i) => {
        tiles.push({
          id: layer+"-"+i+"-"+Math.random().toString(36).slice(2,7),
          x:p.x,
          y:p.y,
          layer,
          type:bag[cursor++],
          gone:false
        });
      });
    });

    tray = [];
    history = [];
    removed = 0;
    locked = false;

    $("tm-result").style.display = "none";
    $("tm-level-label").textContent =
      mode === "hard" ? "Хард · "+hardStage+" слоёв" : "Уровень "+levelNumber;
    $("tm-layer-label").textContent = "Слоёв: "+layerCount;
    $("tm-message").textContent = "Открывай верхние карточки и собирай тройки";

    render();
  }

  function isBlocked(tile) {
    return tiles.some(other =>
      !other.gone &&
      other.layer > tile.layer &&
      Math.abs(other.x-tile.x) < 1 &&
      Math.abs(other.y-tile.y) < 1
    );
  }

  function render() {
    const board = $("tm-board");
    board.innerHTML = "";

    tiles.forEach(tile => {
      if (tile.gone) return;

      const blocked = isBlocked(tile);
      const el = document.createElement("button");

      el.className = "tm-tile" + (blocked ? " blocked" : "");
      el.textContent = symbols[tile.type][0];
      el.style.color = symbols[tile.type][1];
      el.style.left = (tile.x*14.2857+tile.layer*0.45)+"%";
      el.style.top = (tile.y*14.2857-tile.layer*0.45)+"%";
      el.style.zIndex = String(20+tile.layer);
      el.disabled = blocked || locked;
      el.setAttribute(
        "aria-label",
        blocked ? "Закрытая карточка" : "Открытая карточка"
      );
      el.addEventListener("click", () => take(tile.id));

      board.appendChild(el);
    });

    const trayEl = $("tm-tray");
    trayEl.innerHTML = "";

    for (let i=0; i<7; i++) {
      const slot = document.createElement("div");
      slot.className = "tm-slot";

      if (tray[i] !== undefined) {
        slot.textContent = symbols[tray[i]][0];
        slot.style.color = symbols[tray[i]][1];
      }

      trayEl.appendChild(slot);
    }

    $("tm-count").textContent = tray.length+"/7";
    $("tm-progress").style.width =
      (removed/tiles.length*100)+"%";
  }

  function take(id) {
    if (locked) return;

    const tile = tiles.find(t => t.id === id);

    if (!tile || tile.gone || isBlocked(tile)) return;

    history.push({
      tiles:tiles.map(t => ({...t})),
      tray:[...tray],
      removed
    });

    tile.gone = true;
    tray.push(tile.type);

    if (tray.filter(type => type === tile.type).length === 3) {
      let left = 3;

      tray = tray.filter(type => {
        if (type === tile.type && left > 0) {
          left--;
          return false;
        }
        return true;
      });

      removed += 3;
      $("tm-message").textContent = "Есть тройка! Слой за слоем";
    } else {
      $("tm-message").textContent = "Ищи ещё две такие карточки";
    }

    render();

    if (tiles.every(t => t.gone)) {
      finish(true);
    } else if (tray.length >= 7) {
      finish(false);
    }
  }

  function finish(won) {
    locked = true;

    $("tm-result-title").textContent =
      won ? "Уровень пройден!" : "Панель заполнена";

    $("tm-result-text").textContent = won
      ? "Все карточки разобраны. Готова к следующему слою?"
      : "Семь ячеек заняты. Попробуй другую последовательность ходов.";

    $("tm-result-button").textContent =
      won ? "Следующий уровень" : "Повторить";

    nextAction = won ? "next" : "restart";
    $("tm-result").style.display = "flex";
  }

  function undo() {
    if (!history.length || locked) return;

    const prev = history.pop();

    tiles = prev.tiles;
    tray = prev.tray;
    removed = prev.removed;

    $("tm-message").textContent = "Последний ход отменён";
    render();
  }

  function setMode(next) {
    mode = next;
    levelNumber = 1;

    game.querySelectorAll("[data-mode]").forEach(button => {
      button.classList.toggle("active",button.dataset.mode === mode);
    });

    $("tm-stages").classList.toggle("visible",mode === "hard");
    makeLevel();
  }

  $("tm-restart").addEventListener("click",makeLevel);

  $("tm-new").addEventListener("click",() => {
    levelNumber++;
    makeLevel();
  });

  $("tm-undo").addEventListener("click",undo);

  $("tm-result-button").addEventListener("click",() => {
    $("tm-result").style.display = "none";

    if (nextAction === "next") {
      if (mode === "hard") {
        hardStage = hardStage >= 10 ? 5 : hardStage+1;
      } else {
        levelNumber++;
      }
    }

    makeLevel();
  });

  game.querySelectorAll("[data-mode]").forEach(button => {
    button.addEventListener("click",() => setMode(button.dataset.mode));
  });

  game.querySelectorAll("[data-stage]").forEach(button => {
    button.addEventListener("click",() => {
      hardStage = Number(button.dataset.stage);

      game.querySelectorAll("[data-stage]").forEach(b => {
        b.classList.toggle("active",b === button);
      });

      makeLevel();
    });
  });

  window.startTripleMatch = () => {
    game.style.display = "block";
    makeLevel();
  };

  const back = document.getElementById("mindless-back");

  if (back) {
    back.addEventListener("click",() => {
      game.style.display = "none";
    });
  }

  setMode("normal");
})();
