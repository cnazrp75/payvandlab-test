(() => {
  const { React, createRoot, motion, AnimatePresence, MotionConfig, useReducedMotion, html } = window.Vendor;
  const { useState, useEffect, useRef, useLayoutEffect } = React;
  const params = new URLSearchParams(location.search);
  const faDigits = "۰۱۲۳۴۵۶۷۸۹";
  let FOCUS = [];
  const pos = (s, i) => FOCUS[i] || `${s.fx} ${s.fy}`;

  const SLIDES = [
    { src: "media/photos/lab-7.jpg", caption: "سالن انتظار", alt: "سالن انتظار آزمایشگاه پیوند با صندلی‌های خاکستری و تابلوهای قاب‌شده", fy: "40%", fx: "50%" },
    { src: "media/photos/lab-5.jpg", caption: "ورودی آزمایشگاه", alt: "ورودی آزمایشگاه پیوند با دیوار چوبی، نشان و نوشته آزمایشگاه و گلدان‌ها", fy: "38%", fx: "62%" },
    { src: "media/photos/lab-1-crop.jpg", caption: "میز جوابدهی", alt: "میز جوابدهی آزمایشگاه پیوند با تابلوی جوابدهی", fy: "55%", fx: "50%" },
    { src: "media/photos/lab-2.jpg", caption: "پذیرش ۲", alt: "میز پذیرش ۲ آزمایشگاه پیوند با گلدان سانسوریا", fy: "52%", fx: "45%" },
    { src: "media/photos/lab-6.jpg", caption: "کیوسک نوبت", alt: "کیوسک نوبت آزمایشگاه پیوند با دکمه‌های پذیرش و جوابدهی و ساعت دیواری", fy: "50%", fx: "50%" },
    { src: "media/photos/lab-3.jpg", caption: "تابلوهای سالن انتظار", alt: "تابلوهای قاب‌شده گل و ظروف آزمایشگاهی در سالن انتظار", fy: "40%", fx: "50%" }
  ];

  const Icon = {
    prev: html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>`,
    next: html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>`,
    pause: html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12" /></svg>`,
    play: html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 12L8 6.5v11z" /></svg>`
  };

  function Roll({ value, dir, fmt }) {
    return html`<span class="sl-roll">
      <${AnimatePresence} initial=${false} mode="popLayout" custom=${dir}>
        <${motion.span}
          key=${value}
          custom=${dir}
          variants=${{ enter: d => ({ y: d >= 0 ? "70%" : "-70%", opacity: 0 }), center: { y: "0%", opacity: 1 }, exit: d => ({ y: d >= 0 ? "-70%" : "70%", opacity: 0 }) }}
          initial="enter" animate="center" exit="exit"
          transition=${{ type: "spring", stiffness: 420, damping: 34 }}
        >${fmt(value)}<//>
      <//>
    </span>`;
  }

  function useCarousel(count, interval) {
    const systemReduced = useReducedMotion();
    const reduced = systemReduced || params.get("rm") === "1";
    const start = Math.min(count - 1, Math.max(0, (parseInt(params.get("slide"), 10) || 1) - 1));
    const [state, setState] = useState({ index: start, dir: 1 });
    const [playing, setPlaying] = useState(!reduced && params.get("paused") !== "1");
    const [hover, setHover] = useState(false);
    const [focus, setFocus] = useState(false);
    const [hidden, setHidden] = useState(document.hidden);
    const [progress, setProgress] = useState(0);
    const elapsed = useRef(0);
    useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);
    useEffect(() => { elapsed.current = 0; setProgress(0); }, [state.index]);
    useEffect(() => {
      const v = () => setHidden(document.hidden);
      document.addEventListener("visibilitychange", v);
      return () => document.removeEventListener("visibilitychange", v);
    }, []);
    const held = hover || focus || hidden;
    useEffect(() => {
      if (!playing || held) return;
      let raf, last = performance.now();
      const tick = t => {
        elapsed.current += t - last; last = t;
        if (elapsed.current >= interval) { elapsed.current = 0; setState(s => ({ index: (s.index + 1) % count, dir: 1 })); }
        setProgress(elapsed.current / interval);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [playing, held, count, interval]);
    const go = (i, dir) => setState(s => ({ index: (i + count) % count, dir: dir ?? (i > s.index ? 1 : -1) }));
    useEffect(() => {
      window.__slider = { go: i => go(i), play: () => setPlaying(true), pause: () => setPlaying(false) };
    });
    return {
      ...state, playing, progress, reduced, held,
      next: () => go(state.index + 1, 1),
      prev: () => go(state.index - 1, -1),
      go,
      toggle: () => setPlaying(p => !p),
      bind: {
        onPointerEnter: () => setHover(true),
        onPointerLeave: () => setHover(false),
        onFocus: () => setFocus(true),
        onBlur: e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }
      }
    };
  }

  function Controls({ c, fmt, total }) {
    const s = SLIDES[c.index];
    return html`<div class=${"sl-bar" + (c.playing ? " is-playing" : "")}>
      <p class="sl-caption">
        <span class="sl-caption-text">
          <${AnimatePresence} initial=${false}>
            <${motion.span} key=${c.index} initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0 }} transition=${{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}>${fmt(s.caption)}<//>
          <//>
        </span>
        <span class="sl-count"><${Roll} value=${c.index + 1} dir=${c.dir} fmt=${fmt} /><span class="sl-of">از</span><span>${fmt(total)}</span></span>
        <span class="sl-dots" aria-hidden="true">${SLIDES.map((_, i) => html`<${motion.i}
            key=${i}
            class=${i === c.index ? "on" : ""}
            initial=${false}
            animate=${{ width: i === c.index ? 26 : 7 }}
            transition=${{ type: "spring", stiffness: 520, damping: 38 }}
          >${i === c.index ? html`<b style=${{ transform: `scaleX(${c.playing ? c.progress : 1})` }}></b>` : null}<//>`)}</span>
      </p>
      <div class="sl-controls" role="group" aria-label="کنترل نمایش عکس‌ها">
        <button type="button" class="sl-btn" onClick=${c.prev}>${Icon.prev}<span>قبلی</span></button>
        <button type="button" class="sl-btn sl-toggle" aria-pressed=${!c.playing} onClick=${c.toggle}>
          ${c.playing ? Icon.pause : Icon.play}<span>${c.playing ? "توقف" : "پخش"}</span>
        </button>
        <button type="button" class="sl-btn" onClick=${c.next}><span>بعدی</span>${Icon.next}</button>
      </div>
      <p class="sl-live" aria-live=${c.playing && !c.held ? "off" : "polite"}>عکس ${fmt(c.index + 1)} از ${fmt(total)}: ${fmt(s.caption)}</p>
    </div>`;
  }

  function FadeStage({ c }) {
    const s = SLIDES[c.index];
    return html`<div class="sl-stage">
      <${AnimatePresence} initial=${false}>
        <${motion.img}
          key=${c.index}
          class="sl-img"
          src=${s.src}
          alt=${s.alt}
          style=${{ objectPosition: pos(s, c.index) }}
          initial=${{ opacity: 0 }}
          animate=${{ opacity: 1 }}
          exit=${{ opacity: 1, transition: { duration: c.reduced ? 0 : 0.9 } }}
          transition=${{ duration: c.reduced ? 0 : 0.9, ease: [0.4, 0, 0.2, 1] }}
        />
      <//>
      <div class="sl-shade" aria-hidden="true"></div>
    </div>`;
  }

  function WallStage({ c }) {
    const wall = useRef(null);
    const [m, setM] = useState({ cw: 0, fw: 0, gap: 0, anchor: "center" });
    useLayoutEffect(() => {
      const el = wall.current;
      const read = () => {
        const f = el.querySelector(".sl-frame");
        const cs = getComputedStyle(el);
        setM({ cw: el.clientWidth, fw: f ? f.offsetWidth : 0, gap: parseFloat(cs.getPropertyValue("--wall-gap")) || 24, anchor: cs.getPropertyValue("--wall-anchor").trim() || "center", inset: parseFloat(cs.getPropertyValue("--wall-inset")) || 0 });
      };
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);
    const base = m.anchor === "start" ? -m.inset : -(m.cw - m.fw) / 2;
    const x = base + c.index * (m.fw + m.gap);
    const spring = c.reduced ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 21, mass: 1 };
    return html`<div class="sl-wall" ref=${wall}>
      <div class="sl-rail" aria-hidden="true"></div>
      <${motion.div} class="sl-strip" initial=${false} animate=${{ x }} transition=${spring}>
        ${SLIDES.map((s, i) => html`<${motion.figure}
            key=${s.src}
            class=${"sl-frame" + (i === c.index ? " is-current" : "")}
            aria-hidden=${i !== c.index}
            initial=${false}
            animate=${{ scale: i === c.index ? 1 : 0.8, opacity: Math.abs(i - c.index) > 3 ? 0 : 1 }}
            transition=${spring}
            onClick=${() => i !== c.index && c.go(i)}
          >
            <svg class="sl-wire" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="M8 30L50 2L92 30" /></svg>
            <div class="sl-mat"><img src=${s.src} alt=${i === c.index ? s.alt : ""} style=${{ objectPosition: pos(s, i) }} loading=${i < 3 ? "eager" : "lazy"} /></div>
          <//>`)}
      <//>
    </div>`;
  }

  function Slider({ variant, digits, interval }) {
    const c = useCarousel(SLIDES.length, interval);
    const fmt = n => digits === "latin" ? String(n).replace(/[۰-۹]/g, d => faDigits.indexOf(d)) : String(n).replace(/\d/g, d => faDigits[d]);
    useEffect(() => { SLIDES.forEach(s => { const i = new Image(); i.src = s.src; }); }, []);
    return html`<${MotionConfig} reducedMotion=${c.reduced ? "always" : "never"}>
      <section class=${"sl sl--" + variant} aria-roledescription="carousel" aria-label="عکس‌های آزمایشگاه پیوند" ...${c.bind}>
        ${variant === "wall" ? html`<${WallStage} c=${c} />` : html`<${FadeStage} c=${c} />`}
        <${Controls} c=${c} fmt=${fmt} total=${SLIDES.length} />
      </section>
    <//>`;
  }

  window.PayvandSlider = {
    mount(el, opts) {
      FOCUS = opts.focus || [];
      if (opts.photoDir) SLIDES.forEach(s => { s.src = s.src.replace("media/photos/", opts.photoDir); });
      createRoot(el).render(html`<${Slider} variant=${opts.variant || "fade"} digits=${opts.digits || "fa"} interval=${opts.interval || 6000} />`);
      window.MotionIsMounted = true;
    }
  };
})();
