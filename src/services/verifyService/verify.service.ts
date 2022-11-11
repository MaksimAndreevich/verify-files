import chalk from 'chalk';
import { DEFAULT_CONFIG } from '../../constants';
import { IConfigeFile, IDirectoryFiles, IFileInfo } from '../../types';
import { ConfigService } from '../configService/cofig.service';
import { IConfigService } from '../configService/cofig.service.interface';
import { FileManagementService } from '../fileManagement/file.management.service';
import { IFileManagementService } from '../fileManagement/file.management.service.interface';
import { LoggerService } from '../logger/logger.service';
import { ILogger } from '../logger/logger.service.interface';
import { IVerifyService } from './verify.service.interface';

export class VerifyService implements IVerifyService {
	private config: IConfigeFile;

	constructor(
		private configService: IConfigService = new ConfigService(),
		private logger: ILogger = new LoggerService(),
		private fileManagementServise: IFileManagementService = new FileManagementService(),
	) {
		const currentConfig = this.configService.init();
		this.config = currentConfig || DEFAULT_CONFIG;
	}

	verify(): void {
		const hasWhiteList = this.hasWhiteList();
		if (!hasWhiteList) return;

		this.iterateWhiteList();

		// TODO: return exeption с сообщением
	}

	hasWhiteList(): boolean {
		const whiteList = this.config.whiteList;
		for (const fileName in whiteList) {
			if (Object.prototype.hasOwnProperty.call(whiteList, fileName)) return true;
		}
		this.logger.warn('Before verify, you need to add your white list to the config file');
		return false;
	}

	async iterateWhiteList(): Promise<void> {
		const whiteListConfig = this.config.whiteList;
		const whiteListRepo = await this.fileManagementServise.getParticularFiles(
			this.config.fileExtensions,
		);

		this.verifySurplus(whiteListConfig, whiteListRepo);
		this.verifyChecksum(whiteListConfig, whiteListRepo);
	}

	//TODO: refactoring
	verifySurplus(wlConf: IDirectoryFiles, wlRepo: IDirectoryFiles): void {
		const missedInRepo: IFileInfo[] = [];
		const missedInConf: IFileInfo[] = [];

		for (const file in wlConf) {
			if (!wlRepo[file]) {
				missedInRepo.push(wlConf[file]);
			}
		}

		if (missedInRepo.length) {
			this.logger.warn(
				`The following ${chalk.bgRed(
					missedInRepo.length + ' files',
				)} from your whitelist are missing from your repository:`,
			);
			missedInRepo.forEach((file, i) => {
				console.log(`${i + 1}. ${file.path}`);
			});
		}

		for (const file in wlRepo) {
			if (!wlConf[file]) {
				missedInConf.push(wlRepo[file]);
			}
		}

		if (missedInConf.length) {
			this.logger.warn(
				`The following ${chalk.bgRed(
					missedInConf.length + ' files',
				)} from the repository are missing from your whitelist`,
			);
			missedInConf.forEach((file, i) => {
				console.log(`${i + 1}. ${file.path}`);
			});
		}
	}

	verifyChecksum(wlConf: IDirectoryFiles, wlRepo: IDirectoryFiles): void {
		for (const file in wlConf) {
			if (!wlRepo[file]?.checksum) return;
			if (wlRepo[file].checksum !== wlConf[file].checksum) {
				this.logger.warn(
					//выделить красным файл
					`The checksum of file ${chalk.bgRed(
						file,
					)} from your white sheet did not match the checksum of the same file from your repository`,
				);
			}
		}
	}
}
