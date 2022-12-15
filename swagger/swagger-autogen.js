const swaggerAutogen = require('swagger-autogen')()
const outputFile = './swagger/swagger-output.json'
const endpointFile = ['./app.js']
const doc = {
  info: {
    title: 'Attendance backend API',
    description: 'An API doc for attendance backend API server'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  tags: [
    { name: 'Record', description: 'Record API' },
    { name: 'User', description: 'User API' }
  ]
}
swaggerAutogen(outputFile, endpointFile, doc)
