import "./Contact.css";

function Contact() {
  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <p>Have questions or feedback? We’d love to hear from you.</p>

      <div className="contact-box">
        <input type="text" placeholder="Your name" />
        <input type="email" placeholder="Your email" />
        <textarea placeholder="Your message"></textarea>
        <button>Send Message</button>
      </div>
    </div>
  );
}

export default Contact;
