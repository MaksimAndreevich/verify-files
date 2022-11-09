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
		console.log(args);

		if (args.h || args['-help']) return this.printHelp();
		if (args.g || args['-generate']) return this.generateWhiteList();

		if (args.v || args['-verify']) {
			// verify whitelist
		}
	}

	printHelp(): void {
		this.logger.printHelp();
	}

	generateWhiteList(): void {
		this.fileManagementServise.createWhiteList();
	}
}
