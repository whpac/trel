import { Message } from './message';

export default abstract class BaseMessage implements Message {
    public abstract getEmbeddedMessage(field_number: number): Message;
    public abstract isEmbeddedMessage(field_number: number): boolean;
    public abstract setField(field_number: number, bytes: Buffer | number | bigint): void;

    protected ToFixed32(bytes: Buffer): number {
        if(bytes.length != 4) throw new Error("fixed32 should consist of exactly 4 bytes.");

        return bytes.readUInt32LE();
    }

    protected ToSFixed32(bytes: Buffer): number {
        if(bytes.length != 4) throw new Error("fixed32 should consist of exactly 4 bytes.");

        return bytes.readInt32LE();
    }

    protected ToFloat(bytes: Buffer): number {
        if(bytes.length != 4) throw new Error("float should consist of exactly 4 bytes.");
        return bytes.readFloatLE();
    }

    protected ToFixed64(bytes: Buffer): bigint {
        if(bytes.length != 8) throw new Error("fixed64 should consist of exactly 8 bytes.");
        return bytes.readBigUInt64LE();
    }

    protected ToSFixed64(bytes: Buffer): bigint {
        if(bytes.length != 8) throw new Error("sfixed64 should consist of exactly 8 bytes.");
        return bytes.readBigInt64LE();
    }

    protected ToDouble(bytes: Buffer): number {
        if(bytes.length != 8) throw new Error("double should consist of exactly 8 bytes.");
        return bytes.readDoubleLE();
    }

    protected ToSInt64(zigzag: bigint): bigint {
        let result;
        if(zigzag % BigInt(2) == BigInt(1)) {
            // Negative
            result = -((zigzag + BigInt(1)) / BigInt(2));
        }
        else {
            // Positive
            result = (zigzag / BigInt(2));
        }
        return result;
    }

    protected ToSInt32(zigzag: number): number {
        let result;
        if(zigzag % 2 == 1) {
            // Negative
            result = -((zigzag + 1) / 2);
        }
        else {
            // Positive
            result = (zigzag / 2);
        }
        return result;
    }
}
