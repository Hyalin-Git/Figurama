// import { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";

// const UrlParams = ({ page, sort, sortByName, sortByPrice, search }) => {
// 	const [, setSearchParams] = useSearchParams();
// 	useEffect(() => {
// 		if (sort === "" && search === "") {
// 			setSearchParams(`page=${page}`);
// 		}
// 		if (sort !== "") {
// 			setSearchParams(`page=${page}&sortBy=${sort}`);
// 		}
// 		if (sortByName !== "") {
// 			setSearchParams(`page=${page}&sortByName=${sortByName}`);
// 		}
// 		if (sortByPrice !== "") {
// 			setSearchParams(`page=${page}&sortByPrice=${sortByPrice}`);
// 		}
// 		if (search !== "") {
// 			setSearchParams(`search=${search}`);
// 		}
// 		if (search !== "" && sort !== "") {
// 			setSearchParams(`search=${search}&sortBy=${sort}`);
// 		}
// 		if (search !== "" && sortByName !== "") {
// 			setSearchParams(`search=${search}&sortByName=${sortByName}`);
// 		}
// 		if (search !== "" && sortByPrice !== "") {
// 			setSearchParams(`search=${search}&sortByPrice=${sortByPrice}`);
// 		}
// 	}, [page, sort, sortByName, sortByPrice, search, setSearchParams]);
// };

// export default UrlParams;
