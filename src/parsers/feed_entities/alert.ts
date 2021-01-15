import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';
import EntitySelector from './entity_selector';
import TimeRange from './time_range';
import TranslatedString from './translated_string';

export default class Alert extends BaseMessage {
    public activePeriod: TimeRange[] = [];    // 1
    public informedEntity: EntitySelector[] = [];    // 5
    public cause: EnumCause = EnumCause.UNKNOWN_CAUSE;   // 6
    public effect: EnumEffect = EnumEffect.UNKNOWN_EFFECT;   // 7
    public url: TranslatedString | null = null;     // 8
    public headerText: TranslatedString | null = null;      // 10
    public descriptionText: TranslatedString | null = null;     // 11

    public getEmbeddedMessage(field_number: number): Message {
        switch(field_number) {
            case 1:
                let tr = new TimeRange();
                this.activePeriod.push(tr);
                return tr;
            case 5:
                let es = new EntitySelector();
                this.informedEntity.push(es);
                return es;
            case 8: return this.url ?? (this.url = new TranslatedString());
            case 10: return this.headerText ?? (this.headerText = new TranslatedString());
            case 11: return this.descriptionText ?? (this.descriptionText = new TranslatedString());
        }
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return (field_number == 1 || field_number == 5 || field_number == 8 ||
            field_number == 10 || field_number == 11);
    }

    public setField(field_number: number, number: Buffer | number | bigint): void {
        if(typeof number !== 'number') return;

        switch(field_number) {
            case 6: this.cause = number as EnumCause; break;
            case 7: this.effect = number as EnumEffect; break;
        }
    }
}

enum EnumCause {
    UNKNOWN_CAUSE = 1,
    OTHER_CAUSE = 2,
    TECHNICAL_PROBLEM = 3,
    STRIKE = 4,
    DEMONSTRATION = 5,
    ACCIDENT = 6,
    HOLIDAY = 7,
    WEATHER = 8,
    MAINTENANCE = 9,
    CONSTRUCTION = 10,
    POLICE_ACTIVITY = 11,
    MEDICAL_EMERGENCY = 12
}

enum EnumEffect {
    NO_SERVICE = 1,
    REDUCED_SERVICE = 2,
    SIGNIFICANT_DELAYS = 3,
    DETOUR = 4,
    ADDITIONAL_SERVICE = 5,
    MODIFIED_SERVICE = 6,
    OTHER_EFFECT = 7,
    UNKNOWN_EFFECT = 8,
    STOP_MOVED = 9
}
