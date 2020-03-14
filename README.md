# project_covid19-stocks

## Things to be aware of:
- The datasets used for COVID-19 data and for the topojson use different names for each country.  For example, "China" in the topojson is "Mainland China" in the COVID-19 data and "United States of America" in the topojson is "US" in the COVID-19 data.
- Given the way we construct three different objects each with the same dataset in `main.js`, we are running dataset.initialize() three different times.  We don't need to do this.  What's a better solution?  Do we need all six (or more) data files?