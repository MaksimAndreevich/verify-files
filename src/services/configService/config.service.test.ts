import { beforeAll, describe, expect, it } from '@jest/globals';
import fs from 'fs';
import { DEFAULT_CONFIG } from '../../constants';
import { ConfigService } from './cofig.service';
import { IConfigService } from './cofig.service.interface';

let cofigService: IConfigService;
const defautlConfig = DEFAULT_CONFIG;

beforeAll(() => {
	cofigService = new ConfigService();
});

describe('Config service', () => {
	it('Init config file - success', () => {
		fs.writeFileSync('verify-files.config.json', JSON.stringify(defautlConfig));
		const config = cofigService.init();
		expect(config).toEqual(defautlConfig);
	});

	it('Init config file - fail', () => {
		fs.unlinkSync('verify-files.config.json');
		const config = cofigService.init();
		expect(config).toBeNull();
	});
});
