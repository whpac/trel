import ProgressMonitor from '../../diagnostics/progress_monitor';
import Stream from '../../loaders/stream';

/**
 * This class enables user to select all the needed data at the very moment of reading it.
 */
export default abstract class MemoryEfficientCsvParser<T> {

    public async parse(s: Stream, skip_header: boolean = false, progress_monitor?: ProgressMonitor) {
        let line: string;
        let processed_fields: T[] = [];
        let line_number = 0;

        try {
            if(skip_header) s.readLine();

            while(true) {
                line = s.readLine();
                if(line == '') continue;

                if(progress_monitor !== undefined)
                    progress_monitor.value = ++line_number;

                var fields = this.parseLine(line);
                processed_fields.push(this.processFields(fields));
            }
        } catch(e) {
            // Exception on EOF
        }

        return processed_fields;
    }

    protected abstract processFields(fields: string[]): T;

    protected parseLine(line: string): string[] {
        let fields: string[] = [];
        let current_field = '';
        let is_in_quotes = false;

        let prev_char = '\0';
        for(let c of line) {
            if(c == '"') {
                is_in_quotes = !is_in_quotes;
                if(prev_char == '"') {
                    current_field += c;
                    prev_char = '\0';
                }
                else prev_char = c;
            }
            else if(c == ',' && !is_in_quotes) {
                fields.push(current_field);
                current_field = "";
                prev_char = '\0';
            }
            else {
                current_field += c;
                prev_char = c;
            }
        }
        fields.push(current_field);
        return fields;
    }
}