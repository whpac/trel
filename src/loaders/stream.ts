export default interface Stream {
    /**
     * Holds a current position inside stream
     */
    position: number;

    /**
     * Reads a number of bytes into buffer
     * @param buffer Buffer to store the bytes in
     * @param limit Maximum number of bytes to read
     * @returns Number of bytes that were read
     */
    read(buffer: Buffer, limit: number): Promise<number>;

    /**
     * Reads a byte from stream and returns it
     */
    readByte(): Promise<number>;
}