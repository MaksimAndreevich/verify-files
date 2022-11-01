import { FileManagementService } from './fileManagement/file.management.service';
import { IFileManagementService } from './fileManagement/file.management.service.interface';
import { getArgsCommandLine } from './helpers/args';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.service.interface';

export class App {
	private logger: ILogger;
	private fileManagementServise: IFileManagementService;

	constructor() {
		this.logger = new LoggerService();
		this.fileManagementServise = new FileManagementService(this.logger);
	}

	init(): void {
		const args = getArgsCommandLine(process.argv);
	}

	createFontListFile(): void {
		this.fileManagementServise.createFontListFile();
	}
}
