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
    vis.colorValueByFeature = feat => {
      let country = vis.dataToRender.find(d => feat.properties.name === d.key);
      return (country)
        ? country.value.confirmed
        : 0;
    };

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
        .attr('fill', feat => vis.color(vis.colorValueByFeature(feat)))
      // TODO: remove this tooltip and replace it with a more fancy one
      .append('title')
        .text(feat => feat.properties.name + ': ' + vis.colorValueByFeature(feat));

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