import "./Contact.css";

function Contact() {
  return (
    <div className="contact-wrapper">

      <div className="contact-card">

        <h2>Contact Us</h2>

        <p className="contact-subtitle">
          Have questions or feedback? We’d love to hear from you.
        </p>

        <form className="contact-form">

          {/* NAME */}
          <div className="floating-group">
            <input
              type="text"
              placeholder=" "
              required
            />
            <label>Your Name</label>
          </div>

          {/* EMAIL */}
          <div className="floating-group">
            <input
              type="email"
              placeholder=" "
              required
            />
            <label>Your Email</label>
          </div>

          {/* MESSAGE */}
          <div className="floating-group">
            <textarea
              rows={4}
              placeholder=" "
              required
            />
            <label>Your Message</label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="contact-btn"
          >
            Send Message
          </button>

        </form>

      </div>

    </div>
  );
}

export default Contact;
