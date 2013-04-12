//Gets the Radio 1 Official Charts
function rohart(){
	var self = this;
	this.topfourtysingles = function(callback){
		//http://www.bbc.co.uk/radio1/chart/singles
		$.get("http://www.bbc.co.uk/radio1/chart/singles", function(data) {
			self.rip(callback, data, "singles");
		});
	}
	this.topfourtyalbums = function(callback){
		//http://www.bbc.co.uk/radio1/chart/albums
		$.get("http://www.bbc.co.uk/radio1/chart/albums", function(data) {
			self.rip(callback, data, "albums");
		});
	}
	this.rip = function(callback, data, type){
		var chart = $(".chart ol", data);
		var aChart = new Array();
		
		$(".chart-item", chart).each(function(){
			var tChartItem = {}

			tChartItem.Position = parseFloat($(".position", this).text());
			tChartItem.ArtworkURL = $(".cover", this).attr("src");

			var httploc = tChartItem.ArtworkURL.indexOf("\/http:\/\/www.bbc.co.uk");
			var httpendloc = tChartItem.ArtworkURL.length;

			tChartItem.ArtworkURL = tChartItem.ArtworkURL.substr(httploc+1, httpendloc);

			tChartItem.ArtistMBID = $(".artist-link", this).attr("href");
			tChartItem.ArtistName = $(".artist:first", this).text();
			tChartItem.Name = $(".track:first", this).text();

			if(tChartItem.ArtistMBID != undefined){
				var mbidbbc = tChartItem.ArtistMBID;
				var mbid = mbidbbc.replace("/music/artists/", "");
				tChartItem.ArtistMBID = mbid;
			}

			aChart.push(tChartItem);
		});

		console.log("Hello from Rohart")

		var callbackdata = {
			"charttype": type,
			"chartdata": aChart
		};

		//callback(callbackdata);
		console.log(callbackdata)
	}
}