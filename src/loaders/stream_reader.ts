import { read } from 'fs';
import Stream from './stream';

export default class StreamReader implements Stream {
    protected fileDescriptor: number;
    protected _position: number;

    public get position(): number {
        return this._position;
    }

    public constructor(file_descriptor: number) {
        this.fileDescriptor = file_descriptor;
        this._position = 0;
    }

    public async read(buffer: Buffer, limit: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {

            read(this.fileDescriptor, buffer, 0, limit, null, (err, bytes_read, buffer) => {
                this._position += bytes_read;

                if(err !== null) return reject(err);

                if(bytes_read == 0) {
                    let e = { stream_exhausted: true };
                    return reject(e);
                }

                return resolve(bytes_read);
            });
        });
    }

    public async readByte(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            let buffer = Buffer.alloc(1);
            read(this.fileDescriptor, buffer, 0, 1, null, (err, bytes_read, buffer) => {
                this._position += bytes_read;

                if(err !== null) return reject(err);
                if(bytes_read != 1) {
                    let e = { stream_exhausted: true };
                    return reject(e);
                }

                return resolve(buffer[0]);
            });
        });
    }

}