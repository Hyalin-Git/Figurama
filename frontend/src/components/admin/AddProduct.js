import React, { useState } from "react";
import * as palette from "../../utils/variables";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../services/actions/GET/getProducts.actions";

const Container = styled.div`
	margin-left: auto;
	margin-right: auto;
	width: 80%;
	max-width: 1500px;
	color: white;
	background-color: ${palette.primaryColor};
	border: 2px solid ${palette.tertiaireColor};
	border-radius: 15px;
	padding: 20px;
`;
const Title = styled.div`
	margin-top: -20px;
	text-align: center;
	color: ${palette.secondaryColor};
`;
const TitleUnderline = styled.div`
	margin-top: -10px;
	margin-bottom: 10px;
	line-height: 10%;
	border: 1px solid ${palette.tertiaireColor};
`;

const FormContainer = styled.div`
	display: flex;
	justify-content: center;
	text-align: center;
	form {
		border: 2px solid ${palette.tertiaireColor};
		border-radius: 15px;
		padding: 20px;
	}
`;

const Input = styled.input`
	border-radius: 10px;
	max-width: 240px;
	width: 100%;
	padding: 4px;
	outline: none;
	border: none;
`;

const TextArea = styled.textarea`
	outline: none;
	border: none;
	border-radius: 5px;
`;

const NumberContainer = styled.div`
	input[type="number"]::-webkit-inner-spin-button,
	input[type="number"]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input {
		text-align: center;
		width: 35%;
		resize: both;
	}
`;

const Button = styled.button`
	border-radius: 25px;
	border: none;
	padding: 8px;
	width: 170px;
	max-width: 100%;
	background-color: ${palette.secondaryColor};
	color: white;
	font-weight: bold;
	font-size: 1rem;
	cursor: pointer;
`;
const AddProduct = () => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [universe, setUniverse] = useState("");
	const [brand, setBrand] = useState("");
	const [cover, setCover] = useState("");
	const [coverFile, setCoverFile] = useState();
	const [price, setPrice] = useState(0);
	const [pictures, setPictures] = useState("");
	const [pictureFile, setPictureFile] = useState();
	const [inStock, setInStock] = useState(0);
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const handleCover = (e) => {
		e.preventDefault();
		const file = e.target.files[0];
		setCover(URL.createObjectURL(file));
		setCoverFile(file);
	};

	const handlePictures = (e) => {
		e.preventDefault();
		const files = e.target.files;
		setPictures(URL.createObjectURL(files[0]));
		// créez une balise img pour chaque objecturl
		document.getElementById("picture-preview");

		setPictureFile(files);
	};

	const handleProduct = async (e) => {
		e.preventDefault();

		if (coverFile || pictureFile) {
			const data = new FormData();
			data.append("name", name);
			data.append("description", description);
			data.append("universe", universe);
			data.append("brand", brand);
			data.append("cover", coverFile);
			for (let i = 0; i < pictureFile.length; i++) {
				data.append("pictures", pictureFile[i]);
			}
			data.append("price", price);
			data.append("inStock", inStock);

			await dispatch(addProduct(data));
			clearInput();
		} else {
			alert("Ajoutez des photos");
		}
	};
	const clearInput = () => {
		setName("");
		setDescription("");
		setUniverse("");
		setBrand("");
		// setCover("");
		setCoverFile("");
		setPictures("");
		// setPictureFile("");
		setPrice(0);
		setInStock(0);
	};
	return (
		<div>
			<Container>
				<Title>
					<h1>Que sera le prochain produit {user.firstName} ?</h1>
					<TitleUnderline></TitleUnderline>
				</Title>
				{/* <div>
					preview du produit dans la page d'acceuil
				</div> */}
				<FormContainer>
					<form action="" onSubmit={handleProduct}>
						<label htmlFor="name">Nom du produit </label>
						<br />
						<Input
							type="text"
							id="name"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<br />
						<br />
						<label htmlFor="description">Description</label>
						<br />
						<TextArea
							rows="5"
							cols="30"
							type="text"
							id="description"
							name="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<br />
						<br />
						<label htmlFor="universe">Univers</label>
						<br />
						<Input
							type="text"
							id="universe"
							name="universe"
							value={universe}
							onChange={(e) => setUniverse(e.target.value)}
						/>
						<br />
						<br />
						<label htmlFor="brand">Marque</label>
						<br />
						<Input
							type="text"
							id="brand"
							name="brand"
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
						/>
						<br />
						<br />
						<label htmlFor="cover">Cover</label>
						<br />
						<Input type="file" id="cover" name="cover" onChange={handleCover} />
						<br />
						<br />
						<div>
							{cover && (
								<img style={{ height: "200px" }} src={cover} alt="preview" />
							)}
						</div>
						<br />
						<label htmlFor="pictures">Pictures</label>
						<br />
						<Input
							type="file"
							id="pictures"
							name="pictures"
							multiple="multiple"
							onChange={handlePictures}
						/>
						<br />
						<br />
						{pictures && (
							<div id="picture-preview">
								<img style={{ height: "200px" }} src={pictures} alt="preview" />
							</div>
						)}
						<NumberContainer>
							<label htmlFor="price">Prix</label>
							<br />
							<Input
								type="number"
								id="price"
								name="price"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
							<br />
							<br />
							<label htmlFor="inStock">En stock</label>
							<br />
							<Input
								type="number"
								id="inStock"
								name="inStock"
								value={inStock}
								onChange={(e) => setInStock(e.target.value)}
							/>
						</NumberContainer>
						<br />
						<br />
						<Button type="submit">Ajouter ce produit</Button>
					</form>
				</FormContainer>
				{/* <div>
					preview du produit sur la page de celui-ci
				</div> */}
			</Container>
		</div>
	);
};

export default AddProduct;
