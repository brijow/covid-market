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

    render()
    {
        let vis = this;

        // TODO
    }
}
