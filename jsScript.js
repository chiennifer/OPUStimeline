

		//TBD IF THIS VARIABLE IS NECESSARY/NOT
		var dataset = []; //will hold all the data from the csv file
		//console.log(dataset);

		var cit = [];
		//console.log(x);
		//var y = [2008, 2007, 2009, 2013, 2014, 2009, 2009, 2007, 2008, 2011, 2012, 2007, 2009, 2014, 2006, 2013, 2014, 2008, 2012, 2006]; //publication years
		var years = [];

		d3.csv("/CHMockDataCSV.csv", function(data){

			data.sort(function (a, b){return a.Publication_Year-b.Publication_Year}); //sorts by publication year
			data.sort(function (a, b){return d3.descending(a.Publication_Year, b.Publication_Year)}); //sorts to be descending

			data.forEach(function(d){

				//do the type conversion of strings to numbers for the relevant data columns
				d.ID = +d.ID;
				d["Publication_Year"] = +d["Publication_Year"];
				d.Citations = +d.Citations;
			});

			//console.log(data[0]); //for testing purposes
			for (var i = 0; i<data.length; i++){
				dataset.push(data[i]);
			}

			//for testing purposes to check if the data is sorted by year
			// data.forEach(function(d){
			// 	console.log(d.Publication_Year, d.Citations);
			// });

			//fill the citations variable
			dataset.forEach(function (d) {
				cit.push(d.Citations); //add the citations 
			});

			//fill the years variable //ACTUALLY NOT NEEDED IF THE DATA IS SORTED
			// dataset.forEach(function(d)){
			// 	years.push(d.Publication_Year);
			// }

			//used for double checking values
			console.log("citations min:", Math.min.apply(null, cit));
			console.log("citations max:", Math.max.apply(null, cit));
			console.log("year max:", data[0]["Publication_Year"]);
			console.log("year min:", data[data.length-1]["Publication_Year"]);

			var citMin = d3.min(cit);
			var citMax = d3.max(cit);
			var yearMin = data[0]["Publication_Year"];
			var yearMax = data[data.length-1]["Publication_Year"];

			drawGraph1(cit);

			drawGraph2(data, citMax, yearMax, yearMin);

		});

		//console.log(dataset);

		//-----------------------------------------------------------

		//width + height of svg
		var w = 700;
		var h = 500;
		var barPaddingg1 = 3;
		var citScaleFactor = 7;
		var yScaleFactor = 5;  //so that the bars fit within the svg

		//-----------------------------------------------------------

		//CITATIONS GRAPH
		//create SVG element
		function drawGraph1 (cit){

			console.log("drawing graph 1...", cit);

			// console.log("width", w);
			// console.log("height", h);
			// console.log("citations length", cit.length);
			// console.log("barPadding", barPadding);

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
			   .attr("width", (w/cit.length) - barPaddingg1) //sets the width of the bar to be scaled to fit the total width of the svg
			   .attr("height", h)

			   // bar.append("rect")
      //       .attr("transform", "translate("+labelWidth+", 0)")


			//create the tags so we know the height of these values
			svg2.selectAll("text")
				.data(cit)
				.enter()
				.append("text")
				.text(function(d){
					return d;
				})
				.attr("x", function(d, i){
					return i * (w / cit.length) + (w / cit.length - barPaddingg1) / 2;
				})
				.attr("y", function(d){
					return h-(d/citScaleFactor);
				})
				.attr("text-anchor", "middle");

		};

		//-----------------------------------------------------------


		// //create SVG element
		// //YEAR GRAPH
		// var svg2 = d3.select("div#Graph2")
		// 			.append("svg") //adds the svg to the body
		// 			.attr("width", w)
		// 			.attr("height", h);

		// svg2.selectAll("rect")
		// 	.data(y)
		// 	.enter()
		// 	.append("rect")
		// 	.attr("x", function(d, i){
		// 		return i * (w/y.length); //where the bars are placed
		// 	})
		//    .attr("y", function(d){
		//    		return (h-(d / yScaleFactor)); //height minus data value
		//    })
		//    .attr("width", (w/y.length) - barPadding ) //sets the width of the bar to be scaled to fit the total width of the svg
		//    .attr("height", h);

		//    //create the tags so we know the height of these values
		// svg2.selectAll("text")
		// 	.data(y)
		// 	.enter()
		// 	.append("text")
		// 	.text(function(d){
		// 		return d;
		// 	})
		// 	.attr("x", function(d, i){
		// 		return i * (w / y.length) + (w / y.length - barPadding) / 2;
		// 	})
		// 	.attr("y", function(d){
		// 		return h-(d/yScaleFactor);
		// 	})
		// 	.attr("text-anchor", "middle");

		//-----------------------------------------------------------
		
		//CURRENTLY WORKING ON CREATING A HORIZONTAL BAR CHART WITH THE DATA

		function drawGraph2(d, xmax, ymax, ymin){

			console.log("drawing graph 2...", d);

			var axisMargin = 40,
            	margin = 100, //leftmost margin
            	valueMargin = 40,
            	width = parseInt(d3.select('body').style('width'), 10),
            	height = parseInt(d3.select('body').style('height'), 10),
            	barHeight = (height-axisMargin-margin*2)* 0.4/d.length, //added /10 to make bars skinnier
            	barPadding = (height-axisMargin-margin*2)*0.6/d.length,
       			dataScale = 4,
            	data, bar, svg, xScale, yScale, xAxis, labelWidth = 0;

			svg = d3.select("div#Graph2")
		 			.append("svg") //adds the svg to the body
		 			.attr("width", width)
		 			.attr("height", height);

		 	bar = svg.selectAll("g") //put the bars into a g so they can be rotated?
						.data(d)
						.enter()
						.append("g");

			bar.attr("class", "bar")
				.attr("cx", 0)
				.attr("transform", function(d, i){
					return "translate(" + margin + "," + (i* (barHeight + barPadding) + barPadding) + ")";
				}); //spaces out the bars vertically

			//adds the axis label on the left with the year
			bar.append("text")
				.attr("class", "label")
				.attr("y", barHeight/2)
				.attr("dy", "0.35em") //vertical align middle of bar
				.text(function(d){
					return d.Publication_Year; //RETURNS THE TITLE AS THE TAG FOR EACH BAR -- NEEDS TO BE TITLE AND JOURNAL
				}).each(function(){
					labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width)); //left margin between year and bar start
				});

			xScale = d3.scale.linear()
						.domain([0, xmax]) //maps the domain of 0-xmax+1000 onto the width of the svg
						//.range([margin + valueMargin, (width-valueMargin)]);
						.range([margin + valueMargin, width-valueMargin]);

			bar.append("rect")
	            .attr("transform", "translate("+labelWidth+", 0)")
	            .attr("height", barHeight)
	            .attr("width", function(d){
	                return xScale(d.Citations);// /dataScale;
	            }); //adds the rectangles to the body (draws them)

			//fix this <--------------------------------------------------------------------------------

			console.log("xscale min", xScale(margin + valueMargin)); //2013.99750701153
			console.log("xscale max", xScale(width-valueMargin));


			xAxis = d3.svg.axis()
			 			.scale(xScale)
			 			.tickSize(-height + 2*margin + axisMargin)
			 			.orient("bottom");

			yScale = d3.scale.linear()
			 			.domain([ymin, ymax])
			 			.range([height, 0]);

			yAxis = d3.svg.axis()
						.scale(yScale)
						.tickSize(-height + 2*margin + axisMargin)
			 			.orient("left");

            //DOES NOT WORK
		    // bar.append("text")
		    //         .attr("class", "value")
		    //         .attr("y", barHeight / 2)
		    //         .attr("dx", -valueMargin + labelWidth) //margin right
		    //         .attr("dy", ".35em") //vertical align middle
		    //         .attr("text-anchor", "end")
		    //         .text(function(d){
		    //             return (d.Citations+"%");
		    //         })
		    //         .attr("x", function(d){
		    //             var width = this.getBBox().width;
		    //             return Math.max(width + valueMargin, scale(d.Citations));
		    //         });

		    // svg.insert("g")//,":first-child")
	     //        .attr("class", "axisHorizontal")
	     //        //.attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin*2)+")")
	     //        .call(xAxis)

	     	// svg.append("g")
	     	// 	.attr("class", "x axis")
	     	// 	.call(xAxis);

	     	// svg.append("g")
	     	// 	.attr("class", "y axis")
	      //   	.call(yAxis);







		};










		
