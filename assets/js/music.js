(() => {
  if (document.querySelector('.music-player')) return;
  const en = document.documentElement.lang.startsWith('en');
  const labels = en ? {
    title:'Waltz in A minor', player:'Music player', play:'Play music', pause:'Pause music',
    ready:'CLICK TO PLAY', playing:'NOW PLAYING', paused:'PAUSED', resume:'CLICK TO RESUME',
    error:'Unable to load audio', seek:'Playback position', mute:'Mute', unmute:'Unmute'
  } : {
    title:'A小调圆舞曲', player:'音乐播放器', play:'播放音乐', pause:'暂停音乐',
    ready:'点击晶圆播放', playing:'正在播放', paused:'已暂停', resume:'点击继续播放',
    error:'音频加载失败', seek:'播放进度', mute:'静音', unmute:'取消静音'
  };
  const tracks = [
    {id:'waltz-in-a-minor', zh:'A小调圆舞曲', en:'Waltz in A minor', zhComposer:'肖邦', enComposer:'Chopin'},
    {id:'nocturne-c-sharp-minor', zh:'升C小调夜曲', en:'Nocturne in C♯ minor', zhComposer:'肖邦', enComposer:'Chopin'},
    {id:'clair-de-lune', zh:'月光', en:'Clair de lune', zhComposer:'德彪西', enComposer:'Debussy'},
    {id:'the-swan', zh:'天鹅', en:'The Swan', zhComposer:'圣-桑', enComposer:'Saint-Saëns'}
  ];
  let saved;
  try { saved = JSON.parse(sessionStorage.getItem('wafer-music') || 'null'); } catch (_) {}
  let active = Math.max(0, tracks.findIndex(track => track.id === saved?.track));
  const audio = new Audio(`/assets/audio/${tracks[active].id}.mp3`);
  audio.preload = 'none';
  audio.loop = true;
  audio.volume = 0;
  const player = document.createElement('section');
  player.className = 'music-player';
  player.setAttribute('aria-label', labels.player);
  player.innerHTML = `
    <div class="music-stage">
      <svg class="music-staff" viewBox="0 0 124 92" aria-hidden="true" focusable="false">
        ${[0,4,8,12,16].map(y => `<path d="M-4 ${54+y}C20 ${13+y} 39 ${76+y} 66 ${46+y}S101 ${17+y} 128 ${30+y}"/>`).join('')}
      </svg>
      <button type="button" class="music-wafer-button" aria-label="${labels.play}" aria-pressed="false">
        <span class="music-wafer" aria-hidden="true"></span>
        <span class="music-play-icon" aria-hidden="true"><svg viewBox="0 0 16 16"><path class="music-play-shape" d="M4 2 14 8 4 14Z"/><path class="music-pause-shape" d="M3 2h3v12H3zM10 2h3v12h-3z"/></svg></span>
      </button>
      <svg class="music-tonearm" viewBox="0 0 92 92" aria-hidden="true" focusable="false">
        <rect class="music-arm-rest" x="75" y="48" width="12" height="7" rx="3"/>
        <circle class="music-arm-base" cx="80" cy="14" r="8"/>
        <g class="music-arm-swing">
          <path class="music-arm-counterweight" d="M80 7V3"/>
          <path class="music-arm-shaft" d="M80 14V40Q80 45 78 49L76 53"/>
          <path class="music-arm-highlight" d="M79 18V39Q79 44 77 48"/>
          <g class="music-cartridge">
            <path class="music-stylus" d="M73 61 71 65"/>
            <rect class="music-head" x="72" y="51" width="8" height="12" rx="2" transform="rotate(20 76 57)"/>
            <path class="music-head-highlight" d="M76 54 74 59"/>
          </g>
        </g>
        <circle class="music-arm-pivot" cx="80" cy="14" r="4"/>
        <circle class="music-arm-pin" cx="80" cy="14" r="1.3"/>
      </svg>
    </div>
    <div class="music-copy">
      <div class="music-caption" aria-live="polite">${labels.ready}</div>
      <div class="music-picker" title="${en ? 'Scroll to browse · click to play' : '滚动浏览 · 点击切歌'}">
        <div class="music-viewport" role="group" aria-label="${en ? 'Choose a track' : '选择曲目'}">
          <div class="music-track-list">
            ${tracks.map((track, i) => `<button type="button" class="music-track" data-track="${i}" aria-pressed="${i === active}" tabindex="${i === active ? 0 : -1}"><span>${en ? track.en : track.zh}</span><span class="music-composer"> · ${en ? track.enComposer : track.zhComposer}</span></button>`).join('')}
          </div>
        </div>
        <span class="music-picker-hint" aria-hidden="true">⌃<br>⌄</span>
      </div>
      <div class="music-controls">
        <input class="music-seek" type="range" min="0" max="100" value="0" step=".1" aria-label="${labels.seek}" disabled>
        <span class="music-time">0:00</span>
        <button type="button" class="music-mute" aria-label="${labels.mute}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4Z"/><path class="music-sound-wave" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg></button>
      </div>
      <a class="music-credits" href="/assets/audio/credits.html" target="_blank" rel="noopener">${en ? 'Recording credits' : '录音来源'}</a>
    </div>`;
  document.body.appendChild(player);
  audio.hidden = true;
  player.appendChild(audio);
  const stage = player.querySelector('.music-stage');
  const toggle = player.querySelector('.music-wafer-button');
  const caption = player.querySelector('.music-caption');
  const seek = player.querySelector('.music-seek');
  const time = player.querySelector('.music-time');
  const mute = player.querySelector('.music-mute');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (saved) audio.muted = !!saved.muted;
  const syncMute = () => {
    mute.setAttribute('aria-pressed', String(audio.muted));
    mute.setAttribute('aria-label', audio.muted ? labels.unmute : labels.mute);
  };
  syncMute();
  const save = () => {
    try { sessionStorage.setItem('wafer-music', JSON.stringify({track:tracks[active].id, time:audio.currentTime, playing:!audio.paused, muted:audio.muted})); } catch (_) {}
  };
  // Schedule fades on the audio clock, including when the tab is in the background.
  let context, gain, previousTime = 0;
  const smooth = x => { x = Math.max(0, Math.min(1,x)); return x*x*(3-2*x); };
  const volumeAt = t => .45 * smooth(t/3) * (Number.isFinite(audio.duration) ? smooth((audio.duration-t)/4) : 1);
  function envelope() {
    if (!gain) { audio.volume = volumeAt(audio.currentTime); return; }
    const now = context.currentTime, start = audio.currentTime, duration = audio.duration;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(audio.paused ? 0 : volumeAt(start),now);
    if (audio.paused || !Number.isFinite(duration)) return;
    const points = new Set([duration]);
    for(let t=.125;t<=3;t+=.125) if(t>start) points.add(t);
    for(let t=Math.max(0,duration-4);t<duration;t+=.125) if(t>start) points.add(t);
    [...points].filter(t=>t>start).sort((a,b)=>a-b).forEach(t=>gain.gain.linearRampToValueAtTime(volumeAt(t),now+(t-start)/audio.playbackRate));
  }
  function prepareAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!context && AudioContext) {
      context = new AudioContext();
      gain = context.createGain(); gain.gain.value=0;
      context.createMediaElementSource(audio).connect(gain).connect(context.destination);
      audio.volume=1;
    }
    if (context?.state === 'suspended') context.resume().catch(()=>{});
  }
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
  audio.addEventListener('loadedmetadata', () => {
    seek.max = audio.duration;
    seek.disabled = !Number.isFinite(audio.duration);
    if (saved && Number.isFinite(saved.time)) audio.currentTime = Math.min(saved.time, audio.duration);
    saved = null;
    envelope();
  });
  audio.addEventListener('timeupdate', () => {
    seek.value = audio.currentTime;
    time.textContent = formatTime(audio.currentTime);
    seek.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`);
    if (audio.currentTime < previousTime-.5) envelope();
    if (!gain) audio.volume=volumeAt(audio.currentTime);
    previousTime=audio.currentTime;
  });
  audio.addEventListener('playing', envelope);
  audio.addEventListener('seeked', envelope);
  audio.addEventListener('ratechange', envelope);
  const play = async () => {
    try { prepareAudio(); await audio.play(); }
    catch (error) { if(error.name !== 'AbortError') caption.textContent = error.name === 'NotAllowedError' ? labels.resume : labels.error; }
  };
  toggle.addEventListener('click', () => audio.paused ? play() : audio.pause());
  seek.addEventListener('input', () => { audio.currentTime = Number(seek.value); });
  mute.addEventListener('click', () => { audio.muted = !audio.muted; syncMute(); save(); });
  audio.addEventListener('play', () => {
    player.classList.add('music-playing');
    toggle.setAttribute('aria-label', labels.pause);
    toggle.setAttribute('aria-pressed','true');
    caption.textContent = labels.playing;
    wake();
  });
  audio.addEventListener('pause', () => {
    envelope();
    player.classList.remove('music-playing');
    toggle.setAttribute('aria-label', labels.play);
    toggle.setAttribute('aria-pressed','false');
    caption.textContent = audio.ended ? labels.ready : labels.paused;
    save();
  });
  audio.addEventListener('error', () => { caption.textContent = labels.error; });
  window.addEventListener('pagehide', save);

  // A spring-driven title wheel. Browsing never changes the playing track.
  const picker=player.querySelector('.music-picker');
  const viewport=player.querySelector('.music-viewport');
  const trackList=player.querySelector('.music-track-list');
  const trackButtons=[...player.querySelectorAll('.music-track')];
  const row=24;
  let position=active*row, target=position, velocity=0, pickerFrame=0, pickerTime=0;
  let returnTimer=0, returning=false, drag=null, suppressClickUntil=0;
  const renderPicker=()=>trackList.style.transform=`translateY(${-position}px)`;
  function animatePicker(now) {
    pickerFrame=0;
    const dt=Math.min((now-(pickerTime||now))/16.67,2); pickerTime=now;
    velocity=(velocity+(target-position)*.035*dt)*Math.pow(.82,dt);
    position+=velocity*dt;
    if(reduced.matches || (Math.abs(target-position)<.08 && Math.abs(velocity)<.08)) {
      position=target; velocity=0; pickerTime=0;
      if(returning) {
        picker.classList.remove('music-picker-open');
        player.classList.remove('music-browsing');
        returning=false;
        if(viewport.contains(document.activeElement)) trackButtons[active].focus({preventScroll:true});
      }
    } else pickerFrame=requestAnimationFrame(animatePicker);
    renderPicker();
  }
  const movePicker=()=>{if(!pickerFrame)pickerFrame=requestAnimationFrame(animatePicker);};
  function returnToTrack() {
    clearTimeout(returnTimer); returning=true; target=active*row; movePicker();
  }
  function browse() {
    returning=false;
    picker.classList.add('music-picker-open');
    player.classList.add('music-browsing');
    clearTimeout(returnTimer); returnTimer=setTimeout(returnToTrack,2500);
  }
  picker.addEventListener('pointerenter',browse);
  viewport.addEventListener('wheel',event=>{
    event.preventDefault(); browse();
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?96:1);
    target=Math.max(0,Math.min((tracks.length-1)*row,target+Math.max(-row,Math.min(row,delta*.65))));
    movePicker();
  },{passive:false});
  async function selectTrack(index) {
    if(index!==active) {
      audio.pause(); active=index; saved=null; previousTime=0;
      audio.src=`/assets/audio/${tracks[active].id}.mp3`;
      seek.disabled=true; seek.value=0; time.textContent='0:00';
      trackButtons.forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===active));button.tabIndex=i===active?0:-1;});
      save();
    }
    returnToTrack(); await play(); save();
  }
  trackButtons.forEach((button,index)=>button.addEventListener('click',()=>{
    if(performance.now()>suppressClickUntil) selectTrack(index);
  }));
  viewport.addEventListener('keydown',event=>{
    if(event.key==='Escape') { event.preventDefault(); trackButtons[active].focus({preventScroll:true}); returnToTrack(); }
    else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault(); browse();
      const focused=trackButtons.indexOf(document.activeElement);
      const i=event.key==='Home'?0:event.key==='End'?tracks.length-1:Math.max(0,Math.min(tracks.length-1,focused+(event.key==='ArrowDown'?1:-1)));
      trackButtons[i].focus({preventScroll:true}); target=i*row; movePicker();
    }
  });
  viewport.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse')return;
    browse(); drag={y:event.clientY,position:target,moved:false};
  });
  viewport.addEventListener('pointermove',event=>{
    if(!drag)return;
    if(Math.abs(event.clientY-drag.y)>5) {drag.moved=true; viewport.setPointerCapture(event.pointerId);}
    if(drag.moved) {
      browse(); target=Math.max(0,Math.min((tracks.length-1)*row,drag.position+drag.y-event.clientY)); movePicker();
    }
  });
  const endDrag=()=>{if(drag?.moved)suppressClickUntil=performance.now()+400;drag=null;};
  viewport.addEventListener('pointerup',endDrag); viewport.addEventListener('pointercancel',endDrag);
  renderPicker();

  // Spring particles: a passing pointer pushes notes out; damping brings them back.
  const noteShapes = [
    '<ellipse cx="5" cy="15" rx="3.5" ry="2.4" transform="rotate(-20 5 15)"/><path d="M8 15V2l8-1v12M8 5l8-1M8 8l8-1"/><ellipse cx="13" cy="13" rx="3.5" ry="2.4" transform="rotate(-20 13 13)"/>',
    '<path d="M11 17V2"/><ellipse cx="8" cy="17" rx="3.5" ry="2" transform="rotate(-20 8 17)"/><ellipse cx="8" cy="12" rx="3.5" ry="2" transform="rotate(-20 8 12)"/><ellipse cx="8" cy="7" rx="3.5" ry="2" transform="rotate(-20 8 7)"/>',
    '<ellipse cx="6" cy="16" rx="3.5" ry="2.4" transform="rotate(-20 6 16)"/><path d="M9 16V2q7 3 5 8M9 6q6 2 5 7"/>'
  ];
  const notes = Array.from({length:5}, (_, i) => {
    const element = document.createElement('span');
    element.className = 'music-note';
    element.innerHTML = `<svg viewBox="0 0 20 22">${noteShapes[i%noteShapes.length]}</svg>`;
    element.setAttribute('aria-hidden','true');
    stage.appendChild(element);
    return {element, angle:i / 5 * Math.PI * 2, phase:Math.random()*Math.PI*2, x:0,y:0,vx:0,vy:0};
  });
  let pointer = null, frame = 0, previous = 0, lastRipple = 0;
  function draw(now) {
    frame = 0;
    const dt = Math.min((now - (previous || now)) / 16.67, 2);
    previous = now;
    const center = stage.clientWidth / 2;
    let moving = false;
    for (const note of notes) {
      const phase = reduced.matches ? 0 : now / 2200 + note.phase;
      const radius = center - 5 + Math.sin(phase)*3;
      const bx = center + Math.cos(note.angle + Math.sin(phase)*.08)*radius - 5;
      const by = center + Math.sin(note.angle + Math.sin(phase)*.08)*radius - 9;
      if (pointer && !reduced.matches) {
        const dx = bx + note.x - pointer.x, dy = by + note.y - pointer.y;
        const distance = Math.hypot(dx,dy) || 1;
        if (distance < 66) {
          const force = (1-distance/66)*1.9;
          note.vx += dx/distance*force*dt;
          note.vy += dy/distance*force*dt;
        }
      }
      note.vx = (note.vx - note.x*.018*dt)*Math.pow(.89,dt);
      note.vy = (note.vy - note.y*.018*dt)*Math.pow(.89,dt);
      note.x += note.vx*dt; note.y += note.vy*dt;
      note.element.style.transform = `translate(${bx+note.x}px,${by+note.y}px) rotate(${Math.sin(phase)*12}deg)`;
      moving ||= Math.abs(note.x)+Math.abs(note.y)+Math.abs(note.vx)+Math.abs(note.vy) > .15;
    }
    if (!document.hidden && !reduced.matches && (!audio.paused || pointer || moving)) frame = requestAnimationFrame(draw);
    else previous = 0;
  }
  function wake() { if (!frame && !document.hidden) frame = requestAnimationFrame(draw); }
  stage.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = stage.getBoundingClientRect();
    pointer = {x:event.clientX-rect.left,y:event.clientY-rect.top};
    const now = performance.now();
    if (!reduced.matches && now-lastRipple > 220) {
      const ripple = document.createElement('span');
      ripple.className = 'music-ripple';
      ripple.style.left = `${pointer.x}px`; ripple.style.top = `${pointer.y}px`;
      ripple.setAttribute('aria-hidden','true'); stage.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), {once:true});
      lastRipple = now;
    }
    wake();
  });
  stage.addEventListener('pointerleave', () => { pointer = null; wake(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame=0; previous=0; }
    else wake();
  });
  reduced.addEventListener('change', wake);
  window.addEventListener('resize', wake);
  wake();
  // Browsers may require another click after navigation; retain the saved position.
  if (saved?.playing) play();
})();
