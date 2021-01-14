import { read } from 'fs';
import Stream from './stream';

export default class StreamReader implements Stream {
    protected fileDescriptor: number;

    public constructor(file_descriptor: number) {
        this.fileDescriptor = file_descriptor;
    }

    public async read(buffer: Buffer, limit: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {

            read(this.fileDescriptor, buffer, 0, limit, null, (err, bytes_read, buffer) => {
                if(err !== null) return reject(err);

                return resolve(bytes_read);
            });
        });
    }

    public async readByte(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            let buffer = Buffer.alloc(1);
            read(this.fileDescriptor, buffer, 0, 1, null, (err, bytes_read, buffer) => {
                if(err !== null) return reject(err);
                if(bytes_read != 1) return reject();

                return resolve(buffer[0]);
            });
        });
    }

}