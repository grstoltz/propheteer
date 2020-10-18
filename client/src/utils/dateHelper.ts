export const yesterday = ((d) =>
	new Date(d.setDate(d.getDate() - 1)).toISOString().split("T")[0])(
	new Date()
);

export const oneYear = ((d) =>
	new Date(d.setDate(d.getDate() - 366)).toISOString().split("T")[0])(
	new Date()
);
