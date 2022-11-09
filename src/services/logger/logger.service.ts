import chalk from 'chalk';
import dedent from 'dedent-js';
import { Logger } from 'tslog';

export class LoggerService {
	public logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFunctionName: false,
			displayFilePath: 'hidden',
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}

	printHelp(): void {
		console.log(
			dedent(
				`${chalk.bgCyan(' HELP ')}
			${chalk.bold('-h --help')}               	Print help
			${chalk.bold('-g --generate')} 			Generate a whitelist in the config. 
							If there is no configuration file, it will be created automatically. 
							Then add a list of extensions for your whitelist to it and repeat the command -g
			${chalk.bold('-v --verify')} 			Verify your files with your white list`,
			),
		);
	}
}
