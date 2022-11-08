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
		this.fileManagementServise = new FileManagementService();
	}

	init(): void {
		const args = getArgsCommandLine(process.argv);
		this.configService.init();

		if (args.h) {
			return this.printHelp();
		}
		if (args.c) {
			this.configService.createConfig();
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
