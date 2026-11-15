(function () {
  const { React, createRoot, motion, AnimatePresence, MotionConfig, useReducedMotion, html } = window.Vendor;
  const { useState, useEffect, useRef, useLayoutEffect } = React;
  const BASE = new URL(".", document.currentScript.src).href;
  const Q = new URLSearchParams(location.search);
  const FORCE_RM = Q.get("rm") === "1";
  const fa = v => String(v).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

  const M = {
    press: { type: "spring", stiffness: 700, damping: 38 },
    tap: { entry: 0.98, control: 0.96, row: 0.99 },
    nudge: { type: "spring", stiffness: 500, damping: 30 },
    crossfade: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
    dot: { type: "spring", stiffness: 520, damping: 38 },
    roll: { type: "spring", stiffness: 420, damping: 34 },
    disclose: { type: "spring", stiffness: 260, damping: 32 },
    chevron: { type: "spring", stiffness: 400, damping: 28 },
    dissolveIn: { duration: 0.22, ease: [0, 0, 0.2, 1] },
    dissolveOut: { duration: 0.14, ease: [0.4, 0, 1, 1] },
    drawer: { type: "spring", stiffness: 320, damping: 36 },
    sheetUp: { type: "spring", stiffness: 300, damping: 34 },
    panel: { type: "spring", stiffness: 380, damping: 30 },
    scrim: { duration: 0.2, ease: [0, 0, 0.2, 1] },
    exit: { duration: 0.18, ease: [0.4, 0, 1, 1] },
    interval: 6000
  };

  const LOGIN = "http://178.252.146.82:8082/Login";
  const PARTNER = "http://178.252.146.82:8082/Login#contractor";
  const TEL = "tel:+982171400004";
  const PHONE = "۰۲۱-۷۱۴۰۰۰۰۴";
  const LOGO = BASE + "media/payvand-logo.png";
  const PHOTO = n => BASE + "media/photos/lab-" + n + ".jpg";

  const P = {
    doc: "M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M9 13h6M9 17h4",
    go: "M15 6l-6 6 6 6",
    back: "M9 6l6 6-6 6",
    cal: "M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 3v4M16 3v4M4 10h16M8.5 14h2M13.5 14h2M8.5 17h2",
    phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
    clock: "M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zM12 7.5V12l3 2",
    pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 7.7a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6z",
    chat: "M7.9 20A9 9 0 1 0 4 16.1L2 22z",
    menu: "M4 7h16M4 12h16M4 17h16",
    x: "M18 6L6 18M6 6l12 12",
    down: "M6 9l6 6 6-6",
    check: "M20 6L9 17l-5-5",
    pause: "M9 6v12M15 6v12",
    play: "M16 12L8 6.5v11z",
    mail: "M4 6h16v12H4zM4 7l8 6 8-6",
    sms: "M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5",
    home: "M4 11l8-7 8 7M6 9.5V20h12V9.5",
    bike: "M5.5 17.5a3 3 0 1 0 0-.01M18.5 17.5a3 3 0 1 0 0-.01M5.5 17.5L9 10h5l4.5 7.5M14 10l-2-4h-3",
    flask: "M9 3h6M10 3v6L4.8 18.2A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.8L14 9V3M7.5 15h9"
  };
  const Ico = ({ d }) => html`<svg class="pv-ico" viewBox="0 0 24 24" aria-hidden="true"><path d=${d}/></svg>`;
  const Num = ({ v, ltr }) => html`<span class=${"pv-num" + (ltr ? " pv-ltr" : "")}>${fa(v)}</span>`;

  const MENU = [
    { t: "صفحه اصلی", h: "#", key: "home" },
    { t: "آزمایش‌های فعال", h: "https://test.payvandlab.com" },
    { t: "بخش‌ها", h: "#" },
    { t: "جوابدهی", h: "#", key: "results" },
    { t: "خدمات", h: "#" },
    { t: "درباره آزمایشگاه", h: "#" },
    { t: "ارتباط با ما", h: "#" },
    { t: "اخبار", h: "#" }
  ];

  const st = s => (s && s !== "rest" ? " is-" + s : "");

  function Entry({ state, sub = true }) {
    return html`<${motion.a} class=${"pv-entry" + st(state)} href=${LOGIN} whileHover="hover" whileTap=${{ scale: M.tap.entry }} transition=${M.press}>
      <span class="pv-entry-ic"><${Ico} d=${P.doc}/></span>
      <span class="pv-entry-t"><b>جواب آزمایش</b>${sub ? html`<span>دریافت اینترنتی جواب آزمایش مراجعین</span>` : null}</span>
      <${motion.span} class="pv-entry-go" variants=${{ hover: { x: -4 } }} transition=${M.nudge}><${Ico} d=${P.go}/><//>
    <//>`;
  }

  function EntryBar({ state, block }) {
    return html`<${motion.a} class=${"pv-entry--bar" + (block ? " pv-entry--block" : "") + st(state)} href=${LOGIN} whileHover="hover" whileTap=${{ scale: M.tap.control }} transition=${M.press}>
      <${Ico} d=${P.doc}/><span>جواب آزمایش</span><${motion.span} style=${{ display: "inline-flex", marginInlineStart: block ? "auto" : 0 }} variants=${{ hover: { x: -3 } }} transition=${M.nudge}><${Ico} d=${P.go}/><//>
    <//>`;
  }

  function Book({ state }) {
    return html`<${motion.a} class=${"pv-book" + st(state)} href="#booking" whileTap=${{ scale: M.tap.control }} transition=${M.press}>
      <span class="pv-book-ic"><${Ico} d=${P.cal}/></span>نوبت‌دهی آنلاین
    <//>`;
  }

  const Tel = ({ state }) => html`<a class=${"pv-tel" + st(state)} href=${TEL}><span class="pv-sr">تلفن </span><span class="pv-ltr pv-num">${PHONE}</span></a>`;

  const Call = ({ state }) => html`<a class=${"pv-call" + st(state)} href=${TEL}><span class="pv-call-ic"><${Ico} d=${P.phone}/></span><span class="pv-sr">تلفن </span><span class="pv-ltr">${PHONE}</span></a>`;

  function Facts({ tel = true, address = "short" }) {
    return html`<dl class="pv-facts">
      <div class="pv-fact"><span class="pv-fact-ic"><${Ico} d=${P.clock}/></span><div><dt>ساعات کاری</dt><dd>شنبه تا چهارشنبه <b class="pv-nw"><${Num} v="06:30" ltr/> تا <${Num} v="19:00" ltr/></b><br/>پنجشنبه <b class="pv-nw"><${Num} v="06:30" ltr/> تا <${Num} v="18:00" ltr/></b></dd></div></div>
      <div class="pv-fact"><span class="pv-fact-ic"><${Ico} d=${P.pin}/></span><div><dt>نشانی</dt><dd>${address === "short"
        ? html`<span class="pv-nw">تهران،</span> <span class="pv-nw">خیابان شریعتی،</span> <span class="pv-nw">خیابان ظفر،</span> <b class="pv-nw">پلاک ${fa(174)}</b>`
        : html`تهران، خیابان شریعتی، خیابان دستگردی (ظفر)، پلاک ${fa(174)}`}</dd></div></div>
      ${tel ? html`<div class="pv-fact pv-fact--tel"><span class="pv-fact-ic"><${Ico} d=${P.phone}/></span><div><dt>تلفن</dt><dd><${Tel}/></dd></div></div>` : null}
    </dl>`;
  }

  const SLIDES = [
    { n: 7, cap: "سالن انتظار", alt: "سالن انتظار آزمایشگاه پیوند با صندلی‌ها و تابلوهای گل قاب‌شده روی دیوار", d: "50% 31%", m: "50% 30%", z: 1.3, o: "70% 30%" },
    { n: 5, cap: "ورودی آزمایشگاه", alt: "ورودی آزمایشگاه پیوند با دیوار چوبی، نشان و نوشته آزمایشگاه و گلدان‌ها", d: "62% 28%", m: "60% 30%", z: 1.12, o: "62% 32%" },
    { n: 1, cap: "میز جوابدهی", alt: "میز جوابدهی آزمایشگاه پیوند با تابلوی جوابدهی", d: "50% 42%", m: "50% 48%", z: 1.06, o: "50% 50%" },
    { n: 2, cap: "پذیرش ۲", alt: "میز پذیرش ۲ آزمایشگاه پیوند با گلدان سانسوریا", d: "45% 50%", m: "45% 52%", z: 1.06, o: "45% 52%" },
    { n: 6, cap: "کیوسک نوبت", alt: "کیوسک نوبت آزمایشگاه پیوند با دکمه‌های پذیرش و جوابدهی و ساعت دیواری", d: "50% 44%", m: "50% 44%", z: 1.0, o: "50% 50%" },
    { n: 3, cap: "تابلوهای سالن انتظار", alt: "تابلوهای قاب‌شده گل و ظروف آزمایشگاهی در سالن انتظار", d: "50% 33%", m: "50% 30%", z: 1.14, o: "50% 30%" }
  ];

  function useWide() {
    const q = "(min-width: 1024px)";
    const [w, setW] = useState(() => matchMedia(q).matches);
    useEffect(() => { const m = matchMedia(q); const f = () => setW(m.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
    return w;
  }

  function useCarousel(count) {
    const sys = useReducedMotion();
    const reduced = Boolean(sys) || FORCE_RM;
    const start = Math.min(count - 1, Math.max(0, (parseInt(Q.get("slide"), 10) || 1) - 1));
    const [s, setS] = useState({ i: start, dir: 1 });
    const [playing, setPlaying] = useState(!reduced && Q.get("paused") !== "1");
    const [hover, setHover] = useState(false);
    const [focus, setFocus] = useState(false);
    const [hidden, setHidden] = useState(document.hidden);
    const [progress, setProgress] = useState(0);
    const t = useRef(0);
    useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);
    useEffect(() => { t.current = 0; setProgress(0); }, [s.i]);
    useEffect(() => { const v = () => setHidden(document.hidden); document.addEventListener("visibilitychange", v); return () => document.removeEventListener("visibilitychange", v); }, []);
    const held = hover || focus || hidden;
    useEffect(() => {
      if (!playing || held || reduced) return;
      let raf, last = performance.now();
      const tick = now => {
        t.current += now - last; last = now;
        if (t.current >= M.interval) { t.current = 0; setS(p => ({ i: (p.i + 1) % count, dir: 1 })); }
        setProgress(t.current / M.interval);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [playing, held, reduced, count]);
    const go = (i, dir) => setS(p => ({ i: (i + count) % count, dir: dir ?? (i > p.i ? 1 : -1) }));
    useEffect(() => { window.__pvSlider = { go: i => go(i), pause: () => setPlaying(false), play: () => setPlaying(true), hover: setHover }; });
    return {
      ...s, playing, progress, reduced, held,
      next: () => go(s.i + 1, 1), prev: () => go(s.i - 1, -1), go,
      toggle: () => setPlaying(p => !p),
      bind: {
        onPointerEnter: e => { if (e.pointerType === "mouse") setHover(true); },
        onPointerLeave: () => setHover(false),
        onFocus: () => setFocus(true),
        onBlur: e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }
      }
    };
  }

  function Slider() {
    const c = useCarousel(SLIDES.length);
    const wide = useWide();
    const s = SLIDES[c.i];
    const down = useRef(null);
    useEffect(() => { SLIDES.forEach(x => { const im = new Image(); im.src = PHOTO(x.n); }); }, []);
    const onKey = e => {
      const k = { ArrowLeft: () => c.next(), ArrowRight: () => c.prev(), Home: () => c.go(0, -1), End: () => c.go(SLIDES.length - 1, 1) }[e.key];
      if (k) { e.preventDefault(); k(); }
    };
    const onDown = e => { down.current = { x: e.clientX, y: e.clientY }; };
    const onUp = e => {
      const d = down.current; down.current = null;
      if (!d) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.2) dx > 0 ? c.next() : c.prev();
    };
    const fade = c.reduced ? { duration: 0 } : M.crossfade;
    const imgStyle = wide ? { objectPosition: s.d } : { objectPosition: s.m, scale: s.z, transformOrigin: s.o };
    return html`<section class="pv-sl" aria-roledescription="carousel" aria-label="عکس‌های آزمایشگاه پیوند" onKeyDown=${onKey} ...${c.bind}>
      <div class="pv-sl-stage" onPointerDown=${onDown} onPointerUp=${onUp} onPointerCancel=${() => { down.current = null; }}>
        <${AnimatePresence} initial=${false}>
          <${motion.img} key=${s.n} class="pv-sl-img" src=${PHOTO(s.n)} alt=${s.alt} draggable="false" style=${imgStyle}
            initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0, transition: { duration: 0, delay: fade.duration || 0 } }} transition=${fade}/>
        <//>
        <div class="pv-sl-light" aria-hidden="true"></div>
      </div>
      <p class="pv-sl-tag" aria-hidden="true"><i></i>
        <span style=${{ display: "inline-grid" }}><${AnimatePresence} initial=${false}><${motion.span} key=${s.n} style=${{ gridArea: "1 / 1" }} initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0, transition: M.dissolveOut }} transition=${M.dissolveIn}>${s.cap}<//><//></span>
      </p>
      <div class="pv-sl-plaque">
        <p class="pv-sl-cap" aria-hidden="true">
          <span class="pv-sl-cap-t"><${AnimatePresence} initial=${false}><${motion.span} key=${s.n} initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0, transition: M.dissolveOut }} transition=${M.dissolveIn}>${s.cap}<//><//></span>
        </p>
        <span class="pv-sl-dots" aria-hidden="true">${SLIDES.map((x, i) => html`<${motion.i} key=${x.n} class=${i === c.i ? "on" : ""} initial=${false} animate=${{ width: i === c.i ? 28 : 8 }} transition=${c.reduced ? { duration: 0 } : M.dot}>${i === c.i ? html`<b style=${{ transform: "scaleX(" + (c.playing && !c.reduced ? c.progress : 1) + ")" }}></b>` : null}<//>`)}</span>
        <div class="pv-sl-ctl" role="group" aria-label="کنترل عکس‌ها">
          <${motion.button} type="button" class="pv-sl-btn" onClick=${c.prev} whileTap=${{ scale: M.tap.control }} transition=${M.press}><${Ico} d=${P.back}/><span>قبلی</span><//>
          ${c.reduced ? null : html`<${motion.button} type="button" class="pv-sl-btn" aria-pressed=${c.playing ? "false" : "true"} onClick=${c.toggle} whileTap=${{ scale: M.tap.control }} transition=${M.press}><${Ico} d=${c.playing ? P.pause : P.play}/><span>${c.playing ? "توقف" : "پخش"}</span><//>`}
          <${motion.button} type="button" class="pv-sl-btn" onClick=${c.next} whileTap=${{ scale: M.tap.control }} transition=${M.press}><span>بعدی</span><${Ico} d=${P.go}/><//>
        </div>
      </div>
      <p class="pv-sr" aria-live=${c.playing && !c.held ? "off" : "polite"}>عکس ${fa(c.i + 1)} از ${fa(SLIDES.length)}: ${s.cap}</p>
    </section>`;
  }

  function Room() {
    return html`<div class="pv-room">
      <div class="pv-room-photo"><${Slider}/></div>
      <div class="pv-stack"><div class="pv-sheet">
        <h1 class="pv-title"><span class="pv-title-1">آزمایشگاه تشخیص طبی و تخصصی</span><span class="pv-title-2">پیوند</span></h1>
        <p class="pv-title-3">پاتولوژی، ژنتیک پزشکی و مولکولی</p>
        <div class="pv-sheet-acts"><${Entry}/><div class="pv-sheet-row"><${Book}/><${Call}/></div></div>
        <${Facts} tel=${false}/>
      </div></div>
    </div>`;
  }

  function useEsc(fn) {
    useEffect(() => { const k = e => { if (e.key === "Escape") fn(); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  }

  const Close = ({ onClick }) => html`<${motion.button} type="button" class="pv-close" onClick=${onClick} whileTap=${{ scale: M.tap.control }} transition=${M.press}><${Ico} d=${P.x}/>بستن<//>`;

  function Yar({ open, onClick, state, id = "pv-chat" }) {
    return html`<${motion.button} type="button" class=${"pv-yar" + st(state)} aria-expanded=${open ? "true" : "false"} aria-controls=${id} onClick=${onClick} whileTap=${{ scale: M.tap.control }} transition=${M.press}>
      <span class="pv-yar-ic"><${Ico} d=${open ? P.x : P.chat}/></span>${open ? "بستن پیوندیار" : "پیوندیار"}
    <//>`;
  }

  function ChatBody() {
    return html`<${React.Fragment}>
      <div class="pv-chat-body"><div class="pv-msg">
        <p>به آزمایشگاه پیوند خوش آمدید.</p>
        <p>سوال خود را مطرح کنید تا دستیار هوش مصنوعی آزمایشگاه پیوند (پیوندیار) پاسخگوی سوالات شما باشد.</p>
        <p>در صورت نیاز به اتصال به اپراتور، از پیوندیار بخواهید تا اتصال شما به اپراتورهای ما را برقرار کند.</p>
      </div></div>
      <form class="pv-chat-form" onSubmit=${e => e.preventDefault()}>
        <label>پیام شما<input type="text" name="m" autocomplete="off" placeholder="سوال خود را بنویسید"/></label>
        <button type="submit" class="pv-send">ارسال</button>
      </form>
    <//>`;
  }

  function Chat({ onClose, inline }) {
    if (!inline) useEsc(onClose);
    const wide = useWide();
    const head = html`<div class="pv-chat-head"><div><h2 id=${inline ? "pv-chat-h-demo" : "pv-chat-h"}>پیوندیار</h2><p>دستیار هوش مصنوعی آزمایشگاه پیوند</p></div><${Close} onClick=${onClose}/></div>`;
    if (inline) return html`<section class="pv-chat is-inline" role="dialog" aria-labelledby="pv-chat-h-demo">${head}<${ChatBody}/></section>`;
    const from = wide ? { opacity: 0, scale: 0.92 } : { y: "105%" };
    return html`<${React.Fragment}>
      <${motion.div} class="pv-scrim pv-scrim--chat" onClick=${onClose} initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0, transition: M.exit }} transition=${M.scrim}/>
      <${motion.section} class="pv-chat" id="pv-chat" role="dialog" aria-labelledby="pv-chat-h" initial=${from} animate=${wide ? { opacity: 1, scale: 1 } : { y: 0 }} exit=${{ ...from, transition: M.exit }} transition=${wide ? M.panel : M.sheetUp}>${head}<${ChatBody}/><//>
    <//>`;
  }

  function YarLive({ auto }) {
    const [open, setOpen] = useState(Boolean(auto) && Q.get("chat") === "1");
    return html`<${React.Fragment}><${Yar} open=${open} onClick=${() => setOpen(o => !o)}/><${AnimatePresence}>${open ? html`<${Chat} key="c" onClose=${() => setOpen(false)}/>` : null}<//><//>`;
  }

  function DrawerBody({ cur, onClose }) {
    return html`<${React.Fragment}>
      <div class="pv-drawer-head"><img src=${LOGO} width="217" height="63" alt="آزمایشگاه تشخیص طبی و تخصصی پیوند"/><${Close} onClick=${onClose}/></div>
      <div class="pv-drawer-body">
        <${EntryBar} block=${true}/>
        <nav aria-label="منوی اصلی"><ul>${MENU.map(m => html`<li key=${m.t}><a href=${m.h} aria-current=${m.key && m.key === cur ? "page" : null}>${m.t}<${Ico} d=${P.go}/></a></li>`)}</ul></nav>
      </div>
      <div class="pv-drawer-foot">
        <div class="pv-drawer-partners"><a href=${LOGIN}>ورود پزشکان</a><a href=${PARTNER}>ورود مراکز همکار</a></div>
        <div style=${{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}><${YarLive}/><a class="pv-util-link" href=${TEL}><${Ico} d=${P.phone}/><b class="pv-ltr pv-num">${PHONE}</b></a></div>
      </div>
    <//>`;
  }

  function Drawer({ onClose, cur, inline }) {
    if (inline) return html`<div class="pv-drawer is-inline" role="dialog" aria-label="منو"><${DrawerBody} cur=${cur} onClose=${onClose}/></div>`;
    useEsc(onClose);
    useEffect(() => { const b = document.querySelector(".pv-drawer .pv-close"); b && b.focus({ preventScroll: true }); }, []);
    return html`<${React.Fragment}>
      <${motion.div} class="pv-scrim" onClick=${onClose} initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0, transition: M.exit }} transition=${M.scrim}/>
      <${motion.div} class="pv-drawer" id="pv-drawer" role="dialog" aria-modal="true" aria-label="منو" initial=${{ x: "100%" }} animate=${{ x: 0 }} exit=${{ x: "100%", transition: M.exit }} transition=${M.drawer}><${DrawerBody} cur=${cur} onClose=${onClose}/><//>
    <//>`;
  }

  function Head({ home, cur = "home", state }) {
    const [open, setOpen] = useState(Boolean(home) && Q.get("menu") === "1");
    return html`<header class=${"pv-head" + (home ? " is-home" : "")}>
      <div class="pv-util"><div class="pv-wrap">
        <div class="pv-util-side"><a class="pv-util-link" href=${LOGIN}>ورود پزشکان</a><a class="pv-util-link" href=${PARTNER}>ورود مراکز همکار</a></div>
        <div class="pv-util-side"><a class="pv-util-link pv-util-tel" href=${TEL}><${Ico} d=${P.phone}/><span class="pv-sr">تلفن</span><b class="pv-ltr pv-num">${PHONE}</b></a><${YarLive} auto=${home}/></div>
      </div></div>
      <div class="pv-bar">
        <a class="pv-logo" href="#"><img src=${LOGO} width="217" height="63" alt="آزمایشگاه تشخیص طبی و تخصصی پیوند"/></a>
        <nav class="pv-nav" aria-label="منوی اصلی"><ul>${MENU.map(m => html`<li key=${m.t}><a href=${m.h} class=${state === "hover" && m.key === "results" ? "is-hover" : ""} aria-current=${m.key && m.key === cur ? "page" : null}>${m.t}</a></li>`)}</ul></nav>
        <div class="pv-bar-end">
          <${EntryBar}/>
          <${motion.button} type="button" class="pv-menu-btn" aria-expanded=${open ? "true" : "false"} aria-controls="pv-drawer" onClick=${() => setOpen(true)} whileTap=${{ scale: M.tap.control }} transition=${M.press}><${Ico} d=${P.menu}/>منو<//>
        </div>
      </div>
      <${AnimatePresence}>${open ? html`<${Drawer} key="d" cur=${cur} onClose=${() => setOpen(false)}/>` : null}<//>
    </header>`;
  }

  function PageHead() {
    return html`<div class="pv-phead">
      <div class="pv-phead-photo"><img src=${PHOTO(1)} alt="میز جوابدهی آزمایشگاه پیوند" style=${{ objectPosition: "50% 44%" }}/></div>
      <div class="pv-stack"><div class="pv-sheet">
        <nav class="pv-crumbs" aria-label="مسیر صفحه"><a href="#">صفحه اصلی</a><${Ico} d=${P.go}/><a href="#">جوابدهی</a><${Ico} d=${P.go}/><span aria-current="page">راهنما</span></nav>
        <h1>راهنمای جوابدهی اینترنتی</h1>
        <p class="pv-phead-lead">نام کاربری و رمز عبور هر دو روی قبض آزمایشگاه و در پیامک پذیرش آمده است.</p>
        <${EntryBar} block=${true}/>
      </div></div>
    </div>`;
  }

  function Block({ reverse }) {
    return html`<div class="pv-block">
      <div class="pv-block-text">
        <h2 class="pv-h2">پذیرش حضوری و غیرحضوری</h2>
        <p>پذیرش هم در خود آزمایشگاه انجام می‌شود و هم غیرحضوری: تصویر نسخه را با قالب <span class="pv-ltr">jpg</span> در فرم پذیرش اینترنتی بفرستید، برای نمونه‌گیری در آزمایشگاه یا در منزل.</p>
        <p>ساعت پذیرش: شنبه تا چهارشنبه <b class="pv-nw"><${Num} v="06:30" ltr/> تا <${Num} v="18:00" ltr/></b>، پنجشنبه <b class="pv-nw"><${Num} v="06:30" ltr/> تا <${Num} v="17:00" ltr/></b>.</p>
        <a class="pv-link" href="#">راهنمای پذیرش<${Ico} d=${P.go}/></a>
      </div>
      <figure class="pv-figure">
        <div class="pv-figure-img"><img src=${PHOTO(2)} alt="میز پذیرش ۲ آزمایشگاه پیوند" style=${{ objectPosition: "45% 50%" }} loading="lazy"/></div>
        <figcaption><i></i>پذیرش ${fa(2)}، آزمایشگاه پیوند</figcaption>
      </figure>
    </div>`;
  }

  const STEPS = [
    ["دکمه «جواب آزمایش» را بزنید."],
    ["زبانه «مراجعین آزمایشگاه» را بزنید."],
    ["نام کاربری و رمز عبور را بنویسید.", "شماره پذیرش یا کد ملی، و شماره اشتراک یا شماره موبایل"],
    ["چند پذیرش دارید؟ آخرین را انتخاب کنید."],
    ["تا " + fa(1) + " دقیقه منتظر فایل PDF بمانید."]
  ];
  function Steps() {
    return html`<ol class="pv-steps">
      ${STEPS.map((s, i) => html`<li class="pv-step" key=${i}><span class="pv-step-n" aria-hidden="true">${fa(i + 1)}</span><p class="pv-step-t"><span class="pv-sr">گام ${fa(i + 1)}: </span>${s[0]}${s[1] ? html`<small>${s[1]}</small>` : null}</p></li>`)}
      <li class="pv-step pv-step--end"><span class="pv-step-n" aria-hidden="true"><${Ico} d=${P.check}/></span><p class="pv-step-t"><b>فایل PDF جواب نهایی و تاییدشده است</b><small>مهر و امضای دیجیتال مسئول فنی آزمایشگاه روی آن ثبت شده است.</small></p></li>
    </ol>`;
  }

  const FAQ = [
    { id: "vpn", q: "فیلترشکن (VPN) روشن است؟", a: html`<p>فیلترشکن را خاموش کنید و دوباره وارد شوید؛ سامانه جوابدهی با فیلترشکن باز نمی‌شود.</p>` },
    { id: "err", q: "پیام «خطای غیرمنتظره» می‌بینم", a: html`<p>یک بار «خروج» را بزنید و دوباره با نام کاربری و شماره اشتراک یا موبایل وارد شوید. <b>هرگز با دکمه بازگشت مرورگر بیرون نروید.</b></p>` },
    { id: "browser", q: "با کدام مرورگر وارد شوم؟", a: html`<p>آزمایشگاه مرورگر گوگل کروم یا فایرفاکس را پیشنهاد می‌کند.</p>` }
  ];
  function FaqRow({ item, open, onToggle, onKey, bind, reduced }) {
    const ref = useRef(null);
    const [h, setH] = useState(0);
    const [ready, setReady] = useState(false);
    useLayoutEffect(() => {
      const el = ref.current; if (!el) return;
      const read = () => { const n = el.getBoundingClientRect().height; setH(p => Math.abs(p - n) < 0.5 ? p : n); };
      read(); setReady(true);
      const o = new ResizeObserver(read); o.observe(el);
      return () => o.disconnect();
    }, []);
    useEffect(() => { if (ref.current) ref.current.inert = !open; }, [open]);
    const off = { duration: 0 };
    const hid = "pv-q-" + item.id, pid = "pv-a-" + item.id;
    return html`<div class=${"pv-faq-item" + (open ? " is-open" : "")}>
      <h3 class="pv-faq-q"><${motion.button} type="button" id=${hid} ref=${bind} aria-expanded=${open ? "true" : "false"} aria-controls=${pid} onClick=${onToggle} onKeyDown=${onKey} whileTap=${{ scale: M.tap.row }} transition=${M.press}>
        <span>${item.q}</span>
        <${motion.span} class="pv-faq-chev" aria-hidden="true" initial=${false} animate=${{ rotate: open ? 180 : 0 }} transition=${reduced ? off : M.chevron}><${Ico} d=${P.down}/><//>
      <//></h3>
      <${motion.div} initial=${false} animate=${ready ? { height: open ? h : 0 } : {}} transition=${reduced ? off : M.disclose} style=${{ overflow: "hidden", height: ready ? undefined : (open ? "auto" : 0) }}>
        <div ref=${ref} id=${pid} role="region" aria-labelledby=${hid} class="pv-faq-a">
          <${motion.div} initial=${false} animate=${{ opacity: open ? 1 : 0 }} transition=${reduced ? off : (open ? M.dissolveIn : M.dissolveOut)}>${item.a}<//>
        </div>
      <//>
    </div>`;
  }
  function Faq({ open: start = null }) {
    const reduced = Boolean(useReducedMotion()) || FORCE_RM;
    const [open, setOpen] = useState(start);
    const heads = useRef({});
    const ids = FAQ.map(i => i.id);
    const key = (id, e) => {
      const at = ids.indexOf(id);
      const go = { ArrowDown: (at + 1) % ids.length, ArrowUp: (at - 1 + ids.length) % ids.length, Home: 0, End: ids.length - 1 }[e.key];
      if (go === undefined) return;
      e.preventDefault(); const b = heads.current[ids[go]]; b && b.focus();
    };
    return html`<div class="pv-faq">${FAQ.map(it => html`<${FaqRow} key=${it.id} item=${it} open=${open === it.id} reduced=${reduced} onToggle=${() => setOpen(o => o === it.id ? null : it.id)} onKey=${e => key(it.id, e)} bind=${n => { heads.current[it.id] = n; }}/>`)}</div>`;
  }

  const HOURS = [
    { t: "ساعات کاری", rows: [["شنبه تا چهارشنبه", "06:30", "19:00"], ["پنجشنبه", "06:30", "18:00"]] },
    { t: "پذیرش", rows: [["شنبه تا چهارشنبه", "06:30", "18:00"], ["پنجشنبه", "06:30", "17:00"]] },
    { t: "تحویل حضوری جواب", rows: [["شنبه تا چهارشنبه", "15:00", "18:30"], ["پنجشنبه", "16:00", "18:00"]] }
  ];
  function todayRow() { const d = new Date().getDay(); return d === 6 || d <= 3 ? 0 : d === 4 ? 1 : -1; }
  function Hours({ groups = [0, 1, 2], today }) {
    const tr = today === undefined ? todayRow() : today;
    return html`<div class="pv-hours-card">${groups.map(g => html`<div class="pv-hours-group" key=${g}><table class="pv-hours">
      <caption>${HOURS[g].t}</caption>
      <tbody>${HOURS[g].rows.map((r, i) => html`<tr key=${i} class=${i === tr ? "is-today" : ""}><th scope="row">${r[0]}${i === tr ? html`<span class="pv-today">امروز</span>` : null}</th><td><${Num} v=${r[1]} ltr/> تا <${Num} v=${r[2]} ltr/></td></tr>`)}</tbody>
    </table></div>`)}</div>`;
  }

  function Sms() {
    return html`<figure class="pv-sms">
      <figcaption><${Ico} d=${P.sms}/>نمونه پیامک پذیرش</figcaption>
      <div class="pv-sms-msg">
        <p>خانم/ آقای <span class="pv-blank" aria-label="نام شما"></span> به آزمایشگاه پیوند خوش آمدید!</p>
        <p>شماره پذیرش شما : <span class="pv-blank" aria-label="شماره پذیرش"></span><span class="pv-tag">نام کاربری</span></p>
        <p>شماره اشتراک شما : <span class="pv-blank" aria-label="شماره اشتراک"></span><span class="pv-tag">رمز عبور</span></p>
      </div>
    </figure>`;
  }

  const ROWS = [
    { ic: P.doc, t: "راهنمای جوابدهی اینترنتی", s: "نام کاربری و رمز عبور در پیامک پذیرش آمده است", h: "#", cool: true },
    { ic: P.home, t: "نمونه‌گیری در منزل", s: "درخواست دست‌کم " + fa(24) + " ساعت پیش از نمونه‌گیری", h: "#" },
    { ic: P.flask, t: "آزمایش‌های فعال", s: "جست‌وجو با نام آزمایش", h: "https://test.payvandlab.com" },
    { ic: P.bike, t: "ارسال جواب با پیک آزمایشگاه", s: "درخواست هنگام پذیرش" }
  ];
  function List({ states = [] }) {
    return html`<div class="pv-list">${ROWS.map((r, i) => {
      const inner = html`<span class=${"pv-row-ic" + (r.cool ? " pv-row-ic--cool" : "")}><${Ico} d=${r.ic}/></span><span class="pv-row-t"><b>${r.t}</b><span>${r.s}</span></span>${r.h ? html`<span class="pv-row-go"><${Ico} d=${P.go}/></span>` : html`<span></span>`}`;
      return r.h
        ? html`<${motion.a} key=${i} class=${"pv-row" + st(states[i])} href=${r.h} whileTap=${{ scale: M.tap.row }} transition=${M.press}>${inner}<//>`
        : html`<div key=${i} class="pv-row">${inner}</div>`;
    })}</div>`;
  }

  function Foot() {
    return html`<footer class="pv-foot">
      <div class="pv-foot-band"><img src=${PHOTO(3)} alt="" loading="lazy"/></div>
      <div class="pv-wrap pv-foot-main">
        <div class="pv-foot-name">
          <img src=${LOGO} width="217" height="63" alt="آزمایشگاه تشخیص طبی و تخصصی پیوند"/>
          <address>تهران- خیابان شریعتی – خیابان دستگردی (ظفر)- نرسیده به خیابان دکتر مصدق (نفت سابق) پلاک ${fa(174)}، کدپستی <span class="pv-num">${fa(1919753557)}</span></address>
        </div>
        <div>
          <h2>تماس</h2>
          <div class="pv-foot-contact">
            <a href=${TEL}><${Ico} d=${P.phone}/><span class="pv-sr">تلفن</span><span class="pv-ltr pv-num">${PHONE}</span></a>
            <a href="mailto:info@payvandlab.com"><${Ico} d=${P.mail}/><span class="pv-ltr">info@payvandlab.com</span></a>
            <${YarLive}/>
          </div>
        </div>
        <div>
          <h2>ساعات کاری</h2>
          <div class="pv-foot-hours"><span>شنبه تا چهارشنبه</span><b class="pv-nw"><${Num} v="06:30" ltr/> تا <${Num} v="19:00" ltr/></b><span>پنجشنبه</span><b class="pv-nw"><${Num} v="06:30" ltr/> تا <${Num} v="18:00" ltr/></b></div>
        </div>
        <div>
          <h2>تاییدیه‌های آزمایشگاه</h2>
          <ul class="pv-foot-list">
            <li><span>دارنده گواهینامه <span class="pv-ltr">ISO ${fa(15189)}</span> از NACI</span></li>
            <li><span>دارنده لوح کیفیت از آزمایشگاه مرجع سلامت</span></li>
            <li><span>گواهینامه بین‌المللی <span class="pv-ltr">ISO ${fa("10002:2014")}</span></span></li>
            <li><span>گواهینامه بین‌المللی <span class="pv-ltr">ISO ${fa("9001:2015")}</span></span></li>
            <li><span>عضو شبکه مراکز تشخیص ملکولی IFCC</span></li>
          </ul>
        </div>
      </div>
      <nav class="pv-foot-nav" aria-label="پیوندهای پایین صفحه"><div class="pv-wrap"><ul>${MENU.map(m => html`<li key=${m.t}><a href=${m.h}>${m.t}</a></li>`)}</ul></div></nav>
    </footer>`;
  }

  const PV = { M, fa, Ico, P, Entry, EntryBar, Book, Tel, Call, Facts, Slider, Room, Head, Drawer, Yar, YarLive, Chat, PageHead, Block, Steps, Faq, Hours, Sms, List, Foot, SLIDES, PHOTO };
  window.PV = PV;

  function mountAll() {
    document.querySelectorAll("[data-pv]").forEach(el => {
      const C = PV[el.dataset.pv];
      if (!C) return;
      const props = el.dataset.p ? JSON.parse(el.dataset.p) : {};
      if (props.onClose === "noop" || props.onClick === "noop") { props.onClose = () => {}; props.onClick = () => {}; }
      createRoot(el).render(html`<${MotionConfig} reducedMotion=${FORCE_RM ? "always" : "user"}><${C} ...${props}/><//>`);
    });
    window.MotionIsMounted = true;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAll); else mountAll();
})();
