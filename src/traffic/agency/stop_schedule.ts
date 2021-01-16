import StopDescriptor from './stop_descriptor';

type ScheduleContainer = Map<string, Map<number, StopDescriptor>>;

export default class StopSchedule {

    public constructor(protected trips: ScheduleContainer) { }

    public getStop(trip_id: string, stop_seq: number) {
        let stop = this.trips.get(trip_id)?.get(stop_seq);

        if(stop === undefined) {
            throw new Error(`Given pair (${trip_id}, ${stop_seq}) doesn't exist in StopRegistry.`);
        }

        return stop;
    }
}