import { BinaryToTextEncoding } from 'crypto';
import { IConfigeFile, IDirectoryFiles } from '../../types';

export interface IConfigService {
	fontsListPath: string;
	configPath: string;
	fileExtensions: string[];
	exclusionFolders: string[];
	algorithmCrypto: string;
	encoding: BinaryToTextEncoding;
	whiteList: IDirectoryFiles | null;

	init: () => IConfigeFile | null;
	getCurrentConfig: () => IConfigeFile | void;
	hasConfig: () => Promise<boolean>;
}
