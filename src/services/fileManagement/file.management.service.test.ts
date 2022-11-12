import { beforeAll, describe, expect, it } from '@jest/globals';
import { FileManagementService } from './file.management.service';
import { IFileManagementService } from './file.management.service.interface';

let fileManagementService: IFileManagementService;

beforeAll(() => {
	fileManagementService = new FileManagementService();
});

describe('File management service', () => {
	it('Get all files - fail', async () => {
		let allFiles;
		try {
			allFiles = await fileManagementService.getAllFiles('not/the/correct/path');
		} catch (er: any) {
			expect(er.message).toEqual(
				"ENOENT: no such file or directory, scandir 'not/the/correct/path'",
			);
		}
	});

	it('Generate checksum - success', async () => {
		const checksum = await fileManagementService
			.generateChecksum(__filename)
			.catch(() => undefined);
		expect(checksum).toBeDefined();
	});

	it('Generate checksum - fail', async () => {
		fileManagementService.config.algorithm = 'some unknown algorithm';
		const checksum = await fileManagementService
			.generateChecksum(__filename)
			.catch(() => undefined);
		expect(checksum).toBeUndefined();
	});
});
