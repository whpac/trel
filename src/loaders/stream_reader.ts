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

    public async readLine(): Promise<string> {
        let b;
        let buffer = Buffer.alloc(16);
        let current_pos = 0;
        do {
            b = await this.readByte();
            if(b == 13) continue;   // '\r' = 13

            if(current_pos >= buffer.length) {
                let new_buffer = Buffer.alloc(buffer.length * 2);
                buffer.copy(new_buffer, 0, 0, buffer.length);
                buffer = new_buffer;
            }
            buffer[current_pos] = b;
            current_pos++;
        } while(b != 10);   // '\n' = 10

        // The last char is LF, so strip it
        current_pos--;

        return buffer.toString('utf-8', 0, current_pos);
    }
}