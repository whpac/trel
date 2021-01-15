import StopDescriptor from '../../traffic/agency/stop_desctiptor';
import MemoryEfficientCsvParser from './memory_efficient_csv_parser';

export default class ScheduleParser extends MemoryEfficientCsvParser<StopDescriptor>{

    protected processFields(fields: string[]) {
        return new StopDescriptor(
            parseInt(fields[4]),
            fields[3],
            parseInt(fields[1]),
            fields[0]
        );
    }
}