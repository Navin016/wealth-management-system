import { useEffect, useState } from "react";
import "./Home.css";

/* Quote of the Day */
const quoteOfTheDay = {
  text: "Do not save what is left after spending, but spend what is left after saving.",
  author: "Warren Buffett",
};

/* Trending Financial News */
const trendingNews = [
  {
    title: "Markets rise as inflation shows signs of cooling",
    source: "Financial Times",
  },
  {
    title: "Retirement planning gains focus among young investors",
    source: "Bloomberg",
  },
  {
    title: "Tech stocks lead gains in global markets",
    source: "Reuters",
  },
];

/* Services */
const services = [
  {
    title: "🎯 Goal Tracking",
    short: "Set and achieve financial goals.",
    detail:
      "Create short-term and long-term goals with milestone tracking and progress visualization.",
  },
  {
    title: "📈 Investment Planning",
    short: "Plan and grow investments.",
    detail:
      "Plan investments based on your risk profile and long-term financial objectives.",
  },
  {
    title: "📊 Portfolio Insights",
    short: "Understand portfolio performance.",
    detail:
      "Real-time portfolio analysis, asset allocation, and performance metrics.",
  },
  {
    title: "⚖️ Risk Profiling",
    short: "Balanced financial decisions.",
    detail:
      "Assess risk tolerance to personalize investment recommendations.",
  },
  {
    title: "🔐 Secure Transactions",
    short: "Safe and reliable system.",
    detail:
      "Enterprise-grade encryption and secure transaction handling.",
  },
];

function Home() {
  const [activeService, setActiveService] = useState(null);
  const [showAll, setShowAll] = useState(false);

  /* Scroll reveal animation */
  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) {
          el.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", reveal);
    reveal();

    return () => window.removeEventListener("scroll", reveal);
  }, []);

  /* Accordion toggle */
  const toggleService = (index) => {
    setActiveService((prev) => (prev === index ? null : index));
  };

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero reveal">
        <h1>Track Your Goals. Grow Your Wealth.</h1>
        <p>
          Plan your financial future, manage investments, and stay informed —
          all in one secure platform.
        </p>
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
          {trendingNews.map((news, index) => (
            <div className="news-card" key={index}>
              <h4>{news.title}</h4>
              <span>{news.source}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="features-section reveal">
        <h2>Our Services</h2>

        <div className="features">
          {services
            .slice(0, showAll ? services.length : 2)
            .map((service, index) => (
              <div
                key={index}
                className={`feature-card clickable ${
                  activeService === index ? "open" : ""
                }`}
                onClick={() => toggleService(index)}
              >
                <h3>{service.title}</h3>
                <p>{service.short}</p>

                <div className="service-detail">
                  <p>{service.detail}</p>
                </div>

                <span className="service-toggle">
                  {activeService === index
                    ? "Hide details"
                    : "View details"}
                </span>
              </div>
            ))}
        </div>

        {/* SHOW MORE / LESS */}
        <div
          className="expand-toggle"
          onClick={() => {
            setShowAll(!showAll);
            setActiveService(null); // close any open service
          }}
        >
          <span>
            {showAll ? "Show fewer services" : "Explore all services"}
          </span>
          <span className={`chevron ${showAll ? "rotate" : ""}`}>⌄</span>
        </div>
      </section>

    </div>
  );
}

export default Home;
