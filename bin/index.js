import { program } from 'commander';
import { SwaggerPostmanConverter } from '../src/swagger-postman-converter';

const program = new Command()

program
    .name('swagger-postman')
    .version('0.0.1')

program
    .command('convert')
    .description('convert a list of swagger specifications into a single postman collection with support for environment variables')
    .option('-i, --input <files...>', 'specify a list of input files')
    .option('-o, --output <output>', 'specify output file', 'output.json')
    .action((prev, options) => {
        console.log('prev: ', prev)
        console.log('options: ', options)
        const swaggerPostmanConverter = new SwaggerPostmanConverter(options.input, options.output);
        swaggerPostmanConverter.convert()
    })

program.parse()