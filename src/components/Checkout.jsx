import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Firestore from "../js/Firestore";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";

const firestore = new Firestore();
const auth = getAuth();

function Checkout({ finish, fixCant }) {
  const [loading_send, setLoadingSend] = useState(false);
  const form = useRef();
  const [user, loading, error] = useAuthState(auth);
  const [products, setP] = useState([]);
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState(1);
  const [hidden, setHidden] = useState([]);
  const [ship, setShip] = useState(50);

  const navigate = useNavigate();

  const modi = (by) => {
    if ((value >= 1 && by > 0) || value >= 2) setValue((old) => old + by);
  };

  const signInWithGoogle = async () => {
    await firestore.signInWithGoogle();
  };
  const ok = async () => {
    // console.log(user);
    let resp = await firestore.getProductByUser(user);
    setP(resp.cant);
    console.log(resp.cant);
    setHidden([]);
    resp.cant.map((res) => {
      // console.log({ cant: res.cant, pret: res.pret, name: res.nume });
      setHidden((old) => [
        ...old,
        { id: res.id, cant: res.cant, pret: res.pret, name: res.nume },
      ]);
    });
    setTotal(resp.total);

    if (resp.total > 1000) setShip(0);
    else setShip(50);
  };
  useEffect(() => {
    ok();
  }, [user]);
  const [isfull, setfull] = useState(false);
  const sendEmail = async (e) => {
    e.preventDefault();
  };

  const handleToken = async (token) => {
    try {
      setLoadingSend(true);
      const response = await axios.post(process.env.REACT_APP_URL, {
        token,
        amount: (total + ship) * 100,
      });
      if (response.data.ok) {
        alert(response.data.message);
        let a = `<div>
            <h3>Products: </h3>
            <ul>`;
        hidden.map((h) => {
          a += `<li>  ${JSON.stringify(h.name)}: ${JSON.stringify(h.cant)} x
               ${JSON.stringify(h.pret)} </li>`;
        });
        const {
          first_name,
          last_name,
          email,
          tel,
          adress1,
          adress2,
          oras,
          zip,
          diff,
          nume1,
          nume2,
          email2,
          tel2,
          adress11,
          adress12,
          oras1,
          zip1,
        } = form.current.elements;
        a += `</ul>
                  <h2>Pret final: ${(total + ship).toLocaleString("en-US")}</h2>
                  <h3>email: <span>${email.value}</span> </h3>
                  <h4>tel: <span>${tel.value}</span></h4>
                  <h4>adress: <span>${adress1.value}, ${
          adress2.value
        }</span></h4>
                  <h4>oras: <span>${oras.value}</span></h4>
                  <h4>zip: <span>${zip.value}</span></h4>
                  <br/>
                  ${
                    diff.checked
                      ? `
                  <h4>Ship to a diff adress? <span>${diff.checked}</span></h4>
                  <h4>shipping to:
                  <h4>nume: <span>${nume1.value} ${nume2.value}</span></h4>
                  <h4>email: <span>${email2.value}</span></h4>
                  <h4>tel: <span>${tel2.value}</span></h4>
                  <h4>adress: <span>${adress11.value}, ${adress12.value}</span></h4>
                  <h4>oras: <span>${oras1.value}</span></h4>
                  <h4>zip: <span>${zip1.value}</span></h4>
                  <br/>`
                      : ""
                  }
            </div>`;
        const templateParams = {
          template: a,
          last_name: last_name.value,
          first_name: first_name.value,
          email: email.value,
          factura: `<a href="${response.data.charge.receipt_url}">Downloadeaza factura</a>`,
        };
        await emailjs
          .send(
            process.env.REACT_APP_SERVICEID_EMAIL,
            process.env.REACT_APP_TEMPLATEID_EMAIL,
            templateParams,
            process.env.REACT_APP_PUBLICKEY_EMAIL
          )
          .then(
            async (result) => {
              console.log(result);
              if (result.status == 200) {
                alert("comanda plasata");
                await finish().then(async (res) => {
                  await fixCant(hidden).then((res) => {
                    navigate("/shop/all");
                  });
                });
              } else {
                alert("a intervenit o problema la plasarea comenzii");
              }
            },
            (error) => {
              console.log(error.text);
              alert(error.text);
            }
          );
      }
      // console.log(response.data, response.data.charge.receipt_url);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
    setLoadingSend(false);
  };

  const test = () => {
    if (
      form.current &&
      form.current.elements &&
      form.current.elements.first_name.value != "" &&
      form.current.elements.last_name.value != "" &&
      form.current.elements.email.value != "" &&
      form.current.elements.tel.value != "" &&
      form.current.elements.adress1.value != "" &&
      form.current.elements.adress2.value != "" &&
      form.current.elements.oras.value != "" &&
      form.current.elements.zip.value != ""
    ) {
      setfull(true);
    } else {
      alert("Completeaza toate campurile!");
    }
  };
  return (
    <>
      {!loading && !user && <Navigate to="/" />}
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <Link className="breadcrumb-item text-dark" to="/">
                Home
              </Link>
              <span className="breadcrumb-item active">Checkout</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="bg-light p-30 mb-5">
          <div className="border-bottom">
            <h6 className="mb-3">Products</h6>
            {products &&
              products.map((prod) => {
                return (
                  <div
                    key={prod.id}
                    className="d-flex justify-content-between mb-2 rand"
                    style={{ alignItems: "center" }}
                  >
                    <Link to={`/prod/${prod.id}`}>
                      <p>{prod.nume}</p>
                    </Link>
                    <p style={{ margin: 0, textAlign: "end" }}>
                      {prod.cant.toLocaleString("en-US")} x{" "}
                      {prod.pret.toLocaleString("en-US")} RON
                    </p>
                  </div>
                );
              })}
          </div>
          <div className="border-bottom pt-3 pb-2">
            <div className="d-flex justify-content-between mb-3">
              <h6>Subtotal</h6>
              <h6>{total.toLocaleString("en-US")} RON</h6>
            </div>
            <div className="d-flex justify-content-between">
              <h6 className="font-weight-medium">Shipping</h6>
              <h6 className="font-weight-medium">
                {ship.toLocaleString("en-US")} RON
              </h6>
            </div>
          </div>
          <div className="pt-2">
            <div className="d-flex justify-content-between mt-2">
              <h5>Total</h5>
              <h5>{(total + ship).toLocaleString("en-US")} RON</h5>
            </div>
          </div>
        </div>
        <form ref={form} onSubmit={sendEmail} className="row px-xl-5">
          <div className="col-lg-8">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Billing Address</span>
            </h5>
            <div className="bg-light p-30 mb-5">
              <div className="row">
                <div className="col-md-6 form-group">
                  <label>First Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="first_name"
                    placeholder="John"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Last Name</label>
                  <input
                    name="last_name"
                    className="form-control"
                    type="text"
                    placeholder="Doe"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>E-mail</label>
                  <input
                    className="form-control"
                    type="text"
                    name="email"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Mobile No</label>
                  <input
                    className="form-control"
                    type="text"
                    name="tel"
                    placeholder="+123 456 789"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Address Line 1</label>
                  <input
                    name="adress1"
                    className="form-control"
                    type="text"
                    placeholder="123 Street"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Address Line 2</label>
                  <input
                    name="adress2"
                    className="form-control"
                    type="text"
                    placeholder="123 Street"
                  />
                </div>

                <div className="col-md-6 form-group">
                  <label>City</label>
                  <input
                    className="form-control"
                    type="text"
                    name="oras"
                    placeholder="New York"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>ZIP Code</label>
                  <input
                    className="form-control"
                    type="text"
                    name="zip"
                    placeholder="123"
                  />
                </div>
                <div className="col-md-12">
                  <div className="custom-control custom-checkbox">
                    <input
                      name="diff"
                      type="checkbox"
                      className="custom-control-input"
                      id="shipto"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="shipto"
                      data-toggle="collapse"
                      data-target="#shipping-address"
                    >
                      Ship to different address
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse mb-5" id="shipping-address">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">Shipping Address</span>
              </h5>
              <div className="bg-light p-30">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>First Name</label>
                    <input
                      name="nume1"
                      className="form-control"
                      type="text"
                      placeholder="John"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Last Name</label>
                    <input
                      className="form-control"
                      type="text"
                      name="nume2"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>E-mail</label>
                    <input
                      name="email2"
                      className="form-control"
                      type="text"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Mobile No</label>
                    <input
                      className="form-control"
                      name="tel2"
                      type="text"
                      placeholder="+123 456 789"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Address Line 1</label>
                    <input
                      className="form-control"
                      type="text"
                      name="adress11"
                      placeholder="123 Street"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Address Line 2</label>
                    <input
                      className="form-control"
                      name="adress12"
                      type="text"
                      placeholder="123 Street"
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label>City</label>
                    <input
                      className="form-control"
                      type="text"
                      name="oras1"
                      placeholder="New York"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>ZIP Code</label>
                    <input
                      className="form-control"
                      name="zip1"
                      type="text"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="mb-5">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">Payment</span>
              </h5>
              <div className="bg-light p-30">
                {/* <div className="form-group">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      name="ramburs"
                      id="ramburs"
                    />
                    <label
                      data-toggle="collapse"
                      data-target="#ramburss"
                      className="custom-control-label"
                      htmlFor="ramburs"
                    >
                      Ramburs
                    </label>
                  </div>
                  <div className="collapse mb-5" id="ramburss">
                    ladnfdlnkdslfnl
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      name="paypal"
                      id="paypal"
                    />
                    <label className="custom-control-label" htmlFor="paypal">
                      Paypal
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      name="direct"
                      id="directcheck"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="directcheck"
                    >
                      Direct Check
                    </label>
                  </div>
                </div>
                <div className="form-group mb-4">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      name="transfer"
                      id="banktransfer"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="banktransfer"
                    >
                      Bank Transfer
                    </label>
                  </div>
                </div> */}

                {isfull ? (
                  <StripeCheckout
                    token={handleToken}
                    stripeKey="pk_test_51NhBUiHMkFCUWYGvyOj0PR3sOdkdsGUCW4IMeYGuU2uTGI5EqQopbRdyRjWD1Dnd0NgqpuJ7sSRBSkYVOZljcugw00SmNU6Hoq"
                    amount={(total + ship) * 100}
                    allowRememberMe={true}
                    currency="RON"
                    name="Online Payment Site"
                    shippingAddress={true}
                    zipCode={true}
                  >
                    <button
                      type="submit"
                      className="btn btn-block btn-primary font-weight-bold py-3"
                    >
                      Place Order
                    </button>
                  </StripeCheckout>
                ) : (
                  <button
                    onClick={test}
                    className="btn btn-block btn-primary font-weight-bold py-3"
                  >
                    Verifica adresa
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* <StripeContain/er ammount={total + ship} /> */}

      <a href="#" className="btn btn-primary back-to-top">
        <i className="fa fa-angle-double-up"></i>
      </a>
    </>
  );
}

export default Checkout;
