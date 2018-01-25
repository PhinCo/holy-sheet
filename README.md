# Holy Sheet

[![Build Status](https://travis-ci.org/PhinCo/holy-sheet.svg?branch=master)](https://travis-ci.org/PhinCo/holy-sheet)
[![codecov](https://codecov.io/gh/PhinCo/holy-sheet/branch/master/graph/badge.svg)](https://codecov.io/gh/PhinCo/holy-sheet)
[![NSP Status](https://nodesecurity.io/orgs/phinco/projects/ac838375-a07c-4ce6-bcd6-ba220984bf9a/badge)](https://nodesecurity.io/orgs/phinco/projects/ac838375-a07c-4ce6-bcd6-ba220984bf9a)



Converts spreadsheets created and modified by humans and converts them sheets that can be used by machines.

![alt text](https://raw.githubusercontent.com/PhinCo/holy-sheet/master/images/holy-sheet-intro.png)


## Extract column data from source CSV file

Call `extractColumnsFromCSVForSchema()` to get a set of fields from the transformer
that can then be used to match columns in the source file. Possible columns are sorted based on the 
closeness of their names. This function is very useful for rendering a UI that allows a user
to match transformer columns to input CSV columns.
