class StocksData {

  constructor(_config) {
    this.snpFile = _config.fileNames[0];
    this.snpData = []; // cleaned data goes here
    this.minDate = _config.minDate;
    this.maxDate = _config.maxDate;
    this.dataAvailable = false;
  }

  initialize() {
    let dataset = this;

    // Use Promise.all because we plan to use multiple stock data files,
    // for now we just have the one S&P500 dataset.
    return Promise.all([
      d3.csv(dataset.snpFile, d3.autoType),
    ]).then(files => {

      // Filter by dataset.minDate and dataset.maxDate
      dataset.snpData = files[0].filter( (row) => {
          //debugger;
          return (row.Date >= dataset.minDate && row.Date <= dataset.maxDate)
      });

      dataset.dataAvailable = true;
      return dataset;
    });
  }
}
