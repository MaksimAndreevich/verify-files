import { NoParamCallback } from 'fs';
import { IConfigeFile, IDirectoryFiles } from '../../types';

export interface IFileManagementService {
	config: IConfigeFile;
	/**
	 * Get all files from your directory
	 * @param {string} dir - directory
	 * @param {IDirectoryFiles} files_ - list of files in the format {fileName: path}
	 * @returns {IDirectoryFiles}  list of files in object {fileName: path}
	 */
	getAllFiles: (dir: string, files_?: IDirectoryFiles) => Promise<IDirectoryFiles>;

	/**
	 * Filters all files and returns files that match the specified extension
	 * @param {string[]} fileExtensions - array file extensions
	 * @returns {IDirectoryFiles}  list of files in object {fileName: path}
	 */
	getParticularFiles: (
		fileExtensions: string[],
		allFiles: IDirectoryFiles,
	) => Promise<IDirectoryFiles>;

	/** Generate a whitelist in the config */
	createWhiteList: () => Promise<void>;

	/** Generates a checksum for a file from your whitelist */
	generateChecksum: (path: string) => Promise<string>;

	/** Create file in repository */
	createFile: (
		path: string,
		data: string | NodeJS.ArrayBufferView,
		callback: NoParamCallback,
	) => void;
}
