class StocksPlot extends Chart {

  initVis() {
    super.initVis();
    let vis = this;
    const m = vis.config.margin;

    vis.g = vis.svg.append('g')
      .attr('transform', `translate(${m.left},${m.top})`);

    // Append x-axis group, place at the bottom of the chart
    vis.xAxisG = vis.g.append('g')
      .attr("class", "x-axis")
      .attr('transform', `translate(0,${vis.height})`);

    // Append y-axis group and append add a label to it (a text svg)
    vis.yAxisG = vis.g.append('g');

    // Define scales and axes
    // Note: we need to define their domains in initVis() after data is available
    vis.xScale = d3.scaleTime().range([0, vis.width]);
    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickFormat(d3.timeFormat("%m/%d/%y"));
    vis.yAxis = d3.axisLeft(vis.yScale);

    // Add the brush
    const brushed = () => {
      const selection = d3.event.selection;
      if (!d3.event.sourceEvent || !selection) return;
      const [x0, x1] = selection.map(vis.xScale.invert);
      state.setStartDate(x0);
      state.setEndDate(x1);
    };
    vis.brushG = vis.g.append('g')
      .attr("class", "brush")
      .call(d3.brushX()
          .extent([[0,0], [vis.width, vis.height]])
          .on("brush", brushed));

    // Promise chaining: dataset has its own initialize() method we wait for
    vis.config.dataset.initialize().then( dataset => {

      const initStockPlot1Axis = (mergedData) => {
        // Now that the data is available, we can set the domains for our scales and draw axes
        const dateExtent = d3.extent(mergedData.map( d => {
            return d["date"]
        }));
        vis.xScale.domain(dateExtent);

        // TODO: change this extent to be defined from multiple stock price data sources
        const highPriceExtent = d3.extent(mergedData.map( d => {
            return d["price"]
        }));
        vis.yScale.domain([highPriceExtent[0], highPriceExtent[1]]).nice();

        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

        vis.xAxisG.append("text")
          .attr("transform",
                "translate(" + (vis.width/2) + " ," + 
                               ( m.top ) + ")")
          .style("text-anchor", "middle")
          .style("fill", "black")
          .text("date");
      }

      // Use all data as default
      vis.activeSnpData = dataset.snpData;
      vis.activeDjiData = dataset.djiData;
      vis.activeGoldData = dataset.goldData;
      vis.activeOilData = dataset.oilData;

      initStockPlot1Axis(d3.merge([vis.activeDjiData, vis.activeSnpData,
                                   vis.activeGoldData, vis.activeOilData ]));
      vis.render();
    });
  }

  render() {
    let vis = this;

    const draw_line = (data, cls_str, colo_str) => {
      // Draw the S&P500 line but use a transition!
      let line = vis.g.selectAll(cls_str)
        .data([data])
        .join('path')
          .attr('class', cls_str)
          .attr("fill", "none")
          .attr("stroke", colo_str)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 2)
          .attr("d", d3.line()
            .x( d => { return vis.xScale(d['date'])} )
            .y( d => { return vis.yScale(d['price'])}));

      // Transition logic here:
      // (draw line left to right to emphasize time-series/sequential nature of data)
      const totalLength = line.node().getTotalLength();
      line.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    }

    draw_line(vis.activeSnpData, ".snpline", "steelblue");
    draw_line(vis.activeDjiData, ".djiline", "red");
    draw_line(vis.activeGoldData, ".goldline", "orange");
    draw_line(vis.activeOilData, ".oilline", "green");

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
