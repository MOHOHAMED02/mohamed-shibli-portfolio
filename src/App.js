import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from 'js-cookie'; // ייבוא של העוגיות
import "./App.css";

/* ---------------- ANIMATION SETTINGS ---------------- */
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 },
};

const pageTransition = {
  duration: 0.4,
};

/* ---------------- 1. ABOUT ME (WITH INTRO) ---------------- */
function About({ lang }) {
  const text = {
    en: {
      title: "👨‍💻 About Me",
      desc: `Hello everyone! My name is Mohamed Shibli.
I am a 2nd-year Software Engineering student at Kinneret Academic College.

I am a motivated developer with a strong passion for modern technologies, system design, and full-stack development.

I specialize in building responsive and scalable web applications using technologies such as React, Node.js, JavaScript, and databases.

Currently seeking opportunities to grow as a Junior Developer and contribute to real-world projects in a professional environment.`,
    },
    he: {
      title: "👨‍💻 עליי",
      desc: `שלום לכולם! שמי מוחמד שיבלי.
אני סטודנט להנדסת תוכנה שנה שנייה במכללת כנרת.

אני מפתח עם תשוקה חזקה לטכנולוגיה, פיתוח מערכות ותכנות מודרני.

מתמקד בפיתוח אפליקציות ווב מלאות (Full Stack) עם React, Node.js, JavaScript ובסיסי נתונים.

אוהב לפתור בעיות מורכבות, לכתוב קוד נקי ויעיל, וללמוד טכנולוגיות חדשות כל הזמן.

מחפש הזדמנויות להתפתח כמפתח ג'וניור ולהשתלב בצוות פיתוח מקצועי בפרויקטים אמיתיים.`,
    },
  };

  return (
    <motion.div
      className="page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ direction: lang === "he" ? "rtl" : "ltr" }}
    >
      <h1>{text[lang].title}</h1>
      <p style={{ whiteSpace: "pre-line", fontSize: "1.1rem", lineHeight: "1.6" }}>
        {text[lang].desc}
      </p>
    </motion.div>
  );
}

/* ---------------- 2. ENGINEERING STACK ---------------- */
function Skills({ lang }) {
  const title = {
    en: "🚀 Programs",
    he: "🚀 שפות תכנות שלמדתי",
  };

  const skills = [
    { name: "C", icon: "🧠", level: 75 },
    { name: "HTML", icon: "🌐", level: 90 },
    { name: "CSS", icon: "🎨", level: 85 },
    { name: "JavaScript", icon: "⚡", level: 85 },
    { name: "React", icon: "⚛️", level: 85 },
    { name: "Node.js", icon: "🟢", level: 70 },
    { name: "C++", icon: "🔧", level: 70 },
    { name: "C#", icon: "💻", level: 65 },
    { name: "PHP", icon: "🐘", level: 60 },
    { name: "SQL", icon: "🗄️", level: 75 },
    { name: "QA Testing", icon: "🧪", level: 70 },
    { name: "OOP", icon: "🧩", level: 80 },
    { name: "Arduino", icon: "🔌", level: 75 },
  ];

  return (
    <motion.div
      className="page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ direction: lang === "he" ? "rtl" : "ltr" }}
    >
      <h1>{title[lang]}</h1>
      <div className="skills-grid">
        {skills.map((s, i) => (
          <motion.div
            key={i}
            className="skill-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className="icon">{s.icon}</div>
            <div className="skill-name">{s.name}</div>
            <div className="skill-bar-track">
              <motion.div
                className="skill-bar-fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${s.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.05 + 0.2, ease: "easeOut" }}
              />
            </div>
            <div className="skill-percent">{s.level}%</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------- 3. PORTFOLIO SHOWCASE ---------------- */
function Projects({ lang }) {
  const titles = {
    en: { main: "💼 My Projects", btn: "🔗 View Project" },
    he: { main: "💼 פרוייקטים שלי", btn: "🔗 צפה בפרויקט" },
  };

  const projects = [
    {
      name: "SIMON GAME ARDUINO",
      desc: {
        en: "Arduino-based Simon Says game with LEDs and logic control.",
        he: "משחק סימון מבוסס ארדואינו עם נורות LED ובקרת לוגיקה.",
      },
      link: "https://github.com/MOHOHAMED02/SIMON-GAME-ARDUINO",
    },
    {
      name: "Flying Square Game",
      desc: {
        en: "JavaScript game with movement & collision mechanics.",
        he: "משחק JavaScript עם מכניקת תנועה והתנגשויות.",
      },
      link: "https://github.com/MOHOHAMED02/flying-square",
    },
    {
      name: "Memory Game",
      desc: {
        en: "Classic memory card game built with JavaScript.",
        he: "משחק זיכרון קלאסי שנבנה עם JavaScript.",
      },
      link: "https://github.com/MOHOHAMED02/memory-game",
    },
    {
      name: "Todo List App",
      desc: {
        en: "Task manager with add, delete and complete features.",
        he: "אפליקציית ניהול משימות עם אפשרות הוספה, מחיקה וסימון לביצוע.",
      },
      link: "https://github.com/MOHOHAMED02/finish-todo-list",
    },
    {
      name: "Project Rating System",
      desc: {
        en: "System for rating and managing projects.",
        he: "מערכת לניהול ודירוג פרויקטים.",
      },
      link: "https://github.com/MOHOHAMED02/project_rating_system",
    },
    {
      name: "Escape Room IoT",
      desc: {
        en: "IoT based escape room project using Arduino and smart logic systems.",
        he: "פרויקט חדר בריחה מבוסס IoT עם ארדואינו ולוגיקה חכמה.",
      },
      link: "https://github.com/MOHOHAMED02/escape-room-iot",
    },
    {
      name: "React User Cards Editor",
      desc: {
        en: "An array of 6 user objects (name, ID, address, image) displayed as clickable cards. Clicking a card opens a shared edit panel with labeled inputs (ID stays read-only) and a save button that updates the card's data.",
        he: "מערך של 6 אובייקטים (שם, ת.ז, כתובת, תמונה) המוצגים ככרטיסיות לחיצות. לחיצה על כרטיסייה פותחת מקטע עריכה משותף עם אינפוטים מתויגים (שדה ת.ז קבוע) וכפתור שמירה שמעדכן את פרטי הכרטיסייה.",
      },
      link: "https://github.com/MOHOHAMED02/react-user-cards-editor",
    },
  ];

  return (
    <motion.div
      className="page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ direction: lang === "he" ? "rtl" : "ltr" }}
    >
      <h1>{titles[lang].main}</h1>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <motion.div key={i} className="project-card" whileHover={{ scale: 1.05 }}>
            <h3>{p.name}</h3>
            <p>{p.desc[lang]}</p>
            <a href={p.link} target="_blank" rel="noreferrer" className="project-btn">
              {titles[lang].btn}
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------- 4. CONTACT & COLLABORATION ---------------- */
function Contact({ lang }) {
  const title = {
    en: "📞 Contact & Collaboration",
    he: "📞 צור קשר ושיתוף פעולה",
  };

  return (
    <motion.div
      className="page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ direction: lang === "he" ? "rtl" : "ltr" }}
    >
      <h1>{title[lang]}</h1>
      <div className="contact-grid">
        <a href="mailto:mohamed2002ahibli@gmail.com" className="contact-card">📧 Email</a>
        <a href="https://wa.me/972532427351" target="_blank" rel="noreferrer" className="contact-card">💬 WhatsApp</a>
      </div>
    </motion.div>
  );
}

/* ---------------- SMART NAV BUTTONS ---------------- */
function BottomButtons({ lang }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = ["/", "/skills", "/projects", "/contact"];
  const index = pages.indexOf(location.pathname);

  const labels = {
    en: { back: "⬅ Back", home: "🏠 Home", next: "➡ Next" },
    he: { back: "⬅ אחורה", home: "🏠 בית", next: "➡ קדימה" },
  };

  return (
    <div className="bottom-buttons" style={{ direction: lang === "he" ? "rtl" : "ltr" }}>
      {index > 0 && (
        <button onClick={() => navigate(pages[index - 1])}>
          {labels[lang].back}
        </button>
      )}

      <button onClick={() => navigate("/")}>{labels[lang].home}</button>

      {index < pages.length - 1 && (
        <button onClick={() => navigate(pages[index + 1])}>
          {labels[lang].next}
        </button>
      )}
    </div>
  );
}

/* ---------------- MAIN APP COMPONENT ---------------- */
export default function App() {
  const [lang, setLang] = useState("en");
  const location = useLocation();

  // --- עוגייה לכל משתמש שנכנס (נשמרת ל-30 יום) ---
  useEffect(() => {
    if (!Cookies.get('site_visit')) {
      Cookies.set('site_visit', 'active', { expires: 30, secure: true, sameSite: 'strict' });
    }
  }, []);

  const navLinks = {
    en: ["About Me", "Skills", "Projects", "Contact"],
    he: ["עליי", "שפות תוכנה", "פרוייקטים ", "צור קשר"],
  };

  return (
    <div>
      <div className="animated-bg" aria-hidden="true">
        <span className="blob blob-1"></span>
        <span className="blob blob-2"></span>
        <span className="blob blob-3"></span>
        <div className="stars"></div>
      </div>

      <nav className="nav" style={{ direction: lang === "he" ? "rtl" : "ltr" }}>
        <h2>Mohamed Shibli Portfolio 🚀</h2>
        <div className="links">
          <Link to="/">{navLinks[lang][0]} </Link>
          <Link to="/skills">{navLinks[lang][1]}</Link>
          <Link to="/projects">{navLinks[lang][2]}</Link>
          <Link to="/contact">{navLinks[lang][3]}</Link>
        </div>
      </nav>

      <div className="lang-bar">
        <button 
          onClick={() => setLang("en")} 
          className={lang === "en" ? "active" : ""}
        >
          English
        </button>
        <button 
          onClick={() => setLang("he")} 
          className={lang === "he" ? "active" : ""}
        >
          Hebrew
        </button>
      </div>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<About lang={lang} />} />
          <Route path="/skills" element={<Skills lang={lang} />} />
          <Route path="/projects" element={<Projects lang={lang} />} />
          <Route path="/contact" element={<Contact lang={lang} />} />
        </Routes>
      </AnimatePresence>

      <BottomButtons lang={lang} />
    </div>
  );
}
