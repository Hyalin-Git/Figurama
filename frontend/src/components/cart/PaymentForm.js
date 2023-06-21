import React, { useEffect, useState } from "react";
import {
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useQuery } from "../../utils/urlQuery";

const PaymentForm = () => {
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const stripe = useStripe();
	const elements = useElements();
	let query = useQuery();

	useEffect(() => {
		if (!stripe) {
			return;
		}
		let client_secret = query.get("payment_intent_client_secret");

		if (client_secret)
			stripe.retrievePaymentIntent(client_secret).then(({ paymentIntent }) => {
				switch (paymentIntent.status) {
					case "succeeded":
						setMessage("Payment succeeded!");
						break;
					case "processing":
						setMessage("Your payment is processing.");
						break;
					case "requires_payment_method":
						setMessage("Your payment was not successful, please try again.");
						break;
					default:
						setMessage("Something went wrong.");
						break;
				}
			});
	}, [stripe, query]);
	console.log(message);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		setIsLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: `http://localhost:3000`,
			},
		});

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// your `return_url`. For some payment methods like iDEAL, your customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.
		if (error.type === "card_error" || error.type === "validation_error") {
			setMessage(error.message);
		} else {
			setMessage("An unexpected error occurred.");
		}

		setIsLoading(false);
	};

	const paymentElementOptions = {
		layout: "tabs",
	};

	return (
		<div className="payment-form">
			<form action="" onSubmit={handleSubmit} id="payment">
				<PaymentElement id="payment-element" options={paymentElementOptions} />
				{/* <button
				onClick={handleSubmit}
				disabled={isLoading || !stripe || !elements}
				id="submit">
				<span id="button-text">
					{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
				</span>
			</button> */}
				{/* Show any error or success messages */}
				{message && <div id="payment-message">{message}</div>}
			</form>
		</div>
	);
};

export default PaymentForm;
