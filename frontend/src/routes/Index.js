import { Route, Routes } from "react-router-dom";
import React from "react";
import Home from "../pages/Home";
import Connection from "../pages/Connection";
import Admin from "../pages/Admin";
import Products from "../pages/Products";
import Product from "../pages/Product";
import AddProduct from "../components/admin/AddProduct";
import Graph from "../components/admin/Graph";
import Order from "../pages/Order";

const Index = () => {
	return (
		<Routes>
			<Route path="/products">
				<Route index element={<Products />} />
				<Route path=":id" element={<Products />} />
			</Route>
			<Route path="/product/:id" element={<Product />} />
			<Route path="/order" element={<Order />} />

			<Route path="/auth" element={<Connection />} />
			<Route path="/dashboard">
				<Route index element={<Admin />} />
				<Route path="/dashboard/graph" element={<Graph />} />
				<Route path="/dashboard/add-product" element={<AddProduct />} />
			</Route>
		</Routes>
	);
};

export default Index;
