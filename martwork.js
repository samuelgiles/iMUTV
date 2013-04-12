//Music Artwork:
//Fetches an artist image from BBC's static BBCi Music Database.
function martwork(){
	var self = this;
	
	this.fetchImage = function(mbid){
		var url = "http://static.bbci.co.uk/music/images/artists/542x305/" + mbid + ".jpg";
		return url;
	}

	this.fetchDiscogArtwork = function(id){
		///masters/<id>
	}

}