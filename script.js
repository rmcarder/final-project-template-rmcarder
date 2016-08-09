var app;
var slice = 60
var x;


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
   .defer(d3.json, 'data/county.json')
   .awaitAll(function (error, results) {
     if (error) { throw error; }
     app.initialize(results[0],results[1]);
   });


  app = {
    data: [],
    components: [],
  

  initialize: function (data) {
    app.data = data;
    app.slice=60
    

    app.options = {
        slider: false,
        slicer: 0,
        };

    // Here we create each of the components on our page, storing them in an array
    app.components = [
      new Chart('#chart'),
      new Slider('#slider')
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
          d3.select('#slidertext')
          .text(function (d) {return 'All counties less than (need slider value as global variable)%'+app.options.slider+' will leave the top map and start building one below.' ;});
          app.update();
        };      
      });

  d3.select("#slider-black")
      .on("click", function(){
        if(app.options.slider==="black"){
          app.options.slider=false;
          app.update();
        } else {
          app.options.slider="black";
          console.log(app.options);
          d3.select('#slider')
          .style('display','inline')
          d3.select('#slidertext')
          .text(function (d) {return 'All counties less than (need slider value as global variable)% '+app.options.slider+' will leave the top map and start building one below.' ;});
          app.update();
        };      
      });

  d3.select("#slider-hispanic")
      .on("click", function(){
        if(app.options.slider==="hispanic"){
          app.options.slider=false;
          app.update();
        } else {
          app.options.slider="hispanic";
          console.log(app.options);
          d3.select('#slider')
          .style('display','inline')
          d3.select('#slidertext')
          .text(function (d) {return 'All counties less than (need slider value as global variable)% '+app.options.slider+' will leave the top map and start building one below.' ;});
          app.update();
        };      
      });

  d3.select("#slider-asian")
      .on("click", function(){
        if(app.options.slider==="asian"){
          app.options.slider=false;
          app.update();
        } else {
          app.options.slider="asian";
          console.log(app.options);
          d3.select('#slider')
          .style('display','inline')
          d3.select('#slidertext')
          .text(function (d) {return 'All counties less than (need slider value as global variable)% '+app.options.slider+' will leave the top map and start building one below.' ;});
          app.update();
        };      
      });

  d3.select("#slider-income")
      .on("click", function(){
        if(app.options.slider==="income"){
          app.options.slider=false;
          app.update();
        } else {
          app.options.slider="income";
          console.log(app.options);
          d3.select('#slider')
          .style('display','inline')
          d3.select('#slidertext')
          .text(function (d) {return 'All counties manking less than (need slider value as global variable) dollars a year will leave the top map and start building one below.' ;});
          app.update();
        };      
      });

    // Add event listeners and the like here
       //start slider


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



function Slider(selector) {
  slider=this;

  slider.svg = d3.select(selector)
  .append('svg'),
    margin = {right: 50, left: 50},
    width = +slider.svg.attr("width") - margin.left - margin.right,
    height = +slider.svg.attr("height");

slider.x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 400])
    .clamp(true);

slider.center=width/2-150

slider.slider = slider.svg.append("g")
    .attr("class", "slider")
    .attr('position',"relative")
    .attr("transform", "translate("+slider.center+",15)");

slider.slider.append("line")
    .attr("class", "track")
    .attr("x1", slider.x.range()[0])
    .attr("x2", slider.x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.slider.interrupt(); })
        .on("start drag", function() { hue(slider.x.invert(d3.event.x)); }));

slider.slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(slider.x.ticks(10))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "%"; });

slider.slider.handle = slider.slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

//app.options.slicer= function slice(j) {
    //slider.slider.handle.attr("cx", slider.x(j));
    //return j;
    //console.log(j);
    //app.update();
//}

function hue(h) {
  slider.slider.handle.attr("cx", slider.x(h));
  app.options.slicer=h;
  slider.svg.style("background-color", d3.hsl(h, 0.8, 0.8));  
                     
}
 app.update;
 console.log(app.options.slicer); 
}

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
    .range([0, app.options.slicer]);
  
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
   
    // Statebin
    var states = chart.svg.selectAll('.state')
      .data(app.data)
      .enter().append('g')
      .attr('class','state');

    states.append('rect')
      .attr('height',0)
      .attr('width',0)
      .attr('x', function (d) { return chart.x(d.lon); })
      .attr('y', function (d) { return chart.y(d.lat); })
      .transition().duration(4000)       
      .attr('width', function (d) { return chart.sidelength(d.pop); })
      .attr('height', function (d) { return chart.sidelength(d.pop); })
      .attr('fill',function (d) { return chart.colorScale(d.pop); }) ;

    states.append('text')
      .attr('x', function (d) { return chart.x(d.lon); })
      .attr('y', function (d) { return chart.y(d.lat); })
      .attr('dx',0)
      .attr('dy',0)
      .text(function (d) {return d.abbr;});


      

    states.exit().transition().duration(1000).delay(150).style("opacity", 0).remove();

    }
}




