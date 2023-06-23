import React, { useEffect, useState } from "react";
import Cart from "../components/cart/Cart";
import { useSelector } from "react-redux";
import ShippingForm from "../components/cart/ShippingForm";
import PaymentForm from "../components/cart/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Recap from "../components/cart/Recap";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "../utils/urlQuery";

const Order = () => {
	const [paymentBtn, setPaymentBtn] = useState(false);
	const [clientSecret, setClientSecret] = useState("");
	const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_SECRET}`);

	const query = useQuery();
	const navigate = useNavigate();

	const userCart = useSelector((state) => state.userCart);
	const userData = useSelector((state) => state.user);
	const shippingAddress = userData?.data?.shippingAddress[0];

	let shippingInformations;
	if (
		shippingAddress?.address &&
		shippingAddress?.zip &&
		shippingAddress?.city &&
		shippingAddress?.phone
	) {
		shippingInformations = {
			address: shippingAddress.address,
			addressSupp: shippingAddress.addressSupp,
			phone: shippingAddress.phone,
			city: shippingAddress.city,
			zip: shippingAddress.zip,
		};
	} else {
		shippingInformations = {};
	}

	useEffect(() => {
		// Check if validate exist
		if (query.has("validate")) {
			// If no equal to true then delete the query
			if (query.get("validate") !== "true") {
				query.delete("validate");
				navigate(`?${query.toString()}`);
			} else {
				if (userCart?.data?.cart.length > 0) {
					// Else unlock the shipping-container
					document
						.getElementsByClassName("shipping-container")[0]
						.classList.remove("locked");
				}
			}
		}
		// same logic as validate
		if (query.has("proceed_payment")) {
			if (query.get("proceed_payment") !== "true") {
				query.delete("proceed_payment");
				navigate(`?${query.toString()}`);
			} else {
				if (Object.keys(shippingInformations).length !== 0) {
					document
						.getElementsByClassName("payment-container")[0]
						.classList.remove("locked");
				}
			}
		}

		if (clientSecret) {
			setPaymentBtn(true);
		}
	}, [query, navigate, shippingInformations, clientSecret, userCart]);

	const appearance = {
		theme: "stripe",
	};
	const options = {
		appearance,
		clientSecret,
	};

	return (
		<main>
			<div className="order-page">
				<div className="back-btn">
					<NavLink to="/products">
						<button>Continuer mes achats</button>
					</NavLink>
				</div>
				<div className="order-wrapper-flex">
					<Cart userData={userData} userCart={userCart} query={query} />
					{clientSecret ? (
						<Elements options={options} stripe={stripePromise}>
							<Recap
								userData={userData}
								userCart={userCart}
								clientSecret={clientSecret}
								setClientSecret={setClientSecret}
								paymentBtn={paymentBtn}
								shippingInformations={shippingInformations}
								query={query}
								navigate={navigate}
							/>
						</Elements>
					) : (
						<Recap
							userData={userData}
							userCart={userCart}
							clientSecret={clientSecret}
							setClientSecret={setClientSecret}
							shippingInformations={shippingInformations}
							paymentBtn={paymentBtn}
							query={query}
							navigate={navigate}
						/>
					)}
				</div>
				<div className="shipping-container locked">
					<div className="shipping-header">
						<h1>
							<span>1</span> Livraison
						</h1>
					</div>
					<ShippingForm
						shippingInformations={shippingInformations}
						query={query}
						navigate={navigate}
					/>
				</div>
				<div className="payment-container locked">
					<div className="payment-header">
						<h1>
							<span>2</span> Paiement
						</h1>
					</div>
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
