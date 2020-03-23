class VirusPlot extends Chart
{
    initVis()
    {
        super.initVis();
        let vis = this;

        vis.selected_country_name_1 = "Mainland China";
        vis.selected_country_name_2 = "Thailand";

        // Promise chaining: dataset has its own initialize() method we wait for
        vis.config.dataset.initialize().then(dataset =>
        {
            console.log(dataset);

            // TODO: handle data as required for this chart
            vis.update();
        });
    }

    update()
    {
        let vis = this;

        // TODO
        vis.render();
    }

    render()
    {
        let vis = this;

        // TODO
    }
}
