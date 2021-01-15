import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';

export default class TripDescriptor extends BaseMessage {
    public TripId: string = "";      // 1
    public StartTime: string = "";   // 2
    public StartDate: string = "";   // 3
    public ScheduleRelationship: EnumScheduleRelationship = EnumScheduleRelationship.SCHEDULED;  // 4
    public RouteId: string = "";     // 5
    public DirectionId: number = 0;    // 6

    public getEmbeddedMessage(field_number: number): Message {
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number) {
        return false;
    }

    public setField(field_number: number, bytes: Buffer | number | bigint): void {
        if(typeof bytes === 'number') {
            switch(field_number) {
                case 4: this.ScheduleRelationship = bytes; break;
                case 6: this.DirectionId = bytes; break;
            }
        }
        if(bytes instanceof Buffer) {
            switch(field_number) {
                case 1: this.TripId = bytes.toString('utf-8'); break;
                case 2: this.StartTime = bytes.toString('utf-8'); break;
                case 3: this.StartDate = bytes.toString('utf-8'); break;
                case 5: this.RouteId = bytes.toString('utf-8'); break;
            }
        }
    }
}

enum EnumScheduleRelationship {
    SCHEDULED = 0,
    ADDED = 1,
    UNSCHEDULED = 2,
    CANCELED = 3
}
