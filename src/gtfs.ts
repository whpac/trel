import DirectoryLister from './loaders/directory_lister';
import FileLoader from './loaders/file_loader';
import Stream from './loaders/stream';
import FeedMessage from './parsers/feed_entities/feed_message';
import FeedParser from './parsers/gtfs-rt/feed_parser';
import PbReader from './parsers/protobuf/pb_reader';
import StopSchedule from './traffic/agency/stop_schedule';
import DifferentialAnalyzer from './traffic/realtime/differential_analyzer';
import StopEventMemoryStorage from './traffic/realtime/stop_event_memory_storage';
import StopEventStorage from './traffic/realtime/stop_event_storage';
import StopTimesRegistry from './traffic/realtime/stop_times_registry';

export default class Gtfs {
    protected analyzer: DifferentialAnalyzer;
    protected stopTimesRegistry: StopTimesRegistry | undefined;
    protected stopStorage: StopEventStorage;

    public constructor() {
        this.analyzer = new DifferentialAnalyzer();
        this.stopStorage = new StopEventMemoryStorage();
    }

    public loadStops(schedule: StopSchedule): void {
        this.stopTimesRegistry = new StopTimesRegistry(schedule, this.stopStorage);
    }

    public setStopStorage(storage: StopEventStorage): void {
        this.stopStorage = storage;
        this.stopTimesRegistry?.setStorage(this.stopStorage);
    }

    public async readStream(data_stream: Stream): Promise<void> {
        if(this.stopTimesRegistry === undefined) throw new Error("StopSchedule hasn't been loaded.");

        let fm = new FeedMessage();
        await PbReader.parseMessageInto(data_stream, fm);
        let vehicles = FeedParser.parseFeed(fm);

        this.analyzer.analyzeNewData(vehicles, this.stopTimesRegistry);
    }

    public async readDirectory(path: string): Promise<void> {
        let files = await DirectoryLister.listDir(path, true);
        files = files.sort();

        for(let file of files) {
            if(!file.endsWith(".pb")) continue;

            let loader = new FileLoader();
            let stream = loader.load(file);
            await this.readStream(stream);
        }
    }
}