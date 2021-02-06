import { performance } from 'perf_hooks';
import Gtfs from './gtfs';
import NetworkDownloader from './loaders/network_downloader';
import StopEventFileStorage from './traffic/realtime/stop_event_file_storage';
import StopEventStorage from './traffic/realtime/stop_event_storage';
import AdmZip = require('adm-zip');
import NetworkStreamReader from './loaders/network_stream_reader';
import CsvParser from './parsers/csv/csv_parser';
import StringStream from './loaders/string_stream';
import { rename } from 'fs';
import DirectoryLister from './loaders/directory_lister';

class TrelApp {
    protected gtfs: Gtfs;
    public stopStorage: StopEventStorage;

    protected readonly gtfsDir = './data/';

    public constructor() {
        this.gtfs = new Gtfs();

        this.stopStorage = new StopEventFileStorage(this.gtfsDir + 'wyniki.csv');
        this.gtfs.setStopStorage(this.stopStorage);
    }

    async init(schedule_url: string) {
        console.log('Inicjalizacja...');
        let time;
        time = performance.now();

        await this.readGtfsSchedule(schedule_url);

        time -= performance.now();
        time = Math.floor(-time) / 1000;
        console.log(`Inicjalizacja zakończona! Zajęła ${time}s.`);
    }

    async readGtfsSchedule(schedule_url: string) {
        console.log('Wczytywanie rozkładu jazdy...');

        await this.downloadGtfs(schedule_url);
        let file = await this.getCurrentScheduleFile();
        await this.gtfs.loadStops(file);

        console.log('Rozkład jazdy wczytany!');
    }

    async downloadGtfs(schedule_url: string) {
        let loader = new NetworkDownloader();
        let data_stream = loader.load(schedule_url) as NetworkStreamReader;
        let buf = { buffer: Buffer.alloc(0) };
        await data_stream.read(buf, Number.POSITIVE_INFINITY);
        let zip = new AdmZip(buf.buffer);

        let s = new StringStream(zip.readAsText('feed_info.txt'));
        let csv_parser = new CsvParser();
        let data = await csv_parser.parse(s, true);
        let start_date = data[0][3];

        zip.extractEntryTo('stop_times.txt', this.gtfsDir + 'schedule', undefined, true);
        rename(this.gtfsDir + '/schedule/stop_times.txt', this.gtfsDir + 'schedule/' + start_date + '.stop_times.txt', () => { });
    }

    async getCurrentScheduleFile() {
        let today = new Date();
        let today_text = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        let files = await DirectoryLister.listDir(this.gtfsDir + 'schedule', false);
        files.sort().reverse();

        for(let file of files) {
            let parts = file.split('.');
            try {
                if(parseInt(parts[0]) <= today_text) {
                    return this.gtfsDir + 'schedule/' + file;
                }
            } catch(e) { }
        }
        throw new Error('Nie znaleziono aktualnego rozkładu jazdy');
    }

    async parseGtfsRt(path: string) {
        let loader = new NetworkDownloader();
        let data_stream = loader.load(path);

        await this.gtfs.readStream(data_stream);
        console.log('Wczytano dane o położeniu pojazdów.');
    }
}

const rt_url = "https://www.ztm.poznan.pl/pl/dla-deweloperow/getGtfsRtFile/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0Mi56dG0ucG96bmFuLnBsIiwiY29kZSI6MSwibG9naW4iOiJtaFRvcm8iLCJ0aW1lc3RhbXAiOjE1MTM5NDQ4MTJ9.ND6_VN06FZxRfgVylJghAoKp4zZv6_yZVBu_1-yahlo&file=vehicle_positions.pb";
const sched_url = 'https://www.ztm.poznan.pl/pl/dla-deweloperow/getGTFSFile?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0Mi56dG0ucG96bmFuLnBsIiwiY29kZSI6MSwibG9naW4iOiJtaFRvcm8iLCJ0aW1lc3RhbXAiOjE1MTM5NDQ4MTJ9.ND6_VN06FZxRfgVylJghAoKp4zZv6_yZVBu_1-yahlo';
const interval = 20;    // seconds

async function main() {
    try {
        let app = new TrelApp();
        await app.init(sched_url);

        console.log('');
        console.log(`Dane o położeniu będą wczytywane co ${interval} sekund.`);
        await app.parseGtfsRt(rt_url);

        let iteration = 0;
        let timer = setInterval(async () => {
            try {
                await app.parseGtfsRt(rt_url);

                iteration++;
                if(iteration % Math.floor(120 * 60 / interval) == 0) {
                    await app.readGtfsSchedule(sched_url);
                }
            } catch(e) {
                let message = '';
                if('message' in e) message = e.message;
                else message = e.toString();

                console.log(`Wystąpił błąd: ${message}.`);
                clearInterval(timer);

                main();
            }
        }, interval * 1000);
    } catch(e) {
        let message = '';
        if('message' in e) message = e.message;
        else message = e.toString();

        console.log(`Wystąpił błąd: ${message}.`);

        main();
    }
}

(async () => {
    main();
})();
