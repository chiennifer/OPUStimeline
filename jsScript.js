

		//TBD IF THIS VARIABLE IS NECESSARY/NOT
		var dataset = []; //will hold all the data from the csv file

		var cit = [];
		var years = [];
		var authors = [];


		d3.csv("/CHMockDataCSV.csv", function(data){

			data.sort(function (a, b){return a.Publication_Year-b.Publication_Year}); //sorts by publication year
			data.sort(function (a, b){return d3.descending(a.Publication_Year, b.Publication_Year)}); //sorts to be descending

			data.forEach(function(d){

				//do the type conversion of strings to numbers for the relevant data columns
				d.ID = +d.ID;
				d["Publication_Year"] = +d["Publication_Year"];
				d.Citations = +d.Citations;
			});

			//var tempAuthors = [];
			//FOR NEXT TIME == LEAVE THE AUTHORS SPLIT SO THAT YOU CAN MAYBE USE A 
			//HASHTABLE WITH THE VALUE AS THE CITATIONS FOR A SPECIFIC AUTHOR
			//SO THEN IF YOU SELECT A CERTAIN AUTHOR THEN IT WILL SAY 
			//THE DATA = __ AND REDRAW THE GRAPH
			
			var currentArticle;

			for (var i = 0; i<data.length; i++){
				dataset.push(data[i]);

				currentArtID = data[i].ID;

				var currAuthors = (data[i].Authors).split(",");
				currAuthors.forEach(function(author){
					//console.log("current author: ", author);
					if (!authors[author]){
						authors[author] = [];
						authors[author].push(currentArtID);
					}
					else{
						authors[author].push(currentArtID);
					}
				});
			}

			console.log("authors: ", authors); //UNSORTED

			//var updatedData =
			//authorCheckBoxes(data, authors, citMax);
			//console.log("updated checkbox data", updatedData);

			//fill the citations variable
			// dataset.forEach(function (d) {
			// 	cit.push(d.Citations); //add the citations 
			// });

			dataset.forEach(function (d) {
				cit.push(d.Citations); //add the citations 
			});

			//used for double checking values
			// console.log("citations min:", Math.min.apply(null, cit));
			// console.log("citations max:", Math.max.apply(null, cit));
			// console.log("year max:", data[0]["Publication_Year"]);
			// console.log("year min:", data[data.length-1]["Publication_Year"]);

			//var citMin = d3.min(cit);
			var citMax = d3.max(cit);
			// var yearMin = data[0]["Publication_Year"];
			// var yearMax = data[data.length-1]["Publication_Year"];

			function authorBX(){
				for (var key in authors){
					createCheckBoxes(key, authors);
				}
				authorCheckBoxes(data, authors, citMax);
			}
			authorBX();

			// createCheckBoxes(" A-L Barabasi", authors);
			// createCheckBoxes(" Albert-Laszlo Barabasi", authors);

			
			//drawGraph1(cit);
			//checkBoxesCoauthors(data);

			//drawGraph2(authorCheckBoxes(data, authors, citMax), citMax);

		});

	//creates hte interactive checkboxed for each author in authors
	function createCheckBoxes(a, authors){
		var checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.className = "myCheckbox";
			checkbox.value = a;
			checkbox.id = a;

		var label = document.createElement('label')
			label.htmlFor = a;
			label.appendChild(document.createTextNode(a + " (" + authors[a].length + ")  "));

		checkBoxCoauthors.appendChild(checkbox);
		checkBoxCoauthors.appendChild(label);

	}
	
	//returns the data that will show up in the timeline
	function authorCheckBoxes (data, authors, citMax) {
		//updating checkboxes
      	function update(){
      		console.log("Starting update");
      		var choices = [];
      		d3.selectAll(".myCheckbox").each(function(d){
      			cb = d3.select(this);
      			if (cb.property("checked")){
      				choices.push(cb.property("value"));
      			}
      		});

      		var newData = [];

      		if (choices.length>0){
      			choices.forEach(function (author){
      				//gets the relevant article information from the dataset from the corresponding author
      				console.log((data.filter(function (article) { return article.ID == authors[author];}))[0] );
      				newData.push((data.filter(function (article) { return article.ID == authors[author];}))[0] );
      			});
      		}
      		else{
      			newData = data; //if none are selected, keep the entire dataset
      		}

      		console.log("ALERT: DATA CHECKBOXES UPDATED", newData);

      		drawGraph2(newData, citMax)

      		return newData;

      	};

		var table = d3.select("div#checkBoxCoauthors")
					.append("table")
					.property("border", "1px");
		var themCheckboxes = d3.selectAll(".myCheckbox").on("change", update);
		console.log("BLAH");
		console.log(themCheckboxes);
		//d3.selectAll(".myCheckbox").on("change", update);
		//d3.select("#checkBoxCoauthors").select(".myCheckbox").onChange(update);

      	update();
	}



		//console.log(dataset);

		//-----------------------------------------------------------

		// //width + height of svg
		// var w = 700;
		// var h = 500;
		// var barPaddingg1 = 3;
		// var citScaleFactor = 7;
		// var yScaleFactor = 5;  //so that the bars fit within the svg

		//-----------------------------------------------------------

		//CITATIONS GRAPH
		//create SVG element
		// function drawGraph1 (cit){

		// 	console.log("drawing graph 1...", cit);

		// 	// console.log("width", w);
		// 	// console.log("height", h);
		// 	// console.log("citations length", cit.length);
		// 	// console.log("barPadding", barPadding);

		// 	var svg2 = d3.select("div#Graph1")
		// 				.append("svg") //adds the svg to the body
		// 				.attr("width", w)
		// 				.attr("height", h);

		// 	// //generate rects and add them to the svg
		// 	svg2.selectAll("rect")
		// 		.data(cit)
		// 		.enter()
		// 		.append("rect")
		// 		.attr("x", function(d, i){
		// 			return i * (w/cit.length); //where the bars are placed
		// 		})
		// 	   .attr("y", function(d){
		// 	   		return (h-(d / citScaleFactor)); //height minus data value
		// 	   })
		// 	   .attr("width", (w/cit.length) - barPaddingg1) //sets the width of the bar to be scaled to fit the total width of the svg
		// 	   .attr("height", h)

		// 	   // bar.append("rect")
  //     //       .attr("transform", "translate("+labelWidth+", 0)")


		// 	//create the tags so we know the height of these values
		// 	svg2.selectAll("text")
		// 		.data(cit)
		// 		.enter()
		// 		.append("text")
		// 		.text(function(d){
		// 			return d;
		// 		})
		// 		.attr("x", function(d, i){
		// 			return i * (w / cit.length) + (w / cit.length - barPaddingg1) / 2;
		// 		})
		// 		.attr("y", function(d){
		// 			return h-(d/citScaleFactor);
		// 		})
		// 		.attr("text-anchor", "middle");

		// };

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

		function drawGraph2(d, xmax){

			//create an array for each new year that appears or a space if the year is not new
			var years = [];
			var i=0;
			var currentYear;

			console.log("drawing graph 2...", d);

			d.forEach(function (data) {
				//console.log(data);
				if (i != 0 && currentYear == data.Publication_Year){
					years.push(" ");
					i++;
					//console.log("encountered a repeat year...");
				}
				else{
					years.push(data.Publication_Year);
					i++;
					currentYear = data.Publication_Year;
					//console.log("NEW YEAR!")
				}
			});

			//console.log("years array has ", years);


			
			var axisMargin = 50,
            	margin = 30, //leftmost margin
            	valueMargin = 3,

            	width = 1000, //parseInt(d3.select('body').style('width'), 10),
            	//height = 1000,
            	//barHeight = (1000/d.length) - (3*2), //added /10 to make bars skinnier
            	barHeight = 2,//barThickness
            	barPadding = 30,

            	barContainer = (barHeight + (barPadding * 2)),
            	height = barContainer*d.length + (axisMargin) + barPadding,

            	endBarWidth = 8,
            	endBarHeight = 25,

            	fontMargin = 20, //PARAMETERIZE????

       			//dataScale = 4,
            	data, bar, svg, xScale, yScale, xAxis, labelWidth = 0;


			svg = d3.select("div#Graph2")
		 			.append("svg") //adds the svg to the body
		 			.attr("width", width)
		 			.attr("height", height);

		 	bar = svg.selectAll("g")
						.data(d)
						.enter()
						.append("g");

			bar.attr("class", "bar")
				.attr("cx", 0)
				.attr("transform", function(d, i){
					return "translate(" + margin + "," + (i* barContainer) + ")";
				}); //spaces out the bars vertically

			//adds the axis label on the left with the YEAR
			bar.append("text")
				.attr("class", "label")
				.attr("y", axisMargin + barPadding)
				.attr("dy", "0.35em") //vertical align middle of bar
				.text(function(d, i){
					return years[i];//d.Publication_Year; //RETURNS THE TITLE AS THE TAG FOR EACH BAR -- NEEDS TO BE TITLE AND JOURNAL
				});
				// .each(function(){
				// 	labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width)); //left margin between year and bar start
				// });

			xScale = d3.scale.linear()
						.domain([0, xmax + 1000]) //maps the domain of 0-xmax+1000 onto the width of the svg
						//.range([margin + valueMargin, (width-valueMargin)]);
						.range([margin + valueMargin, width-valueMargin]);

			bar.append("rect")
				.attr("x", axisMargin)
				.attr("y", axisMargin + barPadding)
	            .attr("height", barHeight)
	            .attr("width", function(d){
	                return xScale(d.Citations);// /dataScale;
	            }); //adds the rectangles to the body (draws them)

	        //add the endbar
			bar.append("rect")
				.attr("x", function(d){
					return axisMargin + xScale(d.Citations);
				})
				.attr("y", function(d){
					return axisMargin + barPadding - (endBarHeight/2) + (barHeight/2);
				})
	            .attr("height", endBarHeight)
	            .attr("width", endBarWidth);
	            // .attr("width", function(d){
	            //     return xScale(d.Citations) - (endBarWidth/2);// /dataScale;
	            // });

			xAxis = d3.svg.axis()
			 			.scale(xScale)
			 			.ticks(5)
			 			.tickSize(6,0)
			 			.orient("bottom");

			// yScale = d3.scale.linear()
			//  			.domain([ymin, ymax])
			//  			.range([0, height]);

			// yAxis = d3.svg.axis()
			// 			.scale(yScale)
			// 			.ticks(20)
			// 			.tickSize(5,0)
			//  			.orient("left");

    		//puts the titles at the end of each bar
		    bar.append("text")
		            .attr("class", "value")
		            .attr("x", axisMargin)
		            .attr("y", axisMargin + barPadding - (fontMargin/2))
		            //.attr("y", axisMargin - 2*barPadding)
		            //.attr("y", (barContainer/2) + (barHeight/3)) //barHeight/2 placed the label on the bottom of the bar
		            .attr("dx", valueMargin) //+ labelWidth) //margin right
		            .attr("dy", ".35em")//barContainer)//".35em") //vertical align middle
		            .attr("text-anchor", "end")
		            .text(function(d){
		                return (d.Title); //get the value to tag at the end of the bar
		            })
		            .attr("x", function(d){
		                var width = this.getBBox().width;
		                return width + axisMargin + margin + xScale(d.Citations); 
		            });

		    bar.append("text")
		            .attr("class", "value")
		            .attr("x", axisMargin)
		            .attr("y", axisMargin + (barHeight/2) + barPadding + (fontMargin/2))
		            //.attr("y", axisMargin - 2*barPadding)
		            //.attr("y", (barContainer/2) + (barHeight/3)) //barHeight/2 placed the label on the bottom of the bar
		            .attr("dx", valueMargin) //+ labelWidth) //margin right
		            .attr("dy", ".35em")//barContainer)//".35em") //vertical align middle
		            .attr("text-anchor", "end")
		            .text(function(d){
		                return (d.Journal); //get the value to tag at the end of the bar
		            })
		            .attr("x", function(d){
		                var width = this.getBBox().width;
		                return width + axisMargin + margin + xScale(d.Citations); 
		            });

		    // creates a div to add the hover information to as the user interacts with the page
		    var div = d3.select("body").append("div").attr("class", "toolTip");

		    //when the user hovers over a bar, display the authors and venue(journal)
		    bar.on("mousemove", function(d){
		    	div.style("left", d3.event.pageX+10+"px");
		    	div.style("top", d3.event.pageY-25+"px");
		    	div.style("display", "inline-block");
		    	div.html(
		    		"Authors: " + (d.Authors) + "<br>" + "Venue: " + (d.Journal));
		    });

		    bar.on("mouseout", function(d){
		    	div.style("display", "none");
		    });

		    // svg.insert("g")//,":first-child")
	     //        .attr("class", "axisHorizontal")
	     //        //.attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin*2)+")")
	     //        .call(xAxis)

	     	svg.append("g")
	     		.attr("transform", "translate(-50,0)")
	     		.attr("class", "x axis")
	     		.call(xAxis);

	     	// svg.append("g")
	     	// 	.attr("transform", "translate(" + axisMargin+ ",30)")
	     	// 	.attr("class", "y axis")
	      //   	.call(yAxis);


	    





		};










		
