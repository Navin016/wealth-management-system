import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";

/* Quote */
const quoteOfTheDay = {
  text: "Do not save what is left after spending, but spend what is left after saving.",
  author: "Warren Buffett",
};

/* News */
const trendingNews = [
  { title: "Markets rise as inflation shows signs of cooling", source: "Financial Times" },
  { title: "Retirement planning gains focus among young investors", source: "Bloomberg" },
  { title: "Tech stocks lead gains in global markets", source: "Reuters" },
];

/* Services */
const services = [
  {
    id: 1,
    title: "🎯 Goal Tracking",
    short: "Set and achieve financial goals.",
    detail: "Create short-term and long-term goals with milestone tracking.",
  },
  {
    id: 2,
    title: "📈 Investment Planning",
    short: "Plan and grow investments.",
    detail: "Personalized investment planning based on risk profile.",
  },
  {
    id: 3,
    title: "📊 Portfolio Insights",
    short: "Understand portfolio performance.",
    detail: "Real-time portfolio analytics and performance metrics.",
  },
  {
    id: 4,
    title: "⚖️ Risk Profiling",
    short: "Balanced financial decisions.",
    detail: "Risk assessment for smarter financial planning.",
  },
  {
    id: 5,
    title: "🔐 Secure Transactions",
    short: "Safe and reliable system.",
    detail: "Enterprise-grade encryption and secure handling.",
  },
];

function Home() {
  const [activeService, setActiveService] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) {
          el.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  const toggleService = (id) => {
    setActiveService((prev) => (prev === id ? null : id));
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="home">
      {/* HERO */}
      <section
        id="hero"
        className="hero-shell reveal"
      >
        <div className="hero-grid">
          {/* Left hero copy */}
          <div
            className={`hero-left ${
              heroVisible ? "hero-left-visible" : "hero-left-hidden"
            }`}
          >
            <div className="hero-pill">
              <span className="hero-pill-dot-outer">
                <span className="hero-pill-dot-inner" />
              </span>
              Wealth system v1.0 online
            </div>

            <h1 className="hero-title">
              <span className="hero-title-gradient animate-text-shimmer">
                TRACK YOUR
              </span>
              <br />
              <span className="hero-title-gradient animate-text-shimmer">
                WEALTH
              </span>
              <br />
            <span className="hero-title-gradient animate-text-shimmer">
                SMARTLY
              </span>
            </h1>

            <p className="hero-subtitle-text">
              Plan your financial future, automate savings, and monitor investments in one modern
              dashboard.
            </p>

            <div className="hero-buttons">
              <button
                onClick={() => scrollToId("services")}
                className="hero-btn-primary"
              >
                <span className="hero-btn-primary-shine" />
                <span className="hero-btn-primary-inner">
                  Explore Features <span className="hero-btn-arrow">→</span>
                </span>
              </button>

              <button
                onClick={() => scrollToId("news")}
                className="hero-btn-secondary"
              >
                View Market News
              </button>
            </div>
          </div>

          {/* Right hero CLI card with tilt */}
          <div
            className={`hero-right ${
              heroVisible ? "hero-right-visible" : "hero-right-hidden"
            }`}
          >
            <div className="tilt-wrapper">
              <div className="tilt-card">
                <div className="tilt-card-header">
                  <div className="tilt-lights">
                    <div className="tilt-light red" />
                    <div className="tilt-light yellow" />
                    <div className="tilt-light green" />
                  </div>
                  <div className="tilt-title">CLI // WEALTH-TRACK</div>
                </div>

                <div className="tilt-body">
                  <div className="tilt-line">
                    <span className="tilt-user">user@wealth:~$</span>
                    <span className="tilt-command">init_goals.sh</span>
                  </div>
                  <div className="tilt-status">
                    &gt; Syncing accounts... <span className="tilt-done">Done</span>
                  </div>
                  <div className="tilt-status">
                    &gt; Calculating savings rate... <span className="tilt-done">Done</span>
                  </div>
                  <div className="tilt-status">&gt; Generating insights...</div>

                  <div className="tilt-callout">
                    <div className="tilt-callout-title">DASHBOARD READY</div>
                    <div className="tilt-callout-text">
                      Your portfolio, goals, and cashflow in one place—updated in real time.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-section reveal">
        <h2>Quote of the Day</h2>
        <p className="quote-text">“{quoteOfTheDay.text}”</p>
        <p className="quote-author">— {quoteOfTheDay.author}</p>
      </section>

      {/* NEWS */}
      <section id="news" className="news-section reveal">
        <div className="section-header">
          <h2>📈 Trending Financial News</h2>
        </div>
        <div className="news-list">
          {trendingNews.map((n, i) => (
            <article className="news-card" key={i}>
              <h4>{n.title}</h4>
              <span>{n.source}</span>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURES / SERVICES */}
      <section id="services" className="features-section reveal">
        <div className="section-header">
          <h2>Our Services</h2>
          <p className="section-subtitle">
            Tools designed to give you clarity and control over your money.
          </p>
        </div>

        <div className="features">
          {services.slice(0, showAll ? services.length : 3).map((s) => {
            const isOpen = activeService === s.id;

            return (
              <div
                key={s.id}
                className={`feature-card ${isOpen ? "open" : ""}`}
                onClick={() => toggleService(s.id)}
              >
                <div className="feature-card-header">
                  <div className="feature-icon">{s.title.split(" ")[0]}</div>
                  <div className="feature-meta">
                    <h3>{s.title}</h3>
                    <p className="feature-short">{s.short}</p>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="service-detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p>{s.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  className="service-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleService(s.id);
                  }}
                >
                  {isOpen ? "Hide details" : "View details"}
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="expand-toggle"
          onClick={() => {
            setShowAll(!showAll);
            setActiveService(null);
          }}
        >
          <span>{showAll ? "Show fewer services" : "Explore all services"}</span>
          <span className={`chevron ${showAll ? "rotate" : ""}`}>⌄</span>
        </button>
      </section>
    </div>
  );
}

export default Home;