(function () {
  const { React, motion, html } = window.Vendor;
  const { useEffect } = React;
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

  function Head({ onMenu }) {
    return html`<header class="pv-head"><div class="pv-wrap">
      <a class="pv-logo" href="#" aria-label="آزمایشگاه پیوند، صفحه اصلی"><img src=${LOGO} width="217" height="63" alt="آزمایشگاه تشخیص طبی و تخصصی پیوند"/></a>
      <nav class="pv-nav" aria-label="منوی اصلی"><ul>
        ${MENU.map(m => html`<li key=${m.t}><a href=${m.h} class=${m.results ? "pv-nav-results" : ""} aria-current=${m.cur ? "page" : null}>${m.t}${m.results ? html`<${Ico} d=${P.arrow}/>` : null}</a></li>`)}
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

  function Results({ h1 }) {
    return html`<section class="pv-results" aria-labelledby=${h1 ? "pv-h1" : null} aria-label=${h1 ? null : "جواب آزمایش"}><div class="pv-wrap">
      ${h1 ? html`<h1 class="pv-sr" id="pv-h1">جواب آزمایش، آزمایشگاه پیوند</h1>` : null}
      <div class="pv-results-grid">
        <${Entry} id=${h1 ? "pv-entry" : null}/>
        <div class="pv-stub">
          <div class="pv-stub-top"><dl>
            <dt>نام کاربری</dt><dd>شماره پذیرش یا کد ملی</dd>
            <dt>رمز عبور</dt><dd>شماره اشتراک یا شماره موبایل</dd>
          </dl></div>
          <div class="pv-stub-bot"><p>هر دو روی قبض آزمایشگاه و در پیامک پذیرش آمده است.</p></div>
        </div>
        <div class="pv-help">
          <span>وارد نمی‌شوید؟</span>
          <a class="pv-link" href="/results-help"><${Ico} d=${P.book}/>راهنمای جوابدهی اینترنتی</a>
        </div>
        <div class="pv-roles">
          <span class="pv-roles-label">پزشک یا مرکز همکار هستید؟</span>
          <a class="pv-role" href=${LOGIN}>ورود پزشکان<${Ico} d=${P.chev}/></a>
          <a class="pv-role" href=${PARTNER}>ورود مراکز همکار<${Ico} d=${P.chev}/></a>
        </div>
      </div>
    </div></section>`;
  }

  const Row = ({ href, title, text }) => html`<${motion.a} href=${href} whileTap=${{ scale: M.tap.row }} transition=${M.press}>
    <span class="pv-row-text"><h3>${title}</h3><p>${text}</p></span>
    <span class="pv-row-go"><${Ico} d=${P.chev}/></span>
  <//>`;

  const JOBS = [
    { href: "/visit-guide", title: "راهنمای مراجعه و پذیرش غیرحضوری", text: "نسخه را با فرمت jpg بفرستید تا کارشناسان پذیرش با شما تماس بگیرند." },
    { href: "/home-sampling", title: "درخواست نمونه‌گیری در منزل", text: "۲۴ ساعت زودتر درخواست دهید. برای بالای ۱۵ سال؛ نمونه‌گیری در منزل رایگان است و فقط هزینه آزمایش‌ها گرفته می‌شود." },
    { href: "/insurers", title: "بیمه‌های طرف قرارداد", text: "۳۰ بیمه و سازمان، از جمله سازمان تامین اجتماعی، سازمان بیمه خدمات درمانی و بیمه نیروهای مسلح." }
  ];
  const List = ({ rows }) => html`<div class="pv-list">${(rows || JOBS).map(r => html`<${Row} key=${r.href} ...${r}/>`)}</div>`;

  function Hours({ today, id }) {
    const t = today === undefined ? todayRow() : today;
    const rows = [["شنبه تا چهارشنبه", "۰۶:۳۰ تا ۱۹:۰۰"], ["پنجشنبه", "۰۶:۳۰ تا ۱۸:۰۰"]];
    return html`<div class="pv-card pv-hours" id=${id || null}>
      <h3>ساعت کار، نشانی و تلفن</h3>
      <table><tbody>
        ${rows.map((r, i) => html`<tr key=${i} class=${i === t ? "is-today" : ""}><th scope="row">${r[0]}${i === t ? html`<span class="pv-today">امروز</span>` : null}</th><td>${r[1]}</td></tr>`)}
      </tbody></table>
      <p class="pv-hours-note">روزهای تعطیل رسمی، آزمایشگاه تعطیل است.</p>
      <address>تهران، خیابان شریعتی، خیابان دستگردی (ظفر)، نرسیده به خیابان دکتر مصدق، پلاک ۱۷۴</address>
      <div class="pv-card-actions">
        <${Tel}/>
        <a class="pv-link" href="/contact">نشانی و راه‌های ارتباط<${Ico} d=${P.chev}/></a>
      </div>
    </div>`;
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

  function Sheet({ onClose }) {
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
            ${MENU.filter(m => !m.results).map(m => html`<li key=${m.t}><a href=${m.h} aria-current=${m.cur ? "page" : null}>${m.t}<${Ico} d=${P.chev}/></a></li>`)}
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

  window.PV = { LOGO, LOGIN, PARTNER, TEL, PHONE, MENU, P, Ico, Tel, Yar, Util, Head, Entry, Results, Row, List, JOBS, Hours, Foot, Close, Sheet, Chat, todayRow };
})();
