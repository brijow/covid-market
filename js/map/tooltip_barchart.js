class TooltipBarchart extends Chart {

  initVis() {
    super.initVis();
    let vis = this;

    vis.g = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Define axis titles and labels
    const xAxisLabel = 'Cases';
    vis.xAxisTickFormat = number =>
      d3.format('.1s')(number);
    const yAxisLabel = 'Status';

    const statuses = ['confirmed', 'deaths', 'recovered'];

    vis.yValue = d => d.key;
    vis.xValue = d => d.value;

    vis.getFill = d => (d.key === 'confirmed')
      ? 'yellow'
      : (d.key === 'deaths')
        ? 'red'
        : 'green';

    // This y-axis is universal.
    vis.yScale = d3.scaleBand()
      .domain(statuses)
      .range([vis.height, 0])
      .padding(0.2);
    vis.yAxis = d3.axisLeft(vis.yScale)
        .tickValues([])
        .tickSize(-vis.height)
        .tickPadding(5);
    vis.barHeight = vis.yScale.bandwidth();
    // Add labels for y-axis
    const yAxisG = vis.g.append('g').call(vis.yAxis);
    yAxisG.selectAll('.domain').remove();
    yAxisG.append('text')
        .attr('class', 'tooltip-axis-label')
        .attr('y', -vis.config.margin.left /  2)
        .attr('x', -vis.height / 2)
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);

    // We will use this x-scale for our bar chart.
    vis.xScale = d3.scaleLinear()
        .domain([0, 0]) // The domain of the x-axis will change depending on the data rendered
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
        .attr('y', vis.config.margin.bottom)
        .attr('x', vis.width / 2)
        .text(xAxisLabel);

    vis.countryToRender = null;

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

    vis.xScale.domain([0, vis.maxXValue]);

    vis.g.select('.tooltip-barchart-x-axis')
      .call(d3.axisBottom(d3.scaleLinear()
                            .domain([0, vis.maxXValue])
                            .range([0, vis.width])
                            .nice()
                            )
              .ticks(2)
              .tickFormat(vis.xAxisTickFormat));

    vis.render();
  }

  render() {
    let vis = this;

    // let bars = vis.svg.selectAll('g')
    //     .data(vis.dataToRender)

    // bars.join('g')
    //     .attr("transform", function(d, i)
    //     {
    //       return "translate(0," + i * vis.barHeight + ")";
    //     });

    // bars.append('rect')
    //   // .merge(bars)
    //     .attr('class', 'tooltip-bar')
    //     .attr('fill', d => vis.getFill(d))
    //     .attr('height', vis.barHeight)
    //     .attr('width', d => vis.xScale(vis.xValue(d)))
    //     .attr('x', 0)
    //     .attr('y', d => vis.yScale(vis.yValue(d)))


    // bars.append('text')
    //   // .merge(bars)
    //     .attr('x', 2)
    //     .attr('y', vis.barHeight / 2)
    //     .attr('dy', '.35em')
    //     .attr('fill', 'black')
    //     .text(d =>
    //       d.key === 'confirmed'
    //         ? 'Confirmed: ' + d.value
    //         : d.key === 'deaths'
    //           ? 'Deaths: ' + d.value
    //           : 'Recovered: ' + d.value);

    let bars = vis.g.selectAll('.tooltip-bar')
        .data(vis.dataToRender);

    // bars.enter().append('text')
    //   .merge(bars)
    //     .attr('x', 2)
    //     .attr('y', vis.barHeight / 2)
    //     .attr('dy', '.35em')
    //     // .attr('fill', 'black')
    //     .text(d =>
    //       d.key === 'confirmed'
    //         ? 'Confirmed: ' + d.value
    //         : d.key === 'deaths'
    //           ? 'Deaths: ' + d.value
    //           : 'Recovered: ' + d.value);

    // Set fill and class to be static; all other properties change dynamically
    bars.enter().append('rect')
      .merge(bars)
        .attr('class', 'tooltip-bar')
        .attr('fill', d => vis.getFill(d))
        .attr('height', vis.barHeight)
        .attr('width', d => vis.xScale(vis.xValue(d)))
        .attr('x', 0)
        .attr('y', d => vis.yScale(vis.yValue(d)))

    bars.exit().remove();
  }
}