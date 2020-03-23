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
        var countries_temp = new Set();

        var countries_outp = [];

        // step 1) here we are doing cleaning of the data
        file.forEach((d) =>
        {
            d["Province/State"] =  d["Province/State"].trim();
            d["Country/Region"] =  d["Country/Region"].trim();
            d["Lat"]            = +d["Lat"];
            d["Long"]           = +d["Long"];
            d["People"]         = [];

            for (var index in d)
            {
                if (!d.hasOwnProperty(index))
                {
                    continue;
                }

                if (index !== "Province/State" &&
                    index !== "Country/Region" &&
                    index !== "Lat"            &&
                    index !== "Long"           &&
                    index !== "People")
                {
                    var element_1 = index;
                    var element_2 = +d[index];
                    var element_p = [element_1, element_2];

                    d["People"].push(element_p);
                    delete d[index];
                }
            }

            if (d["Country/Region"] !== "")
            {
                countries_temp.add(d["Country/Region"]);
            }
        });

        // step 2) here we are doing grouping of the data
        countries_temp.forEach((c) =>
        {
            var country_name = c;
            var country_data = {};
            var country_arry = [];

            var country_min  = 0;
            var country_max  = 0;

            file.forEach((d) =>
            {
                if (d["Country/Region"] === country_name)
                {
                    d["People"].forEach((p) =>
                    {
                        var old_number = country_data[p[0]] || 0;
                        var new_number = old_number + p[1];

                        country_data[p[0]] = new_number;
                    });
                }
            });

            for (var index in country_data)
            {
                if (!country_data.hasOwnProperty(index))
                {
                    continue;
                }

                country_arry.push([index, country_data[index]]);
            }

            countries_outp.push({"name":country_name,
                                 "data":country_arry,
                                 "min" :country_min,
                                 "max" :country_max});
        });

        return countries_outp;
    }
}
