import { IArgsCommandLine } from '../types';

export const getArgsCommandLine = (args: string[]): IArgsCommandLine => {
	const res: IArgsCommandLine = {};
	const [execute, file, ...rest] = args;

	rest.forEach((arg, i, arr) => {
		if (arg.charAt(0) == '-') {
			if (i == arr.length - 1) {
				res[arg.substring(1)] = true;
			} else if (arr[i + 1].charAt(0) != '-') {
				res[arg.substring(1)] = arr[i + 1];
			} else {
				res[arg.substring(1)] = true;
			}
		}
	});

	return res;
};
