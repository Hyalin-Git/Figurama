import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../../utils/AppContext";

const ShippingForm = ({ shippingInformations, query, navigate }) => {
	const [shipping, setShipping] = useState(false);

	const [address, setAddress] = useState("");
	const [addressSupp, setAddressSupp] = useState("");
	const [phone, setPhone] = useState("");
	const [city, setCity] = useState("");
	const [zip, setZip] = useState("");

	const [modify, setModify] = useState(false);

	const uid = useContext(UidContext);

	const addressRegex = /^[a-zA-Z0-9\s\-\',.#]+$/;
	const cityRegex = /^[a-zA-Z\s\-']+$/;
	const zipRegex = /^\d{5}$/;

	const addressInfo = shippingInformations.address;
	const zipInfo = shippingInformations.zip;
	const cityInfo = shippingInformations.city;

	useEffect(() => {
		if (Object.keys(shippingInformations).length !== 0) {
			setShipping(true);
		} else {
			setShipping(false);
		}
	}, [shippingInformations]);

	function registerShippingAddress(e) {
		axios({
			method: "PUT",
			url: `${process.env.REACT_APP_API_URL}/api/user/${uid}`,
			withCredentials: true,
			data: {
				address: address,
				addressSupp: addressSupp,
				phone: phone,
				city: city,
				zip: zip,
			},
		})
			.then((res) => {
				setShipping(true);
				window.location.reload();
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function deleteShippingAddress(e) {
		setAddress("");
		setCity("");
		setZip("");
		registerShippingAddress();
		query.delete("proceed_payment");
		navigate(`?${query.toString()}`);
		window.location.reload();
	}

	return (
		<>
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
											deleteShippingAddress();
										}}>
										Supprimer cette adresse
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="form">
						<form
							action=""
							onSubmit={(e) => {
								e.preventDefault();
								registerShippingAddress();
							}}>
							<div className="form-header">
								<h2>Où souhaitez-vous être livré ?</h2>
							</div>
							<div className="header-underline"></div>
							<div className="form-content">
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
									<input
										type="text"
										id="addressSupp"
										name="addressSupp"
										value={addressSupp}
										onChange={(e) => setAddressSupp(e.target.value)}
									/>
								</div>
								<div>
									<label htmlFor="phone">Téléphone</label>
									<input
										type="text"
										id="phone"
										name="phone"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
									/>
								</div>
								<div className="cityZip-wrapper">
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
										<label htmlFor="">Code Postal</label>
										<input
											type="text"
											id="zip"
											name="zip"
											value={zip}
											onChange={(e) => setZip(e.target.value)}
										/>
									</div>
								</div>
							</div>
							<div className="form-btn">
								<button type="submit">Enregistrer cette adresse</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</>
	);
};

export default ShippingForm;
