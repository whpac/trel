import MemoryEfficientCsvParser from './memory_efficient_csv_parser';

export default class CsvParser extends MemoryEfficientCsvParser<string[]> {

    protected processFields(fields: string[]): string[] {
        return fields;
    }
}