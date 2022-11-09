import { IConfigeFile } from './types';

export const DEFAULT_CONFIG: IConfigeFile = {
	fileExtensions: [],
	exclusionFolders: ['node_modules', '.git', '.dist'],
	algorithm: 'md5',
	encoding: 'hex',
	whiteList: {},
};
