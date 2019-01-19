# Holy Sheet

[![Build Status](https://travis-ci.org/PhinCo/holy-sheet.svg?branch=master)](https://travis-ci.org/PhinCo/holy-sheet)
[![codecov](https://codecov.io/gh/PhinCo/holy-sheet/branch/master/graph/badge.svg)](https://codecov.io/gh/PhinCo/holy-sheet)
[![NSP Status](https://nodesecurity.io/orgs/phinco/projects/ac838375-a07c-4ce6-bcd6-ba220984bf9a/badge)](https://nodesecurity.io/orgs/phinco/projects/ac838375-a07c-4ce6-bcd6-ba220984bf9a)
[![bitHound Code](https://www.bithound.io/github/PhinCo/holy-sheet/badges/code.svg)](https://www.bithound.io/github/PhinCo/holy-sheet)


Converts spreadsheets, created and modified by humans, into sheets that can be used by machines.

![alt text](https://raw.githubusercontent.com/PhinCo/holy-sheet/master/images/holy-sheet-intro.png)


## Extract column data from source CSV file

Call `extractColumnsFromCSVForSchema()` to get a set of fields from the transformer
that can then be used to match columns in the source file. Possible columns are sorted based on the 
closeness of their names. This function is very useful for rendering a UI that allows a user
to match transformer columns to input CSV columns.

## Defining a Sheet Transformer

Sheet transformers are just simple javascript objects which define how to process your sheet. You can start with the
empty template below:

```
module.exports = {
	columns: [
	    {
    	    columnName: 'OutputColumnName',
    	    description: 'Use this field to provide helpful information',
    	    type: 'string'
    	}
	]
};
```

Inside the columns array you will need to provide a set of column transformers you wish to map to/from. All column 
transformers require a `columnName` and `type`. `columnName` is the name of the column in the transformed output. `type`
informs Holy Sheet as to what type of data is in the column and how it should be handled. Holy Sheet supports 6 basic
data types: `string`, `integer`, `float`, `boolean`, `date`, & `enum`. 

Some transformer types have custom parameters so you can customize how they do their work. Here is a list of transformer 
types and their custom parameters:

### String

* `defaultValue` - Usually `null`.
* `matchesRegex` - Provide a `RegEx` to test against. Input strings that don't match will be converted to the `defaultValue`.
* `replacementRegex` - Provide a `RegEx` and the `replacementString` to replace against. Useful for cleaning up formatted strings
like emails and phone numbers.
* `replacementString` - Provide a replacement `String` and the `replacementRegex` to replace against. Useful for cleaning up formatted strings
like emails and phone numbers.

##### Example

```
{
    columnName: 'String',
    description: 'tis but a string',
    type: 'string',
    replacementRegex: \.*<(.*)>.*/gi,
    replacementString: '($1)'
}
```


### Integer

* `defaultValue` - Usually `null`.
* `minValue` - Minimum output value. Smaller values are capped at the `minValue`.
* `maxValue` - Maximum output value. Larger values are capped at the `maxValue`.

##### Example

```
{
    columnName: 'Integer',
    description: 'tis but an integer',
    type: 'integer',
    minValue: 1,
    maxValue: 10
}
```


### Float

* `defaultValue` - Usually `null`.
* `minValue` - Minimum output value. Smaller values are capped at the `minValue`.
* `maxValue` - Maximum output value. Larger values are capped at the `maxValue`.

##### Example

```
{
    columnName: 'Float',
    description: 'tis but a float',
    type: 'float',
    minValue: 1.1,
    maxValue: 10.7
}
```


### Boolean

Converts truthy values like `true`, `1`, and `yes` to `true` and falsey values like
`false`, `0`, and `no` to `false`.

##### Example

```
{
    columnName: 'Boolean',
    description: 'tis but a boolean',
    type: 'boolean'
}
```


### Date

Uses moment.js to parse `String`s into `Date`s, validate them, and finally output them as reformatted `String`s.

* `defaultValue` - Usually `null`. Returned for parse errors.
* `inputFormat` - String containing the `moment.format()` string for the input value.
* `outputFormat` - String containing the `moment.format()` string for the output value.

##### Example

```
{
    columnName: 'Date',
    description: 'tis but a date',
    type: 'date',
    inputFormat: 'MM/DD/YY',
    outputFormat: 'YYYY-MM-DD'
}
```


### Enum

Allows columns with a set of allowed values. Supports single or multiple values.

* `allowedValues` - A JavaScript `Array` of `String`s for each allowed value. These are case sensitive.
* `multiple` - If `true`, allow multiple values. Assumes the input is string delimeted.
* `inputDelimeter` - Optional. Supports `,`, `;`, & `:` by default. Provide a `RegEx` or `String` to override.
* `outputDelimeter` - Optional. Uses `,` by default. Provide a `String` to override.
* `excludeInvalidValues` - If `true`, filters out bad input values. Returns remaining good values as output.

##### Example

```
{
    columnName: 'Enum',
    description: 'tis but an enum',
    type: 'enum',
    multiple: true,
    excludeInvalidValues: true
}
```

## Optional configuration

            	
| Name          | Description          | Default  |
| ------------- |:------------- :| -----:|
| headerRowNumber      |  Row number for the headers |  |
| skipRowsFromHeader      | Number of rows between header and the first row of data       |   0 |
| sendUnmappedColumnsInColumnNamed | Adds a column which contains any nonmapped columns      |    Ignores unmapped columns by default |            	
| ignoreBlankLines | Ignore lines where all cells are empty      |    true |

# Developing

Run the demo server `vue ui` and run the 'Serve' task in the Vue UI app.

View the holy sheet demo app at `http://localhost:8080/`


