export interface Message {

    setField(field_number: number, bytes: Buffer | number | bigint): void;
    isEmbeddedMessage(field_number: number): boolean;
    getEmbeddedMessage(field_number: number): Message;
}