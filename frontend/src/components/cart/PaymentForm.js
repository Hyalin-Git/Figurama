import React, { useEffect, useState } from "react";
import {
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { useQuery } from "../../utils/urlQuery";

const PaymentForm = () => {
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const stripe = useStripe();
	const elements = useElements();
	let query = useQuery();

	useEffect(() => {
		if (!stripe) {
			return;
		}

		setTimeout(() => {
			setIsLoading(false);
		}, 2500);
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
			setIsLoading(false);
			setMessage(error.message);
		} else {
			setIsLoading(false);
			setMessage("An unexpected error occurred.");
		}
	};

	const paymentElementOptions = {
		layout: "tabs",
	};

	return (
		<div className="payment-form">
			<div className={isLoading ? "loader-container" : "hide"}>
				<div className="lds-ring">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
			<form
				className={isLoading ? "hide" : ""}
				action=""
				onSubmit={handleSubmit}
				id="payment">
				<PaymentElement id="payment-element" options={paymentElementOptions} />

				{/* Show any error or success messages */}
				{message && <div id="payment-message">{message}</div>}
			</form>
		</div>
	);
};

export default PaymentForm;
