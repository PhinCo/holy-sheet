# csv-transform

Validate and map columns from one CSV file to another

## Extract column data from source CSV file

Call `extractColumnsFromCSVForSchema()` to get a set of fields from the transformer
that can then be used to match columns in the source file. Possible columns are sorted based on the 
closeness of their names. This function is very useful for rendering a UI that allows a user
to match transformer columns to input CSV columns.
