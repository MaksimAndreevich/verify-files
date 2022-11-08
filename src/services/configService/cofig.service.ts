import { BinaryToTextEncoding } from 'crypto';
import fs, { promises } from 'fs';
import { DEFAULT_CONFIG } from '../../constants';
import { IConfigeFile, IDirectoryFiles } from '../../types';
import { LoggerService } from '../logger/logger.service';
import { IConfigService } from './cofig.service.interface';

export class ConfigService implements IConfigService {
	fontsListPath: string;
	configPath: string;
	fileExtensions: string[] = [];
	exclusionFolders: string[] = [];
	algorithmCrypto: string;
	encoding: BinaryToTextEncoding;
	whiteList: IDirectoryFiles | null = null;

	constructor(private logger = new LoggerService()) {
		this.fontsListPath = 'fontsList.json';
		this.algorithmCrypto = 'md5';
		this.encoding = 'hex';
		this.configPath = 'verify-files.config.json';
	}

	init(): void {
		try {
			this.getCurrentConfig();
		} catch (error) {
			this.logger.log(
				'Аn error occurred while reading the kinfiguration file, try configuring the coniguration file with %verify-files -с ',
			);
		}
	}

	async createConfig(): Promise<void> {
		const hasConfig = await this.hasConfig();
		if (!hasConfig) {
			this.generateDefaultConfig();
		}

		const config = this.getCurrentConfig();

		this.fileExtensions = config.fileExtensions || [];
		this.exclusionFolders = config.exclusionFolders || [];
		this.algorithmCrypto = config.algorithm || 'md5';
		this.encoding = config.encoding || 'hex';
		this.whiteList = config.whiteList || {};

		this.logger.log(`Config ${this.configPath} installed successfully`);
	}

	generateDefaultConfig(): void {
		try {
			const defautlConfig = DEFAULT_CONFIG;
			fs.writeFileSync(this.configPath, JSON.stringify(defautlConfig));
			this.logger.log(`Сonfig ${this.configPath} was created successfully`);
		} catch (error: any) {
			this.logger.error(`An error occurred when creating the default config: ${error.message}`);
		}
	}

	getCurrentConfig(): IConfigeFile {
		const rawCurrentConfig = fs.readFileSync(this.configPath);
		const currentConfig = JSON.parse(rawCurrentConfig.toString());
		return currentConfig;
	}

	async hasConfig(): Promise<boolean> {
		try {
			await promises.stat(this.configPath);
			return true;
		} catch (e) {
			return false;
		}
	}
}
