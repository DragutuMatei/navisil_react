import React, { useState } from "react";
import { Link } from "react-router-dom";
import Firestore from "../js/Firestore";

const firestore = new Firestore();

function Contact() {
  const [message, setMessage] = useState({
    nume: "",
    email: "",
    subject: "",
    message: "",
    date: new Date().toUTCString(),
  });

  const handlemessage = (id, data) => {
    setMessage((old) => ({ ...old, [id]: data }));
  };

  const submit = async () => {
    if (
      message.email === "" ||
      message.nume === "" ||
      message.message === "" ||
      message.subject === ""
    ) {
      alert("Completeaza toate campurile");
      return;
    } else
      await firestore.uploadmessage(message).then((res) => {
        if (res) {
          document.querySelectorAll(".form-control").forEach(input => {
            input.value = "";
          })
          alert("mesaj trimis");
        } else {
          alert("eroare");
        }
      });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <Link className="breadcrumb-item text-dark" to={"/"}>
                Home
              </Link>
              <span className="breadcrumb-item active">Contact</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
          <span className="bg-secondary pr-3">Contact Us</span>
        </h2>
        <div className="row px-xl-5">
          <div className="col-lg-7 mb-5">
            <div className="contact-form bg-light p-30">
              <div id="success"></div>
              <div name="sentMessage" id="contactForm">
                <div className="control-group">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    onChange={(e) => handlemessage("nume", e.target.value)}
                    required
                    placeholder="Your Name"
                    data-validation-required-message="Please enter your name"
                  />
                  <p className="help-block text-danger"></p>
                </div>
                <div className="control-group">
                  <input
                    required
                    type="email"
                    className="form-control"
                    id="email"
                    onChange={(e) => handlemessage("email", e.target.value)}
                    placeholder="Your Email"
                    data-validation-required-message="Please enter your email"
                  />
                  <p className="help-block text-danger"></p>
                </div>
                <div className="control-group">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => handlemessage("subject", e.target.value)}
                    id="subject"
                    placeholder="Subject"
                    required
                    data-validation-required-message="Please enter a subject"
                  />
                  <p className="help-block text-danger"></p>
                </div>
                <div className="control-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    onChange={(e) => handlemessage("message", e.target.value)}
                    id="message"
                    placeholder="Message"
                    required
                    data-validation-required-message="Please enter your message"
                  ></textarea>
                  <p className="help-block text-danger"></p>
                </div>
                <div>
                  <button
                    className="btn btn-primary py-2 px-4"
                    type="submit"
                    onClick={submit}
                    id="sendMessageButton"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 mb-5">
            <div className="bg-light p-30 mb-30">
              <iframe
                style={{ width: "100%", height: "250px" }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                frameBorder={0}
                // allowfullscreen=""
                aria-hidden={false}
                tabIndex={0}
              ></iframe>
            </div>
            <div className="bg-light p-30 mb-3">
              <p className="mb-2">
                <i className="fa fa-map-marker-alt text-primary mr-3"></i>123
                Street, New York, USA
              </p>
              <p className="mb-2">
                <i className="fa fa-envelope text-primary mr-3"></i>
                <a href="mailto: info@example.com">info@example.com</a>
              </p>
              <p className="mb-2">
                <i className="fa fa-phone-alt text-primary mr-3"></i>{" "}
                <a href="tel:012 345 67890">+012 345 67890</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <a href="#" className="btn btn-primary back-to-top">
        <i className="fa fa-angle-double-up"></i>
      </a>
    </>
  );
}

export default Contact;
