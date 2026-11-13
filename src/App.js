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

// لون مختلف لكل مربع
function accentStyle(i) {
  const c = ACCENTS[(i * 3) % ACCENTS.length];
  return { "--accent": c.solid, "--accent-glow": c.glow };
}

/* ---------------- 3D TILT (card follows the mouse + light spot) ---------------- */
function tiltMove(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
  el.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
}
function tiltLeave(e) {
  const el = e.currentTarget;
  el.style.setProperty("--ry", "0deg");
  el.style.setProperty("--rx", "0deg");
}
const tilt = { onMouseMove: tiltMove, onMouseLeave: tiltLeave };

/* ---------------- SPLASH SCREEN ---------------- */
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
            className="splash-letter"
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

/* ---------------- SCROLL REVEAL ---------------- */
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

/* ---------------- TYPEWRITER (types and deletes phrases) ---------------- */
function Typewriter({ words }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // אם השפה משתנה - מתחילים מחדש
  useEffect(() => {
    setIndex(0);
    setText("");
    setDeleting(false);
  }, [words]);

  useEffect(() => {
    const word = words[index % words.length];
    let delay = deleting ? 35 : 75;
    if (!deleting && text === word) delay = 1600;
    if (deleting && text === "") delay = 350;

    const t = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((v) => (v + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words]);

  return (
    <span className="typed">
      {text}
      <span className="typed-cursor">|</span>
    </span>
  );
}

/* ---------------- COUNTER (counts up when visible) ---------------- */
function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 1400, 1);
        setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) {
      setValue(to);
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className="stat-num" style={{ direction: "ltr" }}>
      {value}
      {suffix}
    </span>
  );
}

const SECTIONS = ["about", "skills", "projects", "services", "contact"];

/* ---------------- TEXT CONTENT ---------------- */
// 📄 קורות חיים: שני קבצי ה-PDF נמצאים בתיקייה public (אנגלית + עברית)
const CV_FILE = {
  en: "/Mohamed-Shibli-CV-EN.pdf",
  he: "/Mohamed-Shibli-CV-HE.pdf",
};

const ABOUT = {
  en: {
    title: "👨‍💻 About Me",
    badge: "Open to Junior Developer roles",
    name: "Mohamed Shibli",
    role: "3rd-year Software Engineering Student · Kinneret College",
    cta1: "View Projects",
    cta2: "Contact Me",
    cv: "📄 Download CV",
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
    role: "סטודנט להנדסת תוכנה שנה שלישית · מכללת כנרת",
    cta1: "לפרויקטים",
    cta2: "צור קשר",
    cv: "📄 הורדת קורות חיים",
    desc: `שלום לכולם! שמי מוחמד שיבלי.
אני סטודנט להנדסת תוכנה שנה שלישית במכללת כנרת.

אני מפתח עם תשוקה חזקה לטכנולוגיה, פיתוח מערכות ותכנות מודרני.

מתמקד בפיתוח אפליקציות ווב מלאות (Full Stack) עם React, Node.js, JavaScript ובסיסי נתונים.

אני בונה גם אתרים מקצועיים לעסקים - מערכות הזמנת תורים והזמנות, חנויות אונליין למכירת מוצרים, דפי נחיתה ואתרים מותאמים אישית - וגם אפליקציות. כל פרויקט מעוצב ברמה גבוהה, נטען מהר ועוזר לעסק לצמוח.

עם השנים צברתי ניסיון מעשי חזק בכל שכבות הפיתוח - Full Stack אמיתי - החל מממשקי משתמש מסודרים וברורים ועד לוגיקת שרת ובסיסי נתונים איתנים, ואני גאה בכתיבת קוד יעיל ואמין.

מחפש הזדמנויות להתפתח כמפתח ג'וניור ולהשתלב בצוות פיתוח מקצועי בפרויקטים אמיתיים.`,
  },
};

const TYPED = {
  en: ["Full-Stack Developer", "React Developer", "I build websites for businesses", "I build apps"],
  he: ["מפתח Full Stack", "מפתח React", "בונה אתרים לעסקים", "בונה אפליקציות"],
};

const STATS = {
  en: ["Projects", "Technologies", "Years of Study"],
  he: ["פרויקטים", "טכנולוגיות", "שנות לימוד"],
};

const MARQUEE = [
  "React", "Node.js", "JavaScript", "Python", "DevOps", "MongoDB", "SQL", "HTML", "CSS", "C", "C++", "C#",
  "PHP", "Linux", "Arduino", "IoT", "OOP", "QA Testing", "Networking", "Git",
];

/* ---- המסלול שלי (Timeline) ---- */
const JOURNEY_TITLE = { en: "🧭 My Journey", he: "🧭 המסלול שלי" };

const JOURNEY = [
  {
    year: { en: "Year 1", he: "שנה א'" },
    title: { en: "Programming Foundations", he: "יסודות התכנות" },
    desc: {
      en: "C, HTML, CSS and JavaScript. Built my first games — Memory Game and Flying Square.",
      he: "C, HTML, CSS ו-JavaScript. בניתי את המשחקים הראשונים שלי - משחק זיכרון ו-Flying Square.",
    },
  },
  {
    year: { en: "Year 2", he: "שנה ב'" },
    title: { en: "OOP, Databases & Hardware", he: "OOP, בסיסי נתונים וחומרה" },
    desc: {
      en: "C++, C#, OOP, SQL and PHP, plus Arduino projects — Simon Game and an IoT Escape Room.",
      he: "C++, C#, OOP, SQL ו-PHP, יחד עם פרויקטי ארדואינו - משחק סימון וחדר בריחה IoT.",
    },
  },
  {
    year: { en: "Year 3", he: "שנה ג'" },
    title: { en: "Full-Stack & Real Clients", he: "Full Stack ולקוחות אמיתיים" },
    desc: {
      en: "React, Node.js, MongoDB, Linux, operating systems and networking. Currently learning Python and DevOps, and building websites and apps for businesses.",
      he: "React, Node.js, MongoDB, Linux, מערכות הפעלה ותקשורת ורשתות. כרגע לומד Python ו-DevOps, ובונה אתרים ואפליקציות לעסקים.",
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
  { name: "Python", icon: "🐍" },
  { name: "DevOps", icon: "♾️" },
  { name: "QA Testing", icon: "🧪" },
  { name: "OOP", icon: "🧩" },
  { name: "Arduino", icon: "🔌" },
  { name: "Linux", icon: "🐧" },
  { name: "Operating Systems", he: "מערכות הפעלה", icon: "🖥️" },
  { name: "Networking", he: "תקשורת ורשתות", icon: "📡" },
];

const PROJECTS_TITLES = {
  en: { main: "💼 My Projects", btn: "🔗 View Code", demo: "🌐 Visit Website", mine: "My Business" },
  he: { main: "💼 פרוייקטים שלי", btn: "🔗 צפה בקוד", demo: "🌐 לאתר החי", mine: "העסק שלי" },
};

// אפשר להוסיף לכל פרויקט:  image: "/projects/name.png"  (תמונה בתיקייה public)
//                         demo: "https://....vercel.app" (קישור לאתר חי)
const WEBIXA = "https://webixa-design.vercel.app";

const PROJECTS = [
  {
    icon: "🌐",
    featured: true,
    name: "Webixa — Web Design Studio",
    desc: {
      en: "My own web studio. I design and build websites, online stores, appointment-booking systems, digital menus and mobile apps for small businesses — in Arabic, Hebrew and English — from the first meeting with the client to launch and ongoing maintenance.",
      he: "סטודיו האתרים שלי. אני מעצב ובונה אתרים, חנויות אונליין, מערכות הזמנת תורים, תפריטים דיגיטליים ואפליקציות לעסקים קטנים - בערבית, עברית ואנגלית - מהפגישה הראשונה עם הלקוח ועד העלאה לאוויר ותחזוקה שוטפת.",
    },
    demo: WEBIXA,
  },
  {
    icon: "🎮",
    name: "SIMON GAME ARDUINO",
    desc: {
      en: "Arduino-based Simon Says game with LEDs and logic control.",
      he: "משחק סימון מבוסס ארדואינו עם נורות LED ובקרת לוגיקה.",
    },
    link: "https://github.com/MOHOHAMED02/SIMON-GAME-ARDUINO",
  },
  {
    icon: "🕹️",
    name: "Flying Square Game",
    desc: {
      en: "JavaScript game with movement & collision mechanics.",
      he: "משחק JavaScript עם מכניקת תנועה והתנגשויות.",
    },
    link: "https://github.com/MOHOHAMED02/flying-square",
  },
  {
    icon: "🧠",
    name: "Memory Game",
    desc: {
      en: "Classic memory card game built with JavaScript.",
      he: "משחק זיכרון קלאסי שנבנה עם JavaScript.",
    },
    link: "https://github.com/MOHOHAMED02/memory-game",
  },
  {
    icon: "✅",
    name: "Todo List App",
    desc: {
      en: "Task manager with add, delete and complete features.",
      he: "אפליקציית ניהול משימות עם אפשרות הוספה, מחיקה וסימון לביצוע.",
    },
    link: "https://github.com/MOHOHAMED02/finish-todo-list",
  },
  {
    icon: "⭐",
    name: "Project Rating System",
    desc: {
      en: "System for rating and managing projects.",
      he: "מערכת לניהול ודירוג פרויקטים.",
    },
    link: "https://github.com/MOHOHAMED02/project_rating_system",
  },
  {
    icon: "🔐",
    name: "Escape Room IoT",
    desc: {
      en: "IoT based escape room project using Arduino and smart logic systems.",
      he: "פרויקט חדר בריחה מבוסס IoT עם ארדואינו ולוגיקה חכמה.",
    },
    link: "https://github.com/MOHOHAMED02/escape-room-iot",
  },
  {
    icon: "🪪",
    name: "React User Cards Editor",
    desc: {
      en: "An array of 6 user objects (name, ID, address, image) displayed as clickable cards. Clicking a card opens a shared edit panel with labeled inputs (ID stays read-only) and a save button that updates the card's data.",
      he: "מערך של 6 אובייקטים (שם, ת.ז, כתובת, תמונה) המוצגים ככרטיסיות לחיצות. לחיצה על כרטיסייה פותחת מקטע עריכה משותף עם אינפוטים מתויגים (שדה ת.ז קבוע) וכפתור שמירה שמעדכן את פרטי הכרטיסייה.",
    },
    link: "https://github.com/MOHOHAMED02/react-user-cards-editor",
  },
  {
    icon: "🚨",
    name: "Smart Panic Button IoT",
    desc: {
      en: "Real-time smart panic-button system built around an interrupt-driven physical button and a clear state machine (routine / panic / reset). Pressing it triggers a fast-blinking red LED and a rising-falling buzzer, streams live JSON status (device ID + state) over MQTT/WebSocket, and the alert can only be cleared from a live web dashboard.",
      he: "מערכת לחצן מצוקה חכמה בזמן אמת, מבוססת על לחצן פיזי עם Interrupt ומכונת מצבים ברורה (שגרה / מצוקה / איפוס). לחיצה מפעילה LED אדום מהבהב מהר וזמזום עולה-יורד, שולחת סטטוס JSON חי (מזהה מכשיר + מצב) דרך MQTT/WebSocket, וניתן לבטל את ההתראה רק דרך דף אינטרנט חי.",
    },
    link: "https://github.com/MOHOHAMED02/smart-panic-button-iot-pro",
  },
];

/* ---- שירותים וחבילות ---- */
const SERVICES_TITLE = { en: "🛠️ Services & Packages", he: "🛠️ שירותים וחבילות" };
const SERVICES_TEXT = {
  en: { price: "Custom quote", btn: "Get a Quote", popular: "Most Popular", studio: "🌐 See my studio — Webixa" },
  he: { price: "הצעת מחיר אישית", btn: "לקבלת הצעת מחיר", popular: "הכי פופולרי", studio: "🌐 לסטודיו שלי - Webixa" },
};

const SERVICES = [
  {
    icon: "🚀",
    title: { en: "Landing Page", he: "דף נחיתה" },
    desc: { en: "A sharp one-page site that presents your business.", he: "אתר של עמוד אחד שמציג את העסק בצורה חדה." },
    features: {
      en: ["Modern one-page design", "Fits mobile & desktop", "WhatsApp & call buttons", "Contact form"],
      he: ["עיצוב מודרני בעמוד אחד", "מותאם למובייל ולמחשב", "כפתורי וואטסאפ וחיוג", "טופס יצירת קשר"],
    },
  },
  {
    icon: "📅",
    featured: true,
    title: { en: "Business Site + Booking", he: "אתר עסקי + הזמנת תורים" },
    desc: { en: "A full website with an online booking system.", he: "אתר מלא עם מערכת הזמנת תורים אונליין." },
    features: {
      en: ["Multi-page website", "Online appointment booking", "Admin panel to manage bookings", "Gallery, prices & reviews"],
      he: ["אתר מרובה עמודים", "הזמנת תורים אונליין", "פאנל ניהול לתורים", "גלריה, מחירון וביקורות"],
    },
  },
  {
    icon: "🛒",
    title: { en: "Online Store", he: "חנות אונליין" },
    desc: { en: "Sell your products online, 24/7.", he: "מכירת המוצרים שלך אונליין, 24/7." },
    features: {
      en: ["Product catalog", "Shopping cart & checkout", "Order management", "Admin panel for products"],
      he: ["קטלוג מוצרים", "עגלת קניות ותשלום", "ניהול הזמנות", "פאנל ניהול מוצרים"],
    },
  },
];

const CONTACT_TITLE = {
  en: "📞 Contact & Collaboration",
  he: "📞 צור קשר ושיתוף פעולה",
};

const FORM = {
  en: {
    title: "Send me a message",
    name: "Your name",
    msg: "Your message...",
    wa: "💬 Send via WhatsApp",
    mail: "📧 Send via Email",
    hello: "Hi Mohamed, my name is",
    subject: "Message from your portfolio",
  },
  he: {
    title: "שלחו לי הודעה",
    name: "השם שלך",
    msg: "ההודעה שלך...",
    wa: "💬 שליחה בוואטסאפ",
    mail: "📧 שליחה במייל",
    hello: "היי מוחמד, שמי",
    subject: "הודעה מאתר הפורטפוליו",
  },
};

const NAV_LINKS = {
  en: ["About Me", "Skills", "Projects", "Services", "Contact"],
  he: ["עליי", "כישורים", "פרוייקטים", "שירותים", "צור קשר"],
};

const SITE_TITLE = { en: "Mohamed Shibli", he: "מוחמד שיבלי" };
const DOCK = { en: { cats: "Categories" }, he: { cats: "קטגוריות" } };
const FOOTER = { en: "All rights reserved.", he: "כל הזכויות שמורות." };

const PHONE = "972532427351";
const EMAIL = "mohamed2002ahibli@gmail.com";

/* ---------------- MAIN APP COMPONENT ---------------- */
export default function App() {
  const [lang, setLang] = useState("en");
  const [splash, setSplash] = useState(true);
  const [active, setActive] = useState("about");
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const progressRef = useRef(null);

  const dir = lang === "he" ? "rtl" : "ltr";
  const about = ABOUT[lang];
  const form = FORM[lang];

  // --- עוגייה לכל משתמש שנכנס (נשמרת ל-30 יום) ---
  useEffect(() => {
    if (!Cookies.get("site_visit")) {
      Cookies.set("site_visit", "active", { expires: 30, secure: true, sameSite: "strict" });
    }
  }, []);

  // --- קטע פעיל + כפתור למעלה + פס התקדמות ---
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setShowTop(y > 400);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }

      const probe = y + 160;
      let current = SECTIONS[0];
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) current = id;
      });
      if (max > 0 && y >= max - 4) current = SECTIONS[SECTIONS.length - 1];
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

  // --- טופס יצירת קשר: נשלח ישירות לוואטסאפ או למייל ---
  const fullMessage = `${form.hello} ${formName.trim()}.\n${formMsg.trim()}`;
  const formReady = formName.trim() !== "" && formMsg.trim() !== "";
  const waLink = `https://wa.me/${PHONE}?text=${encodeURIComponent(fullMessage)}`;
  const mailLink = `mailto:${EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(fullMessage)}`;

  return (
    <div className="app" dir={dir}>
      {splash && <Splash onDone={() => setSplash(false)} />}

      {/* scroll progress bar */}
      <div className="progress" style={{ direction: "ltr" }}>
        <div className="progress-fill" ref={progressRef}></div>
      </div>

      {/* ---------- BACKGROUND ---------- */}
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
        {/* ---------- 1. HERO + ABOUT ---------- */}
        <section id="about" className="section hero">
          <Reveal className="hero-inner">
            <span className="hero-badge">● {about.badge}</span>
            <h1 className="hero-name">{about.name}</h1>
            <p className="hero-typed">
              <Typewriter words={TYPED[lang]} />
            </p>
            <p className="hero-role">{about.role}</p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-main">{about.cta1}</a>
              <a href={CV_FILE[lang]} download className="btn btn-cv">{about.cv}</a>
              <a href="#contact" className="btn btn-ghost">{about.cta2}</a>
            </div>
          </Reveal>

          {/* counters */}
          <Reveal className="stats">
            <div className="stat">
              <Counter to={PROJECTS.length} suffix="+" />
              <span className="stat-label">{STATS[lang][0]}</span>
            </div>
            <div className="stat">
              <Counter to={SKILLS.length} />
              <span className="stat-label">{STATS[lang][1]}</span>
            </div>
            <div className="stat">
              <Counter to={3} />
              <span className="stat-label">{STATS[lang][2]}</span>
            </div>
          </Reveal>

          {/* moving tech strip */}
          <div className="marquee" style={{ direction: "ltr" }} aria-hidden="true">
            <div className="marquee-track">
              {[...MARQUEE, ...MARQUEE].map((t, i) => (
                <span key={i} className="marquee-item">{t}</span>
              ))}
            </div>
          </div>

          <Reveal className="about-card">
            <h2 className="section-title">{about.title}</h2>
            <p className="about-text">{about.desc}</p>
          </Reveal>

          {/* timeline */}
          <Reveal tag="h2" className="section-title journey-title">{JOURNEY_TITLE[lang]}</Reveal>
          <div className="timeline">
            {JOURNEY.map((j, i) => (
              <Reveal key={i} className="timeline-item" style={accentStyle(i)}>
                <span className="timeline-dot"></span>
                <span className="timeline-year">{j.year[lang]}</span>
                <h3>{j.title[lang]}</h3>
                <p>{j.desc[lang]}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- 2. SKILLS ---------- */}
        <section id="skills" className="section">
          <Reveal tag="h2" className="section-title">{SKILLS_TITLE[lang]}</Reveal>
          <div className="skills-grid">
            {SKILLS.map((s, i) => (
              <Reveal key={s.name} className="skill-card tilt" style={accentStyle(i)} {...tilt}>
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
              <Reveal
                key={p.name}
                className={`project-card tilt ${p.featured ? "featured" : ""}`}
                style={accentStyle(i)}
                {...tilt}
              >
                {p.featured && <span className="service-tag">★ {PROJECTS_TITLES[lang].mine}</span>}
                <div className="project-cover">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" />
                  ) : (
                    <span className="project-emoji">{p.icon}</span>
                  )}
                </div>
                <div className="project-body">
                  <h3>{p.name}</h3>
                  <p>{p.desc[lang]}</p>
                  <div className="project-actions">
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noreferrer" className="project-btn">
                        {PROJECTS_TITLES[lang].demo}
                      </a>
                    )}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className={p.demo ? "project-btn outline" : "project-btn"}
                      >
                        {PROJECTS_TITLES[lang].btn}
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- 4. SERVICES ---------- */}
        <section id="services" className="section">
          <Reveal tag="h2" className="section-title">{SERVICES_TITLE[lang]}</Reveal>
          <Reveal className="studio-link">
            <a href={WEBIXA} target="_blank" rel="noreferrer" className="btn btn-ghost">
              {SERVICES_TEXT[lang].studio}
            </a>
          </Reveal>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <Reveal
                key={s.icon}
                className={`service-card tilt ${s.featured ? "featured" : ""}`}
                style={accentStyle(i * 2)}
                {...tilt}
              >
                {s.featured && <span className="service-tag">★ {SERVICES_TEXT[lang].popular}</span>}
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title[lang]}</h3>
                <p className="service-desc">{s.desc[lang]}</p>
                <ul>
                  {s.features[lang].map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="service-price">{SERVICES_TEXT[lang].price}</div>
                <a href="#contact" className="project-btn">{SERVICES_TEXT[lang].btn}</a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- 5. CONTACT ---------- */}
        <section id="contact" className="section">
          <Reveal tag="h2" className="section-title">{CONTACT_TITLE[lang]}</Reveal>

          <Reveal className="contact-form">
            <h3>{form.title}</h3>
            <input
              type="text"
              placeholder={form.name}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
            <textarea
              rows="4"
              placeholder={form.msg}
              value={formMsg}
              onChange={(e) => setFormMsg(e.target.value)}
            />
            <div className="form-actions">
              <a
                href={formReady ? waLink : undefined}
                target="_blank"
                rel="noreferrer"
                className={`btn btn-main ${formReady ? "" : "disabled"}`}
              >
                {form.wa}
              </a>
              <a href={formReady ? mailLink : undefined} className={`btn btn-ghost ${formReady ? "" : "disabled"}`}>
                {form.mail}
              </a>
            </div>
          </Reveal>

          <div className="contact-grid">
            <Reveal tag="a" href={`mailto:${EMAIL}`} className="contact-card tilt" style={accentStyle(0)} {...tilt}>
              📧 Email
            </Reveal>
            <Reveal
              tag="a"
              href={`https://wa.me/${PHONE}`}
              target="_blank"
              rel="noreferrer"
              className="contact-card tilt"
              style={accentStyle(1)}
              {...tilt}
            >
              💬 WhatsApp
            </Reveal>
            <Reveal
              tag="a"
              href="https://github.com/MOHOHAMED02"
              target="_blank"
              rel="noreferrer"
              className="contact-card tilt"
              style={accentStyle(2)}
              {...tilt}
            >
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

      {/* ---------- CATEGORIES (top corner) ---------- */}
      {menuOpen && <div className="dock-overlay" onClick={() => setMenuOpen(false)} />}

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

      {/* ---------- BACK TO TOP ---------- */}
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
