class Map extends Chart {
  
  initVis() {
    super.initVis();
    let vis = this;

    vis.g = vis.svg.append('g');

    vis.colorLegendG = vis.svg.append('g')
      .attr('transform', `translate(30, 300)`);

    // Initialize projection and paths for map
    vis.projection = d3.geoNaturalEarth1();
    vis.path = d3.geoPath().projection(vis.projection);

    // How to get your background to be a different colour from water
    // Taken from Choropleth map tutorial:
    // https://vizhub.com/jordanmchiu/72c1473eb5ff449ca7910be1e12fcd63?edit=files&file=index.js
    vis.g.append('path')
        .attr('class', 'map-background')
        .attr('d', vis.path({type: 'Sphere'}));

    // Set thresholds for colour value
    // Adapted from Mike Bostock's threshold choropleth:
    // https://observablehq.com/@d3/threshold-choropleth
    vis.thresholds = [0,1,11,101,1001,10001];
    vis.color = d3.scaleThreshold()
      .domain(vis.thresholds)
      .range(d3.schemeYlOrBr[vis.thresholds.length+1]);
    vis.colorValue = d => d ? d.value.confirmed : 0;

    // Set up stylings for tooltips
    // Ideally, we'd want something like this for the end result:
    // https://bl.ocks.org/maelafifi/ee7fecf90bb5060d5f9a7551271f4397
    // This example uses d3-tip, which we may be able to utilize:
    // https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.9.1/d3-tip.min.js
    vis.tooltip = d3.select('body')
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip');
    vis.formatTime = d3.timeFormat("%B %d, %Y");
    let tooltipBarchartId = 'tooltip-barchart';
    vis.tooltip.html(
      '<div><svg id="' + tooltipBarchartId + '"></svg></div>'
    );

    vis.tooltipBarchart = new TooltipBarchart({
      parentElement: '#' + tooltipBarchartId,
      dataset : undefined,
      containerWidth: 240,
      containerHeight: 170,
      margin: { top: 30, bottom: 30, right: 10, left: 20 }
    });
    vis.tooltipBarchart.initVis();

    // This function helps us translate from a country name on our world map
    // to a data element form our COVID data that we can manipulate.
    vis.getDataByFeature = feat => vis.dataToRender.find(d => feat.properties.name === d.key);

    vis.config.dataset.initialize().then( dataset => {
      // First, we select a single date
      vis.selectedDate = new Date('03/11/20');
      let filteredData = dataset.cleanedCovidDataMain.filter(d => d['ObservationDate'].toDateString() === vis.selectedDate.toDateString());

      // By summing up the confirmed, deaths, and recovered cases on a single day,
      // we can capture every single case within a specific country or region.
      vis.dataToRender = d3.nest()
        .key(d => d['Country/Region'])
        .rollup(function(v) {
          return {
            confirmed: d3.sum(v, d => d['Confirmed']),
            deaths: d3.sum(v, d => d['Deaths']),
            recovered: d3.sum(v, d => d['Recovered'])
          };
        })
        .entries(filteredData);

      vis.update();
    });
  }

  update() {
    let vis = this;

    // TODO
    vis.render();
  }

  render() {
    let vis = this;

    vis.features = topojson.feature(vis.config.dataset.cleanedTopoJson, vis.config.dataset.cleanedTopoJson.objects.countries).features;
    vis.features.map(d => {
      d.properties.projected = vis.projection(d3.geoCentroid(d));
    });

    // This function prints out the names of all countries for which a matching country
    // cannot be found in our TOPOJson file.  This can be removed once our project is
    // complete.
    vis.dataToRender.forEach(d => {
      let country = vis.features.filter(feat => feat.properties.name === d.key);
      if (country.length === 0) {
        console.log('Could not find: ' + d.key);
      }
    });

    // Allow for zooming and panning
    vis.svg.call(d3.zoom().on('zoom', () => {
      vis.g.attr('transform', d3.event.transform);
    }));

    let geoPath = vis.g.selectAll('.geo-path')
      .data(vis.features);

    let geoPathEnter = geoPath.enter().append('path')
        .attr('class', 'geo-path')
        .attr('d', vis.path)

    geoPath.merge(geoPathEnter)
        .attr('fill', feat => vis.color(vis.colorValue(vis.getDataByFeature(feat))))
        // Handle tooltips and fill
        .on('mouseover', feat => {
          vis.tooltip.transition()
            .duration(200)
            .style('opacity', 1);
          let country = vis.getDataByFeature(feat)
          vis.tooltipBarchart.countryToRender = (country) ? country : {
            'key': feat.properties.name,
            'value': {
              'confirmed': 0,
              'deaths': 0,
              'recovered': 0
            }
          };
          vis.tooltipBarchart.update();
        })
        // Keep track of where tooltip is
        .on('mousemove', d => {
          vis.tooltip
            .style('left', (d3.event.pageX + 20) + 'px')
            .style('top', (d3.event.pageY) + 'px');
        })
        // Remove tooltip and set fill back to whatever it was before
        .on('mouseout', d => {
          vis.tooltip.transition()
            .duration(200)
            .style('opacity', 0);
        });

    let colorScale = vis.color;
    let thresholds = vis.thresholds;
    vis.colorLegendG.call(mapColorLegend, {
      colorScale,
      circleRadius: 8,
      spacing: 20,
      textOffset: 10,
      backgroundRectWidth: 250,
      titleText: 'Number of confirmed cases',
      thresholds: thresholds
    });

  }
}