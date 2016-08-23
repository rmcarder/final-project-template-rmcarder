var app;
var x;
var greater='greater';
var less='less';


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
    app.leftCentroids=_.cloneDeep(centroids);
    app.rightCentroids=_.cloneDeep(centroids);
    app.leftData = _.cloneDeep(county);
    app.rightData = _.cloneDeep(county);
    app.county=county;
    app.centroids=centroids;

    //Min and max values for set color scale
    app.maxMaleLifeEx = d3.max(app.county, function(d) { return d.MaleLifeEx2010;} );
    app.maxuninsured = d3.max(app.county, function(d) { return d.Uninsured2014;} );
    app.maxobesity = d3.max(app.county, function(d) { return d.obesity;} );
    app.maxYPLS = d3.max(app.county, function(d) { return d.YPLS;} );
    app.maxDaysPoorHealth = d3.max(app.county, function(d) { return d.DaysPoorHealth;} );
    app.minMaleLifeEx = d3.min(app.county, function(d) { return d.MaleLifeEx2010;} );
    app.minuninsured = d3.min(app.county, function(d) { return d.Uninsured2014;} );
    app.minobesity = d3.min(app.county, function(d) { return d.obesity;} );
    app.minYPLS = d3.min(app.county, function(d) { return d.YPLS;} );
    app.minDaysPoorHealth = d3.min(app.county, function(d) { return d.DaysPoorHealth;} );
  



    app.options = {
        slider: 'white',
        slicer: 0,
        yvar: 'obesity',
        yvartext: 'Obesity Rate (%)',
        mouseover: true,
        };


        
  if(app.options.slider) {
          if (app.options.slider ==='white') {
            app.leftDataFilter=app.leftData.filter(function (d) {return d.PCT_NHWHITE10>app.options.slicer; });
            app.rightDataFilter=app.rightData.filter(function (d) {return d.PCT_NHWHITE10<app.options.slicer; });
          } else if (app.options.slider ==='black') {
            app.leftDataFilter=app.leftData.filter(function (d) {return d.PCT_NHBLACK10>app.options.slicer; });
            app.rightDataFilter=app.rightData.filter(function (d) {return d.PCT_NHBLACK10<app.options.slicer; });
          } else if (app.options.slider ==='hispanic') {
            app.leftDataFilter=app.leftData.filter(function (d) {return d.PCT_HISP10>app.options.slicer; });
            app.rightDataFilter=app.rightData.filter(function (d) {return d.PCT_HISP10<app.options.slicer; });

          } else if (app.options.slider ==='asian') {
            app.leftDataFilter=app.leftData.filter(function (d) {return d.PCT_NHASIAN10>app.options.slicer; });
            app.rightDataFilter=app.rightData.filter(function (d) {return d.PCT_NHASIAN10<app.options.slicer; });
          }
        }


  //Data Manipulation      
  //Get State Populations and weighted averages of each variable from County Dataset
    app.leftPopSums = d3.nest()
      .key(function(d) { return d.State; })
      .rollup(function(leaves) { return {
        "counties": leaves.length, 
        "total_pop": d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}),
        "ave_MaleLifeEx": (d3.sum(leaves, function(d) {return parseFloat(d.POPMaleLifeEx);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})), 
        "ave_uninsured": (d3.sum(leaves, function(d) {return parseFloat(d.POPUninsured);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_obesity": (d3.sum(leaves, function(d) {return parseFloat(d.POPobesity);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_DaysPoorHealth": (d3.sum(leaves, function(d) {return parseFloat(d.POPDaysPoorHealth);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_YPLS": (d3.sum(leaves, function(d) {return parseFloat(d.POPYPLS);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}))} })
      .entries(app.leftDataFilter); 

    app.rightPopSums = d3.nest()
      .key(function(d) { return d.State; })
      .rollup(function(leaves) { return {
        "counties": leaves.length, 
        "total_pop": d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}),
        "ave_MaleLifeEx": (d3.sum(leaves, function(d) {return parseFloat(d.POPMaleLifeEx);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})), 
        "ave_uninsured": (d3.sum(leaves, function(d) {return parseFloat(d.POPUninsured);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_obesity": (d3.sum(leaves, function(d) {return parseFloat(d.POPobesity);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_DaysPoorHealth": (d3.sum(leaves, function(d) {return parseFloat(d.POPDaysPoorHealth);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_YPLS": (d3.sum(leaves, function(d) {return parseFloat(d.POPYPLS);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}))} })
      .entries(app.rightDataFilter); 



    console.log(app.leftPopSums);   
    console.log(app.rightPopSums);  
    //Append variables above to centroids (statebins.json)
    //Create blank fields with zeros
     for (var i = 0; i < app.leftCentroids.length; i++) {

        

        app.leftCentroids[i].Pop = 0;
            app.leftCentroids[i].YPLS = 0;
            app.leftCentroids[i].MaleLifeEx =0;
            app.leftCentroids[i].obesity = 0;
            app.leftCentroids[i].DaysPoorHealth =0;
            app.leftCentroids[i].uninsured = 0; 
            app.leftCentroids[i].PopPercent = 0;

      } ;  
   for (var i = 0; i < app.leftPopSums.length; i++) {

        var leftdataState = app.leftPopSums[i].key;
        var leftYPLS= app.leftPopSums[i].value.ave_YPLS;
        var leftMaleLifeEx= app.leftPopSums[i].value.ave_MaleLifeEx;
        var leftuninsured= app.leftPopSums[i].value.ave_uninsured;
        var leftobesity= app.leftPopSums[i].value.ave_obesity;
        var leftDaysPoorHealth= app.leftPopSums[i].value.ave_DaysPoorHealth;
        var leftPop= app.leftPopSums[i].value.total_pop;        

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < app.leftCentroids.length; j++)  {
            var leftjsonState = app.leftCentroids[j].name;
            var lefttotalPop = app.leftCentroids[j].totalpop;

            if (leftdataState === leftjsonState) {
            app.leftCentroids[j].Pop = leftPop || 0;
            app.leftCentroids[j].YPLS = leftYPLS; 
            app.leftCentroids[j].MaleLifeEx = leftMaleLifeEx; 
            app.leftCentroids[j].obesity = leftobesity; 
            app.leftCentroids[j].DaysPoorHealth = leftDaysPoorHealth; 
            app.leftCentroids[j].uninsured = leftuninsured;  
            app.leftCentroids[j].PopPercent = (leftPop/lefttotalPop);
            
            break;

            };
          };

          };
          app.leftSum = app.leftCentroids;
          console.log(app.leftSum);

   for (var i = 0; i < app.rightCentroids.length; i++) {

        

        app.rightCentroids[i].Pop = 0;
            app.rightCentroids[i].YPLS = 0;
            app.rightCentroids[i].MaleLifeEx =0;
            app.rightCentroids[i].obesity = 0;
            app.rightCentroids[i].DaysPoorHealth =0;
            app.rightCentroids[i].uninsured = 0; 
            app.rightCentroids[i].PopPercent = 0;

      } ;  

   for (var i = 0; i < app.rightPopSums.length; i++) {

        var rightdataState = app.rightPopSums[i].key;
        var rightYPLS= app.rightPopSums[i].value.ave_YPLS;
        var rightMaleLifeEx= app.rightPopSums[i].value.ave_MaleLifeEx;
        var rightuninsured= app.rightPopSums[i].value.ave_uninsured;
        var rightobesity= app.rightPopSums[i].value.ave_obesity;
        var rightDaysPoorHealth= app.rightPopSums[i].value.ave_DaysPoorHealth;
        var rightPop= app.rightPopSums[i].value.total_pop;        

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < app.rightCentroids.length; j++)  {
            var rightjsonState = app.rightCentroids[j].name;
            var righttotalPop = app.rightCentroids[j].totalpop;

            if (rightdataState === rightjsonState) {
            app.rightCentroids[j].Pop = rightPop;
            app.rightCentroids[j].YPLS = rightYPLS; 
            app.rightCentroids[j].MaleLifeEx = rightMaleLifeEx; 
            app.rightCentroids[j].obesity = rightobesity; 
            app.rightCentroids[j].DaysPoorHealth = rightDaysPoorHealth; 
            app.rightCentroids[j].uninsured = rightuninsured;  
            app.rightCentroids[j].PopPercent = (rightPop/righttotalPop);
            
            break;


            };
          };
              };
  app.rightSum = app.rightCentroids;
   console.log(app.leftSum);
   console.log(app.rightSum);

    // Here we create each of the components on our page, storing them in an array
    app.components = [
      new Chart('#chart',app.rightSum,'#leftNumberTop','#leftNumber','#leftNumberBottom','greater'),
      new Chart('#chart2',app.leftSum,'#rightNumberTop','#rightNumber','#rightNumberBottom','less'),
      new Slider('#slider')
    ];

 d3.select("#slider-white")
      .on("click", function(){
          app.options.slider="white";
          d3.select('#slidertext')
          .text(function (d) {return app.options.slider;});
          app.update();
        });

   d3.select("#slider-black")
      .on("click", function(){
          app.options.slider="black";
          d3.select('#slidertext')
          .text(function (d) {return app.options.slider;});
          app.update();
        });

   d3.select("#slider-hispanic")
      .on("click", function(){
          app.options.slider="hispanic";
           d3.select("#slider-hispanic")
          .classed('btn:active',true);
          d3.select('#slidertext')
          .text(function (d) {return app.options.slider;});
          app.update();
        });

     d3.select("#slider-asian")
      .on("click", function(){
          app.options.slider="asian";
          d3.select('#slidertext')
          .text(function (d) {return app.options.slider;});
          app.update();
        });

 
    d3.select("#yvar-MaleLifeEx")
      .on("click", function(){
          app.options.yvar='MaleLifeEx';
          app.options.yvartext= 'Male Life Expectancy (years)';
          app.update();      
      });

      d3.select("#yvar-obesity")
      .on("click", function(){
          app.options.yvar='obesity';
          app.options.yvartext= 'Obesity Rate (%)';
          app.update();    
      });

      d3.select("#yvar-uninsured")
      .on("click", function(){
          app.options.yvar='uninsured';
          app.options.yvartext= 'Rate (%) Without Health Insurance';
          app.update();     
      });

      d3.select("#yvar-DaysPoorHealth")
      .on("click", function(){
          app.options.yvar='DaysPoorHealth';
          app.options.yvartext= 'Average Days of Poor Health in 2014';
          app.update();
      });

      d3.select("#yvar-YPLS")
      .on("click", function(){
          app.options.yvar='YPLS';
          app.options.yvartext= 'Average Years of Potential Life Lost 2014';
          app.update();     
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

   console.log(app.options.slicer);

    var leftData = app.county;
    var rightData = app.county;
    var leftCentroids = app.leftCentroids;
    var rightCentroids = app.rightCentroids;
 

   
      if(app.options.slider) {
          if (app.options.slider ==='white') {
            leftDataFilter=leftData.filter(function (d) {return d.PCT_NHWHITE10>((app.options.slicer)*100); });
            rightDataFilter=rightData.filter(function (d) {return d.PCT_NHWHITE10<((app.options.slicer)*100); });
          } else if (app.options.slider ==='black') {
            leftDataFilter=leftData.filter(function (d) {return d.PCT_NHBLACK10>((app.options.slicer)*100); });
            rightDataFilter=rightData.filter(function (d) {return d.PCT_NHBLACK10<((app.options.slicer)*100); });
          } else if (app.options.slider ==='hispanic') {
            leftDataFilter=leftData.filter(function (d) {return d.PCT_HISP10>((app.options.slicer)*100); });
            rightDataFilter=rightData.filter(function (d) {return d.PCT_HISP10<((app.options.slicer)*100); });

          } else if (app.options.slider ==='asian') {
            leftDataFilter=leftData.filter(function (d) {return d.PCT_NHASIAN10>((app.options.slicer)*100); });
            rightDataFilter=rightData.filter(function (d) {return d.PCT_NHASIAN10<((app.options.slicer)*100); });
          }
        }


  //Data Manipulation      
  //Get State Populations and weighted averages of each variable from County Dataset
    var leftPopSums = d3.nest()
      .key(function(d) { return d.State; })
      .rollup(function(leaves) { return {
        "counties": leaves.length, 
        "total_pop": d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}),
        "ave_MaleLifeEx": (d3.sum(leaves, function(d) {return parseFloat(d.POPMaleLifeEx);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})), 
        "ave_uninsured": (d3.sum(leaves, function(d) {return parseFloat(d.POPUninsured);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_obesity": (d3.sum(leaves, function(d) {return parseFloat(d.POPobesity);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_DaysPoorHealth": (d3.sum(leaves, function(d) {return parseFloat(d.POPDaysPoorHealth);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_YPLS": (d3.sum(leaves, function(d) {return parseFloat(d.POPYPLS);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}))} })
      .entries(leftDataFilter); 

    var rightPopSums = d3.nest()
      .key(function(d) { return d.State; })
      .rollup(function(leaves) { return {
        "counties": leaves.length, 
        "total_pop": d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}),
        "ave_MaleLifeEx": (d3.sum(leaves, function(d) {return parseFloat(d.POPMaleLifeEx);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})), 
        "ave_uninsured": (d3.sum(leaves, function(d) {return parseFloat(d.POPUninsured);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_obesity": (d3.sum(leaves, function(d) {return parseFloat(d.POPobesity);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_DaysPoorHealth": (d3.sum(leaves, function(d) {return parseFloat(d.POPDaysPoorHealth);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);})),
        "ave_YPLS": (d3.sum(leaves, function(d) {return parseFloat(d.POPYPLS);}))/(d3.sum(leaves, function(d) {return parseFloat(d.POPEST2012);}))} })
      .entries(rightDataFilter); 

console.log(rightPopSums);
console.log(leftPopSums);
    //Append variables above to centroids (statebins.json)
   
for (var i = 0; i < app.leftCentroids.length; i++) {

        

        app.leftCentroids[i].Pop = 0;
            app.leftCentroids[i].YPLS = 0;
            app.leftCentroids[i].MaleLifeEx =0;
            app.leftCentroids[i].obesity = 0;
            app.leftCentroids[i].DaysPoorHealth =0;
            app.leftCentroids[i].uninsured = 0; 
            app.leftCentroids[i].PopPercent = 0;

      } ;  


   for (var i = 0; i < leftPopSums.length; i++) {

        var leftdataState = leftPopSums[i].key;
        var leftYPLS= leftPopSums[i].value.ave_YPLS;
        var leftMaleLifeEx= leftPopSums[i].value.ave_MaleLifeEx;
        var leftuninsured= leftPopSums[i].value.ave_uninsured;
        var leftobesity= leftPopSums[i].value.ave_obesity;
        var leftDaysPoorHealth= leftPopSums[i].value.ave_DaysPoorHealth;
        var leftPop= leftPopSums[i].value.total_pop;        

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < leftCentroids.length; j++)  {
            var leftjsonState = leftCentroids[j].name;
            var lefttotalPop = leftCentroids[j].totalpop;

            if (leftdataState === leftjsonState) {
            leftCentroids[j].Pop = leftPop;
            leftCentroids[j].YPLS = leftYPLS; 
            leftCentroids[j].MaleLifeEx = leftMaleLifeEx; 
            leftCentroids[j].obesity = leftobesity; 
            leftCentroids[j].DaysPoorHealth = leftDaysPoorHealth; 
            leftCentroids[j].uninsured = leftuninsured;  
            leftCentroids[j].PopPercent = (leftPop/lefttotalPop);
            
            break;

            };
          };
   
          };
           app.leftSum = leftCentroids;


    for (var i = 0; i < app.rightCentroids.length; i++) {

        

        app.rightCentroids[i].Pop = 0;
            app.rightCentroids[i].YPLS = 0;
            app.rightCentroids[i].MaleLifeEx =0;
            app.rightCentroids[i].obesity = 0;
            app.rightCentroids[i].DaysPoorHealth =0;
            app.rightCentroids[i].uninsured = 0; 
            app.rightCentroids[i].PopPercent = 0;

      } ;  

     for (var i = 0; i < rightPopSums.length; i++) {

        var rightdataState = rightPopSums[i].key;
        var rightYPLS= rightPopSums[i].value.ave_YPLS;
        var rightMaleLifeEx= rightPopSums[i].value.ave_MaleLifeEx;
        var rightuninsured= rightPopSums[i].value.ave_uninsured;
        var rightobesity= rightPopSums[i].value.ave_obesity;
        var rightDaysPoorHealth= rightPopSums[i].value.ave_DaysPoorHealth;
        var rightPop= rightPopSums[i].value.total_pop;        

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < rightCentroids.length; j++)  {
            var rightjsonState = rightCentroids[j].name;
            var righttotalPop = rightCentroids[j].totalpop;

            if (rightdataState === rightjsonState) {
            rightCentroids[j].Pop = rightPop;
            rightCentroids[j].YPLS = rightYPLS; 
            rightCentroids[j].MaleLifeEx = rightMaleLifeEx; 
            rightCentroids[j].obesity = rightobesity; 
            rightCentroids[j].DaysPoorHealth = rightDaysPoorHealth; 
            rightCentroids[j].uninsured = rightuninsured;  
            rightCentroids[j].PopPercent = (rightPop/righttotalPop);
            
            break;

            };
          };

          };
              app.rightSum = rightCentroids;    

 console.log(app.leftSum);
  console.log(app.rightSum);
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
        app.update();
        d3.select('#slidernumber')
          .text(function (d) {return (d3.format(".0f")(app.options.slicer*100))+'%';});
        
         
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
}
}

function Chart(selector,sum,numberTop,number,numberBottom,greaterLess) {

  var chart = this;

chart.number=number;
chart.numberTop=numberTop;
chart.numberBottom=numberBottom;
chart.greaterLess=greaterLess;
chart.sum=sum;

console.log(chart.number);

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
  chart.x = d3.scaleLinear()
    .domain([d3.min(sum, function (d) { return d.lon; }),d3.max(sum, function (d) { return d.lon; })])
    .range([0, chart.width])
    .nice();

  chart.y = d3.scaleLinear()
    .domain([d3.min(sum, function (d) { return d.lat; }),d3.max(sum, function (d) { return d.lat; })])
    .range([chart.height, 0])
    .nice();

   chart.sidelength = d3.scaleSqrt()
    .domain([0,1])
    .range([0,35]);

  chart.tooltip = d3.select("body").append("div")   
    .attr("class", "header")               
    .style("opacity", 1);

chart.update();
}
    // data merge:
 
Chart.prototype = {
  update: function () {
    var chart = this;

    // Interrupt ongoing transitions:


//original color scale
//if (app.options.yvar==='MaleLifeEx') {chart.colorScale = d3.scaleLinear()
  //      .domain(d3.extent(chart.sum, function (d) { return d[app.options.yvar]; }))
    //    .range([d3.interpolateYlOrRd(0.75),d3.interpolateYlOrRd(.25)]);}
      //  else { chart.colorScale = d3.scaleLinear()
        //.domain(d3.extent(chart.sum, function (d) { return d[app.options.yvar]; }))
        //.range([d3.interpolateYlOrRd(0.25),d3.interpolateYlOrRd(.75)]);};



if (app.options.yvar==='MaleLifeEx') {
    chart.data_bins = [app.minMaleLifeEx,(app.minMaleLifeEx+app.maxMaleLifeEx)/2,app.maxMaleLifeEx];
  chart.color_range = ["#d73027","#ffffbf","#1a9850"];}
else if (app.options.yvar==='obesity'){
      chart.data_bins = [app.minobesity,(app.minobesity+app.maxobesity)/2,app.maxobesity];
     chart.color_range = ["#1a9850","#ffffbf","#d73027"];}
else if (app.options.yvar==='DaysPoorHealth'){
      chart.data_bins = [app.minDaysPoorHealth,(app.minDaysPoorHealth+app.maxDaysPoorHealth)/2,app.maxDaysPoorHealth];
      chart.color_range = ["#1a9850","#ffffbf","#d73027"];}
else if (app.options.yvar==='YPLS'){
      chart.data_bins = [app.minYPLS,(app.minYPLS+app.maxYPLS)/2,app.maxYPLS];
      chart.color_range = ["#1a9850","#ffffbf","#d73027"];}
else if (app.options.yvar==='uninsured'){
      chart.data_bins = [app.minuninsured,(app.minuninsured+app.maxuninsured)/2,app.maxuninsured];
      chart.color_range = ["#1a9850","#ffffbf","#d73027"];}

    
chart.colorScale2 = d3.scaleLinear()
        .domain(chart.data_bins)
        .range(chart.color_range);

   
   
    // Statebin
    var states = chart.svg.selectAll('.state')
      .data(chart.sum)

    var statesEnter=states
      .enter().append('g')
      .attr('class','state')
      .attr('x',0)
      .attr('y',0);

  

    statesEnter.append('rect')
      .attr('x', function (d) { return chart.x(d.lon)- 17.5; })
      .attr('y', function (d) { return chart.y(d.lat)- 17.5 - 40; })
    
    states=states.merge(statesEnter);  

    states.selectAll('rect')
      .transition().duration(600)    
      .attr('width', function (d) { return chart.sidelength(d.PopPercent); })
      .attr('height', function (d) { return chart.sidelength(d.PopPercent); })
      .attr('fill',function (d) { return chart.colorScale2(d[app.options.yvar]); }) ;

    states
        .on("mouseover", function(d) {if (app.options.mouseover===true){  
        d3.select(chart.number)
          .html(function () {return d3.format(".1f")(d[app.options.yvar]);});
        d3.select(chart.numberTop)
          .html(function () {return d.name;});
        d3.select(chart.numberBottom)
          .html(function () {
              return app.options.yvartext+' in counties that are '+chart.greaterLess+
              ' than '+d3.format(".1f")(app.options.slicer*100)+'% '+app.options.slider+
              '. This accounts for '+d3.format(",.0f")(d.Pop)+' people, '+d3.format(".1f")(d.PopPercent*100)+
              '% of '+d.name+'s total population.';});
        };})        
        .on("click", function () {if (app.options.mouseover===true) {
          d3.select(this)
            .attr('stroke','#FFFFFF')
            .attr('stroke-width','4px');
            app.options.mouseover=false;
         } else {
          d3.selectAll('g')
            .attr('stroke','none');
            app.options.mouseover=true;}});


        
     

    statesEnter.append('text')
      .attr('class','statetext')
      .attr('x', function (d) { return chart.x(d.lon)-9; })
      .attr('y', function (d) { return chart.y(d.lat)-33; })
      .attr('dx',0)
      .attr('dy',0)
      .text(function (d) {return d.abbr;});

  


    }

}




