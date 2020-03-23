class VirusPlot extends Chart
{
    initVis()
    {
        super.initVis();
        let vis = this;

        vis.selected_country_name_1 = "Mainland China";
        vis.selected_country_name_2 = "Thailand";
        vis.number_of_days          = 5;

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

        console.log(country_1);
    }
}
