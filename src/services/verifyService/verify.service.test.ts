import { beforeAll, describe, expect, it } from '@jest/globals';
import { IDirectoryFiles } from '../../types';
import { FileManagementService } from '../fileManagement/file.management.service';
import { IFileManagementService } from '../fileManagement/file.management.service.interface';
import { VerifyService } from './verify.service';
import { IVerifyService } from './verify.service.interface';

let verifyService: IVerifyService;
let fileManagementService: IFileManagementService;
const wlConf: IDirectoryFiles = {
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
	verifyService = new VerifyService();
	fileManagementService = new FileManagementService();
});

describe('Verify service', () => {
	it('Found an excess file in repository', async () => {
		wlRepo['newFileRepo.json'] = { path: '/path/newFileRepo.json', checksum: 'someChecksum' };
		verifyService.verifySurplus(wlConf, wlRepo);
		expect(verifyService.collectedErrors).toContain('1. /path/newFileRepo.json');
	});

	it('Found an excess file in whiteList', async () => {
		wlConf['newFileConf.json'] = { path: '/path/newFileConf.json', checksum: 'someChecksum' };
		verifyService.verifySurplus(wlConf, wlRepo);
		expect(verifyService.collectedErrors).toContain('1. /path/newFileConf.json');
	});

	it('Not matching checksums', async () => {
		wlRepo['nodemon.json'].checksum = 'someChangetChacksum';
		verifyService.verifyChecksum(wlConf, wlRepo);
		expect(verifyService.collectedErrors).toContain(
			'The checksum of file \x1B[41mnodemon.json\x1B[49m from your white sheet did not match the checksum of the same file from your repository',
		);
	});
});
