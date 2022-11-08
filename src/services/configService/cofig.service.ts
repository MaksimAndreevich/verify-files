import { BinaryToTextEncoding } from 'crypto';
import { DEFAULT_CONFIG } from '../../constants';
import { IDirectoryFiles } from '../../types';
import { FileManagementService } from '../fileManagement/file.management.service';
import { IFileManagementService } from '../fileManagement/file.management.service.interface';
import { LoggerService } from '../logger/logger.service';
import { ILogger } from '../logger/logger.service.interface';
import { IConfigService } from './cofig.service.interface';

export class ConfigService implements IConfigService {
	logger: ILogger;
	fileManagement: IFileManagementService;

	fontsListPath: string;
	configPath: string;
	fileExtensions: string[] = [];
	exclusionFolders: string[] = [];
	algorithmCrypto: string;
	encoding: BinaryToTextEncoding;
	whiteList: IDirectoryFiles | null = null;

	constructor() {
		this.logger = new LoggerService();
		this.fileManagement = new FileManagementService(this.logger);
		this.fontsListPath = 'fontsList.json';
		this.algorithmCrypto = 'md5';
		this.encoding = 'hex';
		this.configPath = 'verify-files.config.json';
	}

	init(): void {
		console.log('init');
	}

	setConfig(path: string): void {
		try {
			const config = this.fileManagement.getCurrentConfig(path);
			this.configPath = path;
			this.fileExtensions = config.fileExtensions || [];
			this.exclusionFolders = config.exclusionFolders || [];
			this.algorithmCrypto = config.algorithm || 'md5';
			this.encoding = config.encoding || 'hex';
			this.whiteList = config.whiteList || {};
		} catch (error: any) {
			this.logger.error('Error installing the configuration file', error.message);
			this.generateDefaultConfig();
		}
	}

	generateDefaultConfig(): void {
		const defautlConfig = DEFAULT_CONFIG;

		this.fileManagement.createFile(this.configPath, JSON.stringify(defautlConfig), (err) => {
			if (err) {
				return this.logger.error('An error occurred when creating the default config', err.message);
			}
			this.logger.log(
				`The default configuration file: ${this.configPath} was created successfully`,
			);
		});
	}
}
