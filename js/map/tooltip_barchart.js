class TooltipBarchart extends Chart {
  
  initVis() {
    super.initVis();
    let vis = this;

    vis.g = vis.svg.append('g');
    vis.g.text('HELLO!');

    // Define axis titles and labels
    const xAxisLabel = 'Cases';
    vis.xAxisTickFormat = number =>
      d3.format('.2s')(number);
    const yAxisLabel = 'Status';

    const statuses = ['confirmed', 'deaths', 'recovered'];

    vis.yValue = d => d.key;
    vis.xValue = d => d.value;

    // This y-axis is universal.
    vis.yScale = d3.scaleBand()
      .domain(statuses)
      .range([vis.height, 0])
      .padding(0.2);
    vis.yAxis = d3.axisLeft(vis.yScale)
        .tickValues(statuses)
        .tickSize(-vis.height)
        .tickPadding(5);
    vis.barHeight = vis.yScale.bandwidth();
    // Add labels for y-axis
    const yAxisG = vis.g.append('g').call(vis.yAxis);
    yAxisG.selectAll('.domain').remove();
    yAxisG.append('text')
        .attr('class', 'tooltip-axis-label')
        .attr('y', -vis.config.margin.left / 3 * 2)
        .attr('x', -vis.height / 2)
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);

    // We will use this x-scale for our bar chart.
    vis.xScale = d3.scaleLinear()
        .domain([0, 1]) // The domain of the x-axis will change depending on the data rendered
                        // This change is handled in the update() method.
        .range([0, vis.width])
        .nice();
    // Temporary labels for x axis
    const xAxisG = vis.g.append('g')
        .attr('class', 'tooltip-barchart-x-axis')
      .call(d3.axisBottom(vis.xScale))
        .attr('transform', `translate(0,${vis.height})`);
    xAxisG.select('.domain').remove();
    xAxisG.append('text')
        .attr('class', 'tooltip-axis-label')
        .attr('y', vis.config.margin.bottom - 10)
        .attr('x', vis.width / 2)
        .text(xAxisLabel);

    vis.dataToRender = null;

    vis.update();
  }

  update() {
    let vis = this;

    // The parent sets vis.dataToRender to be the data of the country to be
    // represented in the barchart.  The object will either be `null` or 
    // have the format:
    // {
    //   key: 'Australia',
    //   value: {
    //     confirmed: 128,
    //     deaths: 3,
    //     recovered: 21
    //   }
    // }
    if (!vis.countryToRender) {
      vis.countryToRender = {
        'key': 'N/A',
        'value': {
          'confirmed': 0,
          'deaths': 0,
          'recovered': 0
        }
      };
    }

    vis.maxXValue = Math.max(
      vis.countryToRender.value.confirmed,
      vis.countryToRender.value.deaths,
      vis.countryToRender.value.recovered
    );

    vis.dataToRender = 
    [
      { 'key': 'confirmed', 'value': vis.countryToRender.value.confirmed },
      { 'key': 'deaths', 'value': vis.countryToRender.value.deaths },
      { 'key': 'recovered', 'value': vis.countryToRender.value.recovered },
    ];

    vis.g.select('.tooltip-barchart-x-axis')
      .call(d3.axisBottom(d3.scaleLinear()
                            .domain([0, vis.maxXValue])
                            .range([0, vis.width])
                            .nice())
              .tickFormat(vis.xAxisTickFormat));

    console.log(vis.dataToRender);
    
    vis.render();
  }

  render() {
    let vis = this;

    let bars = vis.g.selectAll('.tooltip-bar')
        .data(vis.dataToRender);

    // Set fill and class to be static; all other properties change dynamically
    bars.enter().append('rect')
      .merge(bars)
        .attr('class', 'tooltip-bar')
        .attr('fill', 'yellow')
        .attr('x', 0)
      // .transition().duration(500)
        .attr('height', vis.barHeight)
        .attr('y', d => vis.yScale(vis.yValue(d)))
        .attr('width', d => vis.xScale(vis.xValue(d)))

    bars.exit().remove();
  }
}