import { IDirectoryFiles } from '../../types';

export interface IVerifyService {
	collectedErrors: string[];

	/** Run verify */
	verify: () => Promise<void>;

	/** Checking if there is a white list in your configuration */
	hasWhiteList: () => boolean;

	/** Checking for the presence or absence of files in the repository and your whitelist */
	verifySurplus: (wlConf: IDirectoryFiles, wlRepo: IDirectoryFiles) => void;

	/** Checking checksums */
	verifyChecksum: (wlConf: IDirectoryFiles, wlRepo: IDirectoryFiles) => void;
}
