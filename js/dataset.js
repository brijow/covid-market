class Dataset {

  constructor(_config) {
    this.covidDataMain = _config.fileNames[0];
    this.covidDataConfirmed = _config.fileNames[1];
    this.covidDataDeaths = _config.fileNames[2];
    this.covidDataRecovered = _config.fileNames[3];
    this.stocksData = _config.fileNames[4];
    this.topoJson = _config.fileNames[5];

    this.cleanedCovidDataMain = [];
    this.cleanedCovidDataConfirmed = [];
    this.cleanedCovidDataDeaths = [];
    this.cleanedCovidDataRecovered = [];
    this.cleanedStocksData = [];
    this.cleanedTopoJson = [];

    this.dataAvailable = false;
  }

  initialize() {
    let dataset = this;
    return Promise.all([
      d3.csv(dataset.covidDataMain),
      d3.csv(dataset.covidDataConfirmed),
      d3.csv(dataset.covidDataDeaths),
      d3.csv(dataset.covidDataRecovered),
      d3.csv(dataset.stocksData),
      d3.json(dataset.topoJson),
    ]).then(files => {
      dataset.cleanedCovidDataMain = dataset.cleanCovidDataMain(files[0]);
      dataset.cleanedCovidDataConfirmed = dataset.cleanCovidTimeSeries(files[1]);
      dataset.cleanedCovidDataDeaths = dataset.cleanCovidTimeSeries(files[2]);
      dataset.cleanedCovidDataRecovered = dataset.cleanCovidTimeSeries(files[3]);
      dataset.cleanedStocksData = dataset.cleanStocksData(files[4]);
      dataset.cleanedTopoJson = dataset.cleanTopoJson(files[5]);

      dataset.dataAvailable = true;
      return dataset;
    });
  }

  cleanCovidDataMain(file) {
    file.forEach(d => {
      d['SNo'] = +d['SNo'];
      d['ObservationDate'] = new Date(d['ObservationDate']);
      d['Last Update'] = new Date(d['Last Update']);
      d['Confirmed'] = +d['Confirmed'];
      d['Deaths'] = +d['Deaths'];
      d['Recovered'] = +d['Recovered'];
    });
    return file
  }

  cleanCovidTimeSeries(file) {
    // All the time series data takes on the same format.
    // TODO: clean data
    return file
  }

  cleanStocksData(file) {
    // TODO: clean data
    return file
  }

  cleanTopoJson(file) {
    // TODO: clean data
    return file
  }
}
