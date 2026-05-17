import fs from 'fs';
import path from 'path';


const logsDir = 'logs';
if(!fs.existsSync(logsDir)){
    fs.mkdirSync(logsDir);
}

const logger = {
    info: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] INFO: ${message}\n`;
        console.log(logMessage);
        fs.appendFileSync(path.join(logsDir , 'app.log'), logMessage);
    } ,
    error: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ERROR: ${message}`;
        console.log(logMessage);
        fs.appendFileSync(path.join(logsDir , 'error.log'), logMessage);
    } ,
    warn: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] WARNING: ${message}`;
        console.log(logMessage);
        fs.appendFileSync(path.join(logsDir , 'app.log'), logMessage);
    }
}

export default logger;