class VirusPlot extends Chart
{
    initVis()
    {
        super.initVis();
        let vis = this;

        vis.selected_countries_array  = ["Mainland China"];
        vis.selected_countries_color  = ["red"];
        vis.selected_countries_length = 1;
        vis.number_of_days            = 10;

        vis.visualize_confirmed       = false;
        vis.visualize_dead            = false;
        vis.visualize_recovered       = true;

        vis.show_x_domain_border      = false;
        vis.show_y_domain_border      = false;

        // Promise chaining: dataset has its own initialize() method we wait for
        vis.config.dataset.initialize().then(dataset =>
        {
            vis.virgin_dataset = dataset;

            vis.render(dataset);
        });
    }

    update()
    {
        let vis = this;

        let dataset = {...vis.virgin_dataset};

        vis.render(dataset);
    }

    render(dataset)
    {
        let vis = this;

        vis.handle_chart_state();

        // the following code is used to extract dataset
        if (vis.visualize_confirmed)
        {
            dataset = dataset.cleanedCovidDataConfirmed;
        }

        if (vis.visualize_dead)
        {
            dataset = dataset.cleanedCovidDataDeaths;
        }

        if (vis.visualize_recovered)
        {
            dataset = dataset.cleanedCovidDataRecovered;
        }

        // the following code is used to extract countries
        var countries = [];

        vis.selected_countries_array.forEach(selection =>
        {
            dataset.forEach(data =>
            {
                if (data.name === selection)
                {
                    countries.push({...data});
                }
            });
        });

        // the following code is used to bound countries
        var abs_min = 0;
        var abs_max = 0;

        countries.forEach(country =>
        {
            country.data = country.data.slice(Math.max(country.data.length - vis.number_of_days, 0));

            country.data.forEach(d =>
            {
                d = d.slice();
            });

            if (abs_max < country.max)
            {
                abs_max = country.max;
            }
        });

        if (countries.length === 0)
        {
            var graft_country = {...dataset[0]};

            graft_country.name = vis.selected_countries_array[0];
            graft_country.data = graft_country.data.slice(Math.max(graft_country.data.length - vis.number_of_days, 0));

            graft_country.data.forEach(d =>
            {
                d    = d.slice();
                d[1] = 0;
            });

            countries.push(graft_country);
        }

        // the following code is used to draw our graph
        var target_svg    = d3.select("#virus_plot");
        var target_width  = +target_svg.attr("width")  || 1200;
        var target_height = +target_svg.attr("height") || 600;

        var margin = { top    : 20,
                       bottom : 60,
                       left   : 90,
                       right  : 40};

        var innerWidth  = target_width  - margin.left - margin.right;
        var innerHeight = target_height - margin.top  - margin.bottom;

        const xValue     = d => d[0];
        const xAxisLabel = "Date";

        const yValue     = d => d[1];
        const yAxisLabel = "Number of People";

        // here we are currently rendering the charts
        const chart = target_svg.selectAll("#virus_chart").data([null])
            .enter().append("g")
            .merge(target_svg.selectAll("#virus_chart").data([null]))
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .attr("id",        "virus_chart");

        // here we are currently rendering the axes
        const AxisScaleX = d3.scaleBand()
            .domain(countries[0].data.map(xValue))
            .range([0, innerWidth])
            .padding(0.25);

        const AxisScaleY = d3.scaleLinear()
            .domain([0, abs_max])
            .range([innerHeight, 0])
            .nice();

        const AxisX = d3.axisBottom(AxisScaleX)
            .tickSize(-innerHeight)
            .tickPadding(15);

        const AxisY = d3.axisLeft(AxisScaleY)
            .tickSize(-innerWidth)
            .tickPadding(15);

        const chartAxisX = chart.selectAll("#virus_axis_x").data([null])
            .enter().append("g")
            .merge(chart.selectAll("#virus_axis_x").data([null]))
            .call(AxisX)
            .attr("transform", `translate(0,${innerHeight})`)
            .attr("id",        "virus_axis_x");

        if (!vis.show_x_domain_border)
        {
            chartAxisX.selectAll(".domain").remove();
        }

        chartAxisX.selectAll(".virus_axis_label").data([null])
            .enter().append("text")
            .merge(chartAxisX.selectAll(".virus_axis_label").data([null]))
            .attr("class", "virus_axis_label")
            .attr("x",     innerWidth/2)
            .attr("y",     70)
            .text(xAxisLabel);

        const chartAxisY = chart.selectAll("#virus_axis_y").data([null])
            .enter().append("g")
            .merge(chart.selectAll("#virus_axis_y").data([null]))
            .call(AxisY)
            .attr("id", "virus_axis_y");

        if (!vis.show_y_domain_border)
        {
            chartAxisY.selectAll(".domain").remove();
        }

        chartAxisY.selectAll(".virus_axis_label").data([null])
            .enter().append("text")
            .merge(chartAxisY.selectAll(".virus_axis_label").data([null]))
            .attr("class", "virus_axis_label")
            .attr("x",     -innerHeight/2)
            .attr("y",     -70)
            .attr("transform",   "rotate(-90)")
            .attr("text-anchor", "middle")
            .text(yAxisLabel);

        // here we are currently rendering the countries
        for (var i=0; i<vis.selected_countries_length; i++)
        {
            let cn_selection = chart.selectAll(".virus_rect_c" + i).data(countries[i].data);
            let cn_division  = vis.selected_countries_length;

            cn_selection.enter().append("rect")
                .merge(cn_selection)
                .attr("fill",   vis.selected_countries_color[i])
                .attr("class",  "virus_rect_c" + i)
                .transition().duration(150)
                .attr("x",      (d) => AxisScaleX(xValue(d)) + AxisScaleX.bandwidth()/cn_division*i)
                .attr("width",  (d) => AxisScaleX.bandwidth()/cn_division)
                .transition().duration(150)
                .attr("y",      (d) => AxisScaleY(yValue(d)))
                .attr("height", (d) => innerHeight - AxisScaleY(yValue(d)));

            cn_selection.exit().remove();
        }
    }

    handle_chart_state()
    {
        let vis = this;

        var regular_name_array   = vis.virgin_dataset.availableCountries;
        var reversed_name_object = swap(MapDict);

        // the following logic is for when 0 selected countries
        if (state.selectedCountry === null)
        {
            vis.selected_countries_array = ["worldwide"];

            return;
        }

        // the following logic is for when 1 selected countries
        else
        {
            var regular_name  = state.selectedCountry;
            var reversed_name = null;
            var unfound_name  = null;

            if (regular_name === "China")
            {
                regular_name = "Mainland China";
            }

            if (regular_name === "Russia")
            {
                regular_name = "Russian Federation";
            }

            var name_in_reg_array  = regular_name_array.includes(regular_name);
            var name_in_rev_object = reversed_name_object.hasOwnProperty(regular_name);

            // here we have logic handling selected regular name
            if (name_in_reg_array)
            {
                vis.selected_countries_array = [regular_name];

                return;
            }

            // here we have logic handling selected reversed name
            if (name_in_rev_object)
            {
                reversed_name = reversed_name_object[regular_name];

                vis.selected_countries_array = [reversed_name];

                return;
            }

            // here we have logic handling selected unfound name
            else
            {
                unfound_name = state.selectedCountry;

                vis.selected_countries_array = [unfound_name];

                return;
            }
        }
    }
}
