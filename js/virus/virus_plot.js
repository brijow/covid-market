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

        // the following code is used to draw our graph
        var target_svg    = d3.select("#virus_plot");
        var target_width  = +target_svg.attr("width");
        var target_height = +target_svg.attr("height");
    }
}
