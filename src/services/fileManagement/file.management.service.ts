import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { DEFAULT_CONFIG } from '../../constants';
import { IConfigeFile, IDirectoryFiles } from '../../types';
import { ConfigService } from '../configService/cofig.service';
import { IConfigService } from '../configService/cofig.service.interface';
import { LoggerService } from '../logger/logger.service';
import { ILogger } from '../logger/logger.service.interface';
import { IFileManagementService } from './file.management.service.interface';

export class FileManagementService implements IFileManagementService {
	config: IConfigeFile;
	constructor(
		private configService: IConfigService = new ConfigService(),
		private logger: ILogger = new LoggerService(),
	) {
		const currentConfig = this.configService.init();
		this.config = currentConfig || DEFAULT_CONFIG;
	}

	async getAllFiles(dir: string, files_: IDirectoryFiles = {}): Promise<IDirectoryFiles> {
		files_ = files_ || {};
		const allFiles = fs.readdirSync(dir);
		const filteredFiles = allFiles
			// TODO: refactor and in helpers (filter), get arr from config
			.filter((file) => file != 'node_modules')
			.filter((file) => file != '.git')
			.filter((file) => file != 'dist');

		for (const i in filteredFiles) {
			const path = dir + '/' + filteredFiles[i];

			if (fs.statSync(path).isDirectory()) {
				this.getAllFiles(path, files_);
			} else {
				files_[filteredFiles[i]] = {
					path: path,
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

		// add checksum
		for (const fileName in result) {
			result[fileName].checksum = await this.generateChecksum(result[fileName].path).catch(
				(err) => {
					this.logger.error(`An error occurred during checksu generation: ${err.message}`);
					return undefined;
				},
			);
			if (!result[fileName].checksum) break;
		}

		return result;
	}

	// dont use?
	async createListFilesDefinedExtension(): Promise<void> {
		// const fileExtensions = this.configService.fileExtensions;
		const fileContent = await this.getParticularFiles(['js', 'json']);
		const filePath = 'fontsList.json';

		try {
			this.createFile(filePath, JSON.stringify(fileContent), (err) => {
				this.logger.log(`File ${filePath} was successfully created`);
			});
		} catch (error) {
			this.logger.error(`Error during creation ${filePath}`);
		}
	}

	generateChecksum(path: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const hash = crypto.createHash(this.config.algorithm);
			const input = fs.createReadStream(path);

			input.on('error', reject);
			input.on('data', (chunk) => {
				hash.update(chunk);
			});
			input.on('close', () => {
				resolve(hash.digest(this.config.encoding));
			});
		});
	}

	async createWhiteList(): Promise<void> {
		if (!this.config) return;

		const whiteList = await this.getParticularFiles(this.config.fileExtensions);
		const newConfig = Object.assign(this.config, { whiteList });

		for (const fileName in whiteList) {
			if (!whiteList[fileName].checksum)
				return this.logger.warn(
					`Perhaps checksums will be missing from your white list. Check your configuration`,
				);
		}

		this.createFile(this.configService.configPath, JSON.stringify(newConfig), (err) => {
			if (err) {
				return this.logger.error(`Error when creating a white list ${err}`);
			}
		});

		this.logger.log(`White list added. Config update successfully`);
	}

	createFile(
		path: string,
		data: string | NodeJS.ArrayBufferView,
		callback: fs.NoParamCallback,
	): void {
		fs.writeFile(path, data, callback);
	}
}
