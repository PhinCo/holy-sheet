
const csvTransform = require("../index");
const basicCsvTransformer = require('./test-transformers/basic-csv.js');
const _ = require('lodash');

describe( 'loadColumnsFromCSVForSchema', function(){
	
	it( 'works', async function(){
		const sourceCsvPath = "./tests/test-files/basic-csv.csv";
		const results = await csvTransform.loadColumnsFromCSVForSchema( sourceCsvPath, basicCsvTransformer );
		
		_.each( results, result => {
			const matches = _.map( result.possibleInputFileColumns, inputFileColumn => {
				return `${inputFileColumn.inputColumnName} (${inputFileColumn.similarity})`;
			})
			console.log( result.columnName + " -> " + matches.join(", ") );
		});
	});
	
});