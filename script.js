var app;

// Declaring our constants
    var colorRamp = ['#e5f5f9','#2ca25f'];

    var color = d3.scaleLinear()
      .domain([0, 6.5])
      .range(colorRamp);

  // var projection = d3.geo.equirectangular()
    //  .scale(2000)
      //.center([-96.03542,41.69553])
      //.translate([width / 2, height / 2]);


      //Will need this to center rects:
      //squareSize = 19;
//square
  //  .attr("x", function(d){ return x(d) - squareSize/2;})
    //.attr("y", function(d){return y(statusText) - squareSize/2;} )
   // .attr("width",squareSize)
    //.attr("height",squareSize)




//d3.queue() enables us to load multiple data files. Following the example below, we make
//additional .defer() calls with additional data files, and they are returned as results[1],
// // results[2], etc., once they have all finished downloading.
 d3.queue()
  .defer(d3.json, 'data/statebins.json')
   .defer(d3.json, 'data/us-states.json')
   .awaitAll(function (error, results) {
     if (error) { throw error; }
     app.initialize(results[0],results[1]);
   });

app = {
  data: [],
  components: [],

  initialize: function (data) {
    app.data = data;

    // Here we create each of the components on our page, storing them in an array
    app.components = [
      new Chart('#chart')
    ];

    // Add event listeners and the like here

    // app.resize() will be called anytime the page size is changed
    d3.select('window').on('resize', app.resize);

   },

  resize: function () {
    app.components.forEach(function (c) { if (c.resize) { c.resize(); }});
  },

  update: function () {
    app.components.forEach(function (c) { if (c.update) { c.update(); }});
  }
}

var margin = {
    left: 75,
    right: 50,
    top: 50,
    bottom: 75
};


var width = 625 - margin.left - margin.right;
var height = 625 - margin.top - margin.bottom;



function Chart(selector) {

  var chart = this;

  var margin = {
    left: 75,
    right: 50,
    top: 50,
    bottom: 75
  };


chart.width = 600 - margin.left - margin.right;
chart.height = 600 - margin.top - margin.bottom;

chart.svg = d3.select(selector)
    .append('svg')
    .attr('width', chart.width + margin.left + margin.right)
    .attr('height', chart.height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
//Scales - Hopefully 

// SCALES

  chart.x = d3.scaleLinear()
    .domain([d3.min(app.data, function (d) { return d.lon; }),0])
    .range([0, chart.width])
    .nice();

  chart.y = d3.scaleLinear()
    .domain([0, d3.max(app.data, function (d) { return d.lat; })])
    .range([chart.height, 0])
    .nice();

  chart.sidelength = d3.scaleSqrt()
    .domain([0, d3.max(app.data, function (d) { return d.pop; })])
    .range([0, 25]);

  chart.update();
}
    // Data merge:
 
Chart.prototype = {
  update: function () {
    var chart = this;

    // Interrupt ongoing transitions:  

    chart.colorScale = d3.scaleLinear()
        .domain([0,100])
        .range(["#d73027","#4575b4"]);

    // Create a projection with geoAlbersUSA
    // Many more geographic projections available here:
    // https://github.com/d3/d3/blob/master/API.md#projections

    // First create a map projection and specify some options:
    //var projection = d3.geoAlbersUsa()
      // .translate([width/2, height/2])// Places the map in the center of the SVG
       //.scale([width * 1.5]); // Scales the size of the map

    // Then pass this projection to d3.geoPath() - which is analagous to d3.line()
    //var projectionPath = d3.geoPath().projection(projection);

    // Now we have this projection path that we can give to the "d" attribute of a new path:
   
    // Statebin
    var states = chart.svg.selectAll('.state')
      .data(app.data);

      console.log(app.data)

    states.enter().append('rect')
       .attr('opacity',0)
      .transition().duration(250)
      .attr('opacity',1)
      .attr('class','state')
      .attr('x', function (d) { return chart.x(d.lon); })
      .attr('y', function (d) { return chart.y(d.lat); })
      .attr('width', function (d) { return chart.sidelength(d.pop); })
      .attr('height', function (d) { return chart.sidelength(d.pop); });

    states.exit().transition().duration(1000).delay(150).style("opacity", 0).remove();

    }
}




