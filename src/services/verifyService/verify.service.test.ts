import { beforeAll, describe, expect, it } from '@jest/globals';
import fs from 'fs';
import { IConfigeFile, IDirectoryFiles } from '../../types';
import { VerifyService } from './verify.service';
import { IVerifyService } from './verify.service.interface';

let verifyService: IVerifyService;

const config: IConfigeFile = {
	fileExtensions: ['ts', 'txt'],
	exclusionFolders: ['node_modules', '.git', 'dist', 'verify-files.config.json'],
	algorithm: 'md5',
	encoding: 'hex',
	whiteList: {
		'settings.json': {
			path: '/path/settings.json',
			checksum: 'f212f060eb7a3aceeb2255c5f8740fce',
		},
		'nodemon.json': {
			path: '/path/nodemon.json',
			checksum: '2fce79f962f11f936fc058ba5bc4f7b7',
		},
		'tsconfig.json': {
			path: '/path/tsconfig.json',
			checksum: '101345f42e24638666b1ac617ebad1b4',
		},
	},
};

const wlRepo: IDirectoryFiles = {
	'settings.json': {
		path: '/path/settings.json',
		checksum: 'f212f060eb7a3aceeb2255c5f8740fce',
	},
	'nodemon.json': {
		path: '/path/nodemon.json',
		checksum: '2fce79f962f11f936fc058ba5bc4f7b7',
	},
	'tsconfig.json': {
		path: '/path/tsconfig.json',
		checksum: '101345f42e24638666b1ac617ebad1b4',
	},
};

beforeAll(async () => {
	fs.writeFileSync('verify-files.config.json', JSON.stringify(config));
	verifyService = new VerifyService();
});

describe('Verify service', () => {
	it('Has whitelist - success', () => {
		const hasWhiteList = verifyService.hasWhiteList();
		expect(hasWhiteList).toBeTruthy();
	});

	it('Found an excess file in repository', async () => {
		wlRepo['newFileRepo.json'] = { path: '/path/newFileRepo.json', checksum: 'someChecksum' };
		verifyService.verifySurplus(config.whiteList, wlRepo);
		expect(verifyService.collectedErrors).toContain('1. /path/newFileRepo.json');
	});

	it('Found an excess file in whiteList', async () => {
		config.whiteList['newFileConf.json'] = {
			path: '/path/newFileConf.json',
			checksum: 'someChecksum',
		};
		verifyService.verifySurplus(config.whiteList, wlRepo);
		expect(verifyService.collectedErrors).toContain('1. /path/newFileConf.json');
	});

	it('Not matching checksums', async () => {
		wlRepo['nodemon.json'].checksum = 'someChangetChacksum';
		verifyService.verifyChecksum(config.whiteList, wlRepo);
		expect(verifyService.collectedErrors).toContain(
			'The checksum of file \x1B[41mnodemon.json\x1B[49m from your white sheet did not match the checksum of the same file from your repository',
		);
	});

	it('Basic vetify', async () => {
		const mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => {
			throw new Error('process.exit: ' + number);
		});

		verifyService
			.verify()
			.then((data) => expect(data).toBeUndefined)
			.catch((err) => {
				expect(err.message).toMatch('/(following|checksum)/i');
			});
	});

	it('Has whitelist - false', () => {
		if (fs.existsSync('verify-files.config.json')) fs.unlinkSync('verify-files.config.json');

		verifyService = new VerifyService();
		const hasWhiteList = verifyService.hasWhiteList();
		expect(hasWhiteList).toBeFalsy();
	});
});
