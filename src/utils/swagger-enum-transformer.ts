export const populateEnum = <T extends object>(enumObject: T) => {
	return Object.fromEntries(
		Object.entries(enumObject)
			.filter(([, value]) => {
				return typeof value !== 'number';
			})
			.map(([key, value]) => {
				return [key, value + key];
			}),
	);
};
