		
//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
var color = d3.scale.linear()
			  .range(["#f03b20","#fd8d3c","#feb24c","#fed976"]);

var legendText = ["50000+", "25000+", "10000+", "<10000"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);


var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([0, -6])
	.html(function(d) {
		if(d.properties.value === undefined || d.properties.value === null) return "<span style='color:white' >Data Unavailable</span>";
		return "<span style='color:white' >"+d.properties.name+"</span> <span style='color:white'>" + d3.format("0.2s")(d.properties.value) + "</span>";
	})
svg.call(tip);

// Load in my states data!
d3.csv("export.csv", function(data) {
color.domain([0,1,2,3]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {

	// Grab State Name
	var dataState = data[i].state;

	// Grab data value 
	var dataValue = data[i].values;
	var dataRange = data[i].id;

	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
	var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

			json.features[j].properties.value=dataValue;

		if (dataValue <= 10000 ) {

		// Copy the data value into the JSON
		json.features[j].properties.id = dataRange; 

		// Stop looking through the JSON
		break;
		}
		if (dataValue > 10000 && dataValue <= 250000 ) {

		// Copy the data value into the JSON
		json.features[j].properties.id = dataRange; 

		// Stop looking through the JSON
		break;
		}
		if (dataValue > 25000 && dataValue <= 50000 ) {

		// Copy the data value into the JSON
		json.features[j].properties.id = dataRange; 

		// Stop looking through the JSON
		break;
		}
		if (dataValue > 50000 ) {

		// Copy the data value into the JSON
		json.features[j].properties.id = dataRange; 

		// Stop looking through the JSON
		break;
		}
	}
	}
}
		
// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.on("mouseover", tip.show)
	.on("mouseout", tip.hide)
	.on("mouseover", tip.show)
	.on("mouseout", tip.hide)
	.on("mouseenter", function(d,i){
		d3.select(this.parentNode.appendChild(this)).transition().duration(300)
			.style({'stroke-opacity':1,'stroke':'#000', 'stroke-width': 1.1,  'stroke-linejoin': 'round', 'stroke-linecap' : 'round'})
	})
	.on("mouseleave", function(d,i){
		d3.select(this).transition().duration(300)
			.style({'stroke-opacity':1,'stroke':'#ddd', 'stroke-width': 1});
	})
	.style("fill", function(d) {

	// Get data value
	var value = d.properties.id;

	if (value) {
	//If value exists…
	return color(value);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});


// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
var legende = d3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 140)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice().reverse())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legende.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legende.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
	});

});