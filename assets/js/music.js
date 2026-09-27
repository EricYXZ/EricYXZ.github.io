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
  const audio = new Audio('/assets/audio/waltz-in-a-minor.mp3');
  audio.preload = 'none';
  audio.volume = .45;
  const player = document.createElement('section');
  player.className = 'music-player';
  player.setAttribute('aria-label', labels.player);
  player.innerHTML = `
    <div class="music-stage">
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
      <span class="music-title">${labels.title}</span>
      <div class="music-controls">
        <input class="music-seek" type="range" min="0" max="100" value="0" step=".1" aria-label="${labels.seek}" disabled>
        <span class="music-time">0:00</span>
        <button type="button" class="music-mute" aria-label="${labels.mute}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4Z"/><path class="music-sound-wave" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg></button>
      </div>
    </div>`;
  document.body.appendChild(player);
  const stage = player.querySelector('.music-stage');
  const toggle = player.querySelector('.music-wafer-button');
  const caption = player.querySelector('.music-caption');
  const seek = player.querySelector('.music-seek');
  const time = player.querySelector('.music-time');
  const mute = player.querySelector('.music-mute');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let saved;
  try { saved = JSON.parse(sessionStorage.getItem('wafer-music') || 'null'); } catch (_) {}
  if (saved) audio.muted = !!saved.muted;
  const syncMute = () => {
    mute.setAttribute('aria-pressed', String(audio.muted));
    mute.setAttribute('aria-label', audio.muted ? labels.unmute : labels.mute);
  };
  syncMute();
  const save = () => {
    try { sessionStorage.setItem('wafer-music', JSON.stringify({time:audio.currentTime, playing:!audio.paused, muted:audio.muted})); } catch (_) {}
  };
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
  audio.addEventListener('loadedmetadata', () => {
    seek.max = audio.duration;
    seek.disabled = !Number.isFinite(audio.duration);
    if (saved && Number.isFinite(saved.time)) audio.currentTime = Math.min(saved.time, audio.duration);
    saved = null;
  });
  audio.addEventListener('timeupdate', () => {
    seek.value = audio.currentTime;
    time.textContent = formatTime(audio.currentTime);
    seek.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`);
  });
  const play = async () => {
    try { await audio.play(); }
    catch (error) { caption.textContent = error.name === 'NotAllowedError' ? labels.resume : labels.error; }
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
    player.classList.remove('music-playing');
    toggle.setAttribute('aria-label', labels.play);
    toggle.setAttribute('aria-pressed','false');
    caption.textContent = audio.ended ? labels.ready : labels.paused;
    save();
  });
  audio.addEventListener('error', () => { caption.textContent = labels.error; });
  window.addEventListener('pagehide', save);

  // Spring particles: a passing pointer pushes notes out; damping brings them back.
  const notes = Array.from({length:9}, (_, i) => {
    const element = document.createElement('span');
    element.className = 'music-note';
    element.textContent = ['♪','♫','♩'][Math.floor(Math.random()*3)];
    element.setAttribute('aria-hidden','true');
    stage.appendChild(element);
    return {element, angle:i / 9 * Math.PI * 2, phase:Math.random()*Math.PI*2, x:0,y:0,vx:0,vy:0};
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
