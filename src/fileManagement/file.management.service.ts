import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { ILogger } from '../logger/logger.service.interface';
import { IDirectoryFiles } from '../types';
import { IFileManagementService } from './file.management.service.interface';

export class FileManagementService implements IFileManagementService {
	constructor(private logger: ILogger) {}

	async getAllFiles(dir: string, files_: IDirectoryFiles = {}): Promise<IDirectoryFiles> {
		files_ = files_ || {};
		const allFiles = fs.readdirSync(dir);
		const filteredFiles = allFiles
			// TODO: refactor and in helpers (filter), get arr from config
			.filter((file) => file != 'node_modules')
			.filter((file) => file != '.git')
			.filter((file) => file != '.dist');

		for (const i in filteredFiles) {
			const path = dir + '/' + filteredFiles[i];
			const statsFile = fs.statSync(path);

			if (statsFile.isDirectory()) {
				this.getAllFiles(path, files_);
			} else {
				const hash = await this.generateChecksum(path)
					.then((hash) => hash)
					.catch((err) => this.logger.error(err));

				files_[filteredFiles[i]] = {
					path: path,
					checksum: hash as string,
				};
			}
		}
		return files_;
	}

	async getParticularFiles(fileExtensions: string[]): Promise<IDirectoryFiles> {
		const result: IDirectoryFiles = {};
		const rootRepository = path.resolve();
		const allFiles = await this.getAllFiles(rootRepository);

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

	async createFontListFile(): Promise<void> {
		// TODO: get from config. replaсe  ['js', 'ts'] with extensions fonts after test
		const fileContent = await this.getParticularFiles(['js', 'ts', 'jpeg']);
		const filePath = 'fontsList.json';

		try {
			fs.writeFile(filePath, JSON.stringify(fileContent), (err) => {
				this.logger.log(`File ${filePath} was successfully created`);
			});
		} catch (error) {
			this.logger.error(`Error during creation ${filePath}`);
		}
	}

	generateChecksum(path: string): Promise<string> {
		return new Promise((resolve, reject) => {
			// TODO: get algorith from config
			const hash = crypto.createHash('md5');
			const input = fs.createReadStream(path);

			input.on('error', reject);
			input.on('data', (chunk) => {
				hash.update(chunk);
			});
			input.on('close', () => {
				//TODO: get encoding from cofig (BinaryToTextEncoding "base64" | "base64url" | "hex" | "binary")
				resolve(hash.digest('hex'));
			});
		});
	}

	createWhiteList(): void {
		const rawCurrentConfig = fs.readFileSync('verify-fonts.config.json');
		const currentConfig = JSON.parse(rawCurrentConfig.toString());

		//TODO: get from config 'fontsList.json'
		const rawWhiteList = fs.readFileSync('fontsList.json');
		const whiteList = JSON.parse(rawWhiteList.toString());

		const newConfig = Object.assign(currentConfig, { whiteList });

		fs.writeFile('verify-fonts.config.json', JSON.stringify(newConfig), (err) => {
			if (err) {
				return this.logger.error(`Error when creating a white list ${err}`);
			}
			this.logger.log(`"White list added. Config update successfully `);
		});
	}
}
