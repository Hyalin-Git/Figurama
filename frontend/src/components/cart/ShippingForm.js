import axios from "axios";
import React, { useEffect, useState } from "react";

const ShippingForm = ({
	userData,
	userCart,
	validateCart,
	setClientSecret,
	setPaymentId,
}) => {
	const [shipping, setShipping] = useState(false);
	const [address, setAddress] = useState("");
	const [zip, setZip] = useState("");
	const [city, setCity] = useState("");
	const [modify, setModify] = useState(false);

	let shippingInformations = [
		{
			address: userData?.data?.shippingAddress,
			zip: userData?.data?.zip,
			city: userData?.data?.city,
		},
	];
	const addressInfo = shippingInformations[0].address;
	const zipInfo = shippingInformations[0].zip;
	const cityInfo = shippingInformations[0].city;

	useEffect(() => {
		const paymentForm = document.getElementsByClassName("payment-container")[0];
		if (addressInfo === "" || zipInfo === "" || cityInfo === "") {
			paymentForm.classList.add("locked");
			setShipping(false);
		} else {
			if (userCart?.data?.cart && userData?.data?.email) {
				axios({
					method: "POST",
					url: `${process.env.REACT_APP_API_URL}/api/payment/create-payment-intent`,
					withCredentials: true,
					data: {
						userId: userData?.data?._id,
						email: userData?.data?.email,
						items: userCart?.data?.cart,
						address: addressInfo,
						zip: zipInfo,
						city: cityInfo,
					},
				})
					.then((res) => {
						setClientSecret(res.data.clientSecret);
					})
					.catch((err) => console.log(err));
			}
			setShipping(true);
			paymentForm.classList.remove("locked");
		}
	}, [
		addressInfo,
		zipInfo,
		cityInfo,
		userCart,
		userData,
		setClientSecret,
		setPaymentId,
	]);

	function registerShippingAddress(e) {
		axios({
			method: "PUT",
			url: `${process.env.REACT_APP_API_URL}/api/user/${userData?.data?._id}`,
			withCredentials: true,
			data: {
				shippingAddress: address,
				city: city,
				zip: zip,
			},
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	console.log(validateCart);
	return (
		<div className={validateCart ? "form-container" : "form-container locked"}>
			<div className="form-header">
				<h1>
					{" "}
					<span>1</span> Livraison
				</h1>
			</div>
			<div className="form-wrapper">
				{shipping ? (
					<>
						{modify ? (
							<>
								<div className="input">
									<label htmlFor="address">Adresse</label>
									<input
										type="text"
										id="address"
										name="address"
										value={address}
										onChange={(e) => setAddress(e.target.value)}
									/>
								</div>
								<div>
									<label htmlFor="">Code Postal</label>
									<input
										type="text"
										id="zip"
										name="zip"
										value={zip}
										onChange={(e) => setZip(e.target.value)}
									/>
								</div>
								<div>
									<label htmlFor="">Ville</label>
									<input
										type="text"
										id="city"
										name="city"
										value={city}
										onChange={(e) => setCity(e.target.value)}
									/>
								</div>
								<div>
									<button onClick={registerShippingAddress}>
										Enregistrer cette adresse
									</button>
								</div>
							</>
						) : (
							<div className="registered-container">
								<div>
									<p>
										Cette adresse sera utilisée à la fois comme adresse
										personnelle (pour la facturation) et comme adresse de
										livraison.
									</p>
								</div>
								<div className="registered-content">
									<div>
										<h3>Nous vous livrerons à cette adresse :</h3>
									</div>
									<div className="registered-informations">
										<div>
											<p>Adresse: {addressInfo}</p>
										</div>
										<div>
											<p>Code postal: {zipInfo}</p>
										</div>
										<div>
											<p>Ville: {cityInfo}</p>
										</div>
									</div>
								</div>
								<div className="btn-container">
									<button onClick={(e) => setModify(!modify)}>
										Modifier cette adresse
									</button>
									<button
										onClick={(e) => {
											setAddress("");
											setZip("");
											setCity("");
											registerShippingAddress();
										}}>
										Supprimer cette adresse
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="form-content">
						<form
							action=""
							onSubmit={(e) => {
								if (address === "" || zip === "" || city === "") {
									return;
								} else {
									registerShippingAddress();
								}
							}}>
							<div className="form">
								<div>
									<label htmlFor="address">Adresse</label>
									<input
										type="text"
										id="address"
										name="address"
										value={address}
										onChange={(e) => setAddress(e.target.value)}
									/>
								</div>
								<div>
									<label htmlFor="">Code Postal</label>
									<input
										type="text"
										id="zip"
										name="zip"
										value={zip}
										onChange={(e) => setZip(e.target.value)}
									/>
								</div>
								<div>
									<label htmlFor="">Ville</label>
									<input
										type="text"
										id="city"
										name="city"
										value={city}
										onChange={(e) => setCity(e.target.value)}
									/>
								</div>
							</div>
							<div className="form-btn">
								<button type="submit">Enregistrer cette adresse</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};

export default ShippingForm;
