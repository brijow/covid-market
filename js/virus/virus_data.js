class VirusData
{
    constructor(_config)
    {
        this.covidDataConfirmed = _config.fileNames[0];
        this.covidDataDeaths    = _config.fileNames[1];
        this.covidDataRecovered = _config.fileNames[2];

        this.cleanedCovidDataConfirmed = [];
        this.cleanedCovidDataDeaths    = [];
        this.cleanedCovidDataRecovered = [];

        this.dataAvailable = false;
    }

    initialize()
    {
        let dataset = this;

        return Promise.all([
            d3.csv(dataset.covidDataConfirmed),
            d3.csv(dataset.covidDataDeaths),
            d3.csv(dataset.covidDataRecovered),
        ]).then(files =>
        {
            dataset.cleanedCovidDataConfirmed = dataset.cleanCovidTimeSeries(files[0]);
            dataset.cleanedCovidDataDeaths    = dataset.cleanCovidTimeSeries(files[1]);
            dataset.cleanedCovidDataRecovered = dataset.cleanCovidTimeSeries(files[2]);

            dataset.dataAvailable = true;
            return dataset;
        });
    }

    cleanCovidTimeSeries(file)
    {
        // All the time series data takes on the same format.
        // TODO: clean data
        return file
    }
}
