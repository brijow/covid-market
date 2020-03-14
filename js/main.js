// Instantiate dataset (data not loaded until we call initVis())
let dataset = new Dataset({
  fileNames: ['data/covid_19_data.csv',
              'data/time_series_covid_19_confirmed.csv',
              'data/time_series_covid_19_deaths.csv',
              'data/time_series_covid_19_recovered.csv',
              'data/s_p_500.csv',
              'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',]
});

// Instantiate map (data not loaded until we call initVis())
let map = new Map({
  parentElement: '#map',
  dataset : dataset
});

// Instantiate virus plot (data not loaded until we call initVis())
let virus = new VirusPlot({
  parentElement: '#virus-plot',
  dataset : dataset
});


// Instantiate stocks plot (data not loaded until we call initVis())
let stocks = new StocksPlot({
  parentElement: '#stocks-plot',
  dataset : dataset
});


// This does some Promise chaining:
// 1. Calls initVis() on dataset attribute (a PopulationDataset object)
//    which returns a promise.
// 2. When that promise is resolved, dataset has been fully initialized,
//    and so we can finish initialization of choroplethMap.
map.initVis();
virus.initVis();
stocks.initVis();
