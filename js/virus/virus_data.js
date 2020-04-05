class VirusData
{
    constructor(_config)
    {
        this.availableCountries = [];

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
                    var temp_min = 0;
                    var temp_max = 0;

                    d["People"].forEach((p) =>
                    {
                        var old_number = country_data[p[0]] || 0;
                        var new_number = old_number + p[1];

                        country_data[p[0]] = Math.max(new_number, temp_max);

                        if (country_max < new_number)
                        {
                            country_max = new_number;
                        }

                        if (temp_max < new_number)
                        {
                            temp_max = new_number;
                        }
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

        this.availableCountries = Array.from(countries_temp);

        var virus_country_1 = $("#virus_country_1")[0];
        var virus_country_2 = $("#virus_country_2")[0];
        var virus_country_3 = $("#virus_country_3")[0];
        var virus_country_4 = $("#virus_country_4")[0];

        virus.config.dataset.availableCountries.forEach(c =>
        {
            var option_1 = document.createElement("option");
            option_1.value     = c;
            option_1.innerHTML = c;
            virus_country_1.appendChild(option_1);

            var option_2 = document.createElement("option");
            option_2.value     = c;
            option_2.innerHTML = c;
            virus_country_2.appendChild(option_2);

            var option_3 = document.createElement("option");
            option_3.value     = c;
            option_3.innerHTML = c;
            virus_country_3.appendChild(option_3);

            var option_4 = document.createElement("option");
            option_4.value     = c;
            option_4.innerHTML = c;
            virus_country_4.appendChild(option_4);
        });

        return countries_outp;
    }
}
