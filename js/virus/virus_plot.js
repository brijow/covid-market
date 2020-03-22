class VirusPlot extends Chart
{
    initVis()
    {
        super.initVis();
        let vis = this;

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
    }

    render()
    {
        let vis = this;

        // TODO
    }
}
