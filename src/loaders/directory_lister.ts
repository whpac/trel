import { readdir } from 'fs';
import { join } from 'path';

export default class DirectoryLister {

    /**
     * Returns a list of files in the directory
     * @param path The directory to list files
     */
    public static listDir(path: string, use_full_paths = false): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            readdir(path, (err, files) => {
                if(err !== null) {
                    return reject();
                }
                if(use_full_paths) {
                    for(let i = 0; i < files.length; i++) {
                        files[i] = join(path, files[i]);
                    }
                }
                return resolve(files);
            });
        });
    }
}