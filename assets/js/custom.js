(function () {
  'use strict';

  var KEY = 'wth-progress-v1';
  var LEVELS = ['beginner', 'intermediate', 'advanced'];
  var LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  var memory = null;

  function blank() {
    return { v: 1, levels: {}, last: null, days: [], celebrated: [] };
  }

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.v === 1 && data.levels) {
          if (!Array.isArray(data.days)) data.days = [];
          if (!Array.isArray(data.celebrated)) data.celebrated = [];
          return data;
        }
      }
    } catch (e) { /* fall through to memory */ }
    return memory || blank();
  }

  function write(data) {
    memory = data;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) { /* storage unavailable: progress lasts for this visit only */ }
  }

  function level(data, name) {
    if (!data.levels[name]) data.levels[name] = { done: [], total: 0 };
    return data.levels[name];
  }

  function levelFrom(text) {
    var m = /guides\/(beginner|intermediate|advanced)(?:\/|$|#)/.exec(text || '');
    return m ? m[1] : null;
  }

  // A path is only trusted if it is a plain site path under /guides/ (never //host or another scheme)
  function safePath(p) {
    return typeof p === 'string' && p.charAt(0) === '/' && p.charAt(1) !== '/' && !/[\s\\:]/.test(p) && p.indexOf('/guides/') !== -1;
  }

  function percent(l) {
    return l && l.total ? Math.min(100, Math.round((l.done.length / l.total) * 100)) : 0;
  }

  var POINTS = { s: 10, v: 5, p: 15, c: 100 };

  function pointsOf(id) {
    return POINTS[String(id).charAt(0)] || 0;
  }

  function totalPoints(data) {
    var sum = 0;
    LEVELS.forEach(function (name) {
      var l = data.levels[name];
      if (l) l.done.forEach(function (id) { sum += pointsOf(id); });
    });
    return sum;
  }

  function dayKey(date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }

  function dateFromKey(k) {
    return new Date(parseInt(k.slice(0, 4), 10), parseInt(k.slice(5, 7), 10) - 1, parseInt(k.slice(8, 10), 10));
  }

  function streakInfo(days) {
    var set = {};
    (days || []).forEach(function (k) { set[k] = true; });
    var cursor = new Date();
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
    var activeToday = !!set[dayKey(cursor)];
    if (!activeToday) cursor.setDate(cursor.getDate() - 1); // yesterday keeps the streak alive until today ends
    var current = 0;
    while (set[dayKey(cursor)]) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    }
    var sorted = (days || []).slice().sort();
    var best = 0;
    var run = 0;
    var prev = null;
    sorted.forEach(function (k) {
      var t = dateFromKey(k);
      run = prev && Math.round((t - prev) / 86400000) === 1 ? run + 1 : 1;
      if (run > best) best = run;
      prev = t;
    });
    return { current: current, best: Math.max(best, current), activeToday: activeToday };
  }

  function touchDay(data) {
    var k = dayKey(new Date());
    if (data.days.indexOf(k) !== -1) return false;
    data.days.push(k);
    data.days.sort();
    if (data.days.length > 800) data.days = data.days.slice(-800);
    return true;
  }

  var toastTimer = null;
  function toast(message) {
    var t = document.querySelector('.wth-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'wth-toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2800);
  }

  function reward(data, id, on, newDay) {
    var p = pointsOf(id);
    var msg = (on ? '+' : '−') + p + ' points · ' + totalPoints(data) + ' total';
    if (on && id === 'c:capstone') msg = 'Capstone complete! ' + msg;
    if (on && newDay) {
      var st = streakInfo(data.days);
      msg += ' · ' + st.current + '-day streak';
    }
    toast(msg);
  }

  var COMMUNITY_URL = 'https://writetechhub.org/our-community/';
  var NEXT_LEVEL = { beginner: 'intermediate', intermediate: 'advanced' };
  var modalReturnFocus = null;

  function guidesBase() {
    return window.location.pathname.replace(/(guides|progress)\/.*$/, '') + 'guides/';
  }

  function siteUrl() {
    return window.location.origin + guidesBase().replace(/guides\/$/, '');
  }

  function shareText(kind, key) {
    if (kind === 'streak') return 'I am on a ' + key + '-day learning streak on the WriteTech Hub technical writing roadmap! #TechnicalWriting #WriteTechHub';
    var label = LABELS[key] || '';
    var tags = ' #TechnicalWriting #WriteTechHub';
    if (kind === 'roadmap') return 'I just completed the full WriteTech Hub technical writing roadmap: Beginner, Intermediate and Advanced!' + tags;
    if (kind === 'capstone') return 'I just finished my ' + label + ' capstone project on the WriteTech Hub technical writing roadmap and I would love feedback from other writers.' + tags;
    if (kind === 'levelcap') return 'I just completed the ' + label + ' stage of the WriteTech Hub technical writing roadmap, including my capstone project!' + tags;
    return 'I just completed the ' + label + ' stage of the WriteTech Hub technical writing roadmap!' + tags;
  }

  var STREAK_STEPS = [1, 7, 14, 21, 30, 60, 90, 120, 150, 180, 270, 365];

  function isStreakStep(n) {
    return STREAK_STEPS.indexOf(n) !== -1 || (n > 365 && n % 365 === 0);
  }

  function cardHeadline(kind, key) {
    var label = LABELS[key] || '';
    if (kind === 'streak') return key + '-day streak';
    if (kind === 'roadmap') return 'Roadmap complete';
    if (kind === 'capstone') return label + ' capstone complete';
    return label + ' stage complete';
  }

  function wrapLines(ctx, text, maxWidth) {
    var words = text.split(' ');
    var lines = [];
    var line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else { line = test; }
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawCard(canvas, kind, key, data, onBlob) {
    var W = 1200;
    var H = 630;
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    var st = streakInfo(data.days);
    var display = '"Syne", "Arial Black", sans-serif';
    var mono = '"JetBrains Mono", "Courier New", monospace';

    ctx.fillStyle = '#840cd6';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (var gx = 0; gx < W; gx += 40) ctx.fillRect(gx, 0, 1, H);
    for (var gy = 0; gy < H; gy += 40) ctx.fillRect(0, gy, W, 1);

    ctx.fillStyle = '#1e1b1d';
    ctx.fillRect(92, 82, 1040, 490);
    ctx.fillStyle = '#fefefe';
    ctx.fillRect(80, 70, 1040, 490);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1e1b1d';
    ctx.strokeRect(80, 70, 1040, 490);

    ctx.fillStyle = '#840cd6';
    ctx.fillRect(120, 110, 330, 44);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px ' + mono;
    ctx.textBaseline = 'middle';
    ctx.fillText('★ WRITETECH HUB', 138, 133);

    ctx.fillStyle = '#1e1b1d';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '800 76px ' + display;
    var lines = wrapLines(ctx, cardHeadline(kind, key), 960).slice(0, 3);
    lines.forEach(function (ln, i) { ctx.fillText(ln, 120, 250 + i * 86); });

    ctx.font = '500 30px ' + mono;
    ctx.fillStyle = '#4a4548';
    ctx.fillText('Technical writing roadmap', 120, 250 + lines.length * 86 + 10);

    var chips = [totalPoints(data) + ' points'];
    if (kind !== 'streak' && st.current > 0) chips.push(st.current + '-day streak');
    var x = 120;
    chips.forEach(function (t) {
      ctx.font = '700 28px ' + mono;
      var w = ctx.measureText(t).width + 44;
      ctx.fillStyle = '#c97bff';
      ctx.fillRect(x, 470, w, 54);
      ctx.strokeStyle = '#1e1b1d';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, 470, w, 54);
      ctx.fillStyle = '#1e1b1d';
      ctx.textBaseline = 'middle';
      ctx.fillText(t, x + 22, 498);
      ctx.textBaseline = 'alphabetic';
      x += w + 16;
    });

    ctx.font = '500 22px ' + mono;
    ctx.fillStyle = '#4a4548';
    ctx.textAlign = 'right';
    ctx.fillText(window.location.host + window.location.pathname.replace(/(guides|progress)\/.*$/, ''), 1080, 524);
    ctx.textAlign = 'left';

    if (canvas.toBlob) canvas.toBlob(function (b) { if (b) onBlob(b); }, 'image/png');
  }

  function streakMilestone(d) {
    var n = streakInfo(d.days).current;
    if (!isStreakStep(n) || d.celebrated.indexOf('streak:' + n) !== -1) return false;
    d.celebrated.push('streak:' + n);
    write(d);
    setTimeout(function () { showCelebration('streak', n); }, 350);
    return true;
  }

  function closeModal() {
    var m = document.querySelector('.wth-modal');
    if (m) m.parentNode.removeChild(m);
    document.documentElement.classList.remove('wth-modal-open');
    if (modalReturnFocus && modalReturnFocus.focus) modalReturnFocus.focus();
    modalReturnFocus = null;
  }

  function copyText(text, button) {
    function done() {
      var label = button.querySelector('.wth-check__text');
      if (label) {
        var old = label.textContent;
        label.textContent = 'Copied!';
        setTimeout(function () { label.textContent = old; }, 1800);
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
      return;
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* nothing more to do */ }
    document.body.removeChild(ta);
  }

  function shareLink(label, href) {
    var a = el('a', 'wth-check wth-share__link');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.appendChild(el('span', 'wth-check__text', label));
    return a;
  }

  function showCelebration(kind, key) {
    closeModal();
    var d = read();
    var label = LABELS[key] || '';
    var st = streakInfo(d.days);
    var withCapstone = kind === 'capstone' || kind === 'levelcap';
    var kicker, title, text;
    if (kind === 'streak') {
      kicker = '★ ' + key + '-day streak';
      title = key === 1 ? 'Day one is done. Your streak has started!' : 'You are on a ' + key + '-day streak!';
      text = key === 1 ? 'Come back tomorrow to keep it going.' : 'You have shown up ' + key + ' days in a row. Keep it up.';
    } else if (kind === 'roadmap') {
      kicker = '★ Roadmap complete';
      title = 'You finished the whole roadmap!';
      text = 'Beginner, Intermediate and Advanced are all done. That is a real achievement.';
    } else if (kind === 'capstone') {
      kicker = '★ Capstone complete';
      title = 'Your ' + label + ' capstone is done!';
      text = 'You built the main deliverable for this stage. Put it in front of other writers while it is fresh.';
    } else if (kind === 'levelcap') {
      kicker = '★ Stage complete';
      title = 'You completed the ' + label + ' stage of the roadmap!';
      text = 'Every section, video and exercise is done, and so is your capstone.';
    } else {
      kicker = '★ Stage complete';
      title = 'You completed the ' + label + ' stage of the roadmap!';
      text = 'Every section, video and exercise in this stage is done.';
    }
    text += ' You have ' + totalPoints(d) + ' points' + (kind !== 'streak' && st.current > 1 ? ' and a ' + st.current + '-day streak' : '') + '.';

    var modal = el('div', 'wth-modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'wth-modal-title');
    var panel = el('div', 'wth-modal__panel');

    var close = el('button', 'wth-modal__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', closeModal);
    panel.appendChild(close);

    panel.appendChild(el('p', 'wth-modal__kicker', kicker));
    var h = el('h2', 'wth-modal__title', title);
    h.id = 'wth-modal-title';
    panel.appendChild(h);
    panel.appendChild(el('p', 'wth-modal__text', text));

    var picture = document.createElement('canvas');
    picture.className = 'wth-modal__img';
    picture.setAttribute('role', 'img');
    picture.setAttribute('aria-label', cardHeadline(kind, key));
    var pictureBlob = null;
    function paint() { drawCard(picture, kind, key, d, function (b) { pictureBlob = b; }); }
    paint();
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load('800 40px Syne'), document.fonts.load('700 24px "JetBrains Mono"')]).then(paint, function () {});
    }
    panel.appendChild(picture);

    var actions = el('div', 'wth-modal__actions');
    var nextKey = NEXT_LEVEL[key];
    if (kind !== 'capstone' && kind !== 'roadmap' && nextKey) {
      var next = el('a', 'wth-btn wth-btn--primary', 'Start the ' + LABELS[nextKey] + ' stage →');
      next.href = guidesBase() + nextKey + '/';
      actions.appendChild(next);
    } else {
      var mine = el('a', 'wth-btn wth-btn--primary', 'See my progress');
      mine.href = guidesBase().replace(/guides\/$/, 'progress/');
      actions.appendChild(mine);
    }
    var later = el('button', 'wth-check', null);
    later.type = 'button';
    later.appendChild(el('span', 'wth-check__text', 'Keep reading'));
    later.addEventListener('click', closeModal);
    actions.appendChild(later);
    panel.appendChild(actions);

    panel.appendChild(el('p', 'wth-modal__sharehead', 'Share your milestone'));
    var msg = shareText(kind, key);
    var url = siteUrl();
    var row = el('div', 'wth-share');
    row.appendChild(shareLink('LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url)));
    row.appendChild(shareLink('X', 'https://x.com/intent/post?text=' + encodeURIComponent(msg) + '&url=' + encodeURIComponent(url)));
    row.appendChild(shareLink('Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)));
    row.appendChild(shareLink('WhatsApp', 'https://wa.me/?text=' + encodeURIComponent(msg + ' ' + url)));
    var copy = el('button', 'wth-check', null);
    copy.type = 'button';
    copy.appendChild(el('span', 'wth-check__text', 'Copy post text'));
    copy.addEventListener('click', function () { copyText(msg + ' ' + url, copy); });
    row.appendChild(copy);
    var save = el('button', 'wth-check', null);
    save.type = 'button';
    save.appendChild(el('span', 'wth-check__text', 'Download picture'));
    save.addEventListener('click', function () {
      if (!pictureBlob) return;
      var href = URL.createObjectURL(pictureBlob);
      var a = document.createElement('a');
      a.href = href;
      a.download = 'wth-roadmap-' + kind + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(href); }, 4000);
    });
    row.appendChild(save);
    if (navigator.share) {
      var native = el('button', 'wth-check', null);
      native.type = 'button';
      native.appendChild(el('span', 'wth-check__text', 'Share…'));
      native.addEventListener('click', function () {
        var payload = { title: title, text: msg, url: url };
        try {
          var file = pictureBlob ? new File([pictureBlob], 'wth-roadmap.png', { type: 'image/png' }) : null;
          if (file && navigator.canShare && navigator.canShare({ files: [file] })) payload.files = [file];
        } catch (e) { /* share without the picture */ }
        navigator.share(payload).catch(function () {});
      });
      row.appendChild(native);
    }
    panel.appendChild(row);
    panel.appendChild(el('p', 'wth-modal__fine', 'These buttons only open the sharing page of the site you choose. Nothing is sent until you press post there. Sites cannot attach the picture for you, so download it and add it to your post.'));

    if (withCapstone) {
      var note = el('p', 'wth-modal__note');
      note.appendChild(document.createTextNode('Want feedback? Share your capstone in the '));
      var link = el('a', null, 'WriteTech Hub community');
      link.href = COMMUNITY_URL;
      link.target = '_blank';
      link.rel = 'noopener';
      note.appendChild(link);
      note.appendChild(document.createTextNode(' so other writers can review it.'));
      panel.appendChild(note);
    }

    modal.appendChild(panel);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key !== 'Tab') return;
      var f = modal.querySelectorAll('a[href], button');
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    modalReturnFocus = document.activeElement;
    document.body.appendChild(modal);
    document.documentElement.classList.add('wth-modal-open');
    var firstAction = actions.querySelector('a, button');
    if (firstAction) firstAction.focus();
    var t = document.querySelector('.wth-toast');
    if (t) t.classList.remove('is-on');
  }

  // Called after an item is ticked. Shows a pop-up the first time a level or capstone is finished.
  // Returns true if a pop-up is on its way (so the small points toast is skipped).
  function milestone(d, key, id, on, doneCount, totalCount) {
    if (!on) return false;
    var seen = d.celebrated;
    var levelDone = totalCount > 0 && doneCount === totalCount;
    var cap = id === 'c:capstone';
    var allDone = LEVELS.every(function (n) {
      var l = d.levels[n];
      return l && l.total > 0 && l.done.length === l.total;
    });
    var kind = null;
    var marks = [];
    if (allDone && levelDone && seen.indexOf('roadmap') === -1) {
      kind = 'roadmap';
      marks = ['roadmap', 'level:' + key];
    } else if (levelDone && seen.indexOf('level:' + key) === -1) {
      kind = cap ? 'levelcap' : 'level';
      marks = ['level:' + key];
      if (cap) marks.push('capstone:' + key);
    } else if (cap && seen.indexOf('capstone:' + key) === -1) {
      kind = 'capstone';
      marks = ['capstone:' + key];
    }
    if (!kind) return false;
    marks.forEach(function (m) { if (seen.indexOf(m) === -1) seen.push(m); });
    write(d);
    setTimeout(function () { showCelebration(kind, key); }, 350);
    return true;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function initVideos() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.wth-video__play') : null;
      if (!btn) return;
      var frame = document.createElement('iframe');
      frame.className = 'wth-video__frame';
      frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(btn.getAttribute('data-video')) + '?autoplay=1&rel=0';
      frame.title = btn.getAttribute('data-title') || 'Video';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.setAttribute('allowfullscreen', '');
      btn.parentNode.replaceChild(frame, btn);
    });
  }

  function initReadingBar() {
    var bar = document.querySelector('.wth-progress');
    if (!bar) return;
    var fill = bar.querySelector('.wth-progress__bar');
    var label = bar.querySelector('.wth-progress__label');
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var pct = Math.round(p * 100);
      fill.style.transform = 'scaleX(' + p + ')';
      label.textContent = pct + '% read';
      bar.setAttribute('aria-valuenow', pct);
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function makeToggle(idleText, doneText, onChange) {
    var b = el('button', 'wth-check');
    b.type = 'button';
    b.appendChild(el('span', 'wth-check__box'));
    var text = el('span', 'wth-check__text', idleText);
    b.appendChild(text);
    b.setAttribute('aria-pressed', 'false');
    b.set = function (on) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      text.textContent = on ? doneText : idleText;
    };
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.set(on);
      onChange(on);
    });
    return b;
  }

  function miniBar(pct) {
    var track = el('span', 'wth-mini');
    var fill = el('i');
    fill.style.width = pct + '%';
    track.appendChild(fill);
    return track;
  }

  function paintLevelLinks(data) {
    var links = document.querySelectorAll('.docs-links a, .wth-row[data-level]');
    Array.prototype.forEach.call(links, function (a) {
      var name = a.getAttribute('data-level') || levelFrom(a.getAttribute('href'));
      if (!name) return;
      var l = data.levels[name];
      var host = a.classList.contains('wth-row') ? a.querySelector('.wth-row__body') : a;
      if (!host) return;
      var old = host.querySelector('.wth-levelprog');
      if (old) old.parentNode.removeChild(old);
      if (!l || !l.total) return; // never visited: nothing to show yet
      var wrap = el('span', 'wth-levelprog');
      wrap.appendChild(miniBar(percent(l)));
      wrap.appendChild(el('span', 'wth-levelprog__text', l.done.length + ' of ' + l.total + ' done'));
      var cta = host.querySelector('.wth-row__cta');
      if (cta) host.insertBefore(wrap, cta); else host.appendChild(wrap);
    });
  }

  function toolsUrl() {
    return window.location.pathname.replace(/guides\/(beginner|intermediate|advanced).*$/, 'progress/');
  }

  function initGuide(content, name) {
    var items = [];

    Array.prototype.forEach.call(document.querySelectorAll('nav.docs-links'), function (nav) {
      var after = nav.nextElementSibling;
      if (after && after.classList.contains('wth-manage')) return;
      var manage = el('a', 'wth-manage', 'Manage progress');
      manage.href = toolsUrl();
      nav.parentNode.insertBefore(manage, nav.nextSibling);
    });

    function addItem(id, toggle) {
      items.push({ id: id, toggle: toggle });
    }

    function nextBoundary(kids, i, stopTags) {
      var j = i + 1;
      while (j < kids.length) {
        var k = kids[j];
        if (stopTags.indexOf(k.tagName) !== -1 ||
            k.classList.contains('wth-capstone') ||
            k.classList.contains('page-footer-meta') ||
            k.classList.contains('docs-navigation')) break;
        j++;
      }
      return kids[j] || null;
    }

    var kids = Array.prototype.slice.call(content.children);
    kids.forEach(function (node, i) {
      var text = (node.textContent || '').trim();

      if (node.tagName === 'H2' && node.id && /^\d+\./.test(text) && !/video tutorials|further reading/i.test(text)) {
        var sid = 's:' + node.id;
        var t = makeToggle('Mark section done \u00b7 +' + POINTS.s + ' pts', 'Section done \u00b7 +' + POINTS.s + ' pts', function (on) { change(sid, on, node.id); });
        var row = el('div', 'wth-check-row');
        row.appendChild(t);
        content.insertBefore(row, nextBoundary(kids, i, ['H2']));
        addItem(sid, t);
        node.setAttribute('data-track', sid);
      }

      if (node.tagName === 'H3' && node.id && /^practice$/i.test(text)) {
        var pid = 'p:' + node.id;
        var pt = makeToggle('Mark exercise done \u00b7 +' + POINTS.p + ' pts', 'Exercise done \u00b7 +' + POINTS.p + ' pts', function (on) { change(pid, on, node.id); });
        var prow = el('div', 'wth-check-row');
        prow.appendChild(pt);
        content.insertBefore(prow, nextBoundary(kids, i, ['H2', 'H3']));
        addItem(pid, pt);
      }
    });

    Array.prototype.forEach.call(content.querySelectorAll('.wth-video[data-video]'), function (fig) {
      var vid = 'v:' + fig.getAttribute('data-video');
      var vt = makeToggle('Mark as watched \u00b7 +' + POINTS.v + ' pts', 'Watched \u00b7 +' + POINTS.v + ' pts', function (on) { change(vid, on, null); });
      var cap = fig.querySelector('.wth-video__caption');
      if (cap) cap.appendChild(vt);
      addItem(vid, vt);
    });

    var capBody = content.querySelector('.wth-capstone__body');
    if (capBody) {
      var ct = makeToggle('Mark capstone complete \u00b7 +' + POINTS.c + ' pts', 'Capstone complete \u00b7 +' + POINTS.c + ' pts', function (on) { change('c:capstone', on, 'capstone-deliverable'); });
      var crow = el('div', 'wth-check-row wth-check-row--capstone');
      crow.appendChild(ct);
      capBody.appendChild(crow);
      addItem('c:capstone', ct);
    }

    if (!items.length) return;

    function makePill(extraClass) {
      var root = el('a', 'wth-donepill' + (extraClass ? ' ' + extraClass : ''));
      root.href = toolsUrl();
      root.title = 'Manage your progress: export, import or clear';
      var text = el('span', 'wth-donepill__text');
      var bar = miniBar(0);
      root.appendChild(bar);
      root.appendChild(text);
      return { root: root, text: text, bar: bar };
    }
    var pills = [makePill(''), makePill('wth-donepill--inline')];
    var sideNav = document.querySelector('.docs-sidebar nav.docs-links');
    var readLabel = document.querySelector('.wth-progress__label');
    if (sideNav) {
      var stack = el('div', 'wth-sidebadges');
      stack.appendChild(pills[0].root);
      if (readLabel) stack.appendChild(readLabel);
      var manageLink = sideNav.parentNode.querySelector('.wth-manage');
      (manageLink || sideNav).insertAdjacentElement('afterend', stack);
    } else {
      document.body.appendChild(pills[0].root);
    }
    var heading = content.querySelector('h1');
    if (heading) heading.parentNode.insertBefore(pills[1].root, heading.nextSibling);

    var levelIndex = LEVELS.indexOf(name);
    if (levelIndex > 0 && heading) {
      var stored = read();
      var earlierOpen = LEVELS.slice(0, levelIndex).filter(function (n) {
        var l = stored.levels[n];
        return !(l && l.total > 0 && l.done.length === l.total);
      });
      if (earlierOpen.length) {
        var skip = el('p', 'wth-skipnote');
        skip.appendChild(document.createTextNode('Starting here? If you already know the earlier levels, '));
        var skipLink = el('a', null, 'mark them as done on your progress page');
        skipLink.href = toolsUrl();
        skip.appendChild(skipLink);
        skip.appendChild(document.createTextNode(' so your points and path stay in sync.'));
        heading.parentNode.insertBefore(skip, heading.nextSibling);
      }
    }

    // drop saved ids that no longer exist on the page (content changes over time)
    var ids = items.map(function (it) { return it.id; });
    var data = read();
    var L = level(data, name);
    L.done = L.done.filter(function (id) { return ids.indexOf(id) !== -1; });
    L.total = items.length;
    write(data);

    function paint() {
      var d = read();
      var l = level(d, name);
      items.forEach(function (it) { it.toggle.set(l.done.indexOf(it.id) !== -1); });
      Array.prototype.forEach.call(content.querySelectorAll('[data-track]'), function (h) {
        h.classList.toggle('wth-done', l.done.indexOf(h.getAttribute('data-track')) !== -1);
      });
      Array.prototype.forEach.call(document.querySelectorAll('.docs-toc a[href^="#"]'), function (a) {
        var target = 's:' + a.getAttribute('href').slice(1);
        a.classList.toggle('wth-done', l.done.indexOf(target) !== -1);
      });
      pills.forEach(function (p) {
        p.text.textContent = l.done.length + ' of ' + l.total + ' done \u00b7 ' + totalPoints(d) + ' pts';
        p.bar.firstChild.style.width = percent(l) + '%';
        p.root.classList.toggle('is-complete', l.total > 0 && l.done.length === l.total);
      });
      paintLevelLinks(d);
    }

    function change(id, on, hash) {
      var d = read();
      var l = level(d, name);
      var i = l.done.indexOf(id);
      var newDay = false;
      var changedState = (on && i === -1) || (!on && i !== -1);
      if (on && i === -1) { l.done.push(id); newDay = touchDay(d); }
      if (!on && i !== -1) l.done.splice(i, 1);
      if (hash) rememberPlace(d, hash);
      write(d);
      paint();
      announce();
      var celebrating = changedState && milestone(d, name, id, on, l.done.length, l.total);
      if (!celebrating && changedState && on && newDay) celebrating = streakMilestone(d);
      if (changedState && !celebrating) reward(d, id, on, newDay);
    }

    function rememberPlace(d, hash) {
      var h1 = document.querySelector('.docs-content h1');
      d.last = {
        path: window.location.pathname,
        title: h1 ? h1.textContent.trim() : document.title,
        level: name,
        hash: hash ? '#' + hash : '',
        t: Date.now()
      };
    }

    var timer = null;
    function currentHeading() {
      var found = '';
      Array.prototype.forEach.call(content.querySelectorAll('h2[id]'), function (h) {
        if (h.getBoundingClientRect().top < 160) found = h.id;
      });
      return found;
    }
    window.addEventListener('scroll', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var d = read();
        rememberPlace(d, currentHeading());
        write(d);
      }, 500);
    }, { passive: true });

    var d0 = read();
    if (!d0.last || d0.last.path !== window.location.pathname) {
      rememberPlace(d0, '');
      write(d0);
    }
    paint();
  }

  function initContinue() {
    var d = read();
    if (!d.last || !safePath(d.last.path)) return;
    var l = d.levels[d.last.level];
    var a = el('a', 'wth-continue');
    a.href = d.last.path + (d.last.hash || '');
    var strong = el('strong', null, 'Continue where you left off');
    a.appendChild(strong);
    a.appendChild(el('span', null, d.last.title + (l && l.total ? ' · ' + l.done.length + ' of ' + l.total + ' done' : '') + ' →'));

    var lower = document.querySelector('.wth-hero__lower');
    var facts = document.querySelector('.wth-hero__facts');
    var list = document.querySelector('.card-list');
    if (lower && facts) {
      facts.parentNode.insertBefore(a, facts.nextSibling);
    } else if (list) {
      list.parentNode.insertBefore(a, list);
    }
  }

  function encode(data) {
    return 'WTH1.' + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  }

  function decode(code) {
    var raw = String(code || '').trim();
    var parsed;
    if (raw.charAt(0) === '{') {
      var j = JSON.parse(raw);
      parsed = { v: j.version, levels: j.levels, last: j.last, days: j.days, celebrated: j.celebrated };
    } else {
      var clean = raw.replace(/\s+/g, '');
      if (clean.indexOf('WTH1.') !== 0) throw new Error('That does not look like a progress code or file.');
      parsed = JSON.parse(decodeURIComponent(escape(atob(clean.slice(5)))));
    }
    if (!parsed || parsed.v !== 1 || typeof parsed.levels !== 'object' || parsed.levels === null) throw new Error('That progress code or file is not valid.');
    var safe = blank();
    LEVELS.forEach(function (name) {
      var src = parsed.levels[name];
      if (!src || !Array.isArray(src.done)) return;
      var l = level(safe, name);
      l.done = src.done.filter(function (x) { return typeof x === 'string' && /^[spvc]:[A-Za-z0-9_-]{1,120}$/.test(x); }).slice(0, 500);
      l.total = Math.max(0, Math.min(500, parseInt(src.total, 10) || 0));
    });
    if (parsed.last && safePath(parsed.last.path) && LEVELS.indexOf(parsed.last.level) !== -1) {
      safe.last = {
        path: parsed.last.path,
        title: String(parsed.last.title || '').slice(0, 120),
        level: parsed.last.level,
        hash: typeof parsed.last.hash === 'string' && /^#[\w-]*$/.test(parsed.last.hash) ? parsed.last.hash : '',
        t: Number(parsed.last.t) || 0
      };
    }
    safe.days = Array.isArray(parsed.days)
      ? parsed.days.filter(function (k) { return typeof k === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(k); }).slice(-800)
      : [];
    safe.celebrated = Array.isArray(parsed.celebrated)
      ? parsed.celebrated.filter(function (k) { return typeof k === 'string' && /^(roadmap|(level|capstone):[a-z]{1,20}|streak:\d{1,4})$/.test(k); }).slice(0, 60)
      : [];
    return safe;
  }

  function announce() {
    window.dispatchEvent(new Event('wth-progress'));
  }

  function initTools() {
    var box = document.querySelector('.wth-tools');
    if (!box) return;
    var area = box.querySelector('.wth-tools__code');
    var status = box.querySelector('.wth-tools__status');
    var summary = box.querySelector('.wth-tools__levels');
    var confirmBox = box.querySelector('.wth-tools__confirm');
    var confirmText = box.querySelector('.wth-tools__confirm-text');
    var yesLabel = box.querySelector('[data-act="confirm-yes"] .wth-check__text');
    var pending = null;

    function say(msg) { status.textContent = msg; }

    function ask(message, onYes, yesText) {
      pending = onYes;
      confirmText.textContent = message;
      yesLabel.textContent = yesText || 'Yes, clear it';
      confirmBox.hidden = false;
      var yes = confirmBox.querySelector('[data-act="confirm-yes"]');
      if (yes) yes.focus();
    }

    function closeAsk() {
      pending = null;
      confirmBox.hidden = true;
    }

    function drawSummary() {
      var d = read();
      summary.textContent = '';
      LEVELS.forEach(function (name) {
        var l = d.levels[name];
        var started = !!(l && l.total);
        var row = el('div', 'wth-tools__level');
        row.appendChild(el('span', 'wth-tools__name', LABELS[name]));
        row.appendChild(miniBar(percent(l)));
        row.appendChild(el('span', 'wth-tools__count', started ? l.done.length + ' of ' + l.total : 'Not started'));
        var clear = el('button', 'wth-check wth-check--small');
        clear.type = 'button';
        clear.setAttribute('data-act', 'clear-level');
        clear.setAttribute('data-level', name);
        clear.setAttribute('aria-label', 'Clear ' + LABELS[name] + ' progress');
        clear.disabled = !(l && l.done.length);
        clear.appendChild(el('span', 'wth-check__text', 'Clear'));
        row.appendChild(clear);
        summary.appendChild(row);
      });
    }

    function refresh() {
      drawSummary();
      announce();
    }

    function startImport(text) {
      closeAsk();
      var incoming;
      try {
        incoming = decode(text);
      } catch (err) {
        say(err && err.message ? err.message : 'That code could not be read.');
        return;
      }
      var parts = [];
      LEVELS.forEach(function (name) {
        var src = incoming.levels[name];
        if (src && src.done.length) parts.push(LABELS[name] + ': ' + src.done.length + (src.done.length === 1 ? ' item' : ' items'));
      });
      if (incoming.days.length) parts.push(incoming.days.length + (incoming.days.length === 1 ? ' active day' : ' active days'));
      if (!parts.length && !incoming.last) {
        say('That code is valid but has no progress in it.');
        return;
      }
      var where = incoming.last ? ' It also remembers where you stopped: ' + (incoming.last.title || incoming.last.level) + '.' : '';
      ask('This code contains ' + (parts.length ? parts.join(', ') : 'no ticked items') + '.' + where + ' Add it to the progress saved in this browser?', function () {
        var d = read();
        LEVELS.forEach(function (name) {
          var src = incoming.levels[name];
          if (!src) return;
          var l = level(d, name);
          src.done.forEach(function (id) { if (l.done.indexOf(id) === -1) l.done.push(id); });
          l.total = Math.max(l.total, src.total);
        });
        incoming.days.forEach(function (k) { if (d.days.indexOf(k) === -1) d.days.push(k); });
        incoming.celebrated.forEach(function (k) { if (d.celebrated.indexOf(k) === -1) d.celebrated.push(k); });
          d.days.sort();
          if (incoming.last && (!d.last || incoming.last.t > d.last.t)) d.last = incoming.last;
        write(d);
        refresh();
        say('Progress imported.');
      }, 'Yes, import it');
    }

    var fileInput = box.querySelector('.wth-tools__file');
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        var file = fileInput.files && fileInput.files[0];
        fileInput.value = '';
        if (!file) return;
        if (file.size > 200 * 1024) {
          say('That file is too large to be a progress file.');
          return;
        }
        var reader = new FileReader();
        reader.onload = function () { startImport(String(reader.result || '')); };
        reader.onerror = function () { say('That file could not be read.'); };
        reader.readAsText(file);
      });
    }

    box.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!btn || btn.disabled) return;
      var act = btn.getAttribute('data-act');

      if (act === 'export') {
        closeAsk();
        area.value = encode(read());
        area.focus();
        area.select();
        var copied = false;
        try { copied = document.execCommand && document.execCommand('copy'); } catch (err) { copied = false; }
        say(copied ? 'Progress code copied. Paste it on another device and choose Import.' : 'Copy this code and paste it on another device, then choose Import.');
      }

      if (act === 'import') {
        startImport(area.value);
      }

      if (act === 'import-file') {
        closeAsk();
        if (fileInput) fileInput.click();
      }

      if (act === 'download') {
        closeAsk();
        var current = read();
        var out = { app: 'wth-resource-library', format: 'progress', version: 1, exportedAt: new Date().toISOString(), levels: current.levels, last: current.last, days: current.days, celebrated: current.celebrated };
        var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'wth-progress.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        say('Progress file downloaded (wth-progress.json). Keep it somewhere safe.');
      }

      if (act === 'reset') {
        say('');
        ask('Clear ALL saved progress in this browser? This cannot be undone.', function () {
          write(blank());
          area.value = '';
          refresh();
          say('All progress cleared.');
        }, 'Yes, clear it');
      }

      if (act === 'clear-level') {
        var name = btn.getAttribute('data-level');
        say('');
        ask('Clear your ' + LABELS[name] + ' progress? This cannot be undone.', function () {
          var d = read();
          d.levels[name] = { done: [], total: (d.levels[name] && d.levels[name].total) || 0 };
          if (d.last && d.last.level === name) d.last = null;
          write(d);
          refresh();
          say(LABELS[name] + ' progress cleared.');
        }, 'Yes, clear it');
      }

      if (act === 'confirm-yes') {
        var run = pending;
        closeAsk();
        if (run) run();
      }

      if (act === 'confirm-no') {
        closeAsk();
        say('Nothing was changed.');
      }
    });

    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !confirmBox.hidden) {
        closeAsk();
        say('Nothing was changed.');
      }
    });

    window.addEventListener('wth-progress', drawSummary);
    drawSummary();
  }

  function initDashboard() {
    var root = document.querySelector('.wth-dash');
    if (!root) return;
    var catalogue;
    try {
      catalogue = JSON.parse(root.getAttribute('data-catalogue'));
    } catch (e) {
      return;
    }
    var cardsBox = root.querySelector('.wth-dash__levels');
    var detailsBox = root.querySelector('.wth-dash__details');
    var continueBox = root.querySelector('.wth-dash__continue');
    var summaryBox = root.querySelector('.wth-dash__summary');
    var statsBox = root.querySelector('.wth-dash__stats');
    var open = {};
    var pendingSkip = null;
    var focusId = null;

    function setItem(key, id, on) {
      var d = read();
      var l = level(d, key);
      var i = l.done.indexOf(id);
      var newDay = false;
      var changedState = (on && i === -1) || (!on && i !== -1);
      if (on && i === -1) { l.done.push(id); newDay = touchDay(d); }
      if (!on && i !== -1) l.done.splice(i, 1);
      write(d);
      focusId = id;
      announce();
      var Lc = catalogue.filter(function (x) { return x.key === key; })[0];
      var levelIds = Lc ? idsOfLevel(Lc) : [];
      var doneHere = l.done.filter(function (x) { return levelIds.indexOf(x) !== -1; }).length;
      var celebrating = changedState && milestone(d, key, id, on, doneHere, levelIds.length);
      if (!celebrating && changedState && on && newDay) celebrating = streakMilestone(d);
      if (changedState && !celebrating) reward(d, id, on, newDay);
    }

    function idsOfLevel(L) {
      var ids = [];
      L.sections.forEach(function (sec) {
        ids.push(sec.id);
        sec.items.forEach(function (it) { ids.push(it.id); });
      });
      if (L.capstone && L.capstone.id) ids.push(L.capstone.id);
      return ids;
    }

    function markAll(L) {
      var d = read();
      var l = level(d, L.key);
      var added = 0;
      l.total = idsOfLevel(L).length;
      idsOfLevel(L).forEach(function (id) {
        if (l.done.indexOf(id) === -1) {
          l.done.push(id);
          added += pointsOf(id);
        }
      });
      var freshDay = touchDay(d);
      write(d);
      pendingSkip = null;
      announce();
      toast(LABELS[L.key] + ' marked as done \u00b7 +' + added + ' points');
      if (freshDay) streakMilestone(d);
    }

    function row(key, id, label, href, done, extra) {
      var li = el('li', 'wth-dash__row' + (extra ? ' ' + extra : ''));
      var a = el('a', 'wth-dash__link', label);
      a.href = href;
      li.appendChild(a);
      li.appendChild(el('span', 'wth-dash__pts', '+' + pointsOf(id) + ' pts'));
      var t = makeToggle('Mark done', 'Done', function (on) { setItem(key, id, on); });
      t.classList.add('wth-check--small');
      t.setAttribute('data-id', id);
      t.set(done);
      li.appendChild(t);
      return li;
    }

    var ICON = { video: 'Video: ', practice: '' };

    function render() {
      var d = read();
      var changed = false;
      var doneAll = 0;
      var totalAll = 0;
      var complete = 0;
      cardsBox.textContent = '';
      detailsBox.textContent = '';

      catalogue.forEach(function (L) {
        var ids = [];
        L.sections.forEach(function (s) {
          ids.push(s.id);
          s.items.forEach(function (it) { ids.push(it.id); });
        });
        var hasCap = !!(L.capstone && L.capstone.id);
        if (hasCap) ids.push(L.capstone.id);

        var rec = level(d, L.key);
        var valid = rec.done.filter(function (id) { return ids.indexOf(id) !== -1; });
        if (valid.length !== rec.done.length) { rec.done = valid; changed = true; }
        if (rec.total !== ids.length) { rec.total = ids.length; changed = true; }

        var n = valid.length;
        var total = ids.length;
        var pct = total ? Math.round((n / total) * 100) : 0;
        var state = n === 0 ? 'not-started' : (n === total ? 'complete' : 'in-progress');
        doneAll += n;
        totalAll += total;
        if (state === 'complete') complete++;

        var card = el('div', 'wth-dash__card wth-dash__card--' + L.key + ' is-' + state);
        var badge = el('span', 'wth-dash__badge', state === 'complete' ? '★ Level complete' : (state === 'in-progress' ? 'In progress' : 'Not started'));
        card.appendChild(badge);
        card.appendChild(el('h3', 'wth-dash__cardtitle', L.title));
        card.appendChild(miniBar(pct));
        var lvlPoints = valid.reduce(function (sum, id) { return sum + pointsOf(id); }, 0);
        card.appendChild(el('p', 'wth-dash__count', n + ' of ' + total + ' done \u00b7 ' + pct + '% \u00b7 ' + lvlPoints + ' pts'));
        var actions = el('div', 'wth-dash__actions');
        var nextKey = NEXT_LEVEL[L.key];
        var nextCat = nextKey ? catalogue.filter(function (x) { return x.key === nextKey; })[0] : null;
        if (state === 'complete') {
          var lead = el('a', 'wth-btn wth-btn--primary wth-dash__open', nextCat ? 'Next: ' + LABELS[nextKey] + ' \u2192' : 'Review level');
          lead.href = nextCat ? nextCat.url : L.url;
          actions.appendChild(lead);
          var shareBtn = el('button', 'wth-check wth-check--small');
          shareBtn.type = 'button';
          shareBtn.appendChild(el('span', 'wth-check__text', 'Share'));
          shareBtn.addEventListener('click', function () { showCelebration('level', L.key); });
          actions.appendChild(shareBtn);
          if (nextCat) {
            var review = el('a', 'wth-dash__sub', 'Review this level');
            review.href = L.url;
            actions.appendChild(review);
          }
        } else {
          var go = el('a', 'wth-btn wth-btn--primary wth-dash__open', n ? 'Keep going' : 'Start level');
          go.href = L.url;
          actions.appendChild(go);
          var skipBtn = el('button', 'wth-check wth-check--small');
          skipBtn.type = 'button';
          skipBtn.appendChild(el('span', 'wth-check__text', 'Mark all done'));
          skipBtn.addEventListener('click', function () { pendingSkip = L.key; render(); });
          actions.appendChild(skipBtn);
        }
        card.appendChild(actions);
        if (pendingSkip === L.key) {
          var maxPts = ids.reduce(function (sum, id) { return sum + pointsOf(id); }, 0);
          var box = el('div', 'wth-dash__skip');
          box.appendChild(el('p', null, 'Mark every item in ' + LABELS[L.key] + ' as done? You get all ' + maxPts + ' points. Only do this if you already know this level.'));
          var yes = el('button', 'wth-check wth-check--small');
          yes.type = 'button';
          yes.appendChild(el('span', 'wth-check__text', 'Yes, mark all'));
          yes.addEventListener('click', function () { markAll(L); });
          var no = el('button', 'wth-check wth-check--small');
          no.type = 'button';
          no.appendChild(el('span', 'wth-check__text', 'Cancel'));
          no.addEventListener('click', function () { pendingSkip = null; render(); });
          box.appendChild(yes);
          box.appendChild(no);
          card.appendChild(box);
        }
        cardsBox.appendChild(card);

        var det = el('details', 'wth-dash__level');
        det.open = !!open[L.key];
        det.addEventListener('toggle', function () { open[L.key] = det.open; });
        var sum = el('summary', null, L.title + ' — ' + n + ' of ' + total);
        det.appendChild(sum);
        var ul = el('ul', 'wth-dash__list');
        L.sections.forEach(function (s) {
          ul.appendChild(row(L.key, s.id, s.title, s.anchor, valid.indexOf(s.id) !== -1, 'wth-dash__row--section'));
          s.items.forEach(function (it) {
            ul.appendChild(row(L.key, it.id, (ICON[it.type] || '') + it.title, s.anchor, valid.indexOf(it.id) !== -1, 'wth-dash__row--item'));
          });
        });
        if (hasCap) {
          ul.appendChild(row(L.key, L.capstone.id, L.capstone.title, L.capstone.anchor, valid.indexOf(L.capstone.id) !== -1, 'wth-dash__row--capstone'));
        }
        det.appendChild(ul);
        detailsBox.appendChild(det);
      });

      if (changed) write(d);

      summaryBox.textContent = '';
      var pctAll = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
      if (complete === catalogue.length && catalogue.length) {
        summaryBox.appendChild(el('p', 'wth-dash__banner', '★ Full path complete. You have finished every level.'));
      } else {
        summaryBox.appendChild(el('p', 'wth-dash__overall', doneAll + ' of ' + totalAll + ' done across all levels (' + pctAll + '%)'));
      }

      var st = streakInfo(d.days);
      statsBox.textContent = '';
      function stat(label, value, note) {
        var box = el('div', 'wth-dash__stat');
        box.appendChild(el('span', 'wth-dash__statlabel', label));
        box.appendChild(el('strong', 'wth-dash__statvalue', value));
        box.appendChild(el('span', 'wth-dash__statnote', note));
        return box;
      }
      statsBox.appendChild(stat('Points', String(totalPoints(d)), 'Sections ' + POINTS.s + ' \u00b7 videos ' + POINTS.v + ' \u00b7 exercises ' + POINTS.p + ' \u00b7 capstone ' + POINTS.c));
      statsBox.appendChild(stat('Current streak', st.current + (st.current === 1 ? ' day' : ' days'),
        st.activeToday ? 'You have ticked something today' : (st.current ? 'Tick something today to keep it going' : 'Tick something to start a streak')));
      statsBox.appendChild(stat('Best streak', st.best + (st.best === 1 ? ' day' : ' days'), 'Your longest run of active days'));

      continueBox.textContent = '';
      var last = d.last;
      if (last && safePath(last.path)) {
        var a = el('a', 'wth-continue');
        a.href = last.path + (last.hash || '');
        a.appendChild(el('strong', null, 'Continue where you left off'));
        a.appendChild(el('span', null, (last.title || 'Your last page') + ' →'));
        continueBox.appendChild(a);
      }

      if (focusId) {
        var again = root.querySelector('[data-id="' + focusId + '"]');
        if (again) again.focus();
        focusId = null;
      }
    }

    window.addEventListener('wth-progress', render);
    render();
  }

  function start() {
    initVideos();
    initReadingBar();

    var content = document.querySelector('.docs-content');
    var name = levelFrom(window.location.pathname);
    if (content && name) initGuide(content, name);

    paintLevelLinks(read());
    initContinue();
    initTools();
    initDashboard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
