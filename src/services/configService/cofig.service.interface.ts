import { BinaryToTextEncoding } from 'crypto';
import { IDirectoryFiles } from '../../types';

export interface IConfigService {
	fontsListPath: string;
	configPath: string | null;
	fileExtensions: string[];
	exclusionFolders: string[];
	algorithmCrypto: string;
	encoding: BinaryToTextEncoding;
	whiteList: IDirectoryFiles | null;

	init: () => void;
	setConfig: (path: string) => void;
	generateDefaultConfig: () => void;
}
