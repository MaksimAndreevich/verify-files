import { IDirectoryFiles } from '../types';

export interface IFileManagementService {
	getAllFiles: (dir: string, files_?: IDirectoryFiles) => IDirectoryFiles;
	getParticularFiles: (fileExtensions: string[]) => IDirectoryFiles;
	createFontListFile: () => void;
}
