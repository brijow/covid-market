//////////////////////
/// CHOROPLETH MAP ///
//////////////////////

// Instantiate map dataset (data not loaded until we call initVis())
let mapData = new MapData({
  fileNames: ['data/covid_19_data.csv',
              'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',]
});
let map = new Map({
  parentElement: '#map',
  dataset : mapData,
  containerWidth: 1000,
  containerHeight: 500
});

//////////////////////
/// LINE+BAR CHART ///
//////////////////////

// Instantiate time series dataset (data not loaded until we call initVis())
let virusData = new VirusData({
  fileNames: ['data/time_series_covid_19_confirmed.csv',
              'data/time_series_covid_19_deaths.csv',
              'data/time_series_covid_19_recovered.csv',]
});

// Instantiate virus plot (data not loaded until we call initVis())
let virus = new VirusPlot({
  parentElement: '#virus-plot',
  dataset : virusData
});

//////////////////////
//// STOCKS CHART ////
//////////////////////

// Instantiate map dataset (data not loaded until we call initVis())
let stocksData = new StocksData({
  fileNames: ['data/s_p_500.csv',]
});
// Instantiate stocks plot (data not loaded until we call initVis())
let stocks = new StocksPlot({
  parentElement: '#stocks-plot',
  dataset : stocksData
});

// This does some Promise chaining:
// 1. Calls initVis() on dataset attribute (a Dataset object)
//    which returns a promise.
// 2. When that promise is resolved, dataset has been fully initialized,
//    and so we can finish initialization of choroplethMap.
map.initVis();
virus.initVis();
stocks.initVis();
