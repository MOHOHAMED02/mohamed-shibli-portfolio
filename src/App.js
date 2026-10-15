import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie"; // ייבוא של העוגיות
import "./App.css";

/* ---------------- PER-CARD ACCENT COLORS ---------------- */
const ACCENTS = [
  { solid: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)" },
  { solid: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },
  { solid: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)" },
  { solid: "#e11d48", glow: "rgba(225, 29, 72, 0.4)" },
  { solid: "#8b5cf6", glow: "rgba(139, 92, 246, 0.4)" },
  { solid: "#06b6d4", glow: "rgba(6, 182, 212, 0.4)" },
  { solid: "#84cc16", glow: "rgba(132, 204, 22, 0.4)" },
  { solid: "#f97316", glow: "rgba(249, 115, 22, 0.4)" },
  { solid: "#ec4899", glow: "rgba(236, 72, 153, 0.4)" },
  { solid: "#14b8a6", glow: "rgba(20, 184, 166, 0.4)" },
];

// لون مختلف لكل مربع: بنخلط الترتيب شوي عشان ما يتكرر اللون بجنب بعضو
function accentStyle(i) {
  const c = ACCENTS[(i * 3) % ACCENTS.length];
  return { "--accent": c.solid, "--accent-glow": c.glow };
}

/* ---------------- SPLASH SCREEN (opening intro) ---------------- */
function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const letters = "MOHAMED SHIBLI".split("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setLeaving(true), 2900);
    const t2 = setTimeout(() => {
      document.body.style.overflow = "";
      onDone();
    }, 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div
      className={`splash ${leaving ? "leaving" : ""}`}
      style={{ direction: "ltr" }}
      onClick={() => setLeaving(true)}
    >
      <div className="splash-glow"></div>
      <div className="splash-name">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={ch === " " ? "splash-letter space" : "splash-letter"}
            style={{ animationDelay: `${0.25 + i * 0.1}s` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </div>
      <div className="splash-line"></div>
      <div className="splash-sub">FULL-STACK DEVELOPER</div>
    </div>
  );
}

/* ---------------- LIGHTWEIGHT SCROLL REVEAL (no heavy library) ---------------- */
function Reveal({ tag: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

const SECTIONS = ["about", "skills", "projects", "contact"];

/* ---------------- TEXT CONTENT ---------------- */
const ABOUT = {
  en: {
    title: "👨‍💻 About Me",
    badge: "Open to Junior Developer roles",
    name: "Mohamed Shibli",
    role: "Software Engineering Student · Full-Stack Developer",
    cta1: "View Projects",
    cta2: "Contact Me",
    desc: `Hello everyone! My name is Mohamed Shibli.
I am a 3rd-year Software Engineering student at Kinneret Academic College.

I am a motivated developer with a strong passion for modern technologies, system design, and full-stack development.

I specialize in building responsive and scalable web applications using technologies such as React, Node.js, JavaScript, and databases.

I also build professional websites for businesses — online booking systems for appointments and reservations, e-commerce stores for selling products, landing pages and custom web apps — as well as applications. Every project is designed to look premium, load fast and help the business grow.

Over the years I've built strong, hands-on experience across the full stack — from clean, well-structured front-end interfaces to solid back-end logic and databases — and I take pride in writing efficient, reliable code.

Currently seeking opportunities to grow as a Junior Developer and contribute to real-world projects in a professional environment.`,
  },
  he: {
    title: "👨‍💻 עליי",
    badge: "פתוח להזדמנויות כמפתח ג'וניור",
    name: "מוחמד שיבלי",
    role: "סטודנט להנדסת תוכנה · מפתח Full Stack",
    cta1: "לפרויקטים",
    cta2: "צור קשר",
    desc: `שלום לכולם! שמי מוחמד שיבלי.
אני סטודנט להנדסת תוכנה שנה שלישית במכללת כנרת.

אני מפתח עם תשוקה חזקה לטכנולוגיה, פיתוח מערכות ותכנות מודרני.

מתמקד בפיתוח אפליקציות ווב מלאות (Full Stack) עם React, Node.js, JavaScript ובסיסי נתונים.

אני בונה גם אתרים מקצועיים לעסקים - מערכות הזמנת תורים והזמנות, חנויות אונליין למכירת מוצרים, דפי נחיתה ואתרים מותאמים אישית - וגם אפליקציות. כל פרויקט מעוצב ברמה גבוהה, נטען מהר ועוזר לעסק לצמוח.

עם השנים צברתי ניסיון מעשי חזק בכל שכבות הפיתוח - Full Stack אמיתי - החל מממשקי משתמש מסודרים וברורים ועד לוגיקת שרת ובסיסי נתונים איתנים, ואני גאה בכתיבת קוד יעיל ואמין.

מחפש הזדמנויות להתפתח כמפתח ג'וניור ולהשתלב בצוות פיתוח מקצועי בפרויקטים אמיתיים.`,
  },
};

const BUILD_TITLE = { en: "What I Build", he: "מה אני בונה" };

const BUILD = [
  {
    icon: "📅",
    title: { en: "Booking Systems", he: "מערכות הזמנת תורים" },
    desc: {
      en: "Appointment & reservation systems for salons, clinics and restaurants.",
      he: "מערכות לתיאום תורים והזמנות לעסקים, מספרות, מרפאות ומסעדות.",
    },
  },
  {
    icon: "🛒",
    title: { en: "Online Stores", he: "חנויות אונליין" },
    desc: {
      en: "E-commerce websites to sell products, with cart and checkout.",
      he: "אתרי איקומרס למכירת מוצרים, עם עגלת קניות ותשלום.",
    },
  },
  {
    icon: "📱",
    title: { en: "Apps & Web Apps", he: "אפליקציות ואתרים" },
    desc: {
      en: "Custom applications and business websites built to your needs.",
      he: "אפליקציות ואתרים לעסקים, מותאמים אישית לצרכים שלך.",
    },
  },
];

const SKILLS_TITLE = {
  en: "🚀 Skills & Technologies",
  he: "🚀 כישורים וטכנולוגיות",
};

const SKILLS = [
  { name: "C", icon: "🧠" },
  { name: "HTML", icon: "🌐" },
  { name: "CSS", icon: "🎨" },
  { name: "JavaScript", icon: "⚡" },
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "C++", icon: "🔧" },
  { name: "C#", icon: "💻" },
  { name: "PHP", icon: "🐘" },
  { name: "SQL", icon: "🗄️" },
  { name: "MongoDB", icon: "🍃" },
  { name: "QA Testing", icon: "🧪" },
  { name: "OOP", icon: "🧩" },
  { name: "Arduino", icon: "🔌" },
  { name: "Linux", icon: "🐧" },
  { name: "Operating Systems", he: "מערכות הפעלה", icon: "🖥️" },
  { name: "Networking", he: "תקשורת ורשתות", icon: "📡" },
];

const PROJECTS_TITLES = {
  en: { main: "💼 My Projects", btn: "🔗 View Project" },
  he: { main: "💼 פרוייקטים שלי", btn: "🔗 צפה בפרויקט" },
};

const PROJECTS = [
  {
    name: "🎮 SIMON GAME ARDUINO",
    desc: {
      en: "Arduino-based Simon Says game with LEDs and logic control.",
      he: "משחק סימון מבוסס ארדואינו עם נורות LED ובקרת לוגיקה.",
    },
    link: "https://github.com/MOHOHAMED02/SIMON-GAME-ARDUINO",
  },
  {
    name: "🕹️ Flying Square Game",
    desc: {
      en: "JavaScript game with movement & collision mechanics.",
      he: "משחק JavaScript עם מכניקת תנועה והתנגשויות.",
    },
    link: "https://github.com/MOHOHAMED02/flying-square",
  },
  {
    name: "🧠 Memory Game",
    desc: {
      en: "Classic memory card game built with JavaScript.",
      he: "משחק זיכרון קלאסי שנבנה עם JavaScript.",
    },
    link: "https://github.com/MOHOHAMED02/memory-game",
  },
  {
    name: "✅ Todo List App",
    desc: {
      en: "Task manager with add, delete and complete features.",
      he: "אפליקציית ניהול משימות עם אפשרות הוספה, מחיקה וסימון לביצוע.",
    },
    link: "https://github.com/MOHOHAMED02/finish-todo-list",
  },
  {
    name: "⭐ Project Rating System",
    desc: {
      en: "System for rating and managing projects.",
      he: "מערכת לניהול ודירוג פרויקטים.",
    },
    link: "https://github.com/MOHOHAMED02/project_rating_system",
  },
  {
    name: "🔐 Escape Room IoT",
    desc: {
      en: "IoT based escape room project using Arduino and smart logic systems.",
      he: "פרויקט חדר בריחה מבוסס IoT עם ארדואינו ולוגיקה חכמה.",
    },
    link: "https://github.com/MOHOHAMED02/escape-room-iot",
  },
  {
    name: "🪪 React User Cards Editor",
    desc: {
      en: "An array of 6 user objects (name, ID, address, image) displayed as clickable cards. Clicking a card opens a shared edit panel with labeled inputs (ID stays read-only) and a save button that updates the card's data.",
      he: "מערך של 6 אובייקטים (שם, ת.ז, כתובת, תמונה) המוצגים ככרטיסיות לחיצות. לחיצה על כרטיסייה פותחת מקטע עריכה משותף עם אינפוטים מתויגים (שדה ת.ז קבוע) וכפתור שמירה שמעדכן את פרטי הכרטיסייה.",
    },
    link: "https://github.com/MOHOHAMED02/react-user-cards-editor",
  },
  {
    name: "🚨 Smart Panic Button IoT",
    desc: {
      en: "Real-time smart panic-button system built around an interrupt-driven physical button and a clear state machine (routine / panic / reset). Pressing it triggers a fast-blinking red LED and a rising-falling buzzer, streams live JSON status (device ID + state) over MQTT/WebSocket, and the alert can only be cleared from a live web dashboard.",
      he: "מערכת לחצן מצוקה חכמה בזמן אמת, מבוססת על לחצן פיזי עם Interrupt ומכונת מצבים ברורה (שגרה / מצוקה / איפוס). לחיצה מפעילה LED אדום מהבהב מהר וזמזום עולה-יורד, שולחת סטטוס JSON חי (מזהה מכשיר + מצב) דרך MQTT/WebSocket, וניתן לבטל את ההתראה רק דרך דף אינטרנט חי.",
    },
    link: "https://github.com/MOHOHAMED02/smart-panic-button-iot-pro",
  },
];

const CONTACT_TITLE = {
  en: "📞 Contact & Collaboration",
  he: "📞 צור קשר ושיתוף פעולה",
};

const NAV_LINKS = {
  en: ["About Me", "Skills", "Projects", "Contact"],
  he: ["עליי", "כישורים", "פרוייקטים", "צור קשר"],
};

const SITE_TITLE = {
  en: "Mohamed Shibli",
  he: "מוחמד שיבלי",
};

const DOCK = {
  en: { top: "Top", cats: "Categories" },
  he: { top: "למעלה", cats: "קטגוריות" },
};

const FOOTER = {
  en: "All rights reserved.",
  he: "כל הזכויות שמורות.",
};

/* ---------------- MAIN APP COMPONENT ---------------- */
export default function App() {
  const [lang, setLang] = useState("en");
  const [splash, setSplash] = useState(true);
  const [active, setActive] = useState("about");
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dir = lang === "he" ? "rtl" : "ltr";
  const about = ABOUT[lang];

  // --- עוגייה לכל משתמש שנכנס (נשמרת ל-30 יום) ---
  useEffect(() => {
    if (!Cookies.get("site_visit")) {
      Cookies.set("site_visit", "active", { expires: 30, secure: true, sameSite: "strict" });
    }
  }, []);

  // --- קטע פעיל + כפתור למעלה (קל וחלק, עם requestAnimationFrame) ---
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      setShowTop(window.scrollY > 400);

      const probe = window.scrollY + 160;
      let current = SECTIONS[0];
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) current = id;
      });
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
      if (atBottom) current = SECTIONS[SECTIONS.length - 1];
      setActive(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app" dir={dir}>
      {splash && <Splash onDone={() => setSplash(false)} />}

      {/* ---------- LIGHT BACKGROUND ---------- */}
      <div className="bg" aria-hidden="true">
        <span className="bg-orb bg-orb-1"></span>
        <span className="bg-orb bg-orb-2"></span>
        <span className="bg-grid"></span>
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="spark"
            style={{
              left: `${(i * 7.3 + 5) % 100}%`,
              animationDuration: `${12 + (i % 6) * 3}s`,
              animationDelay: `${-(i * 1.7)}s`,
            }}
          ></span>
        ))}
      </div>

      {/* ---------- NAVBAR ---------- */}
      <nav className="nav">
        <a href="#about" className="brand">{SITE_TITLE[lang]}</a>

        <div className="links">
          {SECTIONS.map((id, i) => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>
              {NAV_LINKS[lang][i]}
            </a>
          ))}
        </div>

        <div className="nav-tools">
          <button
            className="lang-toggle"
            style={{ direction: "ltr" }}
            onClick={() => setLang(lang === "en" ? "he" : "en")}
            title={lang === "en" ? "עברית" : "English"}
            aria-label="Change language"
          >
            <span className="lang-code">{lang === "en" ? "EN" : "עב"}</span>
            <span className="lang-globe">🌐</span>
          </button>
        </div>
      </nav>

      <main>
        {/* ---------- 1. ABOUT / HERO ---------- */}
        <section id="about" className="section hero">
          <Reveal className="hero-inner">
            <span className="hero-badge">● {about.badge}</span>
            <h1 className="hero-name">{about.name}</h1>
            <p className="hero-role">{about.role}</p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-main">{about.cta1}</a>
              <a href="#contact" className="btn btn-ghost">{about.cta2}</a>
            </div>
          </Reveal>

          <Reveal tag="h2" className="section-title">{BUILD_TITLE[lang]}</Reveal>
          <div className="build-grid">
            {BUILD.map((b, i) => (
              <Reveal key={b.icon} className="build-card" style={accentStyle(i * 3 + 1)}>
                <div className="build-icon">{b.icon}</div>
                <h3>{b.title[lang]}</h3>
                <p>{b.desc[lang]}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="about-card">
            <h2 className="section-title">{about.title}</h2>
            <p className="about-text">{about.desc}</p>
          </Reveal>
        </section>

        {/* ---------- 2. SKILLS ---------- */}
        <section id="skills" className="section">
          <Reveal tag="h2" className="section-title">{SKILLS_TITLE[lang]}</Reveal>
          <div className="skills-grid">
            {SKILLS.map((s, i) => (
              <Reveal key={s.name} className="skill-card" style={accentStyle(i)}>
                <div className="icon">{s.icon}</div>
                <div className="skill-name">{lang === "he" && s.he ? s.he : s.name}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- 3. PROJECTS ---------- */}
        <section id="projects" className="section">
          <Reveal tag="h2" className="section-title">{PROJECTS_TITLES[lang].main}</Reveal>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.link} className="project-card" style={accentStyle(i)}>
                <h3>{p.name}</h3>
                <p>{p.desc[lang]}</p>
                <a href={p.link} target="_blank" rel="noreferrer" className="project-btn">
                  {PROJECTS_TITLES[lang].btn}
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- 4. CONTACT ---------- */}
        <section id="contact" className="section">
          <Reveal tag="h2" className="section-title">{CONTACT_TITLE[lang]}</Reveal>
          <div className="contact-grid">
            <Reveal tag="a" href="mailto:mohamed2002ahibli@gmail.com" className="contact-card" style={accentStyle(0)}>
              📧 Email
            </Reveal>
            <Reveal tag="a" href="https://wa.me/972532427351" target="_blank" rel="noreferrer" className="contact-card" style={accentStyle(1)}>
              💬 WhatsApp
            </Reveal>
            <Reveal tag="a" href="https://github.com/MOHOHAMED02" target="_blank" rel="noreferrer" className="contact-card" style={accentStyle(2)}>
              🐙 GitHub
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span style={{ direction: "ltr", display: "inline-block" }}>
          © {new Date().getFullYear()} {SITE_TITLE[lang]}
        </span>
        {" · "}
        {FOOTER[lang]}
      </footer>

      {/* ---------- FLOATING DOCK: TOP + CATEGORIES ---------- */}
      {menuOpen && <div className="dock-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Categories: fixed in the top corner, right under the language button */}
      <div className="cats" style={{ direction: "ltr" }}>
        <button className="cats-btn" onClick={() => setMenuOpen((v) => !v)}>
          ☰ {DOCK[lang].cats}
        </button>
        {menuOpen && (
          <div className="dock-menu" style={{ direction: dir }}>
            {SECTIONS.map((id, i) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {NAV_LINKS[lang][i]}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Back to top: bottom corner */}
      <button
        className={`to-top ${showTop ? "show" : ""}`}
        style={{ direction: "ltr" }}
        onClick={scrollTop}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}