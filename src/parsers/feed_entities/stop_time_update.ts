import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';
import StopTimeEvent from './stop_time_event';

export default class StopTimeUpdate extends BaseMessage {
    public stopSequence: number = 0;   // 1
    public arrival: StopTimeEvent | null = null;    // 2
    public departure: StopTimeEvent | null = null;  // 3
    public stopId: string = "";  // 4
    public scheduleRelationship: EnumScheduleRelationship = EnumScheduleRelationship.SCHEDULED;  // 5

    public getEmbeddedMessage(field_number: number): Message {
        switch(field_number) {
            case 2: return this.arrival ?? (this.arrival = new StopTimeEvent());
            case 3: return this.departure ?? (this.departure = new StopTimeEvent());
        }
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return (field_number == 2 || field_number == 3);
    }

    public setField(field_number: number, bytes: Buffer | number | bigint): void {
        if(field_number == 1 && typeof bytes === 'number') this.stopSequence = bytes;
        if(field_number == 4 && bytes instanceof Buffer) this.stopId = bytes.toString('utf-8');
        if(field_number == 5 && typeof bytes === 'number') this.scheduleRelationship = bytes;
    }
}

enum EnumScheduleRelationship {
    SCHEDULED = 0,
    SKIPPED = 1,
    NO_DATA = 2
}
