import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Footer from "./components/Footer";
import Header from "./components/header/Header";
import Index from "./routes/Index";
import { getUser } from "./services/actions/GET/getUser.actions";
import { UidContext } from "./utils/AppContext";
import { getUserCart } from "./services/actions/GET/getUserCart.actions";

function App() {
	const [uid, setUid] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		axios({
			method: "get",
			url: `${process.env.REACT_APP_API_URL}/login/success`,
			withCredentials: true,
		})
			.then((res) => {
				setUid(res.data.userId);
			})
			.catch((err) => {
				console.log("No token", err);
			});

		axios({
			method: "get",
			url: `${process.env.REACT_APP_API_URL}/google/login/success`,
			withCredentials: true,
		})
			.then((res) => {
				setUid(res.data.userId);
			})
			.catch((err) => {
				console.log("No google Token", err);
			});

		if (uid) {
			dispatch(getUser(uid));
			dispatch(getUserCart(uid));
		}
	}, [dispatch, uid]);

	return (
		<div className="app">
			<UidContext.Provider value={uid}>
				<Header />
				<Index />
				<Footer />
			</UidContext.Provider>
		</div>
	);
}

export default App;
