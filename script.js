var app;


// Declaring our constants
var colorRamp = ['#e5f5f9','#2ca25f'];

var color = d3.scaleLinear()
      .domain([0, 6.5])
      .range(colorRamp);

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
    options: [],
    slice: [],

  initialize: function (data) {
    app.data = data;

    app.options = {
        slider: false,
        };

    // Here we create each of the components on our page, storing them in an array
    app.components = [
      new Chart('#chart')
    ];

 d3.select("#slider-white")
      .on("click", function(){
        if(app.options.slider==="white"){
          app.options.slider=false;
          app.update();
        } else {
          app.options.slider="white";
          console.log(app.options);
          d3.select('#slider')
          .style('display','inline')
          app.update();
        };      
      });

    // Add event listeners and the like here
       //start slider
var svg = d3.select("svg"),
    margin = {right: 50, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height");

var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(10))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "°"; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

function hue(h) {
  handle.attr("cx", x(h));
  svg.style("background-color", d3.hsl(h, 0.8, 0.8));
  app.slice=h;
  console.log(app.slice);
  app.update();
 }

    // app.resize() will be called anytime the page size is changed
    d3.select(window).on('resize', app.resize);

   },

  resize: function () {
    app.components.forEach(function (c) { if (c.resize) { c.resize(); }});
  },

  update: function () {
    app.components.forEach(function (c) { if (c.update) { c.update(); }});
  }
}
app.update();

var margin = {
    left: 75,
    right: 50,
    top: 50,
    bottom: 75
};

function Chart(selector) {

  var chart = this;

  var margin = {
    left: 75,
    right: 50,
    top: 50,
    bottom: 75
  };


chart.width = 800 - margin.left - margin.right;
chart.height = 500 - margin.top - margin.bottom;

chart.svg = d3.select(selector)
    .append('svg')
    .attr('width', chart.width + margin.left + margin.right)
    .attr('height', chart.height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
//Scales - Hopefully 

// SCALES

  chart.x = d3.scaleLinear()
    .domain([d3.min(app.data, function (d) { return d.lon; }),d3.max(app.data, function (d) { return d.lon; })])
    .range([0, chart.width])
    .nice();

  chart.y = d3.scaleLinear()
    .domain([d3.min(app.data, function (d) { return d.lat; }),d3.max(app.data, function (d) { return d.lat; })])
    .range([chart.height, 0])
    .nice();

  chart.sidelength = d3.scaleSqrt()
    .domain([d3.min(app.data, function (d) { return d.pop; }), d3.max(app.data, function (d) { return d.pop; })])
    .range([0, app.slice]);
  
  chart.update();
}
    // Data merge:
 
Chart.prototype = {
  update: function () {
    var chart = this;

    // Interrupt ongoing transitions:  

    chart.colorScale = d3.scaleLinear()
        .domain([d3.min(app.data, function (d) { return d.pop; }), d3.max(app.data, function (d) { return d.pop; })])
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

    states.enter().append('rect')
      .attr('height',0)
      .attr('width',0)
      .attr('x', function (d) { return chart.x(d.lon); })
      .attr('y', function (d) { return chart.y(d.lat); })
      .transition().duration(1000)
      .attr('class','state')      
      .attr('width', function (d) { return chart.sidelength(d.pop); })
      .attr('height', function (d) { return chart.sidelength(d.pop); })
      .attr('fill',function (d) { return chart.colorScale(d.pop); }) ;
      //.attr('width', 50)
      //.attr('height', 50)



      

    states.exit().transition().duration(1000).delay(150).style("opacity", 0).remove();

    }
}




