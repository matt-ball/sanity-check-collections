# Sanity Check Collections

Check that your Postman collections are using variables for sensitive auth fields.

## Usage

Clone this repo.

`node index.js -k POSTMAN_API_KEY`

Optionally, pass `--fix` to have the scanner replace plain text values with an empty string.

`node index.js -k POSTMAN_API_KEY --fix`

## Output

The scanner will output `No issues found!` if all auth values are using variables.

Where plain text is found, the scanner will list collection IDs, names and a link to the collection in table format.

When `--fix` is passed, the same table will be output, but these values will also be replaced inside collections. Running the scanner again should render no further issues.
