import { IDirectoryFiles } from '../types';

export interface IFileManagementService {
	/**
	 * Get all files from your directory
	 * @param {string} dir - directory
	 * @param {IDirectoryFiles} files_ - list of files in the format {fileName: path}
	 * @returns {IDirectoryFiles}  list of files in object {fileName: path}
	 */
	getAllFiles: (dir: string, files_?: IDirectoryFiles) => IDirectoryFiles;

	/**
	 * Filters all files and returns files that match the specified extension
	 * @param {string[]} fileExtensions - array file extensions
	 * @returns {IDirectoryFiles}  list of files in object {fileName: path}
	 */
	getParticularFiles: (fileExtensions: string[]) => IDirectoryFiles;

	/** Created fontList.json in root folder */
	createFontListFile: () => void;
}
