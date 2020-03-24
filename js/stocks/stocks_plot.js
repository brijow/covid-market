class StocksPlot extends Chart {

  constructor(_config) {
    super(_config);
    super.initVis(); // TODO: refactor super constructor and initVis and then remove this line

    const m = this.config.margin;

    this.g = this.svg.append('g')
      .attr('transform', `translate(${m.left},${m.top})`);

    // Append x-axis group, place at the bottom of the chart
    this.xAxisG = this.g.append('g')
        .attr('transform', `translate(0,${this.height})`);

    // Append y-axis group and append add a label to it (a text svg)
    this.yAxisG = this.g.append('g');

    // Define scales and axes
    // Note: we need to define their domains in initVis() after data is available
    this.xScale = d3.scaleTime().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);

    this.xAxis = d3.axisBottom(this.xScale)
      .tickFormat(d3.timeFormat("%y-%b-%d"));
    this.yAxis = d3.axisLeft(this.yScale);
  } // end of constructor

  initVis() {
    let vis = this;

    // Promise chaining: dataset has its own initialize() method we wait for
    vis.config.dataset.initialize().then( dataset => {

    const initStockPlot1Axis = () => {
        // Now that the data is available, we can set the domains for our scales and draw axes
        const dateExtent = d3.extent(vis.activeSnpData.map( d => {
            return d["Date"] }));
        vis.xScale.domain(dateExtent);

        // TODO: change this extent to be defined from multiple stock price data sources
        const highPriceExtent = d3.extent(vis.activeSnpData.map( d => {
            return d["High"] }));
        vis.yScale.domain([highPriceExtent[0]*(0.9), highPriceExtent[1]]).nice();

        vis.yAxisG.call(vis.yAxis);
        vis.xAxisG.call(vis.xAxis)
          .selectAll(".tick text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr('transform', `rotate(-45)`);
      }

      // Use all data as default
      vis.activeSnpData = dataset.snpData;

      initStockPlot1Axis();
      vis.render();
    });
  }

  render() {
    let vis = this;

    vis.xValue = d => d['Date'];
    vis.yValue = d => d['High'];

    // Draw the S&P500 line but use a transition!
    let line = vis.g.selectAll(".snpline")
      .data([vis.activeSnpData])
      .join('path')
        .attr('class', 'snpline')
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
          .x( d => { return vis.xScale(vis.xValue(d))} )
          .y( d => { return vis.yScale(vis.yValue(d))}));

    // Transition logic here:
    // (draw line left to right to emphasize time-series/sequential nature of data)
    const totalLength = line.node().getTotalLength();
    line.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(4000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

      // Add 5 horizontal grid lines for readibility
      vis.g.append("g")
        .attr("class","grid")
        .style("stroke-dasharray",("3,3"))
        .call( d3.axisLeft(vis.yScale)
          .ticks(5)
          .tickSize(-vis.width)
          .tickFormat("")
        );
  }
}
