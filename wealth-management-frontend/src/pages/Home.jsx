import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
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

/* Services (WITH UNIQUE IDs) */
const services = [
  {
    id: 1,
    title: "🎯 Goal Tracking",
    short: "Set and achieve financial goals.",
    detail: "Create short-term and long-term goals with milestone tracking."
  },
  {
    id: 2,
    title: "📈 Investment Planning",
    short: "Plan and grow investments.",
    detail: "Personalized investment planning based on risk profile."
  },
  {
    id: 3,
    title: "📊 Portfolio Insights",
    short: "Understand portfolio performance.",
    detail: "Real-time portfolio analytics and performance metrics."
  },
  {
    id: 4,
    title: "⚖️ Risk Profiling",
    short: "Balanced financial decisions.",
    detail: "Risk assessment for smarter financial planning."
  },
  {
    id: 5,
    title: "🔐 Secure Transactions",
    short: "Safe and reliable system.",
    detail: "Enterprise-grade encryption and secure handling."
  },
];

function Home() {
  const [activeService, setActiveService] = useState(null);
  const [showAll, setShowAll] = useState(false);

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

  /* TRUE ACCORDION LOGIC */
  const toggleService = (id) => {
    setActiveService(prev => (prev === id ? null : id));
  };

  return (
    <>
    <div className="home">

      {/* HERO */}
      <section className="hero reveal">
        <h1>Track Your Goals. Grow Your Wealth.</h1>
        <p>Plan your financial future, manage investments, and stay informed.</p>
      </section>

      {/* QUOTE */}
      <section className="quote-section reveal">
        <h2>Quote of the Day</h2>
        <p className="quote-text">“{quoteOfTheDay.text}”</p>
        <p className="quote-author">— {quoteOfTheDay.author}</p>
      </section>

      {/* NEWS */}
      <section className="news-section reveal">
        <h2>📈 Trending Financial News</h2>
        <div className="news-list">
          {trendingNews.map((n, i) => (
            <div className="news-card" key={i}>
              <h4>{n.title}</h4>
              <span>{n.source}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section reveal">
        <h2>Our Services</h2>

        <div className="features">
          {services.slice(0, showAll ? services.length : 2).map((s) => {
            const isOpen = activeService === s.id;

            return (
              <div
                key={s.id}
                className={`feature-card clickable ${isOpen ? "open" : ""}`}
                onClick={() => toggleService(s.id)}
              >
                <h3>{s.title}</h3>
                <p>{s.short}</p>

                {/* SMOOTH HEIGHT ANIMATION */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="service-detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <p>{s.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <span className="service-toggle">
                  {isOpen ? "Hide details" : "View details"}
                </span>
              </div>
            );
          })}
        </div>

        {/* EXPAND ALL */}
        <div
          className="expand-toggle"
          onClick={() => {
            setShowAll(!showAll);
            setActiveService(null);
          }}
        >
          <span>{showAll ? "Show fewer services" : "Explore all services"}</span>
          <span className={`chevron ${showAll ? "rotate" : ""}`}>⌄</span>
        </div>
      </section>
    </div>
       <Footer />
      </>
  );
}

export default Home;
