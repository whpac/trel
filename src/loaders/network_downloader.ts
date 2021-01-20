import http = require('http');
import https = require('https');
import DataLoader from './data_loader';
import NetworkStreamReader from './network_stream_reader';
import Stream from './stream';

export default class NetworkDownloader implements DataLoader {

    /**
     * Creates a stream with downloaded data
     * @param url URL to download from
     */
    load(url: string): Stream {
        let stream = new NetworkStreamReader();

        let get;
        if(url.startsWith('https')) get = https.get;
        else get = http.get;

        get(url, function (response) {
            response.on('readable', () => {
                let data;
                while(data = response.read()) {
                    if(data === null) break;
                    stream.newData(data);
                }
            });
            response.on('end', () => stream.close());
        }).on('error', function (err) { // Handle errors
        });

        return stream;
    }
}