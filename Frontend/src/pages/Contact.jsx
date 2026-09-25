import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Leaf,
} from 'lucide-react'
import { FaGithub, FaYoutube } from "react-icons/fa";
import '../styles/Contact.css'
import ContactImg from '../assets/contactimg.png'
const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">

        <section className="contact-intro">
          <h1>যোগাযোগ</h1>

          <p>
            কোনো পরামর্শ, সহযোগিতা, মতামত অথবা প্রশ্ন থাকলে
            আমাদের সঙ্গে যোগাযোগ করুন। আপনার বার্তা আমাদের
            কাছে গুরুত্বপূর্ণ।
          </p>
        </section>

        <section className="contact-body">
          <h2>আমাদের ঠিকানা</h2>
          <div className="contact-info">

            

            <div className="contact-list">

              <a
                href="mailto:hello@odhyay.com"
                className="contact-item"
              >
                <span className="contact-icon">
                  <Mail size={19} strokeWidth={1.7} />
                </span>

                <span className="contact-item-content">
                  <small>ইমেইল</small>
                  <strong>info@odhyay.com</strong>
                </span>

                <ArrowUpRight
                  className="contact-arrow"
                  size={17}
                  strokeWidth={1.7}
                />
              </a>

              <a
                href="tel:+8801234567890"
                className="contact-item"
              >
                <span className="contact-icon">
                  <Phone size={19} strokeWidth={1.7} />
                </span>

                <span className="contact-item-content">
                  <small>ফোন</small>
                  <strong>+৮৮০ ১২৩৪ ৫৬৭৮৯০</strong>
                  <em>সকাল ১০টা — সন্ধ্যা ৭টা</em>
                </span>

                <ArrowUpRight
                  className="contact-arrow"
                  size={17}
                  strokeWidth={1.7}
                />
              </a>

              <div className="contact-item">
                <span className="contact-icon">
                  <MapPin size={19} strokeWidth={1.7} />
                </span>

                <span className="contact-item-content">
                  <small>ঠিকানা</small>
                  <strong>ঢাকা, বাংলাদেশ</strong>
                </span>
              </div>

            </div>

            <div className="contact-divider" />

            <div className="contact-social">
              <div className="social-heading">
                <Leaf size={21} strokeWidth={1.6} />
                <div>
                  <h3>সঙ্গে থাকুন</h3>
                  <p>
                    নতুন প্রকাশনা, আপডেট এবং অন্যান্য
                    খবর পেতে আমাদের সঙ্গে থাকুন।
                  </p>
                </div>
              </div>

              <div className="social-links">
                <a
                  href="#"
                  aria-label="GitHub"
                  className="social-link"
                >
                  <FaGithub size={18} strokeWidth={1.8} />
                </a>

                <a
                  href="#"
                  aria-label="Facebook"
                  className="social-link"
                >
                  <span className="facebook-icon">f</span>
                </a>
                <a href="https://www.youtube.com" className='social-link' aria-label='Youtube'>
                    <FaYoutube size={18} strokeWidth={1.8}/>
                </a>
              </div>
            </div>

          </div>

        </section>
      </div>
      <div className="contact-hero">
        <img src={ContactImg} alt="" />
      </div>
    </div>
  )
}

export default Contact