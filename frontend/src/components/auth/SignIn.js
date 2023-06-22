import React, { useState } from "react";
import axios from "axios";

const SignIn = ({ setSignIn, setSignUp }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleModals = (e) => {
		e.preventDefault();
		setSignIn(false);
		setSignUp(true);
	};

	const googleAuth = () => {
		window.open(`${process.env.REACT_APP_API_URL}/api/auth/google/`, "_self");
	};

	const handleSignIn = (e) => {
		e.preventDefault();

		const emailExclamation = document.getElementById("exc-email");
		const passwordExclamation = document.getElementById("exc-password");

		const emailErr = document.getElementById("err-email");
		const passwordErr = document.getElementById("err-password");

		emailErr.innerHTML = "";
		passwordErr.innerHTML = "";

		axios({
			method: "POST",
			url: `${process.env.REACT_APP_API_URL}/api/auth/login`,
			withCredentials: true,
			data: {
				email,
				password,
			},
		})
			.then((res) => {
				if (res.data.userId) {
					window.location = "/";
				}
			})
			.catch((err) => {
				// gestion des potentiels erreurs
				console.log(err.response.data.message);
				const error = err.response.data;
				if (error) {
					if (error.message.includes("Adresse")) {
						emailExclamation.style.display = "inline";
						emailErr.innerHTML = error.message;
						emailErr.style.opacity = "65%";
						setInterval(() => {
							emailExclamation.style.display = "none";
							emailErr.innerHTML = "";
						}, 5000);
					}
					if (error.message.includes("Mot")) {
						passwordExclamation.style.display = "inline";
						passwordErr.innerHTML = error.message;
						passwordErr.style.opacity = "65%";
						setInterval(() => {
							passwordExclamation.style.display = "none";
							passwordErr.innerHTML = "";
							return;
						}, 5000);
					}
				}
			});
	};
	return (
		<div className="signIn-container">
			<h2>Vous avez déjà un compte ?</h2>
			<div className="title-underline"></div>
			<form action="" onSubmit={handleSignIn}>
				<label htmlFor="email">Adresse mail</label>
				<br />
				<input
					type="email"
					id="email"
					name="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
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
					onChange={(e) => setPassword(e.target.value)}
					value={password}
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
				<button type="submit">Se connecter</button>
				<p>ou</p>
			</form>
			<button className="button-google" onClick={googleAuth}>
				<span>
					<img
						className="google-logo"
						src="./img/google-auth.png"
						alt="google"
					/>
					Se connecter avec Google
				</span>
			</button>
			<div className="underline"></div>
			<h3 onClick={handleModals}>Vous n'avez pas de compte ?</h3>
			<div className="underline"></div>
		</div>
	);
};

export default SignIn;
