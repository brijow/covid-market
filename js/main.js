/*
 * State management
 * ----------------
 * We will use this state variable in order to keep track of things for bidirectional
 * interactivity.  These include start/end dates and the selected countries.
 *
 * Note for developers: The three things that you will need to access in your update()
 * method are:
 *   - state.startDate
 *   - state.endDate
 *   - state.selectedCountries
 * NEVER MODIFY THESE PROPERTIES WITHOUT CALLING THE SETTERS!  The setters will take care
 * of error checking and calling the update() method of all the charts.
 */
const DATE_START = new Date('01/22/2020'); // min date common to all our datasets
const DATE_END = new Date('03/11/20');     // max date common to all our datasets
const MAX_COUNTRIES = 4;                   // select maximum of 4 countries at a time

const state = {
  startDate: DATE_START,
  endDate: DATE_END,
  selectedCountries: [],

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
    if (this.selectedCountries.length < MAX_COUNTRIES && !this.selectedCountries.includes(country)) {
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
    //stocks.update(); TODO: uncomment when/if stocks.update() is implemented (may not be necessary to update as dates don't change and currently no country data)
  }
};

/*
 * Instantiate Dataset objects
 * ---------------------------
 */
const mapData = new MapData({
  fileNames: ['data/covid_19_data.csv',
              'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',]
});
const virusData = new VirusData({
  fileNames: ['data/time_series_covid_19_confirmed.csv',
              'data/time_series_covid_19_deaths.csv',
              'data/time_series_covid_19_recovered.csv',]
});
const stocksData = new StocksData({
  files: [ { file:  'data/s_p_500.csv',
             label: 'S&P 500' },
           { file:  'data/dow_jones.csv',
             label: 'DOW JONES' },
           { file:  'data/gold.csv',
             label: 'GOLD' },
           { file:  'data/crude_oil.csv',
             label: 'CRUDE OIL' } ],
  minDate: DATE_START,
  maxDate: DATE_END
});

/*
 * Instantiate Chart objects
 * ---------------------------
 * 1. Choropleth map
 *   - visualize covid-19 statistics per country within a variable date range
 *   - state.startDate and state.endDate are used for the date range
 *
 * 2. Grouped bar chart
 *   - compare covid-19 statistics between countries within a variable date range
 *   - state.startDate and state.endDate are used for the date range
 *
 * 3. Multi-line chart
 *   - visualize stock market changes over a fixed date range
 *   - DATE_START and DATE_END are used for the (fixed) date range
 *   - a brush (will be) used to set state.startDate and state.endDate (TODO)
 */
const map = new Map({
  parentElement: '#map',
  dataset : mapData,
  containerWidth: "100%",
  containerHeight: "100%"
});
const virus = new VirusPlot({
  parentElement: '#virus_plot',
  dataset : virusData,
  containerWidth: "100%",
  containerHeight: "100%"
});
const stocks = new StocksPlot({
  parentElement: '#stocks_plot',
  dataset : stocksData,
  containerWidth: 1200,
  containerHeight: 200
});

/*
 * Initialize and render all the charts
 * ------------------------------------
 * NOTE: each <Chart>.initvis() involves some Promise chaining.
 */
map.initVis();
virus.initVis();
stocks.initVis();

/*
 * The following code is for Alan's chart
 */
$(document).ready(function()
{
    $("#form_virus_display").change(function()
    {
        selected_value = $("input[name='name_virus_display']:checked").val();

        if (selected_value === "confirmed")
        {
            virus.visualize_confirmed = true;
            virus.visualize_dead      = false;
            virus.visualize_recovered = false;
            virus.update();
        }

        if (selected_value === "dead")
        {
            virus.visualize_confirmed = false;
            virus.visualize_dead      = true;
            virus.visualize_recovered = false;
            virus.update();
        }

        if (selected_value === "recovered")
        {
            virus.visualize_confirmed = false;
            virus.visualize_dead      = false;
            virus.visualize_recovered = true;
            virus.update();
        }
    });
});
