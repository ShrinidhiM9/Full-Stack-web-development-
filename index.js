// index.js
const mongoose = require('mongoose')
const app = require('.app')
const config = require('./utils/config')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.error('error connecting to MongoDB:', err.message)
  })

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
