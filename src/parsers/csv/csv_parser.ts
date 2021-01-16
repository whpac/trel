import MemoryEfficientCsvParser from './memory_efficient_csv_parser';

export default class CsvParser extends MemoryEfficientCsvParser<string[]> {

    protected initializeContainer(): string[][] {
        return [];
    }

    protected saveRowToContainer(container: string[][], row: string[]): void {
        container.push(row);
    }

    protected processFields(fields: string[]): string[] {
        return fields;
    }
}