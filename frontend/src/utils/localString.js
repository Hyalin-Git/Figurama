const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
	style: "currency",
	currency: "EUR",
	minimumFractionDigits: 2,
});

export const float = (num) => {
	return CURRENCY_FORMATTER.format(num / 100);
};
