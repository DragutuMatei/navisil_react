import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(process.env.REACT_APP_P);
function StripeContainer({ammount}) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm ammount={ammount} />
    </Elements>
  );
}

export default StripeContainer;
