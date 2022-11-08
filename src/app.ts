import { getArgsCommandLine } from './helpers/args';
import { ConfigService } from './services/configService/cofig.service';
import { IConfigService } from './services/configService/cofig.service.interface';
import { FileManagementService } from './services/fileManagement/file.management.service';
import { IFileManagementService } from './services/fileManagement/file.management.service.interface';
import { LoggerService } from './services/logger/logger.service';
import { ILogger } from './services/logger/logger.service.interface';

export class App {
	private logger: ILogger;
	private fileManagementServise: IFileManagementService;
	private configService: IConfigService;

	constructor() {
		this.configService = new ConfigService();
		this.logger = new LoggerService();
		this.fileManagementServise = new FileManagementService(this.logger);
	}

	init(): void {
		const args = getArgsCommandLine(process.argv);

		if (args.h) {
			return this.printHelp();
		}
		if (args.c) {
			if (typeof args.c === 'boolean') {
				return this.logger.warn('Please enter the path to your config file. -c [path/config.json]');
			}
			this.configService.setConfig(args.c);
		}
		if (args.s) {
			return this.createListFile();
		}
		if (args.v) {
			// verify whitelist
		}
		if (args.g) {
			//generate whitelist in the config
			this.generateWhiteList();
		}
	}

	createListFile(): void {
		this.fileManagementServise.createListFilesDefinedExtension();
	}

	printHelp(): void {
		this.logger.printHelp();
	}

	initConfig(): void {
		//config
	}

	generateWhiteList(): void {
		this.fileManagementServise.createWhiteList();
	}
}
