import { IConfigeFile } from './types';

export const DEFAULT_CONFIG: IConfigeFile = {
	fileExtensions: [], // File extensions that you want to add to your
	exclusionFolders: ['node_modules', '.git', 'dist', 'verify-files.config.json'], // Folders that will not be searched
	algorithm: 'md5', // Algorithm for crypto
	encoding: 'hex', // Encoding for crypto. If encoding is provided a string will be returned; otherwise a Buffer is returned.
	whiteList: {}, // Your white list
};
