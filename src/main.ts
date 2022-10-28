import fs from 'fs';
import path from 'path';

interface IDirectoryFiles {
	[key: string]: string;
}

function getParticularFiles(fileExtensions: string[]): IDirectoryFiles {
	const rootRepository = path.resolve();
	const allFiles = getFiles(rootRepository);

	return {
		fontFile: 'path',
	};
}

function getFiles(dir: string, files_?: IDirectoryFiles): IDirectoryFiles {
	files_ = files_ || {};
	const allFiles = fs.readdirSync(dir);
	const files = allFiles.filter((file) => file != 'node_modules').filter((file) => file != '.git');

	for (const i in files) {
		const name = dir + '/' + files[i];
		if (fs.statSync(name).isDirectory()) {
			getFiles(name, files_);
		} else {
			files_[files[i]] = name;
		}
	}
	return files_;
}

getParticularFiles(['json']);
