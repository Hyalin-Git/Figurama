import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../services/actions/GET/products.actions";
import Card from "../card/Card";
import FilterProducts from "../filter/FilterProducts";
import Pagination from "../filter/Pagination";
import NoDataFound from "../../dataNotFound/NoDataFound";
import { useQuery } from "../../../utils/urlQuery";
import { useParams } from "react-router-dom";

// Spinner style

const AllFigures = () => {
	let query = useQuery();
	const { id } = useParams();
	const universe = id || "";
	let sortByDate = query.get("sortByDate") || "";
	let sortByName = query.get("sortByName") || "";
	let sortByPrice = query.get("sortByPrice") || "";
	let page = query.get("page") || "1";
	let search = query.get("search") || "";
	const dispatch = useDispatch();
	const products = useSelector((state) => state.products);

	useEffect(() => {
		dispatch(
			getProducts(page, search, universe, sortByDate, sortByName, sortByPrice)
		);
	}, [page, universe, search, sortByDate, sortByName, sortByPrice, dispatch]);

	const isLoading = products.status === "void" || products.status === "pending";
	const isRejected = products.status === "rejected";

	return (
		<>
			{isLoading ? (
				<div className="spinnerContainer">
					<div className="ldsSpinner"></div>
				</div>
			) : (
				<div className="threadContainer">
					<>
						{isRejected ? (
							<div className="rejected-data">
								<h1>
									Oops, on dirait bien qu'une erreur est survenue de notre
									côté...
								</h1>
								<p>Veuillez raffraichir la page</p>
							</div>
						) : (
							<>
								<div className="productsContainer">
									<div className="filterContainer">
										<FilterProducts universe={products.data.params.universe} />
									</div>
									{products.data.products[0] ? (
										<div className="cardContainer">
											{products.data.products.map((product) => {
												return <Card product={product} key={product._id} />;
											})}
										</div>
									) : (
										<NoDataFound />
									)}
								</div>
								<Pagination
									total={products.data.params.total}
									limit={products.data.params.limit}
									page={products.data.params.page}
								/>
							</>
						)}
					</>
				</div>
			)}
		</>
	);
};

export default AllFigures;
