const cards={
  typo:{name:'Typo Bait',cost:1,art:'⌁',kind:'LOW EFFORT',desc:'Deal 13 tilt. Gain 3 focus.',type:'common',tilt:13,block:3,lines:['its spelled *their* btw','you mean “could have”']},
  huh:{name:'Just “Huh?”',cost:1,art:'?',kind:'CLASSIC',desc:'Deal 11 tilt. Draw 1 card.',type:'common',tilt:11,draw:1,lines:['huh?','wait what do you mean']},
  well:{name:'Well, Actually',cost:2,art:'≋',kind:'PEDANT',desc:'Deal 23 tilt. Take 2 focus damage.',type:'rare',tilt:23,self:2,lines:['well, actually, that’s not quite right','source? because I have a source']},
  meme:{name:'Meme Drive-By',cost:1,art:'▧',kind:'REACTION IMAGE',desc:'Deal 8 tilt. Gain 6 focus.',type:'common',tilt:8,block:6,lines:['[image: extremely relevant meme]','ratio this']},
  ping:{name:'Accidental Ping',cost:1,art:'@',kind:'NOTIFICATION',desc:'Deal 10 tilt. Their next hit is -3.',type:'common',tilt:10,weaken:3,lines:['@everyone quick question','oops wrong channel']},
  ellipsis:{name:'Typing…',cost:1,art:'•••',kind:'SUSPENSE',desc:'Deal 15 tilt. If they’re annoyed, +8 more.',type:'rare',tilt:15,bonus:8,lines:['…','typing a response']},
  touch:{name:'Touch Grass',cost:1,art:'✳',kind:'COUNTERPLAY',desc:'Deal 9 tilt. Gain 8 focus.',type:'special',tilt:9,block:8,lines:['respectfully, log off for a minute','hey, hydrate']},
  quote:{name:'Quote Reply',cost:2,art:'❞',kind:'AMPLIFY',desc:'Deal 18 tilt. Double your next card’s tilt.',type:'rare',tilt:18,amplify:true,lines:['> your last message\n> fascinating']},
  shrug:{name:'The Shrug',cost:0,art:'¯\\_(ツ)_/¯',kind:'FREE ACTION',desc:'Deal 5 tilt. Gain 1 energy.',type:'special',tilt:5,energy:1,lines:['¯\\_(ツ)_/¯']},
  caps:{name:'Caps Lock',cost:1,art:'▲',kind:'LOUD TEXT',desc:'Deal 17 tilt. Lose 4 focus.',type:'common',tilt:17,self:4,lines:['OKAY BUT LISTEN']},
  lurk:{name:'Silent Lurk',cost:1,art:'◉',kind:'PSYCHOLOGICAL',desc:'Deal 12 tilt. Gain 4 focus.',type:'common',tilt:12,block:4,lines:['seen 11:48 PM']},
  mod:{name:'Mod Check',cost:2,art:'⚑',kind:'POWER MOVE',desc:'Deal 25 tilt. Gain 4 focus.',type:'rare',tilt:25,block:4,lines:['is this within the rules?']}
};
const enemies=[
 {name:'kevin.exe',role:'MEMBER',sub:'has been online for 3 hours',avatar:'K',title:'A VERY NORMAL LOBBY',kind:'RANDOM REGULAR',intent:8,opening:'anyone know why my mic sounds weird',reply:['it sounds fine to me','what does that even mean','can you just answer normally?']},
 {name:'mod_marlowe',role:'MODERATOR',sub:'has the “seen it all” badge',avatar:'M',title:'MOD ZONE',kind:'MODERATOR',intent:12,opening:'quick reminder: keep it civil in here',reply:['I am literally a moderator','this is not helping your case','one more message and it’s timeout']},
 {name:'TheMainCharacter',role:'SERVER BOOSTER',sub:'is typing a very long message…',avatar:'✦',title:'THE MAIN EVENT',kind:'FINAL BOSS',intent:15,opening:'I have a 14-part thread about this',reply:['you are missing the entire point','I have never been more composed','mods? hello? anyone?']}
];
const tips=['A well-timed “huh?” can do more damage than a paragraph.','Save a little focus. The reply queue always hits back.','The best bait is technically a question.','A free card is still a card. Use your energy wisely.','Don’t overthink it. The ellipsis is doing the work for you.'];
const $=id=>document.getElementById(id);
let state;
function makeState(){
 let deck=['typo','huh','meme','ping','ellipsis','touch','shrug','caps','lurk','typo'];
 state={floor:0,hp:50,maxHp:50,deck,draw:[],discard:[],hand:[],energy:3,maxEnergy:3,block:0,tilt:0,enemy:null,intent:0,weaken:0,amplify:false,rooms:0,peak:0,played:0,turn:1,locked:false,won:false,log:[],seed:Math.floor(1000+Math.random()*8999)};
 $('seed').textContent=state.seed;
 startRoom(0);
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function startRoom(i){
 state.floor=i;state.enemy={...enemies[i]};state.tilt=0;state.block=0;state.weaken=0;state.amplify=false;state.intent=state.enemy.intent;state.turn=1;state.locked=false;
 state.draw=shuffle([...state.deck]);state.discard=[];state.hand=[];state.energy=state.maxEnergy;
 $('encounterTitle').textContent=state.enemy.title;$('enemyType').textContent=state.enemy.kind;$('enemyName').textContent=state.enemy.name;$('enemyRole').textContent=state.enemy.role;$('enemySub').textContent=state.enemy.sub;$('enemyAvatar').textContent=state.enemy.avatar;$('intentValue').textContent=state.intent;$('encounterIndex').textContent=`0${i+1} / 03`;$('roomLabel').textContent=`0${i+1}`;$('chatTime').textContent=['11:48 PM','12:06 AM','12:21 AM'][i];
 $('chatFeed').innerHTML=`<div class="chat-line system-line"><span class="chat-stamp">SYSTEM</span><span>${state.enemy.name} joined the channel</span></div><div class="chat-line enemy-line"><span class="chat-stamp">${state.enemy.name.split(/[._]/)[0].toUpperCase()}</span><span>${state.enemy.opening}</span></div><div class="chat-line player-line"><span class="chat-stamp">YOU</span><span>interesting approach</span></div>`;
 $('reactionList').innerHTML='';$('reactionCount').textContent='0';
 $('tipText').textContent=tips[Math.floor(Math.random()*tips.length)];
 drawCards(5);update();
}
function drawCards(n){for(let k=0;k<n;k++){if(!state.draw.length){if(!state.discard.length)break;state.draw=shuffle(state.discard);state.discard=[]}state.hand.push(state.draw.pop())}}
function addChat(who,text){const line=document.createElement('div');line.className=`chat-line ${who==='YOU'?'player-line':who==='SYSTEM'?'system-line':'enemy-line'}`;line.innerHTML=`<span class="chat-stamp">${who}</span><span>${escapeHtml(text).replace(/\n/g,'<br>')}</span>`;$('chatFeed').append(line);$('chatFeed').scrollTop=$('chatFeed').scrollHeight;while($('chatFeed').children.length>6)$('chatFeed').firstElementChild.remove()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function addReaction(text){const users=['pixel_pigeon','tea.exe','lofi_lurker','mothman','kitkat42','ghost_mod'];const name=users[Math.floor(Math.random()*users.length)];const row=document.createElement('div');row.className='reaction';row.innerHTML=`<div class="reaction-avatar">${name[0].toUpperCase()}</div><div class="reaction-copy"><b>${name}</b>${escapeHtml(text)}<small>JUST NOW</small></div>`;$('reactionList').prepend(row);while($('reactionList').children.length>4)$('reactionList').lastElementChild.remove();$('reactionCount').textContent=String(state.played)}
function playCard(index){if(state.locked)return;const id=state.hand[index],card=cards[id];if(!card||card.cost>state.energy)return;
 state.energy-=card.cost;state.played++;state.hand.splice(index,1);state.discard.push(id);
 let val=card.tilt+(state.amplify?Math.floor(card.tilt*.65):0);if(card.bonus&&state.tilt>=30)val+=card.bonus;
 state.tilt=Math.min(100,state.tilt+val);if(card.amplify)state.amplify=true;else if(state.amplify)state.amplify=false;
 if(card.block)state.hp=Math.min(state.maxHp,state.hp+card.block);if(card.self)state.hp=Math.max(0,state.hp-card.self);if(card.weaken)state.weaken+=card.weaken;if(card.energy)state.energy=Math.min(state.maxEnergy,state.energy+card.energy);if(card.draw)drawCards(card.draw);
 state.peak=Math.max(state.peak,state.tilt);const quip=card.lines[Math.floor(Math.random()*card.lines.length)];addChat('YOU',quip);addReaction(['👀','this is getting good','oh no they’re typing','🍿','that was unnecessary'][Math.floor(Math.random()*5)]);
 $('opponent').classList.remove('shake');void $('opponent').offsetWidth;$('opponent').classList.add('shake');
 if(state.hp<=0){update();gameOver(false);return}if(state.tilt>=100){state.tilt=100;update();winRoom();return}update();
}
function endTurn(){if(state.locked)return;state.locked=true;$('battleStatus').textContent='THEY’RE REPLYING';$('turnHint').textContent='Incoming message…';$('endTurnBtn').disabled=true;
 setTimeout(()=>{
  const enemy=state.enemy;const quote=enemy.reply[Math.floor(Math.random()*enemy.reply.length)];addChat(enemy.name.split(/[._]/)[0].toUpperCase(),quote);
  let damage=Math.max(0,state.intent-state.weaken-state.block);state.weaken=0;state.block=0;state.hp=Math.max(0,state.hp-damage);
  if(damage>0)addReaction(['ouch, direct hit','that one stung','mods are watching'][Math.floor(Math.random()*3)]);else addReaction('blocked ✨');
  if(state.hp<=0){update();gameOver(false);return}
  state.turn++;state.energy=state.maxEnergy;state.hand.forEach(c=>state.discard.push(c));state.hand=[];drawCards(5);
  state.intent=Math.max(5,enemy.intent+Math.floor((state.turn-1)*1.5));$('intentValue').textContent=state.intent;
  addChat('SYSTEM',`round ${state.turn} — you have a notification`);state.locked=false;update();
 },650);
}
function update(){
 $('tiltFill').style.width=`${state.tilt}%`;$('tiltValue').textContent=`${state.tilt} / 100`;$('focusFill').style.width=`${state.hp/state.maxHp*100}%`;$('focusValue').textContent=`${state.hp} / ${state.maxHp}`;
 $('energyValue').textContent=state.energy;$('energyPips').innerHTML=Array.from({length:state.maxEnergy},(_,i)=>`<i class="energy-pip ${i>=state.energy?'empty':''}"></i>`).join('');
 $('handCount').textContent=state.hand.length;$('cardsPlayed').textContent=state.played;$('peakTilt').textContent=`${state.peak}%`;$('roomsCleared').textContent=state.rooms;$('deckCount').textContent=state.deck.length;$('scrapCount').textContent=state.played;
 $('floorNum').textContent=`0${state.floor+1}`;$('floorTrack').style.width=`${(state.floor+1)/3*100}%`;
 [...$('routeList').children].forEach((el,i)=>{el.classList.toggle('active',i===state.floor);el.classList.toggle('done',i<state.floor);el.lastElementChild.textContent=i<state.floor?'CLEAR':i===state.floor?'NOW':'LOCKED'});
 $('battleStatus').textContent=state.locked?'THEY’RE REPLYING':'YOUR TURN';$('turnHint').textContent=state.locked?'Incoming message…':'Play cards to crank up the tilt.';$('endTurnBtn').disabled=state.locked;
 $('hand').innerHTML='';state.hand.forEach((id,i)=>{const c=cards[id],el=document.createElement('div');el.className=`card card-${c.type} ${c.cost>state.energy||state.locked?'disabled':''}`;el.innerHTML=`<span class="card-cost">${c.cost}</span><div class="card-art">${c.art}</div><div class="card-title">${c.name}</div><div class="card-desc">${c.desc}</div><div class="card-kind">${c.kind}</div>`;el.onclick=()=>playCard(i);$('hand').append(el)});
 $('miniDeck').innerHTML=state.deck.slice(0,8).map(()=>'<i class="mini-card"></i>').join('');$('intentValue').textContent=state.intent;
}
function winRoom(){state.rooms++;state.locked=true;update();setTimeout(()=>{if(state.floor===2){gameOver(true);return}showReward()},350)}
function showReward(){const options=shuffle(['huh','meme','ping','quote','shrug','caps','lurk','mod','typo','well','touch']).slice(0,3);$('modalContent').innerHTML=`<div class="eyebrow">ENCOUNTER CLEARED · ROOM 0${state.floor+1}</div><h2>They left you on read.</h2><p>Room cleared. Take a new tactic for your deck, then head deeper into the server.</p><div class="reward-list">${options.map((id,i)=>{const c=cards[id];return `<button class="reward-pick" data-card="${id}"><div class="card-art" style="color:${c.type==='rare'?'#ad9bff':c.type==='special'?'#c8f36a':'#ee8c5f'}">${c.art}</div><b>${c.name}</b><p>${c.desc}</p></button>`}).join('')}</div><button class="primary-btn" id="skipReward">SKIP REWARD →</button>`;openModal();document.querySelectorAll('.reward-pick').forEach(el=>el.onclick=()=>nextRoom(el.dataset.card));$('skipReward').onclick=()=>nextRoom(null)}
function nextRoom(card){if(card)state.deck.push(card);state.hp=Math.min(state.maxHp,state.hp+8);closeModal();startRoom(state.floor+1)}
function gameOver(victory){state.won=victory;state.locked=true;const h=victory?'YOU OWN THE CHAT.':'YOU GOT MUTED.';const sub=victory?'Three rooms. One legendary notification storm. The server will never be the same.':'The reply queue got you this time. The server will be here when you’re ready.';$('modalContent').innerHTML=`<div class="game-over"><div class="big-symbol">${victory?'✳':'×'}</div><div class="eyebrow">${victory?'RUN COMPLETE':'RUN OVER'}</div><h2>${h}</h2><p>${sub}</p><div class="modal-grid"><div class="modal-tile"><b>${state.rooms} / 3</b><span>rooms cleared</span></div><div class="modal-tile"><b>${state.peak}%</b><span>peak tilt achieved</span></div><div class="modal-tile"><b>${state.played}</b><span>cards played</span></div><div class="modal-tile"><b>${state.deck.length}</b><span>cards in deck</span></div></div><br><button class="primary-btn" id="restartBtn">START A NEW RUN ↗</button></div>`;openModal();$('restartBtn').onclick=()=>{closeModal();makeState()}}
function openModal(){ $('modalBackdrop').classList.remove('hidden') }function closeModal(){ $('modalBackdrop').classList.add('hidden') }
function showRules(){$('modalContent').innerHTML=`<div class="eyebrow">FIELD MANUAL · 01</div><h2>How to play</h2><p>You're a fictional chatroom goblin on a three-room run. Use playful, harmless banter to fill each opponent’s <b>TILT</b> meter before they drain your <b>FOCUS</b>.</p><div class="modal-grid"><div class="modal-tile"><b>① Spend energy</b><span>Each turn gives you 3 energy. Cards cost 0–2. Play the cards you can afford.</span></div><div class="modal-tile"><b>② Read the intent</b><span>The orange number shows how much focus the next reply will drain. Some cards restore focus.</span></div><div class="modal-tile"><b>③ End your turn</b><span>Click END TURN to take the opponent’s hit, draw a fresh hand, and refill energy.</span></div><div class="modal-tile"><b>④ Build your deck</b><span>Clear a room to pick a card. Clear all three to win the run.</span></div></div><p style="font-size:10px;color:#777">A goofy, fictional strategy game. No actual users or servers involved.</p>`;openModal()}
function showDeck(){$('modalContent').innerHTML=`<div class="eyebrow">LOADOUT · ${state.deck.length} CARDS</div><h2>Your deck</h2><p>Cards cycle through the draw and discard piles. Build a deck that gets the point across.</p><div class="deck-list">${Object.keys(cards).map(id=>{const n=state.deck.filter(x=>x===id).length;return n?`<div class="deck-entry"><b>${cards[id].name}</b><span>× ${n}</span></div>`:''}).join('')}</div>`;openModal()}
$('endTurnBtn').addEventListener('click',endTurn);$('rulesBtn').addEventListener('click',showRules);$('deckBtn').addEventListener('click',showDeck);$('modalClose').addEventListener('click',closeModal);$('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});makeState();