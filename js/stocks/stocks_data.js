class StocksData {

  constructor(_config) {
    this.stocksData = _config.fileNames[0];

    this.cleanedStocksData = [];

    this.dataAvailable = false;
  }

  initialize() {
    let dataset = this;
    return Promise.all([
      d3.csv(dataset.stocksData),
    ]).then(files => {
      dataset.cleanedStocksData = dataset.cleanStocksData(files[0]);

      dataset.dataAvailable = true;
      return dataset;
    });
  }

  cleanStocksData(file) {
    // TODO: clean data
    return file
  }
}
