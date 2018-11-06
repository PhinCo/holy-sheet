

module.exports = {
	columns: [
		{
			name: 'String',
			description: 'tis but a string',
			type: 'string'
		},
		{
			name: 'Date',
			type: 'date',
			inputFormat: 'MM/DD/YY',
			outputFormat: 'YYYY-MM-DD'
		},
		{
			name: 'Integer',
			type: 'integer',
			min: 5,
			max: 700
		},
		{
			name: 'Float',
			type: 'float',
			min: 5.1,
			max: 700.6
		},
		{
			name: 'Boolean',
			type: 'boolean'
		},
		{
			name: 'Enum',
			type: 'enum',
			allowedValues: ['cats', 'dogs', 'pandas'],
			multiple: true
		}
	]
};