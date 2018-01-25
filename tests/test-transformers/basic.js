

module.exports = {
	outputColumns: [
		{
			columnName: 'String',
			description: 'tis but a string',
			type: 'string',
			validateMatchesRegex: /\d+/gi
		},
		{
			columnName: 'Date',
			type: 'date',
			inputFormat: 'MM/DD/YY',
			outputFormat: 'YYYY-MM-DD'
		},
		{
			columnName: 'Integer',
			type: 'integer',
			min: 5,
			max: 700
		},
		{
			columnName: 'Float',
			type: 'float',
			min: 5.1,
			max: 700.6
		},
		{
			columnName: 'Boolean',
			type: 'boolean',
			defaultValue: false
		},
		{
			columnName: 'Enum',
			type: 'enum',
			values: ['cats', 'dogs', 'pandas'],
			multiple: true
		}
	]
};