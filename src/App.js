import { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

/* ---------------- ANIMATION ---------------- */
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 },
};

const pageTransition = {
  duration: 0.4,
};


/* ---------------- PROFESSIONAL OVERVIEW ---------------- */
function About({ lang }) {
  const text = {
    en: {
      title: "👨‍💻 About Me",
      desc: `Software Engineering Student (2nd Year) | Junior Full Stack Developer

I am a motivated Software Engineering student with a strong passion for modern technologies, system design, and full-stack development.

I specialize in building responsive and scalable web applications using technologies such as React, Node.js, JavaScript, HTML, CSS, and databases.

I enjoy solving complex problems, writing clean and maintainable code, and continuously learning new technologies in the software development world.

Currently seeking opportunities to grow as a Junior Developer and contribute to real-world projects in a professional environment.`,
    },
    he: {
      title: "👨‍💻 עליי",
      desc: `סטודנט להנדסת תוכנה שנה שנייה | מפתח Full Stack ג'וניור

אני סטודנט להנדסת תוכנה עם תשוקה חזקה לטכנולוגיה, פיתוח מערכות ותכנות מודרני.

מתמקד בפיתוח אפליקציות ווב מלאות (Full Stack) עם React, Node.js, JavaScript, HTML, CSS ובסיסי נתונים.

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
    >
      <h1>{text[lang].title}</h1>
      <p style={{ whiteSpace: "pre-line" }}>{text[lang].desc}</p>
    </motion.div>
  );
}

/* ---------------- ENGINEERING STACK ---------------- */
function Skills() {
  const skills = [
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
    { name: "QA Testing", icon: "🧪" },
  ];

  return (
    <motion.div
      className="page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <h1>🚀 Engineering Stack</h1>

      <div className="skills-grid">
        {skills.map((s, i) => (
          <motion.div key={i} className="skill-card" whileHover={{ scale: 1.08 }}>
            <div className="icon">{s.icon}</div>
            <div>{s.name}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------- PORTFOLIO SHOWCASE ---------------- */
function Projects() {
  const projects = [
    {
      name: "SIMON GAME ARDUINO",
      desc: "Arduino-based Simon Says game with LEDs and logic control.",
      link: "https://github.com/MOHOHAMED02/SIMON-GAME-ARDUINO",
    },
    {
      name: "Flying Square Game",
      desc: "JavaScript game with movement & collision mechanics.",
      link: "https://github.com/MOHOHAMED02/flying-square",
    },
    {
      name: "Memory Game",
      desc: "Classic memory card game built with JavaScript.",
      link: "https://github.com/MOHOHAMED02/memory-game",
    },
    {
      name: "Todo List App",
      desc: "Task manager with add, delete and complete features.",
      link: "https://github.com/MOHOHAMED02/finish-todo-list",
    },
    {
      name: "Project Rating System",
      desc: "System for rating and managing projects.",
      link: "https://github.com/MOHOHAMED02/project_rating_system",
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
    >
      <h1>💼 Portfolio Showcase</h1>

      <div className="projects-grid">
        {projects.map((p, i) => (
          <motion.div key={i} className="project-card" whileHover={{ scale: 1.05 }}>
            <h3>{p.name}</h3>
            <p>{p.desc}</p>

            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="project-btn"
            >
              🔗 View Project
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------- CONTACT & COLLABORATION ---------------- */
function Contact() {
  return (
    <motion.div
      className="page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <h1>📞 Contact & Collaboration</h1>

      <div className="contact-grid">
        <a href="mailto:mohamed2002ahibli@gmail.com" className="contact-card">
          📧 Email
        </a>

        <a
          href="https://wa.me/972532427351"
          target="_blank"
          rel="noreferrer"
          className="contact-card"
        >
          💬 WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

/* ---------------- NAV BUTTONS ---------------- */
function BottomButtons() {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = ["/", "/skills", "/projects", "/contact"];
  const index = pages.indexOf(location.pathname);

  return (
    <div className="bottom-buttons">
      <button onClick={() => navigate(index > 0 ? pages[index - 1] : "/")}>
        ⬅ Back
      </button>
      <button onClick={() => navigate("/")}>🏠 Home</button>
      <button
        onClick={() =>
          navigate(index < pages.length - 1 ? pages[index + 1] : "/contact")
        }
      >
        ➡ Next
      </button>
    </div>
  );
}

/* ---------------- APP ---------------- */
export default function App() {
  const [lang, setLang] = useState("en");
  const location = useLocation();

  return (
    <div>
      {/* NAV */}
      <nav className="nav">
        <h2>Mohamed Shibli Portfolio 🚀</h2>

        <div className="links">
          <Link to="/">About Me </Link>
          <Link to="/skills">Engineering Stack</Link>
          <Link to="/projects">Portfolio Showcase</Link>
          <Link to="/contact">Contact & Collaboration</Link>
        </div>
      </nav>

      {/* LANGUAGE */}
      <div className="lang-bar">
        <button onMouseEnter={() => setLang("en")}>English</button>
        <button onMouseEnter={() => setLang("he")}>Hebrew</button>
      </div>

      {/* ROUTES */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<About lang={lang} />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>

      <BottomButtons />
    </div>
  );
}