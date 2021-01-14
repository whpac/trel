import { createReadStream, openSync } from 'fs';
import DataLoader from './data_loader';
import StreamReader from './stream_reader';

export default class FileLoader implements DataLoader {

    public load(path: string) {
        let fd = openSync(path, 'r');
        let stream = new StreamReader(fd);
        return stream;
    }
}