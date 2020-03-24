class Chart {

  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 500,
      dataset: _config.dataset
    }
    this.config.margin = _config.margin || { top: 20, bottom: 50, right: 20, left: 50 }
  }

  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Set width and height of parent to allow vis to be fully seen
    vis.parent = d3.select(vis.config.parentElement)
      .attr('height', vis.config.containerHeight)
      .attr('width', vis.config.containerWidth);

    // Define what the chart is
    vis.svg = vis.parent;
    //vis.svg = vis.parent.append('svg')
            //.attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // If there's anything else that relates to all components, we should handle it here.
  }
}
