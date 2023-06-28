import moment from "moment";
import "moment/locale/fr";

export const dateFormat = (date) => {
	moment.updateLocale("fr");
	const formattedDate = moment(date).format("dddd LL ");
	return formattedDate;
};
