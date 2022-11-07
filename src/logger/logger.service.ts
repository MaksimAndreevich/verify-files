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
			${chalk.bold('-h')}               	Print help
			${chalk.bold('-c [CONFIG_FILE]')} 	Set config file with yout white list. See REAME.md
			${chalk.bold('-v')} 			Verify your font files with your white list`,
			),
		);
	}
}
