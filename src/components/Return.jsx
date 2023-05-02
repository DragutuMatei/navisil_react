import React from "react";

function Return() {
  return (
    <div
      style={{
        margin: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>
        Thanks for shopping at{" "}
        <a href=" https://navisil.herokuapp.com/"> Navisil</a>.
      </h1>
      <h3>
        If you’re looking to return or exchange your order for whatever reason,
        we're here to help.
      </h3>
      <h3>GENERAL RETURN POLICY</h3>
      <p>
        All returns must be postmarked within 14 days from the fulfillment date.
      </p>

      <p>Refund to original payment method</p>
      <ul>
        <li>We offer the following return resolutions:</li>
        <li>
          Make sure your returns are unused and undamaged. You should include
          Return items, Proof of purchase in the return package.
        </li>
      </ul>
      <p>Available shipping methods are: My company pays</p>
      <p>
        Please return items to this address: Str. Pasajul Unirii 2, Tecuci
        805300 Tecuci Galati Romania
      </p>
      <h3>HOW TO INITIATE A RETURN</h3>
      <p>
        If you want a return, refund, or exchange, and if you have further
        questions, feel free to contact us
        <br />
        Contact Form URL : https://navisil.herokuapp.com/contact
        <br />
        After receiving your return request, we will process it within 2 days.
        You’ll be notified of the return status By email.
      </p>
    </div>
  );
}

export default Return;
