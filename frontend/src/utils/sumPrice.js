// used to get the total price of the cart
export function sumArray(array) {
	let total = 0;

	for (let i = 0; i < array?.length; i++) {
		total += array[i];
	}

	return total;
}
