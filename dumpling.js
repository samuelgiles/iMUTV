//Album Artwork Lookup
//Specify multiple possible sources for fallback.
//E.g If not on Amazon then it will try Discogs, if not on Discogs it will try Wikipedia...
function Dumpling(){

	this.ArtistName = "";
	this.ReleaseName = "";
	this.ReleaseMBID = "";
	this.AmazonID = "";
	this.Discogs = "";
	this.Wikipedia = "";

	var that = this;

	this.find = function(callback){

		var artworkURL = "";

		if(that.AmazonID != ""){

		}
		else if(that.Discogs != ""){
	
		}
		else if(that.Wikipedia != ""){

		}
		else if(that.ReleaseMBID != ""){

		}
		else if(that.ArtistName != "" && that.ReleaseName != "")(

		)
		else{
			//No possible way of finding artwork.
		}

	}

}