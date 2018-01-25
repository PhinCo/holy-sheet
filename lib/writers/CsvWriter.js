const path = require('path');
const fs = require('fs');
const stringify = require('csv-stringify');
const _ = require('lodash');

/**
 * Reads it all into memory. I'm assuming the csv files are relatively small. If this assumptions is wrong,
 * we can adapt this to streaming mode. The problem is that I don't think the XLXS parser support stream reading.
 * I don't feel like writing that shit ... ya know ut i meen
 */
class CsvWriter{

	constructor( outputPath ){
		this.outputPath = path.resolve( outputPath );
	}

	async write( rows ){
		return new Promise( ( resolve, reject ) => {
			if( fs.existsSync( this.outputPath ) ) fs.unlinkSync( this.outputPath );

			const columns = _.keys( _.first( rows ) );
			const output = stringify({ header: true, columns, delimeter: ',' }); // quoted: true

			output.on( 'error', reject );

			output.on( 'finish', () => {
				resolve();
			});

			output.pipe( fs.createWriteStream( this.outputPath ), { flags: 'w' });
			_.each( rows, row => {
				output.write( row );// TODO: stream write
			});
			
			output.end();
		});
	}
}

module.exports = CsvWriter;