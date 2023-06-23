import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
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
	const regex = {
		addressRegex: /^\d+\s(?:[\w\s'-]+,\s)?(?:\d{5}\s)?(?:\w+[\s-]+)*\w+$/,
		addressSuppRegex: /^[a-zA-Z0-9\s-]*$/,
		phoneRegex: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
		cityRegex: /^[a-zA-Z\s]{3,}$/,
		zipRegex: /^\d{5}$/,
	};

	// Gettin the DOM element using useRef from react.
	const addressError = useRef(null);
	const addressSuppError = useRef(null);
	const phoneError = useRef(null);
	const cityError = useRef(null);
	const zipError = useRef(null);

	function getInput(input) {
		let getInput = input?.previousElementSibling?.previousElementSibling;

		if ((getInput.tagName === "INPUT") === false) {
			getInput =
				input?.previousElementSibling?.previousElementSibling
					.previousElementSibling;
		}

		return getInput;
	}

	const addressInfo = shippingInformations.address;
	const addressSuppInfo = shippingInformations?.addressSupp;
	const phoneInfo = shippingInformations.phone;
	const zipInfo = shippingInformations.zip;
	const cityInfo = shippingInformations.city;

	useEffect(() => {
		if (Object.keys(shippingInformations).length !== 0) {
			setShipping(true);
		} else {
			setShipping(false);
		}
	}, [shippingInformations]);

	function addSpace(e) {
		const numberInput = e.target.value;

		let value = numberInput.replace(/\s/g, "");
		value = value.replace(/(.{2})(?=.)/g, "$1 ");

		setPhone(value);
	}

	function registerShippingAddress(e) {
		let isValid = true;

		switch (false) {
			case regex.addressRegex.test(address || addressInfo):
				getInput(addressError.current).style.border = "1px solid red";
				getInput(addressError.current).value = "";
				addressError.current.innerHTML = "Adresse invalide";
				setTimeout(() => {
					getInput(addressError.current).style.border = "none";
					addressError.current.innerHTML = "";
				}, 10000);
				isValid = false;
				break;
			case regex.addressSuppRegex.test(addressSupp || addressSuppInfo):
				getInput(addressSuppError.current).style.border = "1px solid red";
				getInput(addressSuppError.current).value = "";
				addressSuppError.current.innerHTML = "Adresse invalide";
				setTimeout(() => {
					getInput(addressSuppError.current).style.border = "none";
					addressSuppError.current.innerHTML = "";
				}, 10000);
				isValid = false;
				break;
			case regex.phoneRegex.test(phone || phoneInfo):
				getInput(phoneError.current).style.border = "1px solid red";
				getInput(phoneError.current).value = "";
				phoneError.current.innerHTML = "Numéro invalide";
				setTimeout(() => {
					getInput(phoneError.current).style.border = "none";
					phoneError.current.innerHTML = "";
				}, 10000);
				isValid = false;
				break;
			case regex.cityRegex.test(city || cityInfo):
				getInput(cityError.current).style.border = "1px solid red";
				getInput(cityError.current).value = "";
				cityError.current.innerHTML = "Ville invalide";
				setTimeout(() => {
					getInput(cityError.current).style.border = "none";
					cityError.current.innerHTML = "";
				}, 10000);
				isValid = false;
				break;
			case regex.zipRegex.test(zip || zipInfo):
				getInput(zipError.current).style.border = "1px solid red";
				getInput(zipError.current).value = "";
				zipError.current.innerHTML = "Code postal invalide";
				setTimeout(() => {
					getInput(zipError.current).style.border = "none";
					zipError.current.innerHTML = "";
				}, 10000);
				isValid = false;
				break;
			default:
				isValid = true;
				break;
		}
		if (!isValid) {
			return;
		}
		axios({
			method: "PUT",
			url: `${process.env.REACT_APP_API_URL}/api/user/${uid}`,
			withCredentials: true,
			data: {
				address: address ? address : addressInfo,
				addressSupp: addressSupp ? addressSupp : addressSuppInfo,
				phone: phone ? phone : phoneInfo,
				city: city ? city : cityInfo,
				zip: zip ? zip : zipInfo,
			},
		})
			.then((res) => {
				setShipping(true);
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function deleteShippingAddress(e) {
		axios({
			method: "PUT",
			url: `${process.env.REACT_APP_API_URL}/api/user/delete-shipping-address/${uid}`,
			withCredentials: true,
		})
			.then((res) => {
				setShipping(false);
				query.delete("proceed_payment");
				navigate(`?${query.toString()}`);
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<>
			<div className="form-wrapper">
				{shipping ? (
					<>
						{modify ? (
							<>
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
											<div className="address-wrapper">
												<div>
													<label htmlFor="address">Adresse</label>
													<br />
													<input
														type="text"
														id="address"
														name="address"
														placeholder="20 Ingram Street"
														defaultValue={addressInfo}
														onChange={(e) => setAddress(e.target.value)}
													/>
													<br />
													<div
														id="address-error"
														className="error"
														ref={addressError}></div>
												</div>
												<div>
													<input
														type="text"
														id="addressSupp"
														name="addressSupp"
														placeholder="Appartement 3B"
														defaultValue={addressSuppInfo}
														onChange={(e) => setAddressSupp(e.target.value)}
													/>
													<i>(Optionnel)</i>
													<br />
													<div
														id="addressSupp-error"
														className="error"
														ref={addressSuppError}></div>
												</div>
											</div>
											<div>
												<label htmlFor="phone">Téléphone</label>
												<br />
												<input
													type="text"
													id="phone"
													name="phone"
													placeholder="07 89 91 36 60"
													defaultValue={phoneInfo}
													onChange={addSpace}
												/>
												<br />
												<div
													id="phone-error"
													className="error"
													ref={phoneError}></div>
											</div>
											<div className="cityZip-wrapper">
												<div>
													<label htmlFor="city">Ville</label>
													<br />
													<input
														type="text"
														id="city"
														name="city"
														placeholder="New York"
														defaultValue={cityInfo}
														onChange={(e) => setCity(e.target.value)}
													/>
													<br />
													<div
														id="city-error"
														className="error"
														ref={cityError}></div>
												</div>
												<div>
													<label htmlFor="zip">Code Postal</label>
													<br />
													<input
														type="text"
														id="zip"
														name="zip"
														placeholder="10021"
														defaultValue={zipInfo}
														onChange={(e) => setZip(e.target.value)}
													/>
													<br />
													<div
														id="zip-error"
														className="error"
														ref={zipError}></div>
												</div>
											</div>
										</div>
										<div className="form-btn">
											<button type="submit">Enregistrer cette adresse</button>
										</div>
									</form>
								</div>
							</>
						) : (
							<div className="registered-container">
								<div className="registered-header">
									<h2>Nous vous livrerons à cette adresse :</h2>
								</div>
								<div className="header-underline"></div>
								<div className="registered-content">
									<i className="info">
										Cette adresse sera utilisée à la fois comme adresse
										personnelle (pour la facturation) et comme adresse de
										livraison.
									</i>

									<div className="registered-informations">
										<div>
											<p>
												<span>Adresse:</span> {addressInfo}
											</p>
										</div>
										{addressSuppInfo && (
											<div>
												<p>
													{" "}
													<span>Adresse complémentaire:</span> {addressSuppInfo}
												</p>
											</div>
										)}
										<div>
											<p>
												<span>Téléphone:</span> {phoneInfo}
											</p>
										</div>
										<div>
											<p>
												<span>Ville:</span> {cityInfo}
											</p>
										</div>
										<div>
											<p>
												<span>Code postal:</span> {zipInfo}
											</p>
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
								<div className="address-wrapper">
									<div>
										<label htmlFor="address">Adresse</label>
										<br />
										<input
											type="text"
											id="address"
											name="address"
											placeholder="20 Ingram Street"
											value={address}
											onChange={(e) => setAddress(e.target.value)}
										/>
										<br />
										<div
											id="address-error"
											className="error"
											ref={addressError}></div>
									</div>
									<div>
										<input
											type="text"
											id="addressSupp"
											name="addressSupp"
											placeholder="Appartement 3B"
											value={addressSupp}
											onChange={(e) => setAddressSupp(e.target.value)}
										/>
										<i>(Optionnel)</i>
										<br />
										<div
											id="addressSupp-error"
											className="error"
											ref={addressSuppError}></div>
									</div>
								</div>
								<div>
									<label htmlFor="phone">Téléphone</label>
									<br />
									<input
										type="text"
										id="phone"
										name="phone"
										placeholder="07 89 91 36 60"
										value={phone}
										onChange={addSpace}
									/>
									<br />
									<div
										id="phone-error"
										className="error"
										ref={phoneError}></div>
								</div>
								<div className="cityZip-wrapper">
									<div>
										<label htmlFor="city">Ville</label>
										<br />
										<input
											type="text"
											id="city"
											name="city"
											placeholder="New York"
											value={city}
											onChange={(e) => setCity(e.target.value)}
										/>
										<br />
										<div
											id="city-error"
											className="error"
											ref={cityError}></div>
									</div>
									<div>
										<label htmlFor="zip">Code Postal</label>
										<br />
										<input
											type="text"
											id="zip"
											name="zip"
											placeholder="10021"
											value={zip}
											onChange={(e) => setZip(e.target.value)}
										/>
										<br />
										<div id="zip-error" className="error" ref={zipError}></div>
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
