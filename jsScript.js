


		var dataset = []; //will hold all the data from the csv file
		//console.log(dataset);

		//NOTE: what I had originally done was create two empty arrays to hold the citations(cit) and the year published(y), just to work on preliminarily displaying the data, but I had some trouble so I just hard wired the numbers in to show the graph
		//the svg displays the number of citations in the order they are in the CSV file
		//tbd: is the data coming in pre-sorted?

		var cit = [3209, 971, 500, 433, 403, 324, 256, 214, 186, 185, 172, 92, 70, 62, 61, 59, 111, 32, 27, 27]; // citations
		//console.log(x);
		var y = [2008, 2007, 2009, 2013, 2014, 2009, 2009, 2007, 2008, 2011, 2012, 2007, 2009, 2014, 2006, 2013, 2014, 2008, 2012, 2006]; //publication years

		//read the data from the csv file
		var data = d3.csv("/CHMockDataCSV.csv", function (d){
			for (i=0; i<d.length; i++){
				//console.log(d[i]);
				dataset.push(d[i]);
				//id.push(Number(d[i]["ID"]));
				//x.push(Number(d[i]["Citations"]));
				//y.push(Number(d[i]["Publication Year"]));
			}
		});

		//console.log(data);
		console.log(dataset);
		//console.log(dataset[0]); //COMES BACK AS UNDEFINED

		//width + height of svg
		var w = 700;
		var h = 500;
		var barPadding = 3;
		var citScaleFactor = 10;
		var yScaleFactor = 5;//so that the bars fit within the svg

		//-----------------------------------------------------------

		//CITATIONS GRAPH
		//create SVG element
		var svg2 = d3.select("div#Graph1")
					.append("svg") //adds the svg to the body
					.attr("width", w)
					.attr("height", h);

		// //generate rects and add them to the svg
		svg2.selectAll("rect")
			.data(cit)
			.enter()
			.append("rect")
			.attr("x", function(d, i){
				return i * (w/cit.length); //where the bars are placed
			})
		   .attr("y", function(d){
		   		return (h-(d / citScaleFactor)); //height minus data value
		   })
		   .attr("width", (w/cit.length) - barPadding ) //sets the width of the bar to be scaled to fit the total width of the svg
		   .attr("height", h);

		//create the tags so we know the height of these values
		svg2.selectAll("text")
			.data(cit)
			.enter()
			.append("text")
			.text(function(d){
				return d;
			})
			.attr("x", function(d, i){
				return i * (w / cit.length) + (w / cit.length - barPadding) / 2;
			})
			.attr("y", function(d){
				return h-(d/citScaleFactor);
			})
			.attr("text-anchor", "middle");


		//-----------------------------------------------------------


		//create SVG element
		//YEAR GRAPH
		var svg2 = d3.select("div#Graph2")
					.append("svg") //adds the svg to the body
					.attr("width", w)
					.attr("height", h);

		svg2.selectAll("rect")
			.data(y)
			.enter()
			.append("rect")
			.attr("x", function(d, i){
				return i * (w/y.length); //where the bars are placed
			})
		   .attr("y", function(d){
		   		return (h-(d / yScaleFactor)); //height minus data value
		   })
		   .attr("width", (w/y.length) - barPadding ) //sets the width of the bar to be scaled to fit the total width of the svg
		   .attr("height", h);

		   //create the tags so we know the height of these values
		svg2.selectAll("text")
			.data(y)
			.enter()
			.append("text")
			.text(function(d){
				return d;
			})
			.attr("x", function(d, i){
				return i * (w / y.length) + (w / y.length - barPadding) / 2;
			})
			.attr("y", function(d){
				return h-(d/yScaleFactor);
			})
			.attr("text-anchor", "middle");

		//-----------------------------------------------------------
		//sample data
		    var data = [["article 1 title ", 3209], 
		                ["article 2 title ", 971],
		                ["article 3 title ", 500]]; 

		    var chart = document.getElementById("chart"),
		        axisMargin = 20,
		        margin = 20,
		        valueMargin = 4,
		        width = 800,
		        height = 300,
		        barHeight = (height-axisMargin-margin*2)* 0.4/data.length,
		        barPadding = (height-axisMargin-margin*2)*0.6/data.length,
		        data, bar, svg, scale, xAxis, labelWidth = 0;

		    max = d3.max(data.map(function(i){ 
		      return i[1];
		    })); //get the max citation number

		    svg = d3.select(chart)
		      .append("svg")
		      .attr("width", width)
		      .attr("height", 400); //create the svg


		    bar = svg.selectAll("g")
		      .data(data)
		      .enter()
		      .append("g"); //get the data for each bar

		    bar.attr("class", "bar")
		      .attr("cx",0)
		      .attr("transform", function(d, i) { 
		         return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
		      }); //translate the bar over by the margin

		    //labels on y axis (ie would be Title, subject to change later)
		    bar.append("text")
		      .attr("class", "label")
		      .attr("y", barHeight / 2)
		      .attr("dy", ".35em") //vertical align middle
		      .text(function(d){
		        return d[0];
		      }).each(function() {
		        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
		      });

		    scale = d3.scale.linear()
		      .domain([0, max])
		      .range([0, width - margin*2 - labelWidth]);

		    xAxis = d3.svg.axis()
		      .scale(scale)
		      .tickSize(-height + 2*margin + axisMargin)
		      .orient("bottom");

		    bar.append("rect")
		      .attr("transform", "translate("+labelWidth+", 0)")
		      .attr("height", barHeight)
		      .attr("width", function(d){
		        return scale(d[1]);
		      });

		    // //each bar value labels
		    // bar.append("text")
		    //   .attr("class", "value")
		    //   .attr("y", barHeight / 2)
		    //   .attr("dx", -valueMargin + labelWidth) //margin right
		    //   .attr("dy", ".35em") //vertical align middle
		    //   .attr("text-anchor", "end")
		    //   .text(function(d){
		    //     return d[1];
		    //   })
		    //  .attr("x", function(d){
		    //     var width = this.getBBox().width;
		    //     return Math.max(width + valueMargin, scale(d[1]));
		    //   });

		    // //background lines and x axis labels
		    // svg.insert("g",":first-child")
		    //  .attr("class", "axis")
		    //  .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
		    //  .call(xAxis);










		
