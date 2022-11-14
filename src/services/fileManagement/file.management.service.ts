import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { DEFAULT_CONFIG } from '../../constants';
import { excludeFolders } from '../../helpers/excludeFolders';
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

	async getAllFiles(dir_: string, files_: IDirectoryFiles = {}): Promise<IDirectoryFiles> {
		let dir = dir_;

		//TODO: refactoring
		if (dir.includes('\\')) {
			dir = dir.replaceAll('\\\\', '/\\/');
			dir = dir.replaceAll('/', '\\');
		}

		files_ = files_ || {};
		const allFiles = fs.readdirSync(dir);
		const filteredFiles = excludeFolders(allFiles, this.config.exclusionFolders);

		for (const i in filteredFiles) {
			const path = dir + '/' + filteredFiles[i];

			if (fs.statSync(path).isDirectory()) {
				this.getAllFiles(path, files_);
			} else {
				files_[filteredFiles[i]] = {
					path: path.normalize(),
				};
			}
		}
		return files_;
	}

	async getParticularFiles(
		fileExtensions: string[],
		allFiles: IDirectoryFiles,
	): Promise<IDirectoryFiles> {
		const result: IDirectoryFiles = {};

		for (let i = 0; i <= fileExtensions.length; i++) {
			for (const fileName in allFiles) {
				if (fileName.split('.').pop() === fileExtensions[i]) {
					result[fileName] = allFiles[fileName];
				}
			}
		}

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

		let rootRepository = path.resolve().normalize();

		//TODO: refactoring
		if (rootRepository.includes('\\')) {
			rootRepository = rootRepository.replaceAll('\\\\', '/\\/');
			rootRepository = rootRepository.replaceAll('/', '\\');
		}

		const allFiles = await this.getAllFiles(rootRepository);

		const whiteList = await this.getParticularFiles(this.config.fileExtensions, allFiles);
		const newConfig = Object.assign(this.config, { whiteList });

		for (const fileName in whiteList) {
			if (!whiteList[fileName].checksum)
				return this.logger.warn(
					`Perhaps checksums will be missing from your white list. Check your configuration`,
				);
		}
		this.createFile(this.configService.configPath, JSON.stringify(newConfig));

		if (Object.keys(this.config.whiteList).length === 0) {
			this.logger.warn(
				`The configuration file has been created, now it needs to be configured. Add the file extensions you would like to add to your white list to the FileExtensions array and call -g or --generate again`,
			);
		} else {
			this.logger.log(`White list added. Config update successfully`);
		}
	}

	createFile(path: string, data: string | NodeJS.ArrayBufferView): void {
		fs.writeFileSync(path, data);
	}
}
