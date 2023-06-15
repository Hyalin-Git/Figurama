import React from "react";
import SortList from "./SortList";
import { useSelector } from "react-redux";
import ResearchBar from "./ResearchBar";

const FilterProducts = ({
	universe,
	// props for sorting
	setSort,
	setSortByName,
	setSortByPrice,
	setSortByUniverse,
}) => {
	console.log(universe);
	const products = useSelector((state) => state.products);
	return (
		<div className="filterPanel">
			<div className="filter-header">
				<h3>
					Filtres <span>({products?.data?.params.total} produits)</span>
				</h3>
			</div>
			{universe !== "All" && <ResearchBar />}

			<SortList
				setSort={setSort}
				setSortByName={setSortByName}
				setSortByPrice={setSortByPrice}
				setSortByUniverse={setSortByUniverse}
			/>
		</div>
	);
};

export default FilterProducts;
