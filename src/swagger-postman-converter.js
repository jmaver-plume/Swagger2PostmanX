import pino from 'pino'

export class SwaggerPostmanConverter {
    constructor(input, output) {
        this.input = input
        this.output = output

        this.loggger = pino({
            transport: {
                targer: 'pino-pretty'
            }
        })
    }

    convert () {
        this.loggger.error('Not implemented')
        // Read input into memory
        // For each input file
        //      convert to postman
        // For each postman input
        //      for each request in postman
        //          for each path in postman
        //              convert :id to {{id}}
        //              rename {{id}} to prev Entities -> {{entityId}}
        //          add headers
        // https://github.com/postmanlabs/openapi-to-postman
    }
}