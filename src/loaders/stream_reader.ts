import { read, readFileSync } from 'fs';
import Stream from './stream';

export default class StreamReader implements Stream {
    protected fileDescriptor: number;
    protected _position: number;
    protected file_lines: string[] | undefined;
    protected current_line: number = 0;

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

    public readLine(): string {
        if(this.file_lines === undefined) {
            this.file_lines = readFileSync(this.fileDescriptor, { encoding: 'utf-8' }).split('\r\n');
            this.current_line = 0;
        }
        if(this.file_lines.length <= this.current_line) {
            let e = { stream_exhausted: true };
            throw e;
        }

        let out = this.file_lines[this.current_line];
        this.file_lines[this.current_line] = '';
        this.current_line++;
        return out;
    }
}