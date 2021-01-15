import Stream from '../../loaders/stream';

export class VarInt {

    public static async ParseBytes(s: Stream): Promise<bigint> {
        let bytes: number[] = [];
        let b;
        let output = BigInt(0);

        do {
            b = await s.readByte();
            if(b < 0) {
                throw new Error("The stream has ended unexpectedly. Attempted to read a varint.");
            }
            bytes.push(b & 0x7f);
        } while(b > 0x7f);

        for(let part of bytes) {
            output *= BigInt(128);
            output += BigInt(part);
        }

        return output;
    }
}