//imutv.js

//Setup dependancies into variables:
Marmalade = new Marmalade;
Jam = new jam;
Rohart = new rohart;
Martwork = new martwork;
Lartwork = new lartwork;
var geocoder, map,bounds;

//Capture Ready Event
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
document.addEventListener("deviceready", ready, false);
mobile();
} else {
ready(); //this is the browser
}

//Adapts the UI for a mobile
function mobile(){
	$(".window-controls").remove();
}

//Resize Event
function resize(){
	var toolbarheight = $("#toolbar").outerHeight();
	var bottombarheight = $("#bottombar").outerHeight();
	$("#main, #main-content").height($(window).height()-toolbarheight-bottombarheight);
	$("#main-content, #bottombar-right").width($(window).width()-218).css("left", "218px");
}

function switchActivePane(sPaneName){

	$(".content[data-pane]").addClass("not-active").removeClass("active-pane");
	$(".content[data-pane=" + sPaneName + "]").removeClass("not-active").addClass("active-pane")

}

//GetArtistInfo:
//Send MBID:
function GetArtistInfo(mbid, callback){
	//http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=Cher&api_key=053a42854b88f76d6a25b3e935efb1f2
	console.log("Getting artist info");
	$.get("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=053a42854b88f76d6a25b3e935efb1f2&mbid=" + mbid, function(data) {

		var artist = {}

		artist.BioSummary = $("bio summary", data).text();
		artist.Name = $("artist name:first", data).text();

		callback(artist);

	});
}

//PlayBack Functions:
function TimeUpdate(){
	var videoContainer = document.getElementById("marm");
	var percent = (videoContainer.currentTime / (videoContainer.duration/100))
	$("#bottombar-tracker-progess").css("width", percent + "%");
}

var videoContainer = document.getElementById("marm");

//Ready Event
function ready(){

	//Changing X-Requested-With to Nothing, now undetectable, we look like Safari 5.
	(function(){
	$.ajaxSettings.beforeSend=function(xhr){
	xhr.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
	};
	})(jQuery);

	$(window).resize(function(){
		resize();
	})

	$("#toolbar-logo").click(function(){
		Jam.resetCache();
		window.location.reload();
	});

	$(".window-maximize").click(function(){
		videoContainer.webkitEnterFullscreen();
	})

	$("#playbutton").click(function(){
		
		console.log(videoContainer.paused);
		if(videoContainer.paused){
			Marmalade.Play();
		}
		else{
			Marmalade.Pause();
		}
		return false;
	})

	$("#toolbar-settings").click(function(){
		if($("#currentPlaying-art").hasClass("flip")){
			$("#currentPlaying-Info").fadeOut(100).delay(1000).fadeIn(100);
			$("#currentPlaying-art").removeClass("flip");
		}
		else{
			$("#currentPlaying-Info").fadeOut(100).delay(1000).fadeIn(100);
			$("#currentPlaying-art").addClass("flip");
		}
		
	});

	$("#toolbar-searchinput").keydown(function(event){
		if(event.keyCode == 13){
			
			var searchtype = $.trim($("#toolbar-search-type").text());
			var searchterm = $("#toolbar-searchinput").val();

			if(searchterm.length > 0){
				window.location.hash = "search:"+searchtype+"["+searchterm+"]";
			}

		}
	})

	$("#main-content").on("mouseenter", ".albumart-interface", function(event){
		
		$(".albumart-overlay", this).addClass("visible");

	}).on("mouseleave", ".albumart-interface", function(event){
		
		$(".albumart-overlay", this).removeClass("visible");

	});


	window.onhashchange = HashEvent;

	//http://www.musicbrainz.org/ws/2/recording?query=%22Time%20Machine%22%20AND%20artist:%20%22Viva%20Brother%22

	resize();
	//Marmalade.PlaySong({"artist": "Man Like Me", "name": "Squeeze"})
	console.log("iMuTV.2 Ready");

	HashEvent();

}



//URL SCHEMES:
/*

/PLAY/{TRACKNAME}/{ARTIST}
/PLAYLIST/{ID}

/LIBRARY/

/ALBUM/{MBID}
/ARTIST/{MBID}

/SEARCH/ARTIST/{TERM}
/SEARCH/ALBUM/{TERM}
/SEARCH/TRACK/{TERM}
/SEARCH/GENERAL/{TERM}

*/

//ENTITIES:
//-playlist
//-album
//-track
//-artist
//-user

/*
	Each entity should have a MVC structure, with the model being data from Jam/Rohart/Martwork etc.
	There should also be outside entities that manage the application itself:

	imutv:
		view:
			createPlaylists()-renders a users playlists
		controller:

	--------------------------------------------------------------------------------
	playlist:
		view:
			createList()-renders a list element of a playlist
			createGrid()-renders a grid element of a playlist
			createNewPlaylist-renders a 'create playlist form'
			searchPlaylist()-searches for and renders a grid of playlists
		controller:
			createPlaylist()-creates a playlist and stores it in the database
			likePlaylist()-likes a playlist
			playPlaylist()-Starts playing a playlist
			addPlaylist()-Adds a playlist to the users library
			removePlaylist()-Removes an album from a users library
	--------------------------------------------------------------------------------
	album:
		view:
			createGrid()-renders a grid element of a album
			createList()-renders list style album
			searchAlbum()-searches for and renders a grid of albums
		controller:
			playAlbum()-Plays an album
			addAlbumToQueue()-Queues an albums tracks
			addAlbumToLibrary()-Adds an album to the users library
			removeAlbumFromLibrary()-Removes an album from the users library
			removeAlbumFromPlaylist()-Removes an album from a playlist
	--------------------------------------------------------------------------------
	track:
		view:
			createList()-renders list style track
			searchTrack()-searches for a renders a list of tracks
		controller:
			playTrack()-Plays a track
			addTrackToQueue()-Queues a track
			addTrackToLibrary()-Adds a track to the users library
			removeTrackFromLibrary()-Removes a track from the users library
			removeTrackFromPlaylist()-Removes a track from a playlist
	--------------------------------------------------------------------------------
	artist:
		view:
			createOverview()-renders an artists overview page (albums, top tracks)
			createGrid()-renders a grid element of an artist
			createList()-renders list of artists albums/tracks
			searchArtist()-searches for and renders a grid of artists
		controller:
			playArtist()-Plays an artists tracks, starting with first album
			addArtistToQueue()-Queues all an artists songs
			addArtistToLibrary()-Adds all an artists releases to the users library
	--------------------------------------------------------------------------------
*/

function Template(entity, type){

	var classname = "";
	var typename = "";

	switch(entity){

		case "artist":
			classname = "artist";
		break;
		case "album":
			classname = "album";
		break;
		case "grouped-album":
			classname = "grouped-album";

	}

	switch(type){

		case "grid":
			type = $("#grid_templates");
		break;
		case "list":
			type = $("#list_templates");
		break;

	}

	classname = "." + classname;
	var template = $(classname, type);
	return template;
}

function Title(icon, title){
	
	var rTitle = $('<h1 class="mainTitle"><i class="icon-music"></i> <span>iMuTV</span></h1>');

	if(icon != ""){
		$("i", rTitle).removeClass("icon-music").addClass(icon);
	}

	if(title != ""){
		$("span", rTitle).text(title);
	}

	return rTitle;
}

function HashEvent(){

	 var hash = window.location.hash;
	 
	 var hashactionre = hash.replace(/:(.*)/g, "");
	 hashactionre = hashactionre.replace("#", "");

	 var hashvariable = hash.replace(/#(.*):/g, "");
	 console.log("Action:" + hashactionre + ", Variable:" + hashvariable);

	 //Now we switch to hash handlers:
	 switch(hashactionre){

	 	case "artist":

	 		ArtistPage(hashvariable);

	 	break;

	 	case "search":

	 		//search:artist[kasabian]
	 		//need to split hashvariable again:
	 		var searchtype = hashvariable.replace(/\[(.*)\]/g, "");
	 		
	 		var searchterm = hashvariable.split("[");
	 		searchterm = searchterm[1].replace("]", "");

	 		Search(searchterm, searchtype);

	 	break;

	 	case "track":

	 	break;

	 	case "album":

	 		AlbumPage(hashvariable);

	 	break;

	 	case "playlist":

	 	break;

	 }

}


function BigBackground(url){
	var bigback = $("<div class=\"big-background-container\"><img src=\"http://static.bbci.co.uk/music/images/artists/542x305/69b39eab-6577-46a4-a9f5-817839092033.jpg\" class=\"big-background\" width=\"100%\" /><div class=\"big-background-fade\"></div></div>");
	$("img", bigback).attr("src", url);
	return bigback;
}

function AlbumPage(mbid){

	Jam.albumLookup(mbid, function(aAlbum){

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

		var content = $("<div class='content'></div>");
		var listview = $("<div class='list'></div>");

		var listviewgroup = Template("grouped-album", "list");
		listviewgroup = listviewgroup.clone();

		//First fill out the album data:
		var listviewalbum = $(".album", listviewgroup);

		var oImage = $(".albumart", listviewalbum);
		Lartwork.GetArtwork(aAlbum.ID, oImage);


		$(".album-title", listviewalbum).text(aAlbum.Title).attr("href", "#album:" + aAlbum.ID);
		$(".album-trackcount", listviewalbum).text(aAlbum.ReleaseDate);
		$(".album-artist", listviewalbum).text(aAlbum.Artist);
		$(".album-artist", listviewalbum).attr("href", "#artist:" + aAlbum.ArtistID);

		//Now loop through tracks:
		var listtracktable = $(".group-tracks-tracks", listviewgroup);
		var listtracktemplate = $(".track", listviewgroup);
		//listtracktemplate.clone();

		$(".track", listtracktable).remove();

		var nooftracks = aAlbum.Tracks.length;

		for(var i=0; i < nooftracks; i++){


			var listtracktemplatea = listtracktemplate.clone();

			$(".track-no span", listtracktemplatea).text(aAlbum.Tracks[i].No);

			$(".track-no a", listtracktemplatea).attr("href", "#").attr("data-tartist", aAlbum.ArtistName).attr("data-ttitle", aAlbum.Tracks[i].Title).click(function(){
				Marmalade.PlaySong({"artist": $(this).attr("data-tartist"), "name": $(this).attr("data-ttitle")});
			});

			$(".track-title", listtracktemplatea).text(aAlbum.Tracks[i].Title);
			$(".track-artist", listtracktemplatea).text(aAlbum.ArtistName);

			var TrackSeconds = aAlbum.Tracks[i].Length/1000;
			var minVar = Math.floor(TrackSeconds/60);
			var secVar = TrackSeconds % 60;
			$(".track-duration", listtracktemplatea).text(minVar + ":" + secVar);

			/*
			<td class="track-no"><a class="track-link" href="#s"></a>12</td>
			<td class="track-title">Sometimes things get whatever</td>
			<td class="track-artist">Deadmau5</td>
			<td class="track-duration">3:12</td>
			<td class="track-options"><a href="#"><i class="icon-share"></i></a><a href="#"><i class="icon-ok"></i></a><a href="#"><i class="icon-plus-sign"></i></a></td>
			*/


			$(listtracktable).append(listtracktemplatea);

		}

		$(listview).append(listviewgroup);
		$(content).append(Title("icon-music", aAlbum.Title)).append(listview);
		$("#main-content").html("").append(content);	

	});

}

function ArtistPage(mbid){

	Jam.artistReleases(mbid, function(aArtist){

		var noofreleases = aArtist.length;

		//First we are going to loop through and remove live entries:
		var naArtist = new Array();
		for(var i=0; i<aArtist.length; i++){

			if(aArtist[i].Type != "Live"){
				naArtist.push(aArtist[i]);
			}
		}

		aArtist = naArtist;
		naArtist = null;

		noofreleases = aArtist.length

		aArtist.sort(function(a,b){

			if(a.Type < b.Type)
			return -1 
			if (a.Type > b.Type)
			return 1
			return 0 //default return value (no sorting)

		})

		var aGroupedReleases = {}
		//Check the type, check if this already exists, if not make it a new array, if it does then just push
		for(var i=0; i<noofreleases; i++){

			var sType = aArtist[i].Type;

			if(aGroupedReleases[sType] == undefined){
				aGroupedReleases[sType] = new Array();
			}

			aGroupedReleases[sType].push(aArtist[i]);

		}

		for (var key in aGroupedReleases) {
			
			aGroupedReleases[key].sort(function(a, b){
				var aHigher = 0;

				if(Date(a.ReleaseDate) > Date(b.ReleaseDate)){
				aHigher = 1;
				}
				else if(Date(a.ReleaseDate) < Date(b.ReleaseDate)){
				aHigher = -1;
				}
				else{
				aHigher = 0;
				}

				return aHigher;
			});

			aGroupedReleases[key].reverse();

		}

		// console.log("sausage");
		// for(var i=0; i < noofreleases; i++){
		// 	console.log(aArtist[i].ReleaseDate);
		// 	if(jQuery.inArray(aArtist[i].Title, alreadyOnPage) == -1){
		// 		console.log("egg")
		// 		var aTemplate = Template("album", "grid");
		// 		aTemplate = aTemplate.clone();

		// 		$(".album-title", aTemplate).text(aArtist[i].Title);
		// 		$(".album-trackcount", aTemplate).text(aArtist[i].TrackCount + " tracks");
		// 		$(".album-artist", aTemplate).text(aArtist[i].Artist);

		// 		var oImage = $(".albumart", aTemplate);

		// 		Lartwork.GetArtwork(aArtist[i].ID, oImage);

		// 		alreadyOnPage.push(aArtist[i].Title);

		// 		$(releasegrid).append(aTemplate);

		// 	}

		// }


		var content = $("<div class='content clearfix'></div>");

		$(content).append(Title("icon-group", "Loading...")).append(releasegrid);

		for (var key in aGroupedReleases) {

			if(key != "undefined"){

				var cuContent = $("<div class='group cleafix'></div>");
				$(cuContent).append("<h2>" + key + "s</h2>");
				var releasegrid = $("<div class='grid clearfix'></div>");

				var currentGroup = aGroupedReleases[key];

				var alreadyOnPage = new Array();

				for(var i=0; i < currentGroup.length; i++){

					console.log("Alpha")
					var cRelease = currentGroup[i];

						if(jQuery.inArray(cRelease.Title.toLowerCase(), alreadyOnPage) == -1){
						console.log(cRelease);

						var aTemplate = Template("album", "grid");
						aTemplate = aTemplate.clone();
						$(".album-title", aTemplate).text(cRelease.Title).attr("href", "#album:" + cRelease.ID);
						$(".album-trackcount", aTemplate).text(cRelease.TrackCount + " tracks");
						$(".album-artist", aTemplate).text(cRelease.Artist);
						var oImage = $(".albumart", aTemplate);
						Lartwork.GetArtwork(cRelease.ID, oImage);

						$(releasegrid).append(aTemplate);
						alreadyOnPage.push(cRelease.Title.toLowerCase());
					}
				}

				$(cuContent).append(releasegrid)

				$(content).append(cuContent);

			}
			
		}

		GetArtistInfo(mbid, function(info){
			$(".mainTitle span").text(info.Name);
			$(".mainTitle").after("<p>" + info.BioSummary + "</p>");
		})

		console.log("beans")

		console.log("toast")
		$("#main-content").html("").append(BigBackground(Martwork.fetchImage(mbid))).append(content);
		
	})

}


//Search:
//Searches for a term and renders it:
function Search(term, type, callback){

	console.log(term + " : " + type);

	switch(type){

		case "artist":
			console.log("artist search")
			Jam.artistSearch(term, function(aSearch){
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

				console.log(aSearch)

				//First we need to check how many results were returned:
				if(!(aSearch.length > 0)){
					//Show some sort of error, 0 results
					console.log("No results");
					$("#main-content").html("").append(Title("icon-search", "Search for " + term)).append("<p>Returned no results, try a different search term.</p>");
				}
				else{
					//Display artists as a grid:
					var grid = $("<div class='grid clearfix'></div>");
					var iResults = aSearch.length;

					var markers = new Array();

					for( var i = 0; i < iResults; i++ ){
							
						var aTemplate = Template("artist","grid");
						aTemplate = aTemplate.clone();
						
						$(".artist-mbid-link", aTemplate).attr("href", "#artist:" + aSearch[i].ID)
						$(".artist-image", aTemplate).attr("src", Martwork.fetchImage(aSearch[i].ID));
						$(".artist-name", aTemplate).text(aSearch[i].Name);

						var artistcountry = "";
						if(aSearch[i].Country != ""){
							artistcountry = aSearch[i].Country;
						}
						if(aSearch[i].Type != ""){
							if(artistcountry == ""){
								artistcountry = aSearch[i].Type;
							}
							else{
								artistcountry = artistcountry + ", " + aSearch[i].Type;
							}
						}

						$(".artist-country", aTemplate).text(artistcountry);

						
						$(".artist-disambiguation", aTemplate).text(aSearch[i].Disambiguation);
						$(grid).append(aTemplate);

					}

					var content = $("<div class='content'></div>");

					$(content).append(Title("icon-search", "Search for " + term)).append("<div id='map_canvas' style='height: 300px; width:500px; float:right;'></div>").append(grid);
					$("#main-content").html("").append(content);
					var latlng = new google.maps.LatLng(-34.397, 150.644);
					var mapOptions = {
					zoom: 8,
					center: latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP
					}
					map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
					bounds = new google.maps.LatLngBounds();
					for(var i=0; i< iResults; i++){
						var artistcountry
						if(aSearch[i].Country != ""){
							artistcountry = aSearch[i].Country;
						}
						else{
							artistcountry = "";
						}
						console.log(artistcountry);
						
						geocoder = new google.maps.Geocoder();
						geocoder.geocode( { 'address': 'Country: ' + artistcountry}, function(results, status) {

							if (status == google.maps.GeocoderStatus.OK) {
								console.log("marker")
								markers.push(new google.maps.Marker({ map: map, position: results[0].geometry.location }));
								bounds.extend(results[0].geometry.location);
								map.fitBounds(bounds); 
							}

						});
					
					}
					

				}

			});
		break;

		case "track":
			Jam.recordingSearch(term, function(aSearch){
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

				//First we need to check how many results were returned:
				if(!(aSearch.length > 0)){
					//Show some sort of error, 0 results
				}
				else{
					//Display artists as a grid:

				}

			});
		break;

		case "album":

		break;

		case "all":

		break;

	}

}



