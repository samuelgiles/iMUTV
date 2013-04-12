//JAM, Javascript Asyncronous Marmalade-specific-Musicbrainz-Interface-With-Lawnchair-Powered-Cache

function jam(){

	var that = this;

	this.clearCache = false;
	this.cacheSize = 20;
	this.host = "http://www.musicbrainz.org";

	//Notes on Cache:
	//Generally stores MBIDs
	//Can store the result of searches, in which case you must append what type of query it is at the start, e.g:
	//artist:<MBID>
	//Idea behind that is, a release could be called "Kasabian", but an Artist could also be called "Kasabian"
	this.cache = Lawnchair({name:'jamcache', adaptor:'dom'},function(e){
	     console.log('Cache Open');
	     if(that.clearCache == true){
	     	console.log("Removing Old Cache Data:");
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

			console.log("Cache Size:" + arr.length);

			if(arr.length > that.cacheSize){

				console.log("Culling Cache");

				//Get array, reverse, delete everything after cacheSize
				arr.reverse();

				for(var i=that.cacheSize; i<arr.length; i++){
					that.cache.remove(arr[i].key);
					console.log(arr[i].key + " Removed");
				}
				
			}

		});

	}

	//Artist

	//Artist Search function
	//E.g "Kasabian"
	//OR: "recording", '"Time Machine" AND artist: "Viva Brother"'
	//Returns:
	/*
		aArtists[
			toArtist{
				ID,
				Type,
				Name,
				Country,
				Score,
				Disambiguation
			}
		]
	*/
	this.artistSearch = function(query, callback){
		//http://www.musicbrainz.org/ws/2/artist/?query=artist:Viva%20Brother
		console.log("query" + query)
		console.log(that.host + '/ws/2/artist/?query=artist:' + encodeURIComponent(query));
		that.cache.get("artist:" + query,function(artistCacheData){

			if(artistCacheData == undefined){

				$.get(that.host + '/ws/2/artist/?query=artist:' + encodeURIComponent(query), function(data) {
					
					var oData = $(data);
					var aArtists = new Array();
					$("artist", oData).each(function(){

					var toArtist = {}
					toArtist.ID = $(this).attr("id");
					toArtist.Type = $(this).attr("type");
					toArtist.Name = $("name:first", this).text();
					toArtist.Country = $("country", this).text();
					toArtist.Score = $(this).attr("ext:score");
					
					toArtist.Disambiguation = $("disambiguation", this).text();

					aArtists.push(toArtist);
					});

					that.cache.save({key:"artist:" + query,cdata:aArtists});

					if(callback != undefined){
					callback(aArtists);
					}
					else{
					console.log(aArtists);
					return aArtists;
					}

				});
			}
			else{

				aArtists = artistCacheData.cdata;

				if(callback != undefined){
				callback(aArtists);
				}
				else{
				console.log(aArtists);
				return aArtists;
				}

			}

		});

	}

	//Artist Lookup:
	//E.g: "69b39eab-6577-46a4-a9f5-817839092033" : Kasabian
	this.artistLookup = function(query,callback){

	}

	//Artist Releases:
	//E.g "69b39eab-6577-46a4-a9f5-817839092033" : Kasabian
	//You MUST pass in a MBID, otherwise multiple artist albums could be found.
	this.artistReleases = function(query,callback){
		//http://musicbrainz.org/ws/2/release/?query=arid:69b39eab-6577-46a4-a9f5-817839092033

		that.cache.get(query,function(artistCacheData){
			console.log(artistCacheData)
			if(artistCacheData == undefined){

				$.get(that.host + '/ws/2/release/?query=arid:' + encodeURIComponent(query) + "&status=official&limit=100", function(data) {
					var oData = $(data);
					var aArtistReleases = new Array();
					$("release", oData).each(function(){

					var toArtistRelease = {}
					toArtistRelease.Title = $("title:first", this).text();
					toArtistRelease.ID = $(this).attr("id");
					toArtistRelease.ArtistID = $("artist-credit artist:first", this).attr("id");
					toArtistRelease.Artist = $("artist-credit artist:first name", this).text();
					toArtistRelease.Type = $("release-group", this).attr("type");
					toArtistRelease.ReleaseDate = $("date", this).text();
					toArtistRelease.TrackCount = $("medium-list track-count:first", this).text();

					aArtistReleases.push(toArtistRelease);

					});

					that.cache.save({key:query,cdata:aArtistReleases});

					if(callback != undefined){
					callback(aArtistReleases);
					}
					else{
					console.log(aArtistReleases);
					return aArtistReleases;
					}
				});

			}
			else{

				aArtistReleases = artistCacheData.cdata;
				console.log(aArtistReleases)
				if(callback != undefined){
				callback(aArtistReleases);
				}
				else{
				console.log(aArtistReleases);
				return aArtistReleases;
				}

			}

		});

		
	}
	

	//Artist Releases Groups:
	//E.g "69b39eab-6577-46a4-a9f5-817839092033" : Kasabian
	//You MUST pass in a MBID, otherwise multiple artist albums could be found.
	this.artistReleaseGroups = function(query,callback){
		//http://musicbrainz.org/ws/2/release/?query=arid:69b39eab-6577-46a4-a9f5-817839092033

		console.log(that.host + '/ws/2/release-group/?query=arid:' + encodeURIComponent(query))
		that.cache.get(query,function(artistCacheData){

			if(artistCacheData == undefined){

				$.get(that.host + '/ws/2/release-group/?query=arid:' + encodeURIComponent(query), function(data) {
					var oData = $(data);
					var aArtistReleases = new Array();
					
					$("release-group", oData).each(function(){

					var toArtistRelease = {}
					toArtistRelease.Title = $("title:first", this).text();
					toArtistRelease.ID = $(this).attr("id");
					toArtistRelease.Type = $("release-group primary-type:first", this).text();
					toArtistRelease.ReleaseDate = $("date", this).text();
					toArtistRelease.TrackCount = $("medium-list track-count:first", this).text();

					aArtistReleases.push(toArtistRelease);

					});

					that.cache.save({key:query,cdata:aArtistReleases});

					if(callback != undefined){
					callback(aArtistReleases);
					}
					else{
					console.log(aArtistReleases);
					return aArtistReleases;
					}
				});

			}
			else{

				aArtistReleases = artistCacheData.cdata;

				if(callback != undefined){
				callback(aArtistsReleases);
				}
				else{
				console.log(aArtistReleases);
				return aArtistReleases;
				}

			}

		});
	}

	//Album Lookup:
	//E.g. "d0bf59af-398b-4612-ab15-377c786d8a1d" : Kasabian by Kasabian
	//You MUST pass in a MBID.
	/*
	aAlbum{
		Title,
		ReleaseDate
		ID
		ArtistID
		ArtistName
		Tracks[
			toTrack{
				ID,
				Position
				No
				Title
				Length
			}
		]	
	}
	*/
	this.albumLookup = function(query,callback){
		///<ENTITY>/<MBID>?inc=<INC>
		//http://musicbrainz.org/ws/2/release/d0bf59af-398b-4612-ab15-377c786d8a1d?inc=recordings url-rels artists

		that.cache.get(query,function(artistCacheData){

			if(artistCacheData == undefined){
				$.get(that.host + '/ws/2/release/' + encodeURIComponent(query) + "?inc=recordings url-rels artists", function(data) {
					var oData = $("release", data);
					var aAlbum = {}

					aAlbum.Title = $("title:first", oData).text();
					aAlbum.ReleaseDate = $("date:first", oData).text();
					aAlbum.Tracks = new Array();
					aAlbum.ID = $(oData).attr("id");
					aAlbum.ArtistID = $("artist-credit artist", oData).attr("id");
					aAlbum.ArtistName = $("artist-credit artist name", oData).text()

					$("track", oData).each(function(){

						var toTrack = {}
						toTrack.ID = $("recording:first", this).attr("id");
						toTrack.Position = $("position", this).text();
						toTrack.No = $("number", this).text();
						toTrack.Title = $("recording:first title", this).text();
						toTrack.Length = $("recording:first length", this).text();

						aAlbum.Tracks.push(toTrack);

					});

					aAlbum.URLs = new Array();

					$("relation", oData).each(function(){

						var toURL = {}
						toURL.Type = $(this).attr("type");
						toURL.Target = $("target", this).text();

						aAlbum.URLs.push(toURL);

					})

					that.cache.save({key:query,cdata:aAlbum});

					if(callback != undefined){
					callback(aAlbum);
					}
					else{
					console.log(aAlbum);
					return aAlbum;
					}

				});
			}
			else{

				aAlbum = artistCacheData.cdata;

				if(callback != undefined){
				callback(aAlbum);
				}
				else{
				console.log(aAlbum);
				return aAlbum;
				}

			}

		});

	}

	//Recording
	//Search
	//Returns:
	/*
		aRecordings[
			toRecording{
				Title,
				Duration,
				ID,
				Score,
				Artist{
					Name,
					Disambiguation,
					ID
				}
				Releases[
					toRecordingRelease{
						Title,
						ID,
						Type,
						ReleaseDate,
						Country,
						TrackCount
					}
				]
			}
		]
	*/
	this.recordingSearch = function(query,callback){

		that.cache.get("recording:" + query,function(recordingCacheData){

			if(recordingCacheData == undefined){

				$.get(that.host + '/ws/2/recording/?query=' + encodeURIComponent(query) + "", function(data) {
					//console.log(data);
					
					var oData = $(data);
					var aRecordings = new Array();

					$("recording", oData).each(function(){

						var toRecording = {}

						toRecording.Title = $("title:first", this).text();
						toRecording.Duration = $("length:first", this).text();
						toRecording.ID = $(this).attr("id");
						toRecording.Score = $(this).attr("ext:score");
						toRecording.Artist = {
							Name: $("artist:first name", this).text(),
							Disambiguation: $("artist:first disambiguation", this).text(),
							ID: $("artist", this).attr("ID")
						}
						toRecording.Releases = new Array();

						$("release-list", this).find("release").each(function(){
							var toRecordingRelease = {}
							toRecordingRelease.Title = $("title:first", this).text();
							toRecordingRelease.ID = $(this).attr("id");
							toRecordingRelease.Type = $("release-group primary-type:first", this).text();
							toRecordingRelease.ReleaseDate = $("date:first", this).text();
							toRecordingRelease.Country = $("country:first", this).text();
							toRecordingRelease.TrackCount = $("medium-list track-count:first", this).text();
							toRecording.Releases.push(toRecordingRelease);
						});

						aRecordings.push(toRecording);

					});
				
				console.log(aRecordings);
					
					
				});

			}
			else{

				aRecording = recordingCacheData.cdata;

				if(callback != undefined){
				callback(aRecording);
				}
				else{
				console.log(aRecording);
				return aRecording;
				}

			}

		});

	}
	//Lookup

	//Utilities:

	//Pass in a Musicbrainz duration and get an object {"minutes", "seconds"}
	this.durationToTime = function(duration){

		duration = duration/60;
		var toDurationToTime = {"minutes": Math.floor(duration/60), "seconds": duration%60};

		return toDurationToTime;
	}


	this.init = function(){
		console.log("JAM- Musicbrainz Host: " + that.host + ", Cache Size: " + that.cacheSize + ", Cache Method: " + that.cache.adapter);
	}

	that.init();

}