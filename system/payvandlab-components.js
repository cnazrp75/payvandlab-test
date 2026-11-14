(function () {
  const { React, motion, html, useReducedMotion } = window.Vendor;
  const { useEffect, useLayoutEffect, useRef, useState } = React;
  const fa = v => String(v).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const M = window.PvMotion;
  const LOGO = new URL("../home/media/payvand-logo.png", document.currentScript.src).href;

  const LOGIN = "http://178.252.146.82:8082/Login";
  const PARTNER = "http://178.252.146.82:8082/Login#contractor";
  const TEL = "tel:+982171400004";
  const PHONE = "۰۲۱-۷۱۴۰۰۰۰۴";

  const P = {
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
    chat: "M7.9 20A9 9 0 1 0 4 16.1L2 22z",
    arrow: "M19 12H5M12 19l-7-7 7-7",
    chev: "M15 18l-6-6 6-6",
    x: "M18 6L6 18M6 6l12 12",
    down: "M6 9l6 6 6-6",
    check: "M20 6L9 17l-5-5",
    book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
  };
  const Ico = ({ d }) => html`<svg class="pv-ico" viewBox="0 0 24 24" aria-hidden="true"><path d=${d}/></svg>`;

  const MENU = [
    { t: "صفحه اصلی", h: "#", cur: true },
    { t: "جواب آزمایش", h: LOGIN, results: true },
    { t: "آزمایش‌های فعال", h: "https://test.payvandlab.com" },
    { t: "بخش‌ها", h: "/departments" },
    { t: "خدمات", h: "/services" },
    { t: "درباره آزمایشگاه", h: "/about" },
    { t: "ارتباط با ما", h: "/contact" },
    { t: "اخبار", h: "/news" }
  ];

  function todayRow() {
    const d = new Date().getDay();
    if (d === 6 || d <= 3) return 0;
    if (d === 4) return 1;
    return -1;
  }

  const Tel = ({ label }) => html`<a class="pv-tel" href=${TEL}><${Ico} d=${P.phone}/>${label ? html`<small>تلفن</small>` : null}<span class="pv-lat">${PHONE}</span></a>`;

  function Yar({ open, onClick, id }) {
    return html`<${motion.button} type="button" class="pv-yar" id=${id} aria-expanded=${open ? "true" : "false"} aria-controls="pv-chat" onClick=${onClick} whileTap=${{ scale: M.tap.control }} transition=${M.press}>
      <${Ico} d=${open ? P.x : P.chat}/>${open ? "بستن پیوندیار" : "پیوندیار"}
    <//>`;
  }

  function Util({ chatOpen, onChat }) {
    return html`<div class="pv-util"><div class="pv-wrap">
      <${Tel} label=${true}/>
      <${Yar} id="pv-yar" open=${chatOpen} onClick=${onChat}/>
    </div></div>`;
  }

  const isCur = (m, cur) => cur === undefined ? m.cur : m.t === cur;

  function Head({ onMenu, cur }) {
    return html`<header class="pv-head"><div class="pv-wrap">
      <a class="pv-logo" href="#" aria-label="آزمایشگاه پیوند، صفحه اصلی"><img src=${LOGO} width="217" height="63" alt="آزمایشگاه تشخیص طبی و تخصصی پیوند"/></a>
      <nav class="pv-nav" aria-label="منوی اصلی"><ul>
        ${MENU.map(m => html`<li key=${m.t}><a href=${m.h} class=${m.results ? "pv-nav-results" : ""} aria-current=${isCur(m, cur) ? "page" : null}>${m.t}${m.results ? html`<${Ico} d=${P.arrow}/>` : null}</a></li>`)}
      </ul></nav>
      <${motion.button} type="button" class="pv-menubtn" id="pv-menubtn" aria-haspopup="dialog" onClick=${onMenu} whileTap=${{ scale: M.tap.control }} transition=${M.press}>
        <span class="pv-burger" aria-hidden="true"><i></i><i></i><i></i></span>منو
      <//>
    </div></header>`;
  }

  function Entry({ compact, id }) {
    return html`<${motion.a} class=${"pv-entry" + (compact ? " is-compact" : "")} id=${id || null} href=${LOGIN} whileTap=${{ scale: M.tap.entry }} whileHover="hover" initial="rest" animate="rest" transition=${M.press}>
      <span class="pv-entry-text">
        <span class="pv-entry-title">جواب آزمایش</span>
        <span class="pv-entry-sub">ورود به سامانه جوابدهی آنلاین</span>
      </span>
      <${motion.span} class="pv-entry-go" variants=${{ rest: { x: 0 }, hover: { x: M.nudge } }} transition=${M.press}><${Ico} d=${P.arrow}/><//>
    <//>`;
  }

  function Results({ h1, title, help = true }) {
    return html`<section class="pv-results" aria-labelledby=${h1 ? "pv-h1" : null} aria-label=${h1 ? null : "جواب آزمایش"}><div class="pv-wrap">
      ${h1 ? html`<h1 class=${title ? "pv-results-title" : "pv-sr"} id="pv-h1">${title || "جواب آزمایش، آزمایشگاه پیوند"}</h1>` : null}
      <div class="pv-results-grid">
        <${Entry} id=${h1 ? "pv-entry" : null}/>
        <div class="pv-stub">
          <div class="pv-stub-top"><dl>
            <dt>نام کاربری</dt><dd>شماره پذیرش یا کد ملی</dd>
            <dt>رمز عبور</dt><dd>شماره اشتراک یا شماره موبایل</dd>
          </dl></div>
          <div class="pv-stub-bot"><p>هر دو روی قبض آزمایشگاه و در پیامک پذیرش آمده است.</p></div>
        </div>
        ${help ? html`<div class="pv-help">
          <span>وارد نمی‌شوید؟</span>
          <a class="pv-link" href="/results-help"><${Ico} d=${P.book}/>راهنمای جوابدهی اینترنتی</a>
        </div>` : null}
        <div class="pv-roles">
          <span class="pv-roles-label">پزشک یا مرکز همکار هستید؟</span>
          <a class="pv-role" href=${LOGIN}>ورود پزشکان<${Ico} d=${P.chev}/></a>
          <a class="pv-role" href=${PARTNER}>ورود مراکز همکار<${Ico} d=${P.chev}/></a>
        </div>
      </div>
    </div></section>`;
  }

  const Row = ({ href, title, text, action }) => href ? html`<${motion.a} href=${href} whileTap=${{ scale: M.tap.row }} transition=${M.press}>
    <span class="pv-row-text"><h3>${title}</h3><p>${text}</p></span>
    <span class="pv-row-go"><${Ico} d=${P.chev}/></span>
  <//>` : html`<div class="pv-row-static">
    <span class="pv-row-text"><h3>${title}</h3><p>${text}</p></span>
    ${action || null}
  </div>`;

  const JOBS = [
    { href: "/visit-guide", title: "راهنمای مراجعه و پذیرش غیرحضوری", text: "نسخه را با فرمت jpg بفرستید تا کارشناسان پذیرش با شما تماس بگیرند." },
    { href: "/home-sampling", title: "درخواست نمونه‌گیری در منزل", text: "۲۴ ساعت زودتر درخواست دهید. برای بالای ۱۵ سال؛ نمونه‌گیری در منزل رایگان است و فقط هزینه آزمایش‌ها گرفته می‌شود." },
    { href: "/insurers", title: "بیمه‌های طرف قرارداد", text: "۳۰ بیمه و سازمان، از جمله سازمان تامین اجتماعی، سازمان بیمه خدمات درمانی و بیمه نیروهای مسلح." }
  ];
  const List = ({ rows }) => html`<div class="pv-list">${(rows || JOBS).map(r => html`<${Row} key=${r.href || r.title} ...${r}/>`)}</div>`;

  const WORK = [["شنبه تا چهارشنبه", "۰۶:۳۰ تا ۱۹:۰۰"], ["پنجشنبه", "۰۶:۳۰ تا ۱۸:۰۰"]];
  const PICKUP = [["شنبه تا چهارشنبه", "۱۵:۰۰ تا ۱۸:۳۰"], ["پنجشنبه", "۱۶:۰۰ تا ۱۸:۰۰"]];

  function Hours({ today, id, title, rows, plain }) {
    const t = today === undefined ? todayRow() : today;
    rows = rows || WORK;
    return html`<div class="pv-card pv-hours" id=${id || null}>
      <h3>${title || "ساعت کار، نشانی و تلفن"}</h3>
      <table><tbody>
        ${rows.map((r, i) => html`<tr key=${i} class=${i === t ? "is-today" : ""}><th scope="row">${r[0]}${i === t ? html`<span class="pv-today">امروز</span>` : null}</th><td>${r[1]}</td></tr>`)}
      </tbody></table>
      <p class="pv-hours-note">روزهای تعطیل رسمی، آزمایشگاه تعطیل است.</p>
      ${plain ? null : html`<address>تهران، خیابان شریعتی، خیابان دستگردی (ظفر)، نرسیده به خیابان دکتر مصدق، پلاک ۱۷۴</address>
      <div class="pv-card-actions">
        <${Tel}/>
        <a class="pv-link" href="/contact">نشانی و راه‌های ارتباط<${Ico} d=${P.chev}/></a>
      </div>`}
    </div>`;
  }

  function Steps({ items, end, label }) {
    return html`<div class="pv-steps">
      <ol aria-label=${label || null}>${items.map((s, i) => html`<li key=${i}><span class="pv-step-n" aria-hidden="true">${fa(i + 1)}</span><span class="pv-step-t">${s}</span></li>`)}</ol>
      ${end ? html`<div class="pv-steps-end"><span class="pv-step-n"><${Ico} d=${P.check}/></span><span class="pv-step-t"><b>${end.title}</b>${end.text ? html`<small>${end.text}</small>` : null}</span></div>` : null}
    </div>`;
  }

  function FaqRow({ item, open, reduced, onToggle, onKey, bind }) {
    const ref = useRef(null);
    const [h, setH] = useState(0);
    const [ready, setReady] = useState(false);
    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      const read = () => { const n = el.getBoundingClientRect().height; setH(p => Math.abs(p - n) < 0.5 ? p : n); };
      read();
      setReady(true);
      const o = new ResizeObserver(read);
      o.observe(el);
      return () => o.disconnect();
    }, []);
    useEffect(() => { if (ref.current) ref.current.inert = !open; }, [open]);
    const hid = "pv-faq-h-" + item.id, pid = "pv-faq-p-" + item.id;
    const off = { duration: 0 };
    return html`<div class=${"pv-faq-item" + (open ? " is-open" : "")}>
      <h3 class="pv-faq-q"><${motion.button} type="button" id=${hid} ref=${bind} aria-expanded=${open ? "true" : "false"} aria-controls=${pid} onClick=${onToggle} onKeyDown=${onKey} whileTap=${{ scale: M.tap.row }} transition=${M.press}>
        <span class="pv-faq-qt">${item.q}</span>
        <${motion.span} class="pv-faq-chev" aria-hidden="true" initial=${false} animate=${{ rotate: open ? 180 : 0 }} transition=${reduced ? off : M.chevron}><${Ico} d=${P.down}/><//>
      <//></h3>
      <${motion.div} class="pv-faq-clip" initial=${false} animate=${ready ? { height: open ? h : 0 } : {}} transition=${reduced ? off : M.disclose} style=${{ overflow: "hidden", height: ready ? undefined : (open ? "auto" : 0) }}>
        <div ref=${ref} id=${pid} role="region" aria-labelledby=${hid} class="pv-faq-a">
          <${motion.div} initial=${false} animate=${{ opacity: open ? 1 : 0 }} transition=${reduced ? off : (open ? M.dissolveIn : M.dissolveOut)}>${item.a}<//>
        </div>
      <//>
    </div>`;
  }

  function Faq({ items, open, onToggle }) {
    const reduced = useReducedMotion();
    const heads = useRef({});
    const ids = items.map(i => i.id);
    const key = (id, e) => {
      const at = ids.indexOf(id);
      const go = { ArrowDown: (at + 1) % ids.length, ArrowUp: (at - 1 + ids.length) % ids.length, Home: 0, End: ids.length - 1 }[e.key];
      if (go === undefined) return;
      e.preventDefault();
      const b = heads.current[ids[go]];
      b && b.focus();
    };
    return html`<div class="pv-faq">${items.map(it => html`<${FaqRow} key=${it.id} item=${it} open=${open === it.id} reduced=${Boolean(reduced)}
      onToggle=${() => onToggle(open === it.id ? null : it.id)} onKey=${e => key(it.id, e)} bind=${n => { heads.current[it.id] = n; }}/>`)}</div>`;
  }

  function Sms() {
    return html`<figure class="pv-sms">
      <figcaption>نمونه پیامک پذیرش</figcaption>
      <div class="pv-msg pv-sms-msg">
        <p>خانم/ آقای <span class="pv-blank" aria-label="نام شما">………..</span> به آزمایشگاه پیوند خوش آمدید!</p>
        <p>شماره پذیرش شما : <span class="pv-blank" aria-label="شماره پذیرش">……</span><span class="pv-tag">نام کاربری</span></p>
        <p>شماره اشتراک شما : <span class="pv-blank" aria-label="شماره اشتراک">……</span><span class="pv-tag">رمز عبور</span></p>
      </div>
    </figure>`;
  }

  function Foot() {
    return html`<footer class="pv-foot"><div class="pv-wrap">
      <div>
        <h2>نشانی و تماس</h2>
        <address>تهران- خیابان شریعتی – خیابان دستگردی (ظفر)- نرسیده به خیابان دکتر مصدق (نفت سابق) پلاک ۱۷۴، کدپستی <span class="pv-num">۱۹۱۹۷۵۳۵۵۷</span></address>
        <div class="pv-contact">
          <a href=${TEL}><span class="pv-num pv-lat">${PHONE}</span></a>
          <a href="mailto:info@payvandlab.com"><span class="pv-lat">info@payvandlab.com</span></a>
        </div>
      </div>
      <div>
        <h2>تاییدیه‌های آزمایشگاه</h2>
        <ul>
          <li>دارنده گواهینامه <span class="pv-lat">ISO ۱۵۱۸۹</span> از NACI</li>
          <li>دارنده لوح کیفیت از آزمایشگاه مرجع سلامت</li>
          <li>گواهینامه بین‌المللی <span class="pv-lat">ISO ۱۰۰۰۲:۲۰۱۴</span></li>
          <li>گواهینامه بین‌المللی <span class="pv-lat">ISO ۹۰۰۱:۲۰۱۵</span></li>
          <li>عضو شبکه مراکز تشخیص ملکولی IFCC</li>
        </ul>
      </div>
    </div></footer>`;
  }

  const Close = ({ onClick }) => html`<button type="button" class="pv-close" onClick=${onClick}><${Ico} d=${P.x}/>بستن</button>`;

  function useEsc(onClose) {
    useEffect(() => {
      const k = e => { if (e.key === "Escape") onClose(); };
      addEventListener("keydown", k);
      return () => removeEventListener("keydown", k);
    }, []);
  }

  function Sheet({ onClose, cur }) {
    useEsc(onClose);
    useEffect(() => {
      const b = document.querySelector(".pv-sheet .pv-close");
      b && b.focus({ preventScroll: true });
    }, []);
    return html`<${React.Fragment}>
      <${motion.div} class="pv-scrim" key="scrim" onClick=${onClose} initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0, transition: M.exit }} transition=${M.scrim}/>
      <${motion.div} class="pv-sheet" key="sheet" role="dialog" aria-modal="true" aria-label="منو" id="pv-sheet" initial=${{ x: "100%" }} animate=${{ x: 0 }} exit=${{ x: "100%", transition: M.exit }} transition=${M.sheet}>
        <div class="pv-sheet-head">
          <img src=${LOGO} width="217" height="63" alt="آزمایشگاه پیوند"/>
          <${Close} onClick=${onClose}/>
        </div>
        <div class="pv-sheet-body">
          <${Entry} compact=${true}/>
          <nav aria-label="منوی اصلی"><ul>
            ${MENU.filter(m => !m.results).map(m => html`<li key=${m.t}><a href=${m.h} aria-current=${isCur(m, cur) ? "page" : null}>${m.t}<${Ico} d=${P.chev}/></a></li>`)}
          </ul></nav>
        </div>
        <div class="pv-sheet-foot"><${Tel} label=${true}/></div>
      <//>
    <//>`;
  }

  function Chat({ onClose }) {
    useEsc(onClose);
    const wide = matchMedia("(min-width: 960px)").matches;
    const from = wide ? { opacity: 0, scale: 0.55, y: -10 } : { y: "105%" };
    const to = wide ? { opacity: 1, scale: 1, y: 0 } : { y: 0 };
    return html`<${motion.section} class="pv-chat" id="pv-chat" role="dialog" aria-labelledby="pv-chat-h" key="chat" initial=${from} animate=${to} exit=${{ ...from, transition: M.exit }} transition=${wide ? M.panel : M.sheet}>
      <div class="pv-chat-head">
        <div><h2 id="pv-chat-h">پیوندیار</h2><p>دستیار هوش مصنوعی آزمایشگاه پیوند</p></div>
        <${Close} onClick=${onClose}/>
      </div>
      <div class="pv-chat-body">
        <div class="pv-msg">
          <p>به آزمایشگاه پیوند خوش آمدید.</p>
          <p>سوال خود را مطرح کنید تا دستیار هوش مصنوعی آزمایشگاه پیوند (پیوندیار) پاسخگوی سوالات شما باشد.</p>
          <p>در صورت نیاز به اتصال به اپراتور، از پیوندیار بخواهید تا اتصال شما به اپراتورهای ما را برقرار کند.</p>
        </div>
      </div>
      <form class="pv-chat-form" onSubmit=${e => e.preventDefault()}>
        <label><span class="pv-sr">پیام شما</span><input type="text" name="m" autocomplete="off" placeholder="پیام خود را بنویسید"/></label>
        <button type="submit" class="pv-send">ارسال</button>
      </form>
    <//>`;
  }

  window.PV = { LOGO, LOGIN, PARTNER, TEL, PHONE, MENU, P, Ico, Tel, Yar, Util, Head, Entry, Results, Row, List, JOBS, Hours, WORK, PICKUP, Steps, Faq, Sms, Foot, Close, Sheet, Chat, todayRow, fa };
})();
