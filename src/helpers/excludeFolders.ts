export const excludeFolders = (allFiles: string[], exclude: string[]): string[] => {
	const result = allFiles.filter((el) => {
		return exclude.indexOf(el) < 0;
	});
	return result;
};
