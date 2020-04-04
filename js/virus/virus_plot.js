class VirusPlot extends Chart
{
    initVis()
    {
        super.initVis();
        let vis = this;

        vis.selected_countries_array  = ["Mainland China", "Italy"];
        vis.selected_countries_color  = ["red",            "blue"];
        vis.selected_countries_length = 2;
        vis.number_of_days            = 10;

        vis.visualize_confirmed       = false;
        vis.visualize_dead            = false;
        vis.visualize_recovered       = true;

        vis.show_x_domain_border      = false;
        vis.show_y_domain_border      = false;

        // Promise chaining: dataset has its own initialize() method we wait for
        vis.config.dataset.initialize().then(dataset =>
        {
            vis.dataset = dataset;

            vis.render(dataset);
        });
    }

    update()
    {
        let vis = this;

        let dataset = vis.dataset;

        vis.render(dataset);
    }

    render(dataset)
    {
        let vis = this;

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
                    countries.push(data);
                }
            });
        });

        // the following code is used to bound countries
        var abs_min = 0;
        var abs_max = 0;

        countries.forEach(country =>
        {
            country.data = country.data.slice(Math.max(country.data.length - vis.number_of_days, 0));

            if (abs_max < country.max)
            {
                abs_max = country.max;
            }
        });

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
}
