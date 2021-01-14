import Stream from './stream';

export default interface DataLoader {

    /**
     * Retrieves data from the source and returns a reading stream
     * @param path Path to the source
     */
    load(path: string): Stream;
}