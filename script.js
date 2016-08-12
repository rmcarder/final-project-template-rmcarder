var app;
var slice = 0;
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
  

  initialize: function (centroids,county) {
    app.data = county;
    app.slice=60 

    app.options = {
        slider: false,
        slicer: 60,
        yvar: 'obesity',
        };

  //Data Manipulation      
  //Get State Populations and weighted averages of each variable from County Dataset
    app.PopSums = d3.nest()
      .key(function(d) { return d.State; })
      .rollup(function(leaves) { return {
        "counties": leaves.length, 
        "total_pop": d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}),
        "ave_MaleLifeEx": (d3.sum(leaves, function(d) {return parseFloat(d.POPMaleLifeEx);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})), 
        "ave_uninsured": (d3.sum(leaves, function(d) {return parseFloat(d.POPUninsured);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_obesity": (d3.sum(leaves, function(d) {return parseFloat(d.POPobesity);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_DaysPoorHealth": (d3.sum(leaves, function(d) {return parseFloat(d.POPDaysPoorHealth);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_YPLS": (d3.sum(leaves, function(d) {return parseFloat(d.POPYPLS);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}))} })
      .entries(app.data); 



    console.log(app.PopSums);   
    //Append variables above to centroids (statebins.json)
   for (var i = 0; i < app.PopSums.length; i++) {

        var dataState = app.PopSums[i].key;
        var YPLS= app.PopSums[i].value.ave_YPLS;
        var MaleLifeEx= app.PopSums[i].value.ave_MaleLifeEx;
        var uninsured= app.PopSums[i].value.ave_uninsured;
        var obesity= app.PopSums[i].value.ave_obesity;
        var DaysPoorHealth= app.PopSums[i].value.ave_DaysPoorHealth;
        var Pop= app.PopSums[i].value.total_pop;        

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < centroids.length; j++)  {
            var jsonState = centroids[j].name;
            var totalPop = centroids[j].totalpop;

            if (dataState == jsonState) {
            centroids[j].Pop = Pop;
            centroids[j].YPLS = YPLS; 
            centroids[j].MaleLifeEx = MaleLifeEx; 
            centroids[j].obesity = obesity; 
            centroids[j].DaysPoorHealth = DaysPoorHealth; 
            centroids[j].uninsured = uninsured;  
            centroids[j].PopPercent = (Pop/totalPop);
            
            break;

            };
          };
    app.sum = centroids;
          };

    console.log(app.sum);

    // Here we create each of the components on our page, storing them in an array
    app.components = [
      new Chart('#chart'),
      new Chart('#chart2'),
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

    d3.select("#yvar-MaleLifeEx")
      .on("click", function(){
        if(app.options.yvar==='MaleLifeEx'){
          app.options.yvar=false;
          app.update();
        } else {
          app.options.yvar='MaleLifeEx';
          console.log(app.options);
          app.update();
        };      
      });

      d3.select("#yvar-obesity")
      .on("click", function(){
        if(app.options.yvar==='obesity'){
          app.options.yvar=false;
          app.update();
        } else {
          app.options.yvar='obesity';
          console.log(app.options);
          app.update();
        };      
      });

      d3.select("#yvar-uninsured")
      .on("click", function(){
        if(app.options.yvar==='uninsured'){
          app.options.yvar=false;
          app.update();
        } else {
          app.options.yvar='uninsured';
          console.log(app.options);
          app.update();
        };      
      });

      d3.select("#yvar-DaysPoorHealth")
      .on("click", function(){
        if(app.options.yvar==='DaysPoorHealth'){
          app.options.yvar=false;
          app.update();
        } else {
          app.options.yvar='DaysPoorHealth';
          console.log(app.options);
          app.update();
        };      
      });

      d3.select("#yvar-YPLS")
      .on("click", function(){
        if(app.options.yvar==='YPLS'){
          app.options.yvar=false;
          app.update();
        } else {
          app.options.yvar='YPLS';
          console.log(app.options);
          app.update();
        };      
      });

    // Add event listeners and the like here
       //start slider
     // Data merge:
    


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



function Slider(selector) {
  slider=this;

  slider.svg = d3.select(selector)
  .append('svg')
  .attr('height',25)
  .attr('width',170)
    margin = {right: 50, left: 50},
    width = +slider.svg.attr("width") - margin.left - margin.right,
    height = 20;

slider.x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 150])
    .clamp(true);

slider.center=10

slider.slider = slider.svg.append("g")
    .attr('height',5)
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
        .on("start drag", function() { hue(slider.x.invert(d3.event.x));
        app.options.slicer=(slider.x.invert(d3.event.x))/100;
        console.log(app.options.slicer); }));

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

function hue(h) {
  slider.slider.handle.attr("cx", slider.x(h));
  slider.svg.style("background-color", 'none'); 
  app.update();           
}
}

function Chart(selector) {

  var chart = this;

  var margin = {
    left: 0,
    right: 0,
    top: 50,
    bottom: 50
  };

chart.width = 480 - margin.left - margin.right;
chart.height = 370 - margin.top - margin.bottom;

chart.svg = d3.select(selector)
    .append('svg')
    .attr('width', chart.width + margin.left + margin.right)
    .attr('height', chart.height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
//Scales - Hopefully 

// SCALES
  console.log(app.sum);
  chart.x = d3.scaleLinear()
    .domain([d3.min(app.sum, function (d) { return d.lon; }),d3.max(app.sum, function (d) { return d.lon; })])
    .range([0, chart.width])
    .nice();

  chart.y = d3.scaleLinear()
    .domain([d3.min(app.sum, function (d) { return d.lat; }),d3.max(app.sum, function (d) { return d.lat; })])
    .range([chart.height, 0])
    .nice();

chart.update();
}
    // data merge:
 
Chart.prototype = {
  update: function () {
    var chart = this;

    // Interrupt ongoing transitions:

console.log(app.options);

    chart.colorScale = d3.scaleLinear()
        .domain(d3.extent(app.sum, function (d) { return d[app.options.yvar]; }))
        .range([d3.interpolateYlOrRd(0.25),d3.interpolateYlOrRd(.75)]);

    chart.sidelength = d3.scaleSqrt()
    .domain(d3.extent(app.sum, function (d) { return d.PopPercent; }))
    .range([35,70]);
   
    // Statebin
    var states = chart.svg.selectAll('.state')
      .data(app.sum)

    var statesEnter=states
      .enter().append('g')
      .attr('class','state')
      .attr('x',0)
      .attr('y',0);

    states=states.merge(statesEnter);

    statesEnter.append('rect')
      .attr('height',0)
      .attr('width',0)
      .attr('x', function (d) { return chart.x(d.lon)- (chart.sidelength(d.PopPercent))/2; })
      .attr('y', function (d) { return chart.y(d.lat)- (chart.sidelength(d.PopPercent))/2; })
      

    states.selectAll('rect')
      .transition().duration(400)       
      .attr('width', function (d) { return chart.sidelength(d.PopPercent); })
      .attr('height', function (d) { return chart.sidelength(d.PopPercent); })
      .attr('fill',function (d) { return chart.colorScale(d[app.options.yvar]); }) ;

    statesEnter.append('text')
      .attr('class','statetext')
      .attr('x', function (d) { return chart.x(d.lon)-8; })
      .attr('y', function (d) { return chart.y(d.lat)+4; })
      .attr('dx',0)
      .attr('dy',0)
      .text(function (d) {return d.abbr;});

  


    }

}




