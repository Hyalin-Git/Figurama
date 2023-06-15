import React, { useState } from "react";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";

const Connection = () => {
	// signIn is true by default
	const [signUp, setSignUp] = useState(false);
	const [signIn, setSignIn] = useState(true);

	return (
		<main>
			<section>
				<div className="auth-container">
					<div className="auth-content">
						{/* if signIn is true then return SignIn component */}
						{signIn && <SignIn setSignUp={setSignUp} setSignIn={setSignIn} />}
						{/* if signUp is true then return SignUp component */}
						{signUp && <SignUp setSignUp={setSignUp} setSignIn={setSignIn} />}
					</div>
				</div>
			</section>
		</main>
	);
};

export default Connection;
