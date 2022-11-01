import fs from 'fs';
import path from 'path';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.service.interface';
import { IDirectoryFiles } from './types';

export class App {
	private logger: ILogger;

	constructor() {
		this.logger = new LoggerService();
	}

	getAllFiles(dir: string, files_?: IDirectoryFiles): IDirectoryFiles {
		files_ = files_ || {};
		const allFiles = fs.readdirSync(dir);
		const files = allFiles
			// TODO: refactor and in helpers (filter)
			.filter((file) => file != 'node_modules')
			.filter((file) => file != '.git')
			.filter((file) => file != '.dist');

		for (const i in files) {
			const name = dir + '/' + files[i];
			if (fs.statSync(name).isDirectory()) {
				this.getAllFiles(name, files_);
			} else {
				files_[files[i]] = name;
			}
		}
		return files_;
	}

	getParticularFiles(fileExtensions: string[]): IDirectoryFiles {
		const result: IDirectoryFiles = {};
		const rootRepository = path.resolve();
		const allFiles = this.getAllFiles(rootRepository);

		//TODO: in helpers (for)
		for (let i = 0; i <= fileExtensions.length; i++) {
			for (const fileName in allFiles) {
				if (fileName.split('.').pop() === fileExtensions[i]) {
					result[fileName] = allFiles[fileName];
				}
			}
		}
		return result;
	}

	createFontListFile(): void {
		const fileContent = this.getParticularFiles(['js', 'ts']);
		const filePath = 'fontsList.jsn';
		try {
			fs.writeFile(filePath, JSON.stringify(fileContent), (err) => {
				this.logger.log(`File ${filePath} was successfully created`);
			});
		} catch (error) {
			this.logger.error(`Error during creation ${filePath}`);
		}
	}
}
