import { NoParamCallback } from 'fs';
import { IDirectoryFiles } from '../../types';

export interface IFileManagementService {
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
	getParticularFiles: (fileExtensions: string[]) => Promise<IDirectoryFiles>;

	/** Created fontList.json in root folder */
	createListFilesDefinedExtension: () => Promise<void>;

	/** Generate a whitelist in the config */
	createWhiteList: () => void;

	/** Create file */
	createFile: (
		path: string,
		data: string | NodeJS.ArrayBufferView,
		callback: NoParamCallback,
	) => void;
}
