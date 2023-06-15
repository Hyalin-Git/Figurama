import axios from "axios";
import React, { useState } from "react";

const SignUp = ({ setSignIn, setSignUp }) => {
	const [lastName, setLastName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleModals = (e) => {
		e.preventDefault();
		setSignIn(true);
		setSignUp(false);
	};

	const googleAuth = () => {
		window.open(`${process.env.REACT_APP_API_URL}/api/auth/google`, "_self");
	};

	// function checkPasswordStrengh() {}
	const lastNameExclamation = document.getElementById("exc-lastName");
	const firstNameExclamation = document.getElementById("exc-firstName");
	const emailExclamation = document.getElementById("exc-email");
	const passwordExclamation = document.getElementById("exc-password");

	const passwordErr = document.getElementById("err-password");
	const lastNameErr = document.getElementById("err-lastName");
	const firstNameErr = document.getElementById("err-firstName");
	const emailErr = document.getElementById("err-email");

	const isContainSymbol = /^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹]).*$/;
	const isContainUppercase = /^(?=.*[A-Z]).*$/;
	const isContainsNumber = /^(?=.*[0-9]).*$/;

	const handleSignUp = (e) => {
		e.preventDefault();
		lastNameErr.style.opacity = "65%";
		firstNameErr.style.opacity = "65%";
		emailErr.style.opacity = "65%";

		function checkPassword(password) {
			const errors = [];
			if (password.search(isContainSymbol)) {
				errors.push(
					"Le mot de passe doit contenir un caractère spécial (!-&#)"
				);
				passwordErr.style.opacity = "65%";
				passwordErr.innerHTML = errors[0];
			}
			if (password.search(isContainUppercase)) {
				errors.push("Le mot de passe doit contenir au moins une majuscule");
				passwordErr.style.opacity = "65%";
				passwordErr.innerHTML = errors[1];
			}
			if (password.search(isContainsNumber)) {
				passwordErr.style.opacity = "65%";
				errors.push("Le mot de passe doit contenir au moins un chiffre");
				passwordErr.innerHTML = errors[2];
			}
			console.log(errors);
			if (errors.length > 0) {
				return false;
			} else {
				return true;
			}
		}

		if (password || !password) {
			if (password.length < 1) {
				passwordExclamation.style.display = "inline";
				passwordErr.style.opacity = "65%";
				passwordErr.innerHTML = "Veuillez saisir votre mot de passe";
				return setInterval(() => {
					passwordExclamation.style.display = "none";
					passwordErr.innerHTML = "";
				}, 5000);
			} else {
				checkPassword(password);
				console.log(checkPassword(password));
				if (checkPassword(password) === true) {
					axios({
						method: "POST",
						url: `${process.env.REACT_APP_API_URL}/api/auth/register`,
						withCredentials: true,
						data: {
							lastName,
							firstName,
							email,
							password,
						},
					})
						.then((res) => {
							console.log(res);
						})
						.catch((err) => {
							console.log(err);
							const errorDupEntry = err.response.data.code;
							if (errorDupEntry === 11000) {
								emailExclamation.style.display = "inline";
								emailErr.innerHTML = "Adresse mail déjà utilisé";
								setInterval(() => {
									emailExclamation.style.display = "none";
									emailErr.innerHTML = "";
								}, 5000);
							}
							const errors = err.response.data.errors;
							if (errors.lastName) {
								lastNameExclamation.style.display = "inline";
								lastNameErr.innerHTML = "Nom trop court";
								setInterval(() => {
									lastNameExclamation.style.display = "none";
									lastNameErr.innerHTML = "";
								}, 5000);
							}
							if (errors.firstName) {
								firstNameExclamation.style.display = "inline";
								firstNameErr.innerHTML = "Prénom trop court";
								setInterval(() => {
									firstNameExclamation.style.display = "none";
									firstNameErr.innerHTML = "";
								}, 5000);
							}
							if (errors.email) {
								emailExclamation.style.display = "inline";
								emailErr.innerHTML = "Adresse mail requise";
								setInterval(() => {
									emailExclamation.style.display = "none";
									emailErr.innerHTML = "";
								}, 5000);
							}
						});
				}
			}
		}
	};

	return (
		<div className="signUp-container">
			<h2 className="signUp-title">Vous n'avez pas de compte ?</h2>
			<div className="title-underline"></div>
			<form action="" onSubmit={handleSignUp}>
				<label htmlFor="lastName">Nom</label>
				<br />
				<input
					type="text"
					id="lastName"
					name="lastName"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
				<img
					className="exc-img"
					id="exc-lastName"
					src="./svg/exclamation.svg"
					alt="exclamation"
				/>
				<br />
				<div id="err-lastName"></div>
				<br />
				<label htmlFor="firstName">Prénom</label>
				<br />
				<input
					type="text"
					id="firstName"
					name="firstName"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
				<img
					className="exc-img"
					id="exc-firstName"
					src="./svg/exclamation.svg"
					alt="exclamation"
				/>
				<br />
				<div id="err-firstName"></div>
				<br />
				<label htmlFor="email">Adresse mail</label>
				<br />
				<input
					type="email"
					id="email"
					name="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<img
					className="exc-img"
					id="exc-email"
					src="./svg/exclamation.svg"
					alt="exclamation"
				/>
				<br />
				<div id="err-email"></div>
				<br />
				<label htmlFor="password">Mot de passe</label>
				<br />
				<input
					type="password"
					id="password"
					name="password"
					onKeyUp={() => {
						const value = document.getElementById("password").value;

						let strongRegex = new RegExp("^(?=.*[a-z])(?=.{8,})");
						let mediumRegex = new RegExp("^(?=.*[a-z])(?=.{6,})");
						let weakRegex = new RegExp("^(?=.*[a-z])(?=.{4,})");
						// si le password est inférieur à 1
						if (value.length < 1) {
							return (passwordErr.innerHTML = "");
						}
						// si le password est inférieur à 6
						if (weakRegex.test(value)) {
							passwordErr.style.opacity = "100%";
							passwordErr.innerHTML = "Mot de passe faible";
						}
						if (mediumRegex.test(value)) {
							passwordErr.style.opacity = "100%";
							passwordErr.innerHTML = "Mot de passe moyen";
						}
						if (strongRegex.test(value)) {
							passwordErr.style.opacity = "100%";
							passwordErr.innerHTML = "Mot de passe sécurisé";
						}
						console.log(strongRegex.test(value));
					}}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<img
					className="exc-img"
					id="exc-password"
					src="./svg/exclamation.svg"
					alt="exclamation"
				/>
				<br />
				<div id="err-password"></div>
				<br />
				<button>S'inscrire</button>
				<p>ou</p>
			</form>
			<button className="button-google" onClick={googleAuth}>
				<span>
					<img
						className="google-logo"
						src="./img/google-auth.png"
						alt="google"
					/>
					S'inscrire avec Google
				</span>
			</button>
			<div className="underline"></div>
			<h3 onClick={handleModals}>Vous avez déjà compte ?</h3>
			<div className="underline"></div>
		</div>
	);
};

export default SignUp;
