import { beforeAll, describe, expect, it } from '@jest/globals';
import fs from 'fs';
import { IConfigeFile, IDirectoryFiles } from '../../types';
import { FileManagementService } from './file.management.service';
import { IFileManagementService } from './file.management.service.interface';

let fileManagementService: IFileManagementService;

let allFiles: IDirectoryFiles = {};

beforeAll(() => {
	fileManagementService = new FileManagementService();
	fileManagementService.config.fileExtensions = ['txt', 'ts'];
});

describe('File management service', () => {
	it('Generate checksum - success', async () => {
		const checksum = await fileManagementService
			.generateChecksum(__filename)
			.catch(() => undefined);
		expect(checksum).toBeDefined();
	});

	it('Search all files - success', async () => {
		allFiles = await fileManagementService.getAllFiles(__dirname);
		expect(allFiles).toHaveProperty(['file.management.service.test.ts']);
	});

	it('Search all files - fail', async () => {
		try {
			await fileManagementService.getAllFiles('not/the/correct/path');
		} catch (er: any) {
			expect(er.message).toEqual(
				"ENOENT: no such file or directory, scandir 'not/the/correct/path'",
			);
		}
	});

	it('Get particular files without checksum', async () => {
		for (let i = 0; i <= 10; i++) {
			if (i < 5) {
				allFiles[`newFile${i}.js`] = { path: allFiles['file.management.service.test.ts'].path };
			} else {
				allFiles[`newFile${i}.json`] = { path: allFiles['file.management.service.test.ts'].path };
			}
		}

		const particularFiles = await fileManagementService.getParticularFiles(
			['ts', 'json'],
			allFiles,
		);

		expect(particularFiles).toHaveProperty(['newFile5.json']);
	});

	it('Generate checksum - fail', async () => {
		fileManagementService.config.algorithm = 'some unknown algorithm';
		const checksum = await fileManagementService
			.generateChecksum(__filename)
			.catch(() => undefined);
		expect(checksum).toBeUndefined();
	});

	it('Create file', async () => {
		fileManagementService.createFile('fileForTest.txt', 'Test', (err) => {
			//
		});
		expect(fs.existsSync('fileForTest.txt')).toBeTruthy();
	});
});

describe('File management service - nex step', () => {
	it('Create whitelist', async () => {
		fileManagementService.config.algorithm = 'md5';
		fs.writeFileSync(
			'verify-files.config.json',
			JSON.stringify({
				fileExtensions: ['txt', 'ts'],
				exclusionFolders: ['node_modules', '.git', 'dist', 'verify-files.config.json'],
				algorithm: 'md5',
				encoding: 'hex',
				whiteList: {},
			}),
		);

		await fileManagementService.createWhiteList();

		const conf: IConfigeFile = JSON.parse(fs.readFileSync('verify-files.config.json', 'utf8'));
		for (const file in conf.whiteList) {
			expect(conf.whiteList[file].checksum).toBeDefined();
		}
	});
});

afterAll(() => {
	if (fs.existsSync('verify-files.config.json')) fs.unlinkSync('verify-files.config.json');
	if (fs.existsSync('fileForTest.txt')) fs.unlinkSync('fileForTest.txt');
});
