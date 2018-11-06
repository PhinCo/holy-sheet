import fs from 'fs';

class MockFile {

	constructor( filepath ){
		const path = require('path');
		this.filepath = filepath;
		this.name = path.basename( filepath );
	}

}

class MockFileReaderSync {

	readAsText( file ){
		return fs.readFileSync( file.filepath, { encoding: 'utf8' } );
	}

}

class MockFileReader {

	readAsText( file ){
		const data = fs.readFileSync( file.filepath, { encoding: 'utf8' });
		this.onload({
			target: {
				result: data
			}
		});
	}

	readAsBinaryString( file ){
		const binary = fs.readFileSync( file.filepath, { encoding: 'binary' });
		this.onload({
			target: {
				result: binary.toString()
			}
		});
	}

}

global.File = MockFile;
global.FileReaderSync = MockFileReaderSync;
global.FileReader = MockFileReader;
