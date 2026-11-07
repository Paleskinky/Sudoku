
(() => {
  'use strict';

  const ROOT_ID = 'traffic-game';
  const STYLE_ID = 'traffic-style';
  const SIZE = 6;

  document.getElementById(ROOT_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #traffic-game {
      --tg-bg:#f3f1eb; --tg-card:#fffefa; --tg-ink:#292b2d;
      --tg-muted:#92918b; --tg-line:#e7e3da; --tg-accent:#e86e51;
      --tg-green:#729b83; --tg-blue:#7d9eb9;
      font-family:inherit;color:var(--tg-ink);
      width:100%;min-height:100%;box-sizing:border-box;
      background:var(--tg-bg);padding:18px 14px 30px;
      border-radius:22px;user-select:none;-webkit-user-select:none;
    }
    #traffic-game *{box-sizing:border-box}
    #traffic-game .tg-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
    #traffic-game .tg-back{border:0;background:var(--tg-card);border-radius:12px;padding:10px 13px;font-size:14px;color:var(--tg-ink)}
    #traffic-game .tg-title{font-size:23px;font-weight:850;letter-spacing:-.8px}
    #traffic-game .tg-subtitle{font-size:12px;color:var(--tg-muted);margin-top:3px}
    #traffic-game .tg-modes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:18px 0}
    #traffic-game .tg-mode{border:1px solid var(--tg-line);background:var(--tg-card);padding:12px 8px;border-radius:14px;font-size:13px;font-weight:750;color:var(--tg-muted)}
    #traffic-game .tg-mode.active{background:var(--tg-ink);color:white;border-color:var(--tg-ink)}
    #traffic-game .tg-levelrow{display:flex;align-items:center;justify-content:space-between;margin:8px 2px 12px}
    #traffic-game .tg-level{font-weight:800;font-size:15px}
    #traffic-game .tg-record{font-size:11px;color:var(--tg-muted)}
    #traffic-game .tg-boardwrap{position:relative;width:100%;max-width:440px;margin:0 auto}
    #traffic-game .tg-board{
      position:relative;width:100%;aspect-ratio:1;
      display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(6,1fr);
      gap:4px;padding:7px;border-radius:19px;background:#d9d6ce;
      box-shadow:inset 0 2px 5px #00000012,0 8px 22px #24211b12;
      touch-action:none;overflow:visible;
    }
    #traffic-game .tg-cell{background:#eeece5;border-radius:7px;min-width:0;min-height:0}
    #traffic-game .tg-exit{
      position:absolute;right:-8px;top:calc(7px + (100% - 14px)/6 * 2 + 4px);
      width:15px;height:calc((100% - 14px)/6 - 8px);
      background:var(--tg-accent);border-radius:0 7px 7px 0;
      display:flex;align-items:center;justify-content:center;color:white;font-size:13px;
      z-index:4;
    }
    #traffic-game .tg-vehicle{
      position:absolute;display:flex;align-items:stretch;justify-content:center;
      border-radius:10px;cursor:grab;z-index:2;
      transition:left .11s ease,top .11s ease,filter .12s ease;
      padding:3px;touch-action:none;
    }
    #traffic-game .tg-vehicle.selected{z-index:3;filter:brightness(1.08);outline:3px solid #292b2d55;outline-offset:1px}
    #traffic-game .tg-vehicle .tg-carbody{
      width:100%;height:100%;border-radius:8px;position:relative;
      background:var(--car);box-shadow:inset 0 3px 0 #ffffff55,inset 0 -4px 0 #00000019,0 3px 5px #00000020;
      overflow:hidden;
    }
    #traffic-game .tg-vehicle .tg-window{
      position:absolute;background:#ffffff9c;border-radius:4px;
      left:24%;top:17%;width:52%;height:66%;
    }
    #traffic-game .tg-vehicle.horizontal .tg-window{left:25%;top:20%;width:49%;height:60%}
    #traffic-game .tg-vehicle.vertical .tg-window{left:20%;top:25%;width:60%;height:49%}
    #traffic-game .tg-vehicle .tg-stripe{position:absolute;background:#ffffff55;border-radius:3px}
    #traffic-game .tg-vehicle.horizontal .tg-stripe{height:5px;width:18%;right:5%;top:calc(50% - 2px)}
    #traffic-game .tg-vehicle.vertical .tg-stripe{width:5px;height:18%;bottom:5%;left:calc(50% - 2px)}
    #traffic-game .tg-vehicle.target .tg-carbody{background:linear-gradient(145deg,#f38a6e,#d95742)}
    #traffic-game .tg-vehicle.target .tg-window{background:#ffe0d4}
    #traffic-game .tg-hintline{text-align:center;font-size:12px;color:var(--tg-muted);margin:14px 0 12px;min-height:17px}
    #traffic-game .tg-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}
    #traffic-game .tg-stat{background:var(--tg-card);border:1px solid var(--tg-line);border-radius:13px;padding:10px;text-align:center}
    #traffic-game .tg-stat strong{display:block;font-size:18px}
    #traffic-game .tg-stat span{font-size:10px;color:var(--tg-muted)}
    #traffic-game .tg-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}
    #traffic-game .tg-action{border:1px solid var(--tg-line);background:var(--tg-card);color:var(--tg-ink);border-radius:13px;padding:12px 4px;font-size:12px;font-weight:700}
    #traffic-game .tg-action.primary{background:var(--tg-ink);color:white;border-color:var(--tg-ink)}
    #traffic-game .tg-action:disabled{opacity:.35}
    #traffic-game .tg-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:16px;gap:10px}
    #traffic-game .tg-progress{height:5px;background:#e0ddd5;border-radius:8px;overflow:hidden;flex:1}
    #traffic-game .tg-progress i{display:block;height:100%;background:var(--tg-green);border-radius:8px}
    #traffic-game .tg-progresslabel{font-size:11px;color:var(--tg-muted);white-space:nowrap}
    #traffic-game .tg-arrows{display:flex;gap:7px;justify-content:center;margin-top:12px}
    #traffic-game .tg-arrow{width:43px;height:38px;border:1px solid var(--tg-line);background:var(--tg-card);border-radius:11px;font-size:18px}
    #traffic-game .tg-overlay{position:absolute;inset:0;background:#22283166;z-index:10;border-radius:19px;display:flex;align-items:center;justify-content:center;padding:20px}
    #traffic-game .tg-modal{width:100%;max-width:280px;background:var(--tg-card);border-radius:20px;padding:23px;text-align:center;box-shadow:0 12px 35px #0003}
    #traffic-game .tg-modal h3{font-size:21px;margin:0 0 7px}
    #traffic-game .tg-modal p{font-size:13px;color:var(--tg-muted);margin:0 0 17px;line-height:1.5}
    #traffic-game .tg-modal button{border:0;background:var(--tg-ink);color:white;border-radius:12px;padding:12px 18px;font-weight:750;width:100%}
    #traffic-game .tg-legend{display:flex;justify-content:center;gap:15px;margin-top:14px;font-size:10px;color:var(--tg-muted)}
    #traffic-game .tg-dot{display:inline-block;width:8px;height:8px;border-radius:3px;margin-right:5px}
    @media(max-width:360px){#traffic-game{padding:14px 10px}#traffic-game .tg-title{font-size:20px}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.innerHTML = `
    <div class="tg-top">
      <div>
        <div class="tg-title">Traffic Jam</div>
        <div class="tg-subtitle">Освободи путь и выберись с парковки</div>
      </div>
      <button class="tg-back" id="tg-back">← Назад</button>
    </div>
    <div class="tg-modes">
      <button class="tg-mode active" data-mode="traffic">🚗 Traffic Jam</button>
      <button class="tg-mode" data-mode="bus">🚌 Bus Jam</button>
    </div>
    <div class="tg-levelrow">
      <div class="tg-level" id="tg-level">Уровень 1</div>
      <div class="tg-record" id="tg-record">Решено: 0</div>
    </div>
    <div class="tg-boardwrap">
      <div class="tg-board" id="tg-board"></div>
      <div class="tg-exit">›</div>
    </div>
    <div class="tg-hintline" id="tg-message">Выбери машину и сдвинь её по направлению движения</div>
    <div class="tg-stats">
      <div class="tg-stat"><strong id="tg-moves">0</strong><span>ХОДЫ</span></div>
      <div class="tg-stat"><strong id="tg-best">—</strong><span>ЛУЧШИЙ РЕЗУЛЬТАТ</span></div>
      <div class="tg-stat"><strong id="tg-vehicles">0</strong><span>МАШИНЫ</span></div>
    </div>
    <div class="tg-arrows">
      <button class="tg-arrow" data-delta="-1">←</button>
      <button class="tg-arrow" data-delta="1">→</button>
      <button class="tg-arrow" data-delta="-1" data-vertical="1">↑</button>
      <button class="tg-arrow" data-delta="1" data-vertical="1">↓</button>
    </div>
    <div class="tg-actions">
      <button class="tg-action" id="tg-undo">↶ Отмена</button>
      <button class="tg-action" id="tg-hint">✦ Подсказка</button>
      <button class="tg-action" id="tg-restart">↻ Заново</button>
      <button class="tg-action primary" id="tg-next">Далее →</button>
    </div>
    <div class="tg-bottom">
      <div class="tg-progress"><i id="tg-progressbar" style="width:0%"></i></div>
      <div class="tg-progresslabel" id="tg-progresslabel">0 уровней пройдено</div>
    </div>
    <div class="tg-legend">
      <span><i class="tg-dot" style="background:#e86e51"></i>Цель</span>
      <span><i class="tg-dot" style="background:#7d9eb9"></i>Транспорт</span>
      <span><i class="tg-dot" style="background:#729b83"></i>Автобус</span>
    </div>
  `;
  document.body.appendChild(root);

  const $ = id => root.querySelector('#' + id);
  const COLORS = ['#789bb5','#8cae9a','#d2a16f','#9c91b7','#7ca9a5','#c58d91','#8c9db7','#b3a17c','#85a6a0','#bd9baf'];

  let mode = 'traffic';
  let level = 1;
  let vehicles = [];
  let initial = [];
  let selected = null;
  let history = [];
  let moves = 0;
  let won = false;
  let hintBusy = false;
  let pointerStart = null;

  const storageKey = 'trafficJamProgressV2';
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (_) {}
  if (!progress.traffic) progress.traffic = { level: 1, solved: 0, best: {} };
  if (!progress.bus) progress.bus = { level: 1, solved: 0, best: {} };

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (_) {}
  }

  function targetLength() { return mode === 'traffic' ? 2 : 3; }
  function goalX() { return SIZE - targetLength(); }

  function cloneState(list) {
    return list.map(v => ({...v}));
  }

  function occupied(x, y, except) {
    for (const v of vehicles) {
      if (v.id === except) continue;
      for (let i = 0; i < v.len; i++) {
        const cx = v.x + (v.horizontal ? i : 0);
        const cy = v.y + (v.horizontal ? 0 : i);
        if (cx === x && cy === y) return true;
      }
    }
    return false;
  }

  function canMove(v, delta) {
    const nx = v.x + (v.horizontal ? delta : 0);
    const ny = v.y + (v.horizontal ? 0 : delta);
    if (nx < 0 || ny < 0 || nx + (v.horizontal ? v.len : 1) > SIZE ||
        ny + (v.horizontal ? 1 : v.len) > SIZE) return false;
    const cx = v.horizontal ? (delta > 0 ? nx + v.len - 1 : nx) : v.x;
    const cy = v.horizontal ? v.y : (delta > 0 ? ny + v.len - 1 : ny);
    return !occupied(cx, cy, v.id);
  }

  function doMove(id, delta, record = true) {
    if (won) return false;
    const v = vehicles.find(q => q.id === id);
    if (!v || !canMove(v, delta)) return false;
    if (record) history.push(vehicles.map(q => ({id:q.id,x:q.x,y:q.y})));
    if (v.horizontal) v.x += delta; else v.y += delta;
    moves++;
    selected = id;
    render();
    checkWin();
    return true;
  }

  function restore(snapshot) {
    vehicles.forEach(v => {
      const p = snapshot.find(q => q.id === v.id);
      if (p) { v.x = p.x; v.y = p.y; }
    });
    render();
  }

  function cellsClearForPlacement(list, x, y, len, horizontal) {
    for (let i=0;i<len;i++) {
      const cx=x+(horizontal?i:0), cy=y+(horizontal?0:i);
      if (cx<0||cy<0||cx>=SIZE||cy>=SIZE) return false;
      if (cy===2) return false;
      if (list.some(v => {
        for(let j=0;j<v.len;j++){
          const vx=v.x+(v.horizontal?j:0), vy=v.y+(v.horizontal?0:j);
          if(vx===cx&&vy===cy)return true;
        }
        return false;
      })) return false;
    }
    return true;
  }

  function generateBase() {
    const targetLen = targetLength();
    const list = [{
      id:'target', horizontal:true, len:targetLen,
      x:goalX(), y:2, target:true, color:'#e86e51'
    }];

    // Вертикальные машины по краям центрального ряда.
    for (let col=0; col<4; col++) {
      const y = Math.random() < .5 ? 0 : 3;
      list.push({
        id:'v'+col, horizontal:false, len:2, x:col, y,
        color:COLORS[col]
      });
    }

    let id = 0;
    const attempts = 500;
    while (list.length < 10 && id < attempts) {
      id++;
      const horizontal = Math.random() < .55;
      const len = Math.random() < .24 ? 3 : 2;
      const x = Math.floor(Math.random() * (horizontal ? SIZE-len+1 : SIZE));
      const rows = horizontal ? [0,1,3,4,5] : [0,3];
      const y = horizontal ? rows[Math.floor(Math.random()*rows.length)] : rows[Math.floor(Math.random()*rows.length)];
      if (cellsClearForPlacement(list,x,y,len,horizontal)) {
        list.push({
          id:'v'+list.length, horizontal, len, x, y,
          color:COLORS[list.length % COLORS.length]
        });
      }
    }
    return list;
  }

  function randomLegalMove() {
    const options = [];
    for (const v of vehicles) {
      for (const d of [-1,1]) {
        if (canMove(v,d)) {
          if (v.target && d > 0 && v.x + v.len >= SIZE) continue;
          options.push({id:v.id,delta:d});
        }
      }
    }
    return options.length ? options[Math.floor(Math.random()*options.length)] : null;
  }

  function makeLevel() {
    won = false;
    history = [];
    moves = 0;
    selected = null;

    let made = false;
    for (let attempt=0; attempt<100 && !made; attempt++) {
      vehicles = generateBase();

      const target = vehicles[0];
      // Отводим цель от выхода, создавая исходную задачу.
      target.x -= 1 + Math.floor(Math.random() * Math.min(2,target.x));
      const steps = 45 + Math.min(level*3,90);

      for (let i=0;i<steps;i++) {
        const m = randomLegalMove();
        if (!m) break;
        const v = vehicles.find(q=>q.id===m.id);
        if (v.horizontal) v.x += m.delta; else v.y += m.delta;
      }

      const t = vehicles[0];
      if (t.x < goalX()) made = true;
    }

    if (!made) {
      vehicles = generateBase();
      vehicles[0].x = Math.max(0,goalX()-1);
    }

    initial = cloneState(vehicles);
    render();
    updateText();
  }

  function render() {
    const board = $('tg-board');
    board.innerHTML = '';
    for(let i=0;i<36;i++){
      const cell=document.createElement('div');
      cell.className='tg-cell';
      board.appendChild(cell);
    }

    const pad = 7;
    const gap = 4;
    const inner = board.clientWidth - pad*2;
    const cell = (inner-gap*5)/6;
    const pitch = cell+gap;

    vehicles.forEach(v=>{
      const el=document.createElement('div');
      el.className='tg-vehicle '+(v.horizontal?'horizontal':'vertical')+
        (v.target?' target':'')+(selected===v.id?' selected':'');
      el.dataset.id=v.id;
      const left=pad+v.x*pitch;
      const top=pad+v.y*pitch;
      const width=v.horizontal ? v.len*cell+(v.len-1)*gap : cell;
      const height=v.horizontal ? cell : v.len*cell+(v.len-1)*gap;
      el.style.left=left+'px';
      el.style.top=top+'px';
      el.style.width=width+'px';
      el.style.height=height+'px';
      el.style.setProperty('--car',v.target?'#e86e51':v.color);
      el.innerHTML='<div class="tg-carbody"><div class="tg-window"></div><div class="tg-stripe"></div></div>';
      el.addEventListener('pointerdown', e=>{
        if(won)return;
        e.preventDefault();
        selected=v.id;
        pointerStart={id:v.id,x:e.clientX,y:e.clientY,horizontal:v.horizontal};
        renderSelection();
        el.setPointerCapture?.(e.pointerId);
      });
      el.addEventListener('pointerup', e=>{
        if(!pointerStart||pointerStart.id!==v.id)return;
        const dx=e.clientX-pointerStart.x;
        const dy=e.clientY-pointerStart.y;
        const amount=pointerStart.horizontal?dx:dy;
        const delta=Math.round(amount/pitch);
        if(delta!==0){
          const dir=delta>0?1:-1;
          for(let i=0;i<Math.min(Math.abs(delta),6);i++){
            if(!doMove(v.id,dir))break;
          }
        } else {
          selected=v.id;
          render();
        }
        pointerStart=null;
      });
      board.appendChild(el);
    });
    $('tg-moves').textContent=moves;
    $('tg-vehicles').textContent=vehicles.length;
    $('tg-undo').disabled=history.length===0;
    $('tg-next').textContent=won?'Следующий →':'Далее →';
  }

  function renderSelection() {
    root.querySelectorAll('.tg-vehicle').forEach(el=>{
      el.classList.toggle('selected',el.dataset.id===selected);
    });
  }

  function updateText() {
    const p=progress[mode];
    $('tg-level').textContent='Уровень '+level;
    $('tg-record').textContent='Решено: '+p.solved;
    $('tg-best').textContent=p.best[level] ?? '—';
    $('tg-progressbar').style.width=Math.min(100,p.solved/Math.max(10,level)*100)+'%';
    $('tg-progresslabel').textContent=p.solved+' уровней пройдено';
    $('tg-message').textContent=mode==='traffic'
      ? 'Выведи красную машину через правый выход'
      : 'Освободи путь автобусу и выведи его направо';
  }

  function checkWin() {
    const target=vehicles.find(v=>v.target);
    if(target && target.x+target.len===SIZE){
      won=true;
      const p=progress[mode];
      if(!p.best[level]||moves<p.best[level])p.best[level]=moves;
      if(level>p.solved)p.solved=level;
      p.level=Math.max(p.level,level+1);
      save();
      $('tg-message').textContent='Отлично! Путь свободен.';
      render();
      showWin();
      updateText();
    }
  }

  function showWin() {
    const overlay=document.createElement('div');
    overlay.className='tg-overlay';
    overlay.innerHTML=`
      <div class="tg-modal">
        <div style="font-size:34px;margin-bottom:8px">🎉</div>
        <h3>Уровень пройден!</h3>
        <p>Ты справилась за <b>${moves}</b> ходов.<br>Продолжаем?</p>
        <button id="tg-win-next">Следующий уровень →</button>
      </div>`;
    $('tg-board').parentElement.appendChild(overlay);
    overlay.querySelector('button').onclick=()=>{
      overlay.remove();
      level++;
      progress[mode].level=level;
      save();
      makeLevel();
    };
  }

  function undo() {
    if(!history.length||won)return;
    const snapshot=history.pop();
    moves=Math.max(0,moves-1);
    restore(snapshot);
    $('tg-moves').textContent=moves;
    $('tg-undo').disabled=!history.length;
  }

  function restart() {
    if(won)return;
    history=[];
    moves=0;
    selected=null;
    restore(initial);
    $('tg-moves').textContent='0';
    $('tg-undo').disabled=true;
    $('tg-message').textContent='Уровень перезапущен';
  }

  function encode(list) {
    return list.map(v=>v.horizontal?v.x:v.y).join(',');
  }

  function solveFirstMove() {
    // BFS по всем легальным состояниям; возвращает первый ход кратчайшего пути.
    const start=cloneState(vehicles);
    const startKey=encode(start);
    const queue=[{state:start,first:null}];
    const seen=new Set([startKey]);
    let head=0;
    const MAX=45000;

    while(head<queue.length && seen.size<MAX){
      const node=queue[head++];
      const target=node.state[0];
      if(target.x+target.len===SIZE)return node.first;

      for(let i=0;i<node.state.length;i++){
        const v=node.state[i];
        for(const d of [-1,1]){
          const nx=v.x+(v.horizontal?d:0);
          const ny=v.y+(v.horizontal?0:d);
          if(nx<0||ny<0||nx+(v.horizontal?v.len:1)>SIZE||ny+(v.horizontal?1:v.len)>SIZE)continue;
          let blocked=false;
          const cx=v.horizontal?(d>0?nx+v.len-1:nx):v.x;
          const cy=v.horizontal?v.y:(d>0?ny+v.len-1:ny);
          for(let j=0;j<node.state.length;j++){
            if(i===j)continue;
            const other=node.state[j];
            for(let k=0;k<other.len;k++){
              const ox=other.x+(other.horizontal?k:0);
              const oy=other.y+(other.horizontal?0:k);
              if(ox===cx&&oy===cy){blocked=true;break;}
            }
            if(blocked)break;
          }
          if(blocked)continue;

          const next=cloneState(node.state);
          if(next[i].horizontal)next[i].x+=d;else next[i].y+=d;
          const key=encode(next);
          if(seen.has(key))continue;
          seen.add(key);
          queue.push({state:next,first:node.first||{id:v.id,delta:d}});
        }
      }
    }
    return null;
  }

  function hint() {
    if(won||hintBusy)return;
    hintBusy=true;
    $('tg-message').textContent='Ищу решение…';
    setTimeout(()=>{
      const answer=solveFirstMove();
      hintBusy=false;
      if(answer){
        selected=answer.id;
        render();
        $('tg-message').textContent='Подсказка: сдвинь выделенную машину на одну клетку';
        const el=root.querySelector('.tg-vehicle.selected');
        if(el){
          el.animate(
            [{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],
            {duration:550,iterations:2}
          );
        }
      }else{
        $('tg-message').textContent='Не удалось найти решение в пределах поиска. Попробуй перезапустить уровень.';
      }
    },30);
  }

  function switchMode(next) {
    mode=next;
    root.querySelectorAll('.tg-mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
    level=progress[mode].level||1;
    $('tg-title').textContent=mode==='traffic'?'Traffic Jam':'Bus Jam';
    $('tg-subtitle').textContent=mode==='traffic'
      ? 'Освободи путь и выберись с парковки'
      : 'Помоги автобусу выбраться с парковки';
    $('tg-legend').innerHTML=mode==='traffic'
      ? '<span><i class="tg-dot" style="background:#e86e51"></i>Цель</span><span><i class="tg-dot" style="background:#7d9eb9"></i>Транспорт</span><span><i class="tg-dot" style="background:#729b83"></i>Автобус</span>'
      : '<span><i class="tg-dot" style="background:#e86e51"></i>Автобус-цель</span><span><i class="tg-dot" style="background:#7d9eb9"></i>Машины</span>';
    makeLevel();
  }

  root.querySelectorAll('.tg-mode').forEach(b=>{
    b.addEventListener('click',()=>switchMode(b.dataset.mode));
  });
  $('tg-undo').onclick=undo;
  $('tg-hint').onclick=hint;
  $('tg-restart').onclick=restart;
  $('tg-next').onclick=()=>{
    if(won){
      level++;
      progress[mode].level=level;
      save();
      makeLevel();
    }else{
      $('tg-message').textContent='Сначала реши текущий уровень 🙂';
    }
  };

  root.querySelectorAll('.tg-arrow').forEach(btn=>{
    btn.onclick=()=>{
      if(!selected){$('tg-message').textContent='Сначала выбери машину';return;}
      const v=vehicles.find(q=>q.id===selected);
      if(!v)return;
      const vertical=btn.dataset.vertical==='1';
      if(v.horizontal===vertical){
        $('tg-message').textContent='Эта машина движется в другом направлении';
        return;
      }
      doMove(v.id,Number(btn.dataset.delta));
    };
  });

  $('tg-board').addEventListener('click',e=>{
    const el=e.target.closest('.tg-vehicle');
    if(el){selected=el.dataset.id;renderSelection();}
  });

  $('tg-back').onclick=()=>{
    const back=document.getElementById('mindless-back');
    if(back)back.click();
    else root.style.display='none';
  };

  window.addEventListener('keydown',e=>{
    if(root.style.display==='none'||won)return;
    if(e.key==='Escape'){$('tg-back').click();return;}
    if(!selected)return;
    const v=vehicles.find(q=>q.id===selected);
    if(!v)return;
    const map={ArrowLeft:[true,-1],ArrowRight:[true,1],ArrowUp:[false,-1],ArrowDown:[false,1]};
    const action=map[e.key];
    if(action&&action[0]===v.horizontal){
      e.preventDefault();
      doMove(v.id,action[1]);
    }
  });
  window.startTrafficJam=()=>{
    root.style.display='block';
    level=progress[mode].level||1;
    makeLevel();
  };

  root.style.display='none';
})();
  };

  window.startTrafficJam();
})();
