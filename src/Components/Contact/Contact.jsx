import { Link } from "react-router-dom";
import SectionTitle from "../../Utils/SectionTitle/SectionTitle";
import "./Contact.css";
import {
  FaPhoneAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import emailjs from "@emailjs/browser";

import { useRef, useState } from "react";
import ScrollFadeIn from "../../Utils/ScrollFadeIn/ScrollFadeIn";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);

    emailjs
      .send(
        "service_977nvt4",
        "template_ee2my7r",
        {
          from_name: form.name,
          to_name: "Shanjid Ahmad",
          from_email: form.email,
          to_email: "captainlevi9111@gmail.com",
          message: form.message,
        },
        "hAmNIWUNjWyyYlT9V"
      )
      .then(() => {
        alert(`Message sent`);

        setForm({
          name: "",
          emali: "",
          message: "",
        });
      })((error) => console.log(error));
  };

  return (
    <section id="contact">
      <SectionTitle heading="contact" subHeading="Get In Touch"></SectionTitle>
      <ScrollFadeIn>
        <div className="contact-container">
          {/* address */}
          <div className="address mt-12 md:text-left text-center">
            <h4 className="md:text-3xl text-white mb-4 uppercase">Address</h4>
            <p className="text-[#dee3e4] md:text-2xl mb-3">
              Chandpur, <br /> Chattagram, Bangladesh
            </p>
            <span className="flex space-x-3">
              <FaPhoneAlt className="w-6 h-6 text-emerald-500" />{" "}
              <p className="text-[#dee3e4] md:text-[20px]">+08801879648959</p>
            </span>
            <span className="flex space-x-3 mt-3 md:text-[20px]">
              <HiMail className="w-6 h-6 text-emerald-500" />{" "}
              <p className="text-[#dee3e4]">shanjidahmad502@gmail.com</p>
            </span>
            <h4 className="md:text-3xl text-white my-4 uppercase">Follow Me</h4>
            <div className="flex space-x-4">
              <Link
                to="https://www.facebook.com/profile.php?id=100082285091166&mibextid=ZbWKwL"
                target="_blank"
              >
                <FaFacebook className="w-6 h-6 text-gray-500" />{" "}
              </Link>
              <Link to="https://github.com/Levi9111" target="_blank">
                <FaGithub className="w-6 h-6 text-gray-500" />{" "}
              </Link>
              <Link
                to="https://www.linkedin.com/in/shanjid-ahmad-b77b5427b"
                target="_blank"
              >
                <FaLinkedin className="w-6 h-6 text-gray-500" />{" "}
              </Link>
              <Link to="https://twitter.com/shanjid9111" target="_blank">
                <FaTwitter className="w-6 h-6 text-gray-500" />{" "}
              </Link>
            </div>
          </div>

          <div className="message">
            <h4 className="md:text-3xl text-white mb-4 uppercase">
              Message me your thoughts
            </h4>

            {/* form */}
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="md:space-x-4 space-y-4 md:space-y-0 flex flex-wrap md:flex-nowrap mb-4 ">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  id=""
                  onChange={handleChange}
                  placeholder="Name"
                  className="md:w-1/2 w-full p-3 rounded-md "
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  id=""
                  placeholder="Email"
                  className="md:w-1/2 w-full p-3 rounded-md "
                />
              </div>
              <textarea
                className="w-full p-3 rounded-md "
                name="message"
                value={form.message}
                onChange={handleChange}
                id=""
                rows="8"
                placeholder="Tell us your need......"
              ></textarea>

              <input type="submit" value="Send Message" />
            </form>
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
};

export default Contact;
