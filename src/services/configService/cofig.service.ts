import { BinaryToTextEncoding } from 'crypto';
import fs, { promises } from 'fs';
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

	init(): IConfigeFile | null {
		try {
			const rawCurrentConfig = fs.readFileSync(this.configPath);
			const currentConfig = JSON.parse(rawCurrentConfig.toString());
			return currentConfig;
		} catch (error) {
			return null;
		}
	}

	getCurrentConfig(): IConfigeFile | void {
		try {
			const rawCurrentConfig = fs.readFileSync(this.configPath);
			const currentConfig = JSON.parse(rawCurrentConfig.toString());
			return currentConfig;
		} catch (error) {
			this.logger.error(
				`Аn error occurred while reading the konfiguration file verify-files.config.json. Try configuring the coniguration file with $verify-files -i `,
			);
		}
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
