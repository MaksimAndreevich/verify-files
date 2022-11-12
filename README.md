About verify-files
-----------------------------------
This package is a node cli. Its task is to check files in your repository for file ratios in your whitelist. You can add a white sheet manually or generate it automatically. After checking, the application completes its execution with code 1, detected non-matches will be passed to the error body.

How to install
-----------------------------------
```
npm i verify-files
```

Commands
-----------------------------------
```
-h --help                       Print help

-g --generate                   It will generate a whitelist that will correspond to the extensions of the files 
                                that you specified in the configuration. If the configuration file does not exist 
                                at the time of calling this command, it will be created automatically. You need to 
                                add file extensions to it and call -g again
          
-v --verify                     Verify your files with your white list
```

How to use
-----------------------------------
You will need the `verify-files.config.json` configuration file in the root of your repository
```
{
	fileExtensions: [], 
	exclusionFolders: ['node_modules', '.git', 'dist', 'verify-files.config.json'], 
	algorithm: 'md5', 
	encoding: 'hex', 
	whiteList: {}, 
}
```
You can create it yourself or use the `verify-files -g` command
<br>
<br>
After that, you need to add file extensions to the configuration file that you want to index in your whitelist, and call the -g command again
<br>
`fileExtensions: ['ttf', 'wof', 'ts']`
<br>
<br>
The whitelist is ready! To check the files of your repository according to this list, simply call the -v command
<br>
<br>
If there are no errors, the application will simply terminate its work with the exit code 0
<br>
If there are errors, the application will exit with exit code 1. A message will be passed to the error body, which will indicate inconsistencies

What checks
-----------------------------------
- Which files are missing from your whitelist, but are in your repository
- Which files are missing from your repository, but are in your whitelist
- Checksum mapping. If the file was somehow changed, this will also be reflected in the error

Config file
-----------------------------------
Option  | Description
----------------|----------------------
`fileExtensions: ["ts", 'ttf', 'wof']`       | File extensions that you want to add to your 
`exclusionFolders: ['node_modules', '.git', 'dist', 'verify-files.config.json']`       | Folders that will not be searched
`algorithm: 'md5`   | Algorithm for crypto
`encoding: 'hex'`       | Encoding for crypto. If encoding is provided a string will be returned; otherwise a Buffer is returned
`whiteList: {}`    | Your white list

### Whitelist example
```json
"whiteList": {
		"file0.ts": {
			"path": "/path/file0.ts",
			"checksum": "2f1c0519e1d5ff64ca08b507f8178458"
		},
		"file1.ttf": {
			"path": "/path/file1.ttf",
			"checksum": "44341237b104c2863e4698d9e2442131"
		}}
```
