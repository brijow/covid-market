class Map extends Chart {
  
  initVis() {
    super.initVis();
    let vis = this;

    vis.g = vis.svg.append('g');

    // Initialize projection and paths for map
    vis.projection = d3.geoNaturalEarth1();
    vis.path = d3.geoPath().projection(vis.projection);

    // Initialize color scheme for this chart
    vis.colorScheme = d => d3.interpolateYlOrRd(d);
    vis.colorScale = d3.scaleSymlog()
      .domain([0, 100000])
      .range([0,1]);
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

      console.log('=== Map dataset ===');
      console.log(vis.dataToRender);

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
        // If this line of code is added, the countries have an appropriate colour.
        // But I want to move this to the `merge` section.  How?
        // .attr('fill', feat => vis.colorScheme(vis.colorScale(vis.colorValueByFeature(feat))))
      .append('title')
        .text(feat => feat.properties.name + ': ' + vis.colorValueByFeature(feat));

    geoPath.merge(geoPathEnter)
        .attr('fill', feat => {
      // TODO: figure out why this isn't working.
      //    console.log('reached merge section');
          return vis.colorScheme(vis.colorScale(vis.colorValueByFeature(feat)))
        });

  }
}