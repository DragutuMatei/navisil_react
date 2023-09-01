import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="container-fluid bg-dark text-secondary mt-5 pt-5">
      <div className="row px-xl-5 pt-5">
        <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
          <h5 className="text-secondary text-uppercase mb-4">Get In Touch</h5>
          <p className="mb-4">
            NAVISIL este o companie care crede în importanța
            serviciilor de calitate. Echipa NAVISIL
            vă va ajuta să găsiți produsul perfect și să vă asigurați că sunteți
            mulțumit de achiziția dumneavoastră.
          </p>
          <p className="mb-2">
            <i className="fa fa-map-marker-alt text-primary mr-3"></i>
            Str. Pasajul Unirii 2
          </p>
          <p className="mb-2">
            <i className="fa fa-envelope text-primary mr-3"></i>
            <a href="mailto: ivantecsite@gmail.com">ivantecsite@gmail.com</a>
          </p>
          <p className="mb-0">
            <i className="fa fa-phone-alt text-primary mr-3"></i>
            <a href="tel:762 888 863">762 888 863</a>
          </p>
        </div>
        <div className="col-lg-8 col-md-12">
          <div className="row">
            <div className="col-md-4 mb-5">
              <h5 className="text-secondary text-uppercase mb-4">Quick Shop</h5>
              <div className="d-flex flex-column justify-content-start">
                <a className="text-secondary mb-2" href="/">
                  <i className="fa fa-angle-right mr-2"></i>Home
                </a>
                <a className="text-secondary mb-2" href="/shop/all">
                  <i className="fa fa-angle-right mr-2"></i>Our Shop
                </a>
                <Link className="text-secondary mb-2" to="/cart">
                  <i className="fa fa-angle-right mr-2"></i>Shopping Cart
                </Link>
                <Link className="text-secondary" to="/contact">
                  <i className="fa fa-angle-right mr-2"></i>Contact Us
                </Link>
              </div>
            </div>
            <div className="col-md-4 mb-5">
              <h5 className="text-secondary text-uppercase mb-4">Documents</h5>
              <div className="d-flex flex-column justify-content-start">
                <a
                  className="text-secondary mb-2"
                  target="_blank"
                  href="https://www.privacypolicygenerator.info/live.php?token=9bKCKkYtNFrLxEXPOCt8vFYqyfKd1ftw"
                >
                  <i className="fa fa-angle-right mr-2"></i>Privacy Policy
                </a>
                <a
                  className="text-secondary mb-2"
                  target="_blank"
                  href="https://www.termsandconditionsgenerator.com/live.php?token=nFeOTKuVre1uiQZZXarYuqbMeZEucb0P"
                >
                  <i className="fa fa-angle-right mr-2"></i>Terms and Conditions
                </a>
                <Link
                  className="text-secondary mb-2"
                  target="_blank"
                  to="/return"
                >
                  <i className="fa fa-angle-right mr-2"></i>Return Policy
                </Link>
                <a
                  href="https://anpc.ro/ce-este-sal/"
                  target="_blank"
                  className="text-secondary mb-2"
                  rel="noopener"
                  title="ANPC Soluționarea alternativă a litigiilor"
                >
                  <img
                    width="201"
                    height="50"
                    loading="lazy"
                    src={require("../img/legals/SAL.png")}
                    alt="Soluționarea alternativă a litigiilor"
                  />
                </a>
                <a
                  className="text-secondary mb-2"
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener"
                  title="Soluționarea online a litigiilor"
                >
                  <img
                    width="201"
                    height="50"
                    loading="lazy"
                    src={require("../img/legals/SOL.png")}
                    alt="Soluționarea online a litigiilor"
                  />
                </a>
                {/* <a className="text-secondary mb-2" href="#">
                  <i className="fa fa-angle-right mr-2"></i>Shopping Cart
                </a>
                <a className="text-secondary mb-2" href="#">
                  <i className="fa fa-angle-right mr-2"></i>Checkout
                </a>
                <a className="text-secondary" href="#">
                  <i className="fa fa-angle-right mr-2"></i>Contact Us
                </a> */}
              </div>
            </div>
            {/* <div className="col-md-4 mb-5">
              <h5 className="text-secondary text-uppercase mb-4">Newsletter</h5>
              <p>Duo stet tempor ipsum sit amet magna ipsum tempor est</p>
              <form action="">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Email Address"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary">Sign Up</button>
                  </div>
                </div>
              </form>
              <h6 className="text-secondary text-uppercase mt-4 mb-3">
                Follow Us
              </h6>
              <div className="d-flex">
                <a className="btn btn-primary btn-square mr-2" href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a className="btn btn-primary btn-square mr-2" href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="btn btn-primary btn-square mr-2" href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a className="btn btn-primary btn-square" href="#">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div
        className="row border-top mx-xl-5 py-4"
        style={{ borderColor: " rgba(256, 256, 256, .1)!important " }}
      >
        <div className="col-md-6 px-xl-0">
          <p className="mb-md-0 text-center text-md-left text-secondary">
            &copy;
            <a className="text-primary" href="#">
              Ivantec
            </a>
            . All Rights Reserved. Designed by Matei Dragutu
          </p>
        </div>
        {/* <div className="col-md-6 px-xl-0 text-center text-md-right">
          <img
            className="img-fluid"
            src={require("../img/payments.png")}
            alt=""
          />
        </div> */}
      </div>
    </div>
  );
}

export default Footer;
