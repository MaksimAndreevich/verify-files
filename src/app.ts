import { getArgsCommandLine } from './helpers/args';
import { FileManagementService } from './services/fileManagement/file.management.service';
import { IFileManagementService } from './services/fileManagement/file.management.service.interface';
import { LoggerService } from './services/logger/logger.service';
import { ILogger } from './services/logger/logger.service.interface';
import { VerifyService } from './services/verifyService/verify.service';
import { IVerifyService } from './services/verifyService/verify.service.interface';

export class App {
	private logger: ILogger;
	private fileManagementServise: IFileManagementService;
	private verifyService: IVerifyService;

	constructor() {
		this.logger = new LoggerService();
		this.fileManagementServise = new FileManagementService();
		this.verifyService = new VerifyService();
	}

	init(): void {
		const args = getArgsCommandLine(process.argv);

		if (args.h || args['-help']) return this.printHelp();
		if (args.g || args['-generate']) return this.generateWhiteList();
		if (args.v || args['-verify']) return this.runVerify();

		this.printHelp();
	}

	printHelp(): void {
		this.logger.printHelp();
	}

	generateWhiteList(): void {
		this.fileManagementServise.createWhiteList();
	}

	runVerify(): void {
		this.verifyService.verify();
	}
}
