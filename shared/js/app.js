//import loadJson from '../../components/load-json/'
import * as d3 from "d3"
import * as topojson from "topojson"
import contains from 'shared/js/contains'
const infected = [3012,3021,3032,3038,3042,3046,3047,3055,3060,3064]
import mustache from "shared/js//mustache"
//import templateHtml from '../../templates/template.html'
import tooltipHtml from 'shared/js/tooltip.html'

export class App {

	constructor(suburbs, places) {

		var self = this

		this.centre = [145,-37.8]

		this.ratio = 40

		this.suburbs = suburbs

		this.places = places

		this.activate()
		
	}

	activate() {

		var self = this

		this.tooltip = d3.select("body").append("div")
		    .attr("class", "tipster")
		    .style("position", "absolute")
		    .style("background-color", "white")
		    .style("opacity", 0);

		this.init()

		this.resizer()

	}

    resizer() {

        var self = this

        window.addEventListener("resize", function() {

            clearTimeout(document.body.data)

            document.body.data = setTimeout( function() { 

                self.init()

            }, 200);

        });

    }

	init() {

		var self = this

		var container = d3.select("#coronaMapContainer")

		var filterPlaces = self.places.filter( (d) => d.city === "Melbourne");
		
		var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		var isMobile = (windowWidth < 610) ? true : false ;

		var width = document.querySelector("#coronaMapContainer").getBoundingClientRect().width

		var height = width * 0.8;

		var projection = d3.geoMercator()
		                    .center(self.centre)
		                    .scale(width * self.ratio)
		                    .translate([ width / 2, height / 2 ])

		container.selectAll("svg").remove()

		var path = d3.geoPath().projection(projection);

		var geo = topojson.feature(self.suburbs, self.suburbs.objects.victoria).features    

		var svg = container.append("svg")	
		                .attr("width", width)
						.attr("height", height)
		                .attr("id", "covid-19-map")
		                .attr("overflow", "hidden");

		var features = svg.append("g")

		var tops = features.selectAll("path").data(geo)

		tops.enter()
		    .append("path")
		        .attr("fill", function(d){
		        	console.log(+d.properties.postcode)
		        	return contains(infected, +d.properties.postcode) ? "red" : "#eaeaea" ;
		        })
		        .attr("stroke", "#fff")
		        .attr("d", path)
				.on("mouseover", function(d) {

					console.log("Testing")

					self.tooltip.transition().duration(200).style("opacity", .9);

					self.tooltip.html( self.tipster(d.properties) )
					   .style("left", `${d3.event.pageX + 20}px`) //self.tooltip(d3.event.pageX, width) + "px"
					   .style("top", `${d3.event.pageY + 10}px`)


				})
				.on("mouseout", (d) => self.tooltip.transition().duration(500).style("opacity", 0))

		var labels = svg.selectAll("text").data(filterPlaces)

		labels.enter()
			.append("text")
			.text((d) => d.name)
			.attr("x", (d) => projection([d.longitude, d.latitude])[0])
			.attr("y", (d) => projection([d.longitude, d.latitude])[1])
			.attr("class","label")


	}

	tipster(data) {

		var self = this

	    var html = mustache(tooltipHtml, data)

		return html

	}

	tooltip(pos, width) {

		var self = this

		if (width < 500) {

			return (width / 2) - 100

		} else {

			return ((pos > width / 2) ? pos  - 235 : pos + 5 )

		}

	}

}