import React, { useState } from "react";
import Cart from "../components/cart/Cart";
import { useSelector } from "react-redux";
import ShippingForm from "../components/cart/ShippingForm";
import PaymentForm from "../components/cart/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Recap from "../components/cart/Recap";
import { NavLink } from "react-router-dom";
import { useQuery } from "../utils/urlQuery";

const Order = () => {
	const query = useQuery();
	const stripePromise = loadStripe(
		`pk_test_51MNfFgHkF4yhvk2xyKC6XW1629TjgqinSLODELPlewsnNMS2x1IufvcTgsdI7Wvfsvnsxqp8tSTn84n2becvzbvl00A3c8QoHF`
	);
	const [clientSecret, setClientSecret] = useState("");
	const validateCart = query.get("validate") || false;
	const userCart = useSelector((state) => state.userCart);
	const userData = useSelector((state) => state.user);
	const appearance = {
		theme: "stripe",
	};
	const options = {
		appearance,
		clientSecret,
	};

	console.log(clientSecret);

	return (
		<main>
			<div className="order-page">
				<div className="back-btn">
					<NavLink to="/products">
						<button>Continuer mes achats</button>
					</NavLink>
				</div>
				<div className="order-wrapper-flex">
					<Cart userCart={userCart} validateCart={validateCart} />
					<Recap userCart={userCart} validateCart={validateCart} />
				</div>
				<div>
					<ShippingForm
						userData={userData}
						userCart={userCart}
						validateCart={validateCart}
						setClientSecret={setClientSecret}
					/>
				</div>
				<div className="payment-container">
					{clientSecret ? (
						<Elements options={options} stripe={stripePromise}>
							<PaymentForm clientSecret={clientSecret} />
						</Elements>
					) : null}
				</div>
			</div>
		</main>
	);
};

export default Order;
