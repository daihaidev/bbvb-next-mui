const fs = require('fs')

const envData = Object.entries(process.env)
  .reduce((acc, [key, value]) => {
    acc.push(`${key}="${value}"`)
    return acc
  }, [])
  .join('\n')

fs.writeFile('.env', envData, (err) => {
  if (err) return console.log('Error in .env file creation at setup-env.js', err)
  console.log('Successfully created .env file based on current environment variables', envData)
})
