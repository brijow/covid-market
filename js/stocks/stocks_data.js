class StocksData {

  constructor(_config) {
    this.snpFile = _config.fileNames[0];
    this.snpData = []; // cleaned data goes here
    this.dataAvailable = false;
  }

  initialize() {
    let dataset = this;

    // Use Promise.all because we plan to use multiple stock data files,
    // for now we just have the one S&P500 dataset.
    return Promise.all([
      d3.csv(dataset.snpFile, d3.autoType),
    ]).then(files => {
      dataset.snpData = dataset.cleanSnpData(files[0]);
      dataset.dataAvailable = true;
      return dataset;
    });
  }

  cleanSnpData(rawSnpData) {
    // TODO: Possibly clean data further. For now, d3.autoType is enough
    return rawSnpData
  }
}
