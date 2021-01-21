import FileLoader from './loaders/file_loader';
import ScheduleParser from './parsers/csv/schedule_parser';
import { performance } from 'perf_hooks';
import ProgressMonitor from './diagnostics/progress_monitor';
import StopSchedule from './traffic/agency/stop_schedule';
import Gtfs from './gtfs';
import NetworkDownloader from './loaders/network_downloader';
import StopEventDescriptor from './traffic/realtime/stop_event_descriptor';
import StopEventFileStorage from './traffic/realtime/stop_event_file_storage';
import StopEventStorage from './traffic/realtime/stop_event_storage';

class TrelApp {
    protected gtfs: Gtfs;
    public stopStorage: StopEventStorage;

    public constructor() {
        this.gtfs = new Gtfs();

        this.stopStorage = new StopEventFileStorage('D:\\Dokumenty\\gtfs\\wyniki.csv');
        this.gtfs.setStopStorage(this.stopStorage);
    }

    async init() {
        console.log('Inicjalizacja...');
        let time;
        time = performance.now();

        await this.readGtfsSchedule();

        time -= performance.now();
        time = Math.floor(-time) / 1000;
        console.log(`Inicjalizacja zakończona! Zajęła ${time}s.`);
    }

    protected async readGtfsSchedule() {
        let loader = new FileLoader();
        let data_stream = loader.load("D:\\Dokumenty\\gtfs\\stop_times.txt");

        let progress_monitor = new ProgressMonitor(
            (pm) => { if(pm.value % 50000 == 0) console.log(`    Wczytano ${pm.value} wpisów`); }
        );

        console.log('Wczytywanie rozkładu jazdy...');

        let trips = await new ScheduleParser().parse(data_stream, true, progress_monitor);
        let schedule = new StopSchedule(trips);
        this.gtfs.loadStops(schedule);

        console.log('Rozkład jazdy wczytany!');
    }

    async parseGtfsRt(path: string) {
        let loader = new NetworkDownloader();
        let data_stream = loader.load(path);

        await this.gtfs.readStream(data_stream);
        console.log('Wczytano dane o położeniu pojazdów.');
    }
}

const url = "https://www.ztm.poznan.pl/pl/dla-deweloperow/getGtfsRtFile/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0Mi56dG0ucG96bmFuLnBsIiwiY29kZSI6MSwibG9naW4iOiJtaFRvcm8iLCJ0aW1lc3RhbXAiOjE1MTM5NDQ4MTJ9.ND6_VN06FZxRfgVylJghAoKp4zZv6_yZVBu_1-yahlo&file=vehicle_positions.pb";
const interval = 20;    // seconds

(async () => {
    let app = new TrelApp();
    await app.init();

    console.log('');
    console.log(`Dane o położeniu będą wczytywane co ${interval} sekund.`);
    await app.parseGtfsRt(url);

    setInterval(() => {
        app.parseGtfsRt(url);
    }, interval * 1000);
})();
