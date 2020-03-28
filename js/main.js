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
  containerWidth: "100%",
  containerHeight: "100%"
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
  parentElement: '#virus_plot',
  dataset : virusData,
  containerWidth: "100%",
  containerHeight: "100%"
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
  parentElement: '#stocks_plot',
  dataset : stocksData,
  containerWidth: 1200,
  containerHeight: 200
});

//////////////////////
// STATE MANAGEMENT //
//////////////////////

// We will use this state variable in order to keep track of things for bidirectional
// interactivity.  These include start/end dates and the selected countries.
//
// Note for developers: The three things that you will need to access in your update()
// method are:
//   - state.startDate
//   - state.endDate
//   - state.selectedCountries
// NEVER MODIFY THESE PROPERTIES WITHOUT CALLING THE SETTERS!  The setters will take care
// of error checking and calling the update() method of all the charts.

// First: set constants and defaults
// Set the default start and end dates to the date ranges in our COVID-19 data
// Set selected countries to be empty, with a limit on 4 countries at a time
const DATE_START = new Date('01/22/2020');
const DATE_END = new Date('03/11/20');
const MAX_COUNTRIES = 4;

// Next, declare state
const state = {
  // Variables
  startDate: DATE_START,
  endDate: DATE_END,
  selectedCountries: [],

  // Setters
  setStartDate: function(date) {
    if (date < this.endDate && date >= DATE_START) {
      this.startDate = date;
    } else if (date > this.endDate && date <= DATE_END) {
      this.startDate = this.endDate;
      this.endDate = date;
    }
    this.updateAll();
  },

  setEndDate: function(date) {
    if (date > this.startDate && date <= DATE_END) {
      this.endDate = date;
    } else if (date < this.startDate && date >= DATE_START) {
      this.endDate = this.startDate;
      this.startDate = date;
    }
    this.updateAll();
  },

  addSelectedCountry: function(country) {
    if (this.selectedCountries.length < MAX_COUNTRIES && !this.selectedCountries.contains(country)) {
      this.selectedCountries.push(country);
      this.updateAll();
    }
  },

  removeSelectedCountry: function(country) {
    if (this.selectedCountries.includes(country)) {
      this.selectedCountries = this.selectedCountries.filter(c => c !== country);
      this.updateAll();
    }
  },

  clearAllCountries: function() {
    this.selectedCounties = [];
    this.updateAll();
  },

  updateAll: function() {
    map.update();
    virus.update();
    stocks.update();
  }
};
console.log(state);

// This does some Promise chaining:
// 1. Calls initVis() on dataset attribute (a Dataset object)
//    which returns a promise.
// 2. When that promise is resolved, dataset has been fully initialized,
//    and so we can finish initialization of choroplethMap.
map.initVis();
virus.initVis();
stocks.initVis();
