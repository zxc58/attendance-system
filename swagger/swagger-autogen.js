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
  definitions: {
    punch_out: {
      id: 1,
      punchIn: new Date().toISOString(),
      punchOut: new Date().toISOString(),
      employeeId: 1,
      dateId: 1
    },
    punch_in: {
      id: 1,
      punchIn: new Date().toISOString(),
      punchOut: new Date().toISOString(),
      employeeId: 1,
      dateId: 1
    }
  }
}

swaggerAutogen(outputFile, endpointFile, doc)
