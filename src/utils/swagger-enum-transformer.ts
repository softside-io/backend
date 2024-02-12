export const populateEnum = <T extends object>(enumObject: T) => {
	return Object.fromEntries(
		Object.entries(enumObject)
			.filter(([key]) => {
				return !key.match(/\d+$/);
			})
			.map(([key, value]) => {
				if (typeof value === 'number') {
					return [key, key + value];
				}
				return [key, value];
			}),
	);
};
