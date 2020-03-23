class VirusPlot extends Chart
{
    initVis()
    {
        super.initVis();
        let vis = this;

        vis.selected_country_name_1 = "Mainland China";
        vis.selected_country_name_2 = "Thailand";
        vis.number_of_days          = 5;

        vis.visualize_confirmed     = true;
        vis.visualize_dead          = false;
        vis.visualize_recovered     = false;

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

        dataset = vis.dataset;

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
        var country_1 = null;
        var country_2 = null;

        dataset.forEach(data =>
        {
            if (data.name === vis.selected_country_name_1)
            {
                country_1 = data;
            }

            if (data.name === vis.selected_country_name_2)
            {
                country_2 = data;
            }
        });

        // the following code is used to bound countries
        country_1.data = country_1.data.slice(Math.max(country_1.data.length - vis.number_of_days, 0));
        country_2.data = country_2.data.slice(Math.max(country_2.data.length - vis.number_of_days, 0));

        var abs_min    = 0;
        var abs_max    = country_1.max > country_2.max ? country_1.max : country_2.max;

        // the following code is used to draw our graph
        var target_svg    = d3.select("#virus_plot");
        var target_width  = +target_svg.attr("width")  || 800;
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
            .domain(country_1.data.map(xValue))
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
        chartAxisX.selectAll(".domain").remove();
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
        chartAxisY.selectAll(".domain").remove();
        chartAxisY.selectAll(".virus_axis_label").data([null])
            .enter().append("text")
            .merge(chartAxisY.selectAll(".virus_axis_label").data([null]))
            .attr("class", "virus_axis_label")
            .attr("x",     -innerHeight/2)
            .attr("y",     -70)
            .attr("transform",   "rotate(-90)")
            .attr("text-anchor", "middle")
            .text(yAxisLabel);

        // here we are currently rendering the country #1
        let c1_selection = chart.selectAll(".virus_rect_c1").data(country_1.data);

        c1_selection.enter().append("rect")
            .merge(c1_selection)
            .attr("fill",   "blue")
            .attr("class",  "virus_rect_c1")
            .transition().duration(150)
            .attr("x",      (d) => AxisScaleX(xValue(d)) + AxisScaleX.bandwidth()/2*0)
            .attr("width",  (d) => AxisScaleX.bandwidth()/2)
            .transition().duration(150)
            .attr("y",      (d) => innerHeight - AxisScaleY(yValue(d)))
            .attr("height", (d) => AxisScaleY(yValue(d)));

        c1_selection.exit().remove();

        // here we are currently rendering the country #2
        let c2_selection = chart.selectAll(".virus_rect_c2").data(country_2.data);

        c2_selection.enter().append("rect")
            .merge(c2_selection)
            .attr("fill",   "red")
            .attr("class",  "virus_rect_c2")
            .transition().duration(150)
            .attr("x",      (d) => AxisScaleX(xValue(d)) + AxisScaleX.bandwidth()/2*1)
            .attr("width",  (d) => AxisScaleX.bandwidth()/2)
            .transition().duration(150)
            .attr("y",      (d) => innerHeight - AxisScaleY(yValue(d)))
            .attr("height", (d) => AxisScaleY(yValue(d)));

        c2_selection.exit().remove();
    }
}
