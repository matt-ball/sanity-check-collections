const { program } = require('commander')
const run = require('./src/run')

program
  .option('-k, --apiKey <key>', 'Postman API Key')
  .option('-f, --fix', 'Remove plain text values from Collection auth fields')
  .action(run)

program.parse()
