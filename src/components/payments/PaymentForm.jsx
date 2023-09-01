import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React from "react";
import { useState } from "react";
const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

function PaymentForm({ ammount }) {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const submit = async (e) => {
    e.preventDefault();
    console.log(ammount);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    console.log("111111111111111111");
    if (!error) {
      try {
        const { id } = paymentMethod;
        console.log("222222222", id);
        const response = await axios.post("http://localhost:4000/payment", {
          amount: ammount,
          id: id,
        });
        if (response.data.success) {
          console.log("ok");
          setSuccess(true);
        }
      } catch (error) {
        console.log("error", error);
      }
    } else {
      console.log("error2", error);
    }
  };

  return (
    <div>
      {!success ? (
        <form onSubmit={submit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <button>Pay</button>
        </form>
      ) : (
        <h2>ayaye</h2>
      )}
    </div>
  );
}

export default PaymentForm;
