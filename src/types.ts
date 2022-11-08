export interface IDirectoryFiles {
	[key: string]: {
		path: string;
		checksum: string;
	};
}

export interface IArgsCommandLine {
	[key: string]: boolean | string;
}
