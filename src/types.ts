import { BinaryToTextEncoding } from 'crypto';

export interface IDirectoryFiles {
	[key: string]: IFileInfo;
}

export interface IFileInfo {
	path: string;
	checksum?: string;
}

export interface IArgsCommandLine {
	[key: string]: boolean | string;
}

export interface IConfigeFile {
	fileExtensions: string[];
	exclusionFolders: string[];
	algorithm: string;
	encoding: BinaryToTextEncoding;
	whiteList: IDirectoryFiles;
	[key: string]: string | Array<string> | IDirectoryFiles;
}
