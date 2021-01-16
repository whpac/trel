import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';

export default class TripDescriptor extends BaseMessage {
    public tripId: string = "";      // 1
    public startTime: string = "";   // 2
    public startDate: string = "";   // 3
    public scheduleRelationship: EnumScheduleRelationship = EnumScheduleRelationship.SCHEDULED;  // 4
    public routeId: string = "";     // 5
    public directionId: number = 0;    // 6

    public getEmbeddedMessage(field_number: number): Message {
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number) {
        return false;
    }

    public setField(field_number: number, bytes: Buffer | bigint): void {
        if(typeof bytes === 'bigint') {
            switch(field_number) {
                case 4: this.scheduleRelationship = Number(bytes); break;
                case 6: this.directionId = Number(bytes); break;
            }
        }
        if(bytes instanceof Buffer) {
            switch(field_number) {
                case 1: this.tripId = bytes.toString('utf-8'); break;
                case 2: this.startTime = bytes.toString('utf-8'); break;
                case 3: this.startDate = bytes.toString('utf-8'); break;
                case 5: this.routeId = bytes.toString('utf-8'); break;
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
