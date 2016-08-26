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
    //app.maxMaleLifeEx = d3.max(app.county, function(d) { return d.MaleLifeEx2010;} );
    //app.maxuninsured = d3.max(app.county, function(d) { return d.Uninsured2014;} );
    //app.maxobesity = d3.max(app.county, function(d) { return d.obesity;} );
    app.minuninsured=0
    app.maxuninsured=25
    app.minobesity = 10;
    app.maxobesity = 40;
    app.minYPLS = 4000;
    app.maxYPLS = 12000;
    app.minDaysPoorHealth=5;
    app.maxDaysPoorHealth=25;
    app.minMaleLifeEx=68;
    app.maxMaleLifeEx=80;
    // = d3.max(app.county, function(d) { return d.DaysPoorHealth;} );
    //app.minMaleLifeEx = d3.min(app.county, function(d) { return d.MaleLifeEx2010;} );
    //app.minuninsured = d3.min(app.county, function(d) { return d.Uninsured2014;} );
    //app.minobesity = d3.min(app.county, function(d) { return d.obesity;} );
    //app.minDaysPoorHealth = d3.min(app.county, function(d) { return d.DaysPoorHealth;} );
  



    app.options = {
        slider: 'white',
        slicer: 0,
        yvar: 'obesity',
        yvartext: 'Obesity Rate (%)',
        mouseover: true,
        leftName: 'Mouseover a State',
        leftPop: ' ',
        leftPopPercent:' ',
        leftyvarValue:' ',
        rightName: 'Mouseover a State',
        rightPop: ' ',
        rightPopPercent:' ',
        rightyvarValue:' ',
        legendMin:'16',
        legendMax:'30',     
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
      new Chart('#chart','chart2',app.rightSum,'#leftNumberTop','#leftNumber','#leftNumberBottom','less'),
      new Chart('#chart2','chart',app.leftSum,'#rightNumberTop','#rightNumber','#rightNumberBottom','greater'),
      new Slider('#slider'),
      new legend(app.options.legendMin, app.options.legendMax)
    ];


    d3.select('#leftNumberTop')
    .html(function () {return ('  ');});
  d3.select('#leftNumber')
    .html(function () {return (' ');});
  d3.select('#leftNumberBottom')
    .html(function () {return (' ');});
  d3.select('#rightNumberTop')
  .html(function () {return (' ');});
  d3.select('#rightNumber')
  .html(function () {return (' ');});
  d3.select('#rightNumberBottom')
  .html(function () {return (' ');});
  d3.select('#legendEnd')
  .html(function () {return app.options.yvartext;});
  app.update();

 d3.select("#slider-white")
      .on("click", function(){
          app.options.slider="white";
           d3.select("#slider-hispanic")
          .classed('active',false);
          d3.select("#slider-white")
          .classed('active',true);
          d3.select("#slider-black")
          .classed('active',false);
          d3.select("#slider-asian")
          .classed('active',false);
          d3.select('#slidertext')
          .text(function (d) {return app.options.slider;});
          app.update();
          textBox();
        });

   d3.select("#slider-black")
      .on("click", function(){
          app.options.slider="black";
            d3.select("#slider-hispanic")
          .classed('active',false);
          d3.select("#slider-white")
          .classed('active',false);
          d3.select("#slider-black")
          .classed('active',true);
          d3.select("#slider-asian")
          .classed('active',false);
          d3.select('#slidertext')
          .text(function (d) {return app.options.slider;});
          app.update();
          textBox();
        });

   d3.select("#slider-hispanic")
      .on("click", function(){
          app.options.slider="hispanic";
           d3.select("#slider-hispanic")
          .classed('active',true);
          d3.select("#slider-white")
          .classed('active',false);
          d3.select("#slider-black")
          .classed('active',false);
          d3.select("#slider-asian")
          .classed('active',false);
          d3.select('#slidertext')
          .text(function (d) {return app.options.slider;});
          app.update();
          textBox();
        });

     d3.select("#slider-asian")
      .on("click", function(){
          app.options.slider="asian";
            d3.select("#slider-hispanic")
          .classed('active',false);
          d3.select("#slider-white")
          .classed('active',false);
          d3.select("#slider-black")
          .classed('active',false);
          d3.select("#slider-asian")
          .classed('active',true);
          d3.select('#slidertext')
          .text(function (d) {return app.options.slider;});
          app.update();
          textBox();
        });

 
    d3.select("#yvar-MaleLifeEx")
      .on("click", function(){
            d3.select("#yvar-MaleLifeEx")
          .classed('active',true);
          d3.select("#yvar-YPLS")
          .classed('active',false);
          d3.select("#yvar-obesity")
          .classed('active',false);
          d3.select("#yvar-uninsured")
          .classed('active',false);
          d3.select("#yvar-DaysPoorHealth")
          .classed('active',false);
          app.options.yvar='MaleLifeEx';
          app.options.yvartext= 'Male Life Expectancy (years)';
          app.options.legendMax=app.maxMaleLifeEx;
          app.options.legendMin=app.minMaleLifeEx;
          app.update();  
          textBox();   
      });

      d3.select("#yvar-obesity")
      .on("click", function(){
         d3.select("#yvar-MaleLifeEx")
          .classed('active',false);
          d3.select("#yvar-YPLS")
          .classed('active',false);
          d3.select("#yvar-obesity")
          .classed('active',true);
          d3.select("#yvar-uninsured")
          .classed('active',false);
          d3.select("#yvar-DaysPoorHealth")
          .classed('active',false);
          app.options.yvar='obesity';
          app.options.yvartext= 'Obesity Rate (%)';
          app.options.legendMax=app.maxobesity;
          app.options.legendMin=app.minobesity;
          app.update();  
          textBox();  
      });

      d3.select("#yvar-uninsured")
      .on("click", function(){
         d3.select("#yvar-MaleLifeEx")
          .classed('active',false);
          d3.select("#yvar-YPLS")
          .classed('active',false);
          d3.select("#yvar-obesity")
          .classed('active',false);
          d3.select("#yvar-uninsured")
          .classed('active',true);
          d3.select("#yvar-DaysPoorHealth")
          .classed('active',false);
          app.options.yvar='uninsured';
          app.options.yvartext= 'Uninsured Rate (%)';
           app.options.legendMax=app.maxuninsured;
          app.options.legendMin=app.minuninsured;
          app.update();   
          textBox();  
      });

      d3.select("#yvar-DaysPoorHealth")
      .on("click", function(){
         d3.select("#yvar-MaleLifeEx")
          .classed('active',false);
          d3.select("#yvar-YPLS")
          .classed('active',false);
          d3.select("#yvar-obesity")
          .classed('active',false);
          d3.select("#yvar-uninsured")
          .classed('active',false);
          d3.select("#yvar-DaysPoorHealth")
          .classed('active',true);
          app.options.yvar='DaysPoorHealth';
          app.options.yvartext= 'Days of Poor Health (%)';
          app.options.legendMax=app.maxDaysPoorHealth;
          app.options.legendMin=app.minDaysPoorHealth;
          app.update();
          textBox();
      });

      d3.select("#yvar-YPLS")
      .on("click", function(){
         d3.select("#yvar-MaleLifeEx")
          .classed('active',false);
          d3.select("#yvar-YPLS")
          .classed('active',true);
          d3.select("#yvar-obesity")
          .classed('active',false);
          d3.select("#yvar-uninsured")
          .classed('active',false);
          d3.select("#yvar-DaysPoorHealth")
          .classed('active',false);
          app.options.yvar='YPLS';
          app.options.yvartext= 'Average Years of Potential Life Lost';
           app.options.legendMax=app.maxYPLS;
          app.options.legendMin=app.minYPLS;
          app.update(); 
          textBox();    
      });

    // Add event listeners and the like here
       //start slider
     // Data merge:
    
console.log(app.options);
console.log(app.minYPLS);

    // app.resize() will be called anytime the page size is changed
  d3.select(window).on('resize', app.resize);

   },

  resize: function () {
    app.components.forEach(function (c) { if (c.resize) { c.resize(); }});
  },

  update: function () {
   app.components.forEach(function (c) { if (c.update) { c.update(); }});

   console.log(app.options);

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


  }
}

function textBox() {
  d3.select('#leftNumberTop')
    .html(function () {return (app.options.leftName);});
  d3.select('#leftNumber')
    .html(function () {return d3.format(",.1f")(app.options.leftyvarValue);});
  d3.select('#leftNumberBottom')
    .html(function () {return app.options.yvartext+' in counties that are less than '+'<span style="color:white;font-family: Exo, sans-serif;"><strong>'+d3.format(".1f")(app.options.slicer*100)+'% '+'</strong></span>'+app.options.slider+
    '. This accounts for '+'<span style="color:white; font-family: Exo, sans-serif;"><strong>'+d3.format(",.0f")(app.options.leftPop)+'</strong></span>'+' people, '+'<span style="color:white; font-family: Exo, sans-serif;"><strong>'+d3.format(".1f")(app.options.leftPopPercent*100)+
    '%'+'</strong></span>'+' of '+app.options.leftName+'&#39s total population.';});
  d3.select('#rightNumberTop')
  .html(function () {return (app.options.rightName);});
  d3.select('#rightNumber')
  .html(function () {return d3.format(".1f")(app.options.rightyvarValue);});
  d3.select('#rightNumberBottom')
  .html(function () {return app.options.yvartext+' in counties that are greater than '+'<span style="color:white;font-family: Exo, sans-serif;"><strong>'+d3.format(".1f")(app.options.slicer*100)+'% '+'</strong></span>'+app.options.slider+
    '. This accounts for '+'<span style="color:white;font-family: Exo, sans-serif;"><strong>'+d3.format(",.0f")(app.options.rightPop)+'</strong></span>'+' people, '+'<span style="color:white;font-family: Exo, sans-serif;"><strong>'+d3.format(".1f")(app.options.rightPopPercent*100)+
    '%'+'</strong></span>'+' of '+app.options.rightName+'&#39s total population.';});
  d3.select('#legendEnd')
  .html(function () {return app.options.yvartext;});
  app.update();
}


function legend(min,max) {


  var margin = {top: 5, right: 5, bottom: 5, left: 5},
    width = 180 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;


  app.legend=d3.select('#legend').append('svg')
    .attr('width',180)
    .attr('height',50)
     .attr('align','center')


     if (app.options.yvar=="MaleLifeEx"){

  var gradient = app.legend.append("defs")
  .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("x2", "100%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#d73027")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#ffffbf")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#1a9850")
    .attr("stop-opacity", 1);


} else{

var gradient = app.legend.append("defs")
  .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("x2", "100%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#1a9850")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#ffffbf")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#d73027")
    .attr("stop-opacity", 1);
}


app.legend.append("rect")
  .attr("transform", "translate(20,0)")
  .attr('align','center')
   .attr('position','relative')
   .attr('margin','0 auto')
    .attr("width", 140)
    .attr("height", 25)
    .attr('rx',10)
    .attr('ry',10)
    .attr('align','center')
    .style("fill", "url(#gradient)");

app.y = d3.scaleLinear()
  .domain([app.options.legendMin,app.options.legendMax])
  .range([0, 140]);

var yAxis = d3.axisBottom()
  .scale(app.y)
  .ticks(5);

app.legend.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(20,15)")
  .attr("transform", "translate(20,30)")
  .call(yAxis)
  .append("text");
   }

   



legend.prototype = {
  update: function () {
    var chart = this;

d3.select('#legend').selectAll('rect').remove();
d3.select('#legend').selectAll('g').remove();
   
if (app.options.yvar=="MaleLifeEx"){

  var gradient = app.legend.append("defs")
  .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("x2", "100%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#d73027")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#ffffbf")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#1a9850")
    .attr("stop-opacity", 1);


} else{

var gradient = app.legend.append("defs")
  .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("x2", "100%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#1a9850")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#ffffbf")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#d73027")
    .attr("stop-opacity", 1);
}


app.legend.append("rect")
  .attr("transform", "translate(20,0)")
  .attr('align','center')
   .attr('position','relative')
   .attr('margin','0 auto')
    .attr("width", 140)
    .attr("height", 25)
    .attr('rx',10)
    .attr('ry',10)
    .attr('align','center')
    .style("fill", "url(#gradient)");

app.y = d3.scaleLinear()
  .domain([app.options.legendMin,app.options.legendMax])
  .range([0, 140]);

var yAxis = d3.axisBottom()
  .scale(app.y)
  .ticks(5);

app.legend.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(20,15)")
  .attr("transform", "translate(20,30)")
  .call(yAxis)
  .append("text");

  }
}






// var statesEnter=states
//       .enter().append('g')
//       .attr('class','state')
//       .attr('x',0)
//       .attr('y',0);

  

//     statesEnter.append('rect')
//       .attr('x', function (d) { return chart.x(d.lon)- 17.5+7; })
//       .attr('y', function (d) { return chart.y(d.lat)- 17.5 - 40; })
//       .attr('stroke','#CECECE');
    
//     states=states.merge(statesEnter);  





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
        textBox();
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
    .attr('display','none')
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



//.html(function () {return d3.format(".1f")(d[app.options.yvar]);});
        // d3.select(chart.numberTop)
        //   .html(function () {return d.name;});
        // d3.select(chart.numberBottom)
        //   .html(function () {
        //       return app.options.yvartext+' in counties that are '+chart.greaterLess+
        //       ' than '+d3.format(".1f")(app.options.slicer*100)+'% '+app.options.slider+
        //       '. This accounts for '+d3.format(",.0f")(d.Pop)+' people, '+d3.format(".1f")(d.PopPercent*100)+
        //       '% of '+d.name+'s total population.';});

function Chart(selector,analog,sum,numberTop,number,numberBottom,greaterLess) {

  var chart = this;

chart.number=number;
chart.numberTop=numberTop;
chart.numberBottom=numberBottom;
chart.greaterLess=greaterLess;
chart.sum=sum
chart.selector=selector;


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
 

chart.update();
textBox();
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
      .attr('class','staterect')
      .attr('x', function (d) { return chart.x(d.lon)- 17.5+7; })
      .attr('y', function (d) { return chart.y(d.lat)- 17.5 - 40; })
      .attr('stroke','#CECECE');
    
    states=states.merge(statesEnter);  

    states.selectAll('rect')
      .transition().duration(600)    
      .attr('width', function (d) { return chart.sidelength(d.PopPercent); })
      .attr('height', function (d) { return chart.sidelength(d.PopPercent); })
      .attr('fill',function (d) { return chart.colorScale2(d[app.options.yvar]); }) ;

    states
        .on("mouseover", function(d) {if (app.options.mouseover===true){ if (chart.selector=='#chart'){
          app.options.leftName=d.name;
          app.options.leftPop=d.Pop;
          app.options.leftPopPercent=d.PopPercent;
          app.options.leftyvarValue=d[app.options.yvar];
            var id = d.name;
            var matchingState=d3.select('#chart2').selectAll('.state')
              .filter(function(d) {return d.name==id;});
              app.options.rightName=matchingState.data()[0].name;
              app.options.rightPop=matchingState.data()[0].Pop;
              app.options.rightPopPercent=matchingState.data()[0].PopPercent;
              app.options.rightyvarValue=matchingState.data()[0][app.options.yvar];
          console.log(matchingState.data()[0].Pop);
          console.log(app.options.leftPop);
          textBox();

        } else {app.options.rightName=d.name;
          app.options.rightPop=d.Pop;
          app.options.rightPopPercent=d.PopPercent;
          app.options.rightyvarValue=d[app.options.yvar];
            var id = d.name;
            var matchingState=d3.select('#chart').selectAll('.state')
              .filter(function(d) {return d.name==id;});
              app.options.leftName=matchingState.data()[0].name;
              app.options.leftPop=matchingState.data()[0].Pop;
              app.options.leftPopPercent=matchingState.data()[0].PopPercent;
              app.options.leftyvarValue=matchingState.data()[0][app.options.yvar];
          console.log(matchingState.data()[0].Pop);
          console.log(app.options.leftPop);}
          textBox();

        // d3.select(chart.number)
        //   .html(function () {return d3.format(".1f")(d[app.options.yvar]);});
        // d3.select(chart.numberTop)
        //   .html(function () {return d.name;});
        // d3.select(chart.numberBottom)
        //   .html(function () {
        //       return app.options.yvartext+' in counties that are '+chart.greaterLess+
        //       ' than '+d3.format(".1f")(app.options.slicer*100)+'% '+app.options.slider+
        //       '. This accounts for '+d3.format(",.0f")(d.Pop)+' people, '+d3.format(".1f")(d.PopPercent*100)+
        //       '% of '+d.name+'s total population.';});
        };})        
        .on("click", function (d) {if (app.options.mouseover===true) {
          var id = d.name;
           d3.select('rect')
            d3.select(this)     
            .transition().duration(400)
            .attr('width',60)
            .attr('height',60)
            .attr('color','#FFFFFF')
            .attr('text-weight','200');
            app.options.mouseover=false;
            console.log(this);
            chart.update();
         } else {
          d3.selectAll('g')
            .attr('stroke','none');
            app.options.mouseover=true;}});




        
     

    statesEnter.append('text')
      .attr('class','statetext')
      .attr('x', function (d) { return chart.x(d.lon)-2; })
      .attr('y', function (d) { return chart.y(d.lat)-33; })
      .attr('dx',0)
      .attr('dy',0)
      .text(function (d) {return d.abbr;});



  


    }

}




