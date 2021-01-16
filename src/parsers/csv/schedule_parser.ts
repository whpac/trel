import StopDescriptor from '../../traffic/agency/stop_descriptor';
import MemoryEfficientCsvParser from './memory_efficient_csv_parser';

type ScheduleContainer = Map<string, Map<number, StopDescriptor>>;

export default class ScheduleParser extends MemoryEfficientCsvParser<StopDescriptor, ScheduleContainer>{

    protected initializeContainer(): ScheduleContainer {
        return new Map();
    }

    protected saveRowToContainer(container: ScheduleContainer, row: StopDescriptor): void {
        if(!container.has(row.tripId)) {
            container.set(row.tripId, new Map());
        }
        let m = container.get(row.tripId);
        m?.set(row.stopSequence, row);
    }

    protected processFields(fields: string[]) {
        return new StopDescriptor(
            parseInt(fields[4]),
            fields[3],
            this.parseTime(fields[1]),
            fields[0]
        );
    }

    protected parseTime(time: string): number {
        let parts = time.split(':');
        if(parts.length != 3) throw new Error("Time is not in format HH:MM:SS");

        let seconds = parseInt(parts[0]) * 3600;
        seconds += parseInt(parts[1]) * 60;
        seconds += parseInt(parts[2]);
        return seconds;
    }
}