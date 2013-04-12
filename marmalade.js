this.inbtwn = function(input, startcut, finishcut) //Works?
{
	output = "";
try{
	output = "";
	arr1=new Array();
	arr2=new Array();
	arr1 = input.split(startcut);
	arr2 = arr2 = arr1[1].split(finishcut);
	output = arr2[0];
}
catch(err){}
	return output;
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/string/soundex [rev. #1]
String.prototype.soundex = function(p){
    var i, j, l, r, p = isNaN(p) ? 4 : p > 10 ? 10 : p < 4 ? 4 : p,
    m = {BFPV: 1, CGJKQSXZ: 2, DT: 3, L: 4, MN: 5, R: 6},
    r = (s = this.toUpperCase().replace(/[^A-Z]/g, "").split("")).splice(0, 1);
    for(i = -1, l = s.length; ++i < l;)
        for(j in m)
            if(j.indexOf(s[i]) + 1 && r[r.length-1] != m[j] && r.push(m[j]))
                break;
    return r.length > p && (r.length = p), r.join("") + (new Array(p - r.length + 1)).join("0");
};

window.hellosusic = function(){
	console.log("hello");
}

function dispatchMouseEvent(target, var_args) {
  var e = document.createEvent("MouseEvents");
  // If you need clientX, clientY, etc., you can call
  // initMouseEvent instead of initEvent
  e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
  target.dispatchEvent(e);
};

function cKeyword(ckeyword,cvalue){
	this.keyword = ckeyword;
	this.kvalue = cvalue;
}

function Marmalade(){
	
	var preferMusicVideos = true;

	jQTubeUtil.init({
	key: "AI39si4GKmO-zo7RNzyEIpXgx6kCl1zD4xjyCNQEZACnLL4VUbJH2g6c9jet01OlbpVQFSF4N_NDW0l80UUrwxy-vH0T1KT_JA",
	orderby: "relevance",  // Relevancy usually gives more accurate results for music videos
	time: "all_time",   // Put as all_time, songs from any year, possibly..
	maxResults: 10   // *optional -- defined as 10 results by default
	});
	
	console.log("Marmalade Loaded, spread me all over yourself.");

	this.AudioLink = document.getElementById("marm");
	
	//this.AudioLink.addEventListener('progress',susic.Progress,false);
	this.AudioLink.addEventListener('timeupdate',TimeUpdate,false);
	
	//this.AudioLink.addEventListener('pause',susic.PlayShow,false);
	//this.AudioLink.addEventListener('play',susic.PauseShow,false);
	
	//this.AudioLink.addEventListener('ended',Marmalade.NextSong,false);
	
	this.inbtwn = function(input, startcut, finishcut) //Works?
	{
		output = "";
	try{
		output = "";
		arr1=new Array();
		arr2=new Array();
		arr1 = input.split(startcut);
		arr2 = arr2 = arr1[1].split(finishcut);
		output = arr2[0];
		
	}
	catch(err){}
		return output;
	}
	
	this.PlaySong = function(song){
		
		//susic.LoadingSong();
		Marmalade.FindVideoURL(song.artist,song.name);
		//susic.SongShowLoad(susic.PlaylistPosition);
		
		//console.log("ShowSongLoad with " + susic.PlaylistPosition);
	}

	this.MusicVideos = function(b){
		if(b!=undefined){
			Marmalade.preferMusicVideos = b;
		}
		return Marmalade.preferMusicVideos;
	}
	
	this.Play = function(){
		Marmalade.AudioLink.play();
	}
	this.Pause = function(){
		Marmalade.AudioLink.pause();
	}
	//Pass in a Playlist index, skip straight forward to this:
	this.IndexSong = function(index){
		console.log("Song Playlist Index: " + index);
		susic.PlaylistPosition = index;
		if(susic.Playlist[susic.PlaylistPosition] != null){
			Marmalade.PlaySong(susic.Playlist[susic.PlaylistPosition]);
			susic.SongShowLoad(index);
		}
	}
	this.NextSong = function(){
		susic.LoadingSong();
		susic.PlaylistPosition++;
		if(susic.Playlist[susic.PlaylistPosition] != null){
			Marmalade.PlaySong(susic.Playlist[susic.PlaylistPosition]);
		}
	}
	this.PreviousSong = function(){
		susic.PlaylistPosition--;
		if(susic.Playlist[susic.PlaylistPosition] != null){
			Marmalade.PlaySong(susic.Playlist[susic.PlaylistPosition]);
		}
	}
	this.KeywordList = function(){
		
		var keywordlist = new Array();
		
		if(Marmalade.MusicVideos()){

			//Tuned to find music videos:
			keywordlist.push(new cKeyword("official video",20));
			keywordlist.push(new cKeyword("vevo",25));
			keywordlist.push(new cKeyword("video",6));
			keywordlist.push(new cKeyword("itunes",14));
			keywordlist.push(new cKeyword("beatport",8));
			keywordlist.push(new cKeyword("itunes.apple",9));
			keywordlist.push(new cKeyword("hd",7));
			keywordlist.push(new cKeyword("twitter",7));
			keywordlist.push(new cKeyword("buy tickets",7));
			keywordlist.push(new cKeyword("[official music video]", 20))
			keywordlist.push(new cKeyword("directed by", 10))
			keywordlist.push(new cKeyword("recordings ltd", 5))
			keywordlist.push(new cKeyword("off their", -8))
			keywordlist.push(new cKeyword("available now", 8))	
			keywordlist.push(new cKeyword("emi records ltd", 8))
			keywordlist.push(new cKeyword("(official video)"), 35);

		}
		else{
			keywordlist.push(new cKeyword("lyrics",10));
			keywordlist.push(new cKeyword("high quality",4));
			keywordlist.push(new cKeyword("1.",3));
			keywordlist.push(new cKeyword("2.",3));
			keywordlist.push(new cKeyword("3.",3));
			keywordlist.push(new cKeyword("4.",3));
			keywordlist.push(new cKeyword("5.",3));
			keywordlist.push(new cKeyword("director",-10));
			keywordlist.push(new cKeyword("dir:",-10));
			keywordlist.push(new cKeyword("dir",-3));
			keywordlist.push(new cKeyword("6.",3));
			keywordlist.push(new cKeyword("7.",3));
			keywordlist.push(new cKeyword("8.",3));
			keywordlist.push(new cKeyword("9.",3));
			keywordlist.push(new cKeyword("10.",3));
			keywordlist.push(new cKeyword("11.",3));
			keywordlist.push(new cKeyword("12.",3));
			keywordlist.push(new cKeyword("01",3));
			keywordlist.push(new cKeyword("02",3));
			keywordlist.push(new cKeyword("03",3));
			keywordlist.push(new cKeyword("01",3));
			keywordlist.push(new cKeyword("05",3));
			keywordlist.push(new cKeyword("06",3));
			keywordlist.push(new cKeyword("07",3));
			keywordlist.push(new cKeyword("08",3));
			keywordlist.push(new cKeyword("09",3));
			keywordlist.push(new cKeyword("10",3));
			keywordlist.push(new cKeyword("11",3));
			keywordlist.push(new cKeyword("12",3));
			keywordlist.push(new cKeyword("track",7));
			keywordlist.push(new cKeyword("tracklist",2));
			keywordlist.push(new cKeyword("album",2));
			keywordlist.push(new cKeyword("from the",2));
			keywordlist.push(new cKeyword("from",2));
			keywordlist.push(new cKeyword("song",4));
			keywordlist.push(new cKeyword("duration",3));
			keywordlist.push(new cKeyword("time",3));
			keywordlist.push(new cKeyword("music",3));
			keywordlist.push(new cKeyword("entertainment purposes only",8));
			keywordlist.push(new cKeyword("lyrics:",6));
			keywordlist.push(new cKeyword("radio edit",8));
			keywordlist.push(new cKeyword("radio cut",6));
			keywordlist.push(new cKeyword("no copyright intended",9));
			keywordlist.push(new cKeyword("edit"));
		}

		keywordlist.push(new cKeyword("available now", 3))
		keywordlist.push(new cKeyword("emi records ltd", 3))
		keywordlist.push(new cKeyword("emi", 6))
		keywordlist.push(new cKeyword("no copyright intended",3));
		keywordlist.push(new cKeyword("lyrics",4));
		keywordlist.push(new cKeyword("high quality",7));
		keywordlist.push(new cKeyword("official",3));
		keywordlist.push(new cKeyword("vevo",5));
		keywordlist.push(new cKeyword("album",3));
		keywordlist.push(new cKeyword("video",3));
		keywordlist.push(new cKeyword("download",3));
		keywordlist.push(new cKeyword("label",6));
		keywordlist.push(new cKeyword("published",4));
		keywordlist.push(new cKeyword("itunes",4));
		keywordlist.push(new cKeyword("1.",1));
		keywordlist.push(new cKeyword("2.",1));
		keywordlist.push(new cKeyword("3.",1));
		keywordlist.push(new cKeyword("4.",1));
		keywordlist.push(new cKeyword("5.",1));
		keywordlist.push(new cKeyword("6.",1));
		keywordlist.push(new cKeyword("7.",1));
		keywordlist.push(new cKeyword("8.",1));
		keywordlist.push(new cKeyword("9.",1));
		keywordlist.push(new cKeyword("10.",1));
		keywordlist.push(new cKeyword("11.",1));
		keywordlist.push(new cKeyword("12.",1));
		keywordlist.push(new cKeyword("01",1));
		keywordlist.push(new cKeyword("02",1));
		keywordlist.push(new cKeyword("03",1));
		keywordlist.push(new cKeyword("01",1));
		keywordlist.push(new cKeyword("05",1));
		keywordlist.push(new cKeyword("06",1));
		keywordlist.push(new cKeyword("07",1));
		keywordlist.push(new cKeyword("08",1));
		keywordlist.push(new cKeyword("09",1));
		keywordlist.push(new cKeyword("10",1));
		keywordlist.push(new cKeyword("11",1));
		keywordlist.push(new cKeyword("12",1));
		keywordlist.push(new cKeyword("track",3));
		keywordlist.push(new cKeyword("tracklist",2));
		keywordlist.push(new cKeyword("song",4));
		keywordlist.push(new cKeyword("duration",3));
		keywordlist.push(new cKeyword("time",3));
		keywordlist.push(new cKeyword("music",3));
		keywordlist.push(new cKeyword("unofficial",1));
		keywordlist.push(new cKeyword("live recording",-10));
		keywordlist.push(new cKeyword("@",-5));
		keywordlist.push(new cKeyword("live",-15));
		keywordlist.push(new cKeyword("bootleg",-10));
		keywordlist.push(new cKeyword("genre",4));
		keywordlist.push(new cKeyword("year",4));
		keywordlist.push(new cKeyword("date",4));
		keywordlist.push(new cKeyword("entertainment purposes only",6));
		keywordlist.push(new cKeyword("lyrics:",4));
		keywordlist.push(new cKeyword("radio edit",6));
		keywordlist.push(new cKeyword("radio cut",6));
		keywordlist.push(new cKeyword("radio",3));
		keywordlist.push(new cKeyword("hd",5));
		keywordlist.push(new cKeyword("trailer",-10));
		keywordlist.push(new cKeyword("teaser",-10));
		keywordlist.push(new cKeyword("cover",-5));
		keywordlist.push(new cKeyword("remix",-7));
		keywordlist.push(new cKeyword("promo",-10));
		
		return keywordlist;
		
	}
	
	//FindVideoURL : Searches YouTube for a suitable video and fetches it's ID, sends this to FeedVideo
	this.FindVideoURL = function(artist,track) {
		console.log("FindVideoURL: Called with Artist = " + artist + ", Track = " + track + "...");
		
		//Going to implement a first search, look for the track on the YouTube Artist Page:
		
		var findsafeartist = artist;
		findsafeartist.replace(" ", "_");
		
		$("#susic_artist_portal").attr("data-artist",findsafeartist).attr("data-track",track);
		
		//Artist Pages have changed, need to re-do this.
		// $.get('http://www.youtube.com/artist/' + artist.replace(" ", "_"), function(data) {
		// 	Marmalade.FindViaYouTubeArtist(data);
		// });
		Marmalade.FindViaYouTubeSearch();
		
		//var portal = document.getElementById("susic_artist_portal");
		//dispatchMouseEvent(portal,'click', true, true);
			
	}
	
	//<<<UPDATE
	//
	//FIND VIA YOUTUBE ARTIST NEEDS TO BE UPDATED FOR NEW ARTIST PAGES:
	//
	//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE
	//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE
	//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE
	//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE
	//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE//<<<UPDATE
	//
	//FindviaYouTubeArtist : Goes to the YouTube page for the artist and looks for the video, if not possible it goes to FindViaYouTubeSearch
	this.FindViaYouTubeArtist = function(source){
		
		console.log("FindViaYouTubeArtist:HELLO");
		var source = unescape(source);
		var oSource = $(source);

		var albumrows = $(".album-row", oSource);
		var albumrowcount = $(albumrows).length;
		var youMatch = 0;
		var yURL = "";
		
		var artist = $("#susic_artist_portal").attr("data-artist");
		
		
		var track = $("#susic_artist_portal").attr("data-track");
		
		//Get the soundex of the track, we can use this to check for inconsistent track names:
		var trackSoundEx = track.soundex();
		
		$(albumrows).each(function(index) {
			
			var aTrackName = $(".album-row-content .album-track-name", this).text();
			
			console.log("ORIGINAL: " + trackSoundEx + "- " + track + ", COMPARE: " + aTrackName.soundex() + "- " + aTrackName);
			
			if(aTrackName == track){
				youMatch++;
				console.log("<><><><> DEAD MATCH FOUND <><><><>")
			}
			else if(aTrackName.soundex() === trackSoundEx){
				youMatch++;
				console.log("<><><><> SOUNDEX MATCH FOUND <><><><>")
			}
			else{
				console.log("NO MATCH");
			}

			console.log(youMatch);
			
			if(youMatch > 0){
				yURL = $("a", this).attr("href");
				yURL = inbtwn(yURL, "/watch?v=", "&feature=artist");
				console.log(yURL);
				return false;
			}
			
		});
		
		if(youMatch == 0){
			console.log("No match so find via search:")
			Marmalade.FindViaYouTubeSearch();
		}
		else{
			console.log("Match found");
			Marmalade.FeedVideoURL("http://www.youtube.com/watch?v=" + yURL + "&");
		}
		
	}
	
	//FindviaYouTubeSearch : Searches YouTube for a suitable video, fetches the ID then sends to FeedVideo
	this.FindViaYouTubeSearch = function(){
		
		var artist = $("#susic_artist_portal").attr("data-artist");
		var track = $("#susic_artist_portal").attr("data-track");
		
		var searchQuery = artist + track;
		
		jQTubeUtil.search(searchQuery, function(response){
			
			if(response.totalResults === 0){ //If ABSOLUTELY 0 results..
				console.log("FindVideoURL: No Results");
				susic.SongErrorLoad(susic.PlaylistPosition);
			}
			else{

				//Join together the description and tags, then score them:
				
				var searchRank = new Array();
				var videos = new Array();
				var videos = response.videos;
				
				var countVideos = videos.length;
				console.log("VID COUNT:" + countVideos);
				
				for (i=0;i<=countVideos-1;i++){
					
					var cVideo = videos[i];
					var currentPoints = 0;
					console.log(cVideo);
					var tags = (cVideo["keywords"] + " " + cVideo["description"] + " " + cVideo["title"] + " " + cVideo["author"]).toLowerCase();
					
					//Array of keywords and their corresponding point value, then loop through them:
					var keywords = Marmalade.KeywordList();
					var countkeywords = keywords.length;
					
					console.log(tags)

					if(!Marmalade.MusicVideos()){
						if(cVideo["title"].toLowerCase() == artist.toLowerCase() + " - " + track.toLowerCase()){ currentPoints = currentPoints + 20; console.log("EXACT MATCH") }
					}

					if(cVideo["author"].toLowerCase().indexOf(artist.toLowerCase()) != -1){ currentPoints = currentPoints + 20; console.log("ARTIST MATCH") }

					if(Marmalade.MusicVideos()){
						if(cVideo["author"].toLowerCase().indexOf("vevo") != -1){ currentPoints = currentPoints + 30; console.log("ARTIST MATCH") }
					}
					else{
						if(cVideo["author"].toLowerCase().indexOf("vevo") != -1){ currentPoints = currentPoints + 10; console.log("ARTIST MATCH") }
					}
					
					if(tags.indexOf(track.toLowerCase()) != -1){ currentPoints = currentPoints + 30; console.log("Found Track Name") }
					if(tags.indexOf(artist.toLowerCase()) != -1){ currentPoints = currentPoints + 3; console.log("Found Artist Name") }

					for (d=0;d<=countkeywords-1;d++){
						if((tags.indexOf(keywords[d].keyword)) != -1){
							currentPoints = currentPoints + keywords[d].kvalue;
						}
					}
					
					//Now we're going to get the original ranking from YouTube and sway the results
					//with this aswell, because usually YouTube are right:

					var multiFactor = 20 / (i+1);

					currentPoints = currentPoints + multiFactor;
					
					cVideo["kPoints"] = currentPoints;
					searchRank.push(cVideo);
					
				}
				
				searchRank.sort(function(a, b){
				 //console.log(b.playcount);
				 //console.log(a.playcount);
				 return b.kPoints-a.kPoints;
				})
				
				console.log("Search Rank Object:");
				console.log(searchRank);
				
				console.log("Song has scored " + searchRank[0].kPoints + " points in ranking process.");

				//26 June 2012: YouTube have started transitioning to 2 different page code layouts:
				//get_video_info introduced to cope with just 1 code layout
				Marmalade.FeedVideoURL("http://www.youtube.com/get_video_info?video_id=" + searchRank[0]['videoId'] + "&asv=3&el=detailpage&hl=en_US")
			}
			
		});
	}
	
	//FeedVideoURL : Takes a URL to a YouTube video, calls the Chrome Plugin to fetch the Data, sends this to InjectVideo
	this.FeedVideoURL = function(url) {
		//console.log("FeedVideoURL: Called with URL = " + url);
		//$("#susic_url_portal").attr("data-url",url);
		//var portal = document.getElementById("susic_url_portal");
		//dispatchMouseEvent(portal,'click', true, true);

		$.get(url, function(data) {
			Marmalade.FMTDecompile(data);
		});

	}
	
	//FMTDecompile : Takes a YouTube pages source and extracts the highest quality video url from the fmt_map
	this.FMTDecompile = function(source){
		console.log("FMTDecompile: Called, I HAVE SOURCE! Here have it..");
		console.log(source.length);
		var PageSource = unescape(source);
		console.log("FMTDecompile: Now, lets split it up...");
		//alert(PageSource);
		
		var fmt_url_map = "";
		fmt_url_map = unescape((inbtwn(PageSource, "fmt_stream_map=", "u0026amp;")));

		console.log(fmt_url_map);

		//console.log(fmt_url_map);
		
		fmt_arr = new Array();
		fmt_arr = fmt_url_map.split("url=");
		
		//console.log(fmt_arr);
		
		//Init variables for different types of video:
		var videoMPLink, videoMPHDLink;
		//And for the final video link:
		var videoLink;
		
		for ( var i=0, len=fmt_arr.length; i<len; ++i ){
			
			var parts = new Array();
			parts = fmt_arr[i].split("&qual");
		  	parts[1] = unescape((parts[1]));
			for ( var i=0, len=fmt_arr.length; i<len; ++i ){
				
				if(fmt_arr[i] != "")
		  		{
		  			//console.log(fmt_arr[i]);
		  			var currentDibble = fmt_arr[i];
					
					//console.log(unescape( (currentDibble) ));
					
		  			var itag = inbtwn(fmt_arr[i], "itag=", "&");
		  			itag = itag.replace(",", "")
					console.log("FMTDecompile: Found iTag " + itag);

					switch(itag)
					{
					case "13":
					break;
					case "18":
					videoMPLink = unescape( (currentDibble) );
					break;
					case "44":
					videoMPLink = unescape( (currentDibble) );
					case "43":
					//vp8
					break;
					case "45":
					//vp8
					break;
					case "22":
					//720p HD
					videoMPHDLink = unescape( (currentDibble) );
					break;
					}
				}
				
			}
		}
		//Now we can decide which video URL to use:
		//<><><><><>This needs to be expanded for VP8 etc...
		if(videoMPHDLink != null){
			//Use HD
			console.log("FMTDecompile: Using HD");
			console.log(videoMPHDLink);
			//videoLink = videoMPHDLink;
			videoLink = videoMPHDLink;
		}else{
			//Use SD
			console.log("FMTDecompile: Using SD");
			console.log(videoMPLink);
			videoLink = videoMPLink;
		}
		//<><><><><><><><<><><><><><>
		
		videoLink = videoLink.replace("sig", "signature");
		
		console.log("Video Link coming up...")
		console.log(videoLink);

		Marmalade.InjectVideo(videoLink);
		
	}
	
	//InjectVideo : Takes a Video URL and injects it into the video element
	this.InjectVideo = function(videourl) {
		console.log("InjectVideo: Called with videourl ="  + videourl);
		
		Marmalade.AudioLink.src = ""; //Clearing the current source
		Marmalade.AudioLink.load(); //Loading the Nothingness, seems to ease the video stuck bug.
		Marmalade.AudioLink.src = videourl;
		Marmalade.AudioLink.load();
		Marmalade.Pause();
		Marmalade.Play();
		//susic.SongRemoveLoad(susic.PlaylistPosition);
		//susic.SidePlaylistUpdate();
		//susic.CurrentPlayingSongUpdate();
		//susic.FinishedLoadingSong();
		
	}
	

}