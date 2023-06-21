import React, { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
const PaymentBtn = () => {
	const [isLoading, setIsLoading] = useState(false);
	const stripe = useStripe();
	const elements = useElements();

	return (
		<button
			form="payment"
			disabled={isLoading || !stripe || !elements}
			id="submit">
			<span id="button-text">
				{isLoading ? <div className="spinner" id="spinner"></div> : "Payer"}
			</span>
		</button>
	);
};

export default PaymentBtn;
