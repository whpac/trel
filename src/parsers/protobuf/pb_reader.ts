import Stream from '../../loaders/stream';
import { FieldType } from './field_type';
import { Message } from './message';
import { VarInt } from './varint';

export default class PbReader {

    public static async parseMessageInto(s: Stream, m: Message, furthest_location: number | null = null) {
        if(furthest_location === null) furthest_location = Infinity;
        try {
            while(s.position < furthest_location) {
                await this.parseField(s, m);
            }
        } catch(e) {
            if(e !== undefined && !('stream_exhausted' in e)) throw e;
        }
    }

    protected static async parseField(s: Stream, m: Message) {
        let field_key = await VarInt.ParseBytes(s);
        let field_number = Number(field_key >> BigInt(3));
        let field_type = this.getFieldType(field_key);

        switch(field_type) {
            case FieldType.SCALAR_VAR:
                m.setField(field_number, await this.readVarInt(s));
                break;
            case FieldType.SCALAR_32:
                m.setField(field_number, await this.readBytes(s, 4));
                break;
            case FieldType.SCALAR_64:
                m.setField(field_number, await this.readBytes(s, 8));
                break;
            case FieldType.BYTES:
                let byte_count = Number(await VarInt.ParseBytes(s));
                if(m.isEmbeddedMessage(field_number)) {
                    let embedded = m.getEmbeddedMessage(field_number);
                    await this.parseMessageInto(s, embedded, s.position + byte_count);
                } else {
                    m.setField(field_number, await this.readBytes(s, byte_count));
                }
                break;
        }
    }

    protected static async readVarInt(s: Stream): Promise<bigint> {
        return await VarInt.ParseBytes(s);
    }

    protected static async readBytes(s: Stream, byte_count: number): Promise<Buffer> {
        let bytes = Buffer.alloc(byte_count);
        let read = await s.read(bytes, byte_count);
        if(read < byte_count) {
            throw new Error(`The stream ended unexpectedly. Attempted to read a ${byte_count}-byte value.`);
        }
        return bytes;
    }

    protected static getFieldType(field_key: bigint): FieldType {
        let type = Number(field_key % BigInt(8));
        switch(type) {
            case 0: return FieldType.SCALAR_VAR;
            case 1: return FieldType.SCALAR_64;
            case 2: return FieldType.BYTES;
            case 5: return FieldType.SCALAR_32;
        }
        return FieldType.BYTES;
    }
}