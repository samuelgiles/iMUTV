//Lartwork:
//LastFM Artwork

function lartwork(){

	var that = this;

	this.clearCache = false;
	this.cacheSize = 100;

	this.cache = Lawnchair({name:'lartcache', adaptor:'dom'},function(e){
	     console.log('Lart Cache Open');
	     if(that.clearCache == true){
	     	console.log("Removing Old Lart Cache Data:");
	     	this.nuke()
	     	console.log("Done.")
	     }

    	this.after('save', function(){that.cullCache()});

	});

	this.resetCache = function(){
		that.cache.nuke();
	}

	this.cullCache = function(){
		
		that.cache.all(function(arr){

			console.log("LArt Cache Size:" + arr.length);

			if(arr.length > that.cacheSize){

				console.log("Culling Lart Cache");

				//Get array, reverse, delete everything after cacheSize
				arr.reverse();

				for(var i=that.cacheSize; i<arr.length; i++){
					that.cache.remove(arr[i].key);
					console.log(arr[i].key + " Removed");
				}
				
			}

		});

	}

	this.GetArtwork = function(mbid, oImage){

		that.cache.get("lart:" + mbid,function(imagedata){

			if(imagedata == undefined){

				$.get("http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=053a42854b88f76d6a25b3e935efb1f2&mbid=" + mbid, function(data) {

				var artwork = {}
				artwork.small = $("image[size=small]", data).text();
				artwork.medium = $("image[size=medium]", data).text();
				artwork.large = $("image[size=large]", data).text();
				artwork.extralarge = $("image[size=extralarge]", data).text();
				artwork.mega = $("image[size=mega]", data).text();

				var artworkurl = "";

				if(artwork.large != ""){
					artworkurl = artwork.large;
				}
				else if(artwork.medium != ""){
					artworkurl = artwork.medium;
				}
				else if(artwork.small != ""){
					artworkurl = artwork.small;
				}
				else{
					artworkurl = "images/cover.jpg";
				}

				$(oImage).attr("src", artworkurl);
				that.cache.save({key:"lart:" + mbid,cdata:artwork});

				});

			}
			else{

				var artwork = imagedata.cdata;

				var artworkurl = "";

				if(artwork.large != ""){
					artworkurl = artwork.large;
				}
				else if(artwork.medium != ""){
					artworkurl = artwork.medium;
				}
				else if(artwork.small != ""){
					artworkurl = artwork.small;
				}
				else{
					artworkurl = "images/cover.jpg";
				}

				$(oImage).attr("src", artworkurl);

			}

		});
		

	}
}