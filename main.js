function susic(){
	
	console.log("Susic Main Loaded");
	this.init = function(){
		$(document).ready(function() {
			console.log("Susic attaching...");
			
			$("#main").delegate("tr.track", "click", function() {
			  	$("tr.track").removeClass("selected");
				$(this).addClass("selected");
				console.log("selected" + Math.random());
				
			}).delegate("tr.track", "dblclick", function() {
			  	$("tr.track").removeClass("current");
				$(this).addClass("current");
				console.log("selected" + Math.random());
				
				var SongPlaylistIndex = $(this).attr("data-playlistpos");
				Marmalade.IndexSong(SongPlaylistIndex);
				event.preventDefault();
			});
			
			$(document).ajaxStart(function(){ 
			  $('#global_loading').show(); 
			}).ajaxStop(function(){ 
			  $('#global_loading').hide();
			});
			
			$("#search input").focus(function(){
				var retain = $(this).val();
				$("#search input").val("");
				$(this).val(retain);
			});
			
			$("#loginf input").focus(function(){
				susic.ResetLoginError();
			}).keydown(function(){
				susic.ResetLoginError();
			});
			$("#signupf input").focus(function(){
				susic.ResetLoginError();
			}).keydown(function(){
				susic.ResetLoginError();
			});
			
			
			$("#home-controls-wrap div").mousedown(function(){
				
				$(this).addClass("down");
				
			}).mouseup(function(){
				
				$("#home-controls-wrap div").removeClass("down");
				
			});
			
			$("#home-controls-play").click(function(){
				susic.Play();
			});
			$("#home-controls-forward").mousedown(function(){
				susic.PlayForward();
			}).dblclick(function(){
				Marmalade.NextSong();
				return false;
			});
			$("#home-controls-back").mousedown(function(){
				susic.PlayBackward();
			}).dblclick(function(){
				Marmalade.PreviousSong();
				return false;
			});
			
			
			susic.LoadingSong();
			susic.SetTitle("Please wait, nearly there...");
			
			$.getJSON('user.php', {"fn": "update"}, function(udata, textStatus){
				if(udata.status != null){
					
					if(udata.status == "loggedin"){
						susic.SetTitle("Welcome back " + udata.username);
						susic.User = udata;
						susic.PlaceUserData();
						susic.ShowSidebarSection("home");
						$("#main-explain").css({"display": "block"});
						susic.install();
					}
					else{
						$("#login-username").focus();
						susic.SetTitle("Please login to continue.");
						$("#main-content").append('<h5>Welcome to Susic</h5><p>Susic is a free music player.</p><p>You can maintain a virtual library of songs and listen to them on any computer using just your web-browser*.</p><p class="alpha">*Chrome or Safari during Alpha. Other browsers + Mobile Devices may be supported in the future.</p><br /><p>You need to be logged in to use Susic, if you do not have an account <a href="#">click here</a></p>')
						$("#main-explain").css({"display": "block"});
						susic.install();
					}
					
				}
				else{
					susic.SetTitle("There seems to be a problem with Susic, sorry.");
				}
			});
			
		});
		
	}
	
	this.iTunesImport = function(){
		
		$.ajax({
			type: "GET",
			url: "Katy.xml",
			dataType: "xml",
			success: function(xml) {
				
				var iTunesXML = PlistParser.parse(xml);
				console.log(iTunesXML);
				//GetAlbum = function(album,artist,mbid){
					
				var iTunesTracks = iTunesXML.Tracks;
				var previousAlbum = "";
				
				for(var track in iTunesTracks){
					
					var cTrack = iTunesTracks[track];
					
					if(cTrack.Album != previousAlbum){
						console.log("Importing Album:" + cTrack.Album);
						susic.GetAlbum(cTrack.Album,cTrack.Artist);
					}
					else{
						console.log("...")
					}
					
					previousAlbum = cTrack.Album;
					
				}
				
				
			}
		});
		
	}
	
	this.install = function(){
		
		var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
		var is_safari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
		
		if(is_chrome){
			$("#install_susic").attr("href", "install/susicforchrome.crx");
		}
		else if(is_safari){
			$("#install_susic").attr("href", "install/susicforsafari.safariextz");
		}
		else{
			susic.SetTitle("")
			$("#main-explain-portal").html("<h5 class='notavailable'>Sorry!</h5><p class='notavailable'>Susic isn't available for your browser just yet. Susic works in Safari and Chrome.</p>")
		}
		
		
	}

	
	this.LoadingSong = function(){
		
		$("#home-currenttrack").stop().animate({"opacity": "0.5"},300);
		
	}
	this.FinishedLoadingSong = function(){
		
		$("#home-currenttrack").stop().animate({"opacity": "1.0"},150);
		
	}
	
	this.SongShowLoad = function(index){
		$('.track[data-playlistpos="' + index + '"]').addClass("loading");	
	}
	this.SongRemoveLoad = function(index){
		$('.track[data-playlistpos="' + index + '"]').removeClass("loading");
		$('.track').removeClass("loading");		
	}	
	this.SongErrorLoad = function(index){
		susic.FinishedLoadingSong();
		$('.track[data-playlistpos="' + index + '"]').removeClass("loading").addClass("errortrack");
		$('.track').removeClass("loading");
	}
	
	this.ExtractSong = function(trackdom){
		
		var song = new Array();
		var artist = $(trackdom).attr("data-artist");
		var name = $(trackdom).attr("data-track");
		song["artist"] = artist;
		song["name"] = name;
		return song;
		
	}
	
	this.disablesearch = function(){
		$("#search input").attr('disabled', 'disabled');
		$("#search-go").button('loading');
	}
	this.enablesearch = function(){
		$("#search input").removeAttr('disabled');
		$("#search-go").button('reset');
	}
	
	/* UPDATES the buffered bar */
	this.Progress = function(){
		
		var endBuf = Marmalade.AudioLink.buffered.end(0);
		var soFar = parseInt(((endBuf / Marmalade.AudioLink.duration) * 100));
		$(".time .bufferbar").css({"width": soFar + "%"});
		
	}

	/* UPDATES the play bar */
	this.TimeUpdate = function(){
		
		console.log("TIMEUPDATE");
		
		var soFar = parseInt(((Marmalade.AudioLink.currentTime / Marmalade.AudioLink.duration) * 100));
		$(".time .currentbar").css({"width": soFar + "%"});
		$(".time .currenttime").text(((Marmalade.AudioLink.currentTime / 60).toFixed(2)).replace(".",":"));
		
		if(isNaN(Marmalade.AudioLink.duration)){
			$(".time .durationtime").text("0:00");
		}else{
			$(".time .durationtime").text(((Marmalade.AudioLink.duration / 60).toFixed(2)).replace(".",":"));
		}
		
		if(Marmalade.AudioLink.currentTime === Marmalade.AudioLink.duration){
			Marmalade.NextSong();
		}
		
	}
	
	
	this.Play = function(){
		
		if(Marmalade.AudioLink.paused){
			Marmalade.Play();
		}else{
			Marmalade.Pause();
		}
		
	}
	
	this.PlayForward = function(){
		
	}
	this.PlayBackward = function(){
		
	}
	
	this.PauseShow = function(){
		$("#home-controls-play").addClass("pause");
	}
	this.PlayShow = function(){
		$("#home-controls-play").removeClass("pause");
	}

	this.SidePlaylistUpdate = function(){
		
		$("#home-playlist ul li:first-child").animate({"height": "0px", "opacity": "0.0"},200,function(){
			$(this).remove();	
			
			$("#home-playlist ul li").remove();
			
			for(i=1;i<=4;i++){
				
				console.log("GOING TO PLAYLIST POS" + i);
				console.log("ACTUAL PLAYLIST POS" + (parseFloat(susic.PlaylistPosition) + i));
				var cPSong = susic.Playlist[(parseFloat(susic.PlaylistPosition) + i)];
				
				if(susic.Playlist[i] != undefined){
					$("#home-playlist ul").append('<li>' + cPSong.name + '&nbsp;<span>-&nbsp;' + cPSong.artist + '</span></li>');
				}
				
			}
			
			
		});
		
	}
	
	this.CurrentPlayingSongUpdate = function(){
		
		$(".track").removeClass("current");
		$('.track[data-playlistpos="' + susic.PlaylistPosition + '"]').addClass("current");
		
		var cSong = susic.Playlist[susic.PlaylistPosition];
		$("#home-currenttrack-art").animate({"opacity": "0.0"},200,function(){
			
			$("#home-currenttrack .tracktitle").animate({"opacity": "0.0"},20,function(){
				
				$("#home-currenttrack .tracktitle").text(cSong.name);
				$("#home-currenttrack .tracktitle").animate({"opacity": "1.0"},200);
				
				$("#home-currenttrack .artist").animate({"opacity": "0.0"},20,function(){

					$("#home-currenttrack .artist").text(cSong.artist);
					$("#home-currenttrack .artist").animate({"opacity": "1.0"},300);

				});
				
				
			});

			$("#home-currenttrack-art").attr("src", cSong.albumart);
			$("#home-currenttrack-art").animate({"opacity": "1.0"},200);
			
		});
		
		
	}
	
	
	this.search = function(){
		
		console.log("bing");
		$("#search-go").button('loading');
		
		var sArtist = $("#search-artist").val();
		var sAlbum = $("#search-album").val();
		var sTrack = $("#search-track").val();
		
		if(sArtist != ""){
			console.log("Going to Artist search");
			susic.ArtistSearch(sArtist);
		}
		else if(sAlbum != ""){
			console.log("Going to Album search");
		}
		else if(sTrack != ""){
			console.log("Going to Track search");
		}
		
		return false;
	}
	
	this.ArtistSearch = function(artist){
		susic.disablesearch();
		susic.SetTitle("Artist Search");
		$.getJSON('susic.php', {"fn": "search_artist", "artist": artist}, function(searchdata, textStatus){
			console.log(searchdata);
				
				if($.isArray(searchdata.results)){
					var nooftracks = searchdata.results.length;
					var html = "";

					for (i=0;i<=nooftracks - 1;i++){

						var currenttrack = searchdata.results[i];

						if(currenttrack.mbid != ""){
							html = html + '<div class="artist clearfix" data-artistmbid="' + currenttrack.mbid + '">\
								<h2>' + currenttrack.name + '</h2>\
								<button class="btn large" onclick="susic.GoToArtist(\'' + currenttrack.name + '\', \'' + currenttrack.mbid + '\')">Go To Artist</button>\
							</div>';
						}

					}
					$("#main-content").html(html);
					susic.enablesearch();
				}
				else{
					$("#main-content").html("<p><strong>Susic couldn't find any artists in its database with the term '" + artist + "'</strong><br>Check the spelling and try again.</p>");
					susic.enablesearch();
				}
				
			
		});
	}
	
	this.AlbumSearch = function(album){
		
	}
	this.TrackSeach = function(track){
		
	}
	
	this.SetTitle = function(title){
		$(".currentviewTitle").text(title);
	}

	this.FacebookLogin = function(){
		FB.login(function(response) {
		   if (response.authResponse) {
		     console.log('Welcome!  Fetching your information.... ');
		     FB.api('/me', function(response) {
		       console.log('Good to see you, ' + response.name + '.');
			   console.log(FB.getAuthResponse());
		     });
		   } else {
		     console.log('User cancelled login or did not fully authorize.');
		   }
		 }, {scope: 'email'});
	}
	
	this.User = {}
	this.Login = function(){
		
		var enterprise = $("#login-username").val();
		var iloveyou = $("#login-password").val();
		
		$.getJSON('user.php', {fn: "login","uss": enterprise, "pss": iloveyou}, function(userdata, textStatus) {
			
			if(userdata.status != "loggedin"){
				$("#login-password").after("<p class='loginerror'>An error occurred, check your username, password and sanity.</p>")
			}
			else{
				susic.ShowSidebarSection("home");
				susic.User = userdata;
				susic.PlaceUserData();
				console.log("Successfully logged in");
				console.log(userdata);
				susic.SetTitle("Welcome back " + susic.User["username"]);
			}
			
		});
		
		return false;
	}
	
	this.PlaceUserData = function(){
		
		$("#home-username").html("Logged in as " + susic.User["username"]);
		
	}
	
	this.ResetLoginError = function(){
		$(".loginerror").remove();
	}
	
	this.GoToArtist = function(artist,mbid){
		$("#main-content").html("<p class='main-loading'>Loading Albums...</p>");
		susic.SetTitle(artist);
		susic.GetTopAlbums(artist,mbid);
	}
	
	this.GetAlbum = function(album,artist,mbid){
		
		$.getJSON('susic.php', {fn: "get_album","album": album, "artist": artist, "mbid": mbid}, function(albumdata, textStatus) {
			
			//console.log(albumdata);
			var html = susic.CreateAlbum(albumdata);
			$("#main-content").append(html);
			
		});
		
	}
	
	
	this.PlaceArtistDataSearch = function(artistdata){
		
		console.log(artistdata);
		if(artistdata.bio != null){
			var summary = (artistdata.bio["summary"]).replace(/<(?:.|\n)*?>/gm, '');
			$("#main-content .artistinfo").html(summary);
		}
		
	}
	this.ArtistInfo = function(artist, callback){
		
		$.getJSON('susic.php', {"fn": "get_artist", "artist": artist }, function(artistdata, textStatus){
			callback(artistdata);
		});
		
	}
	
	this.GetTopAlbums = function(artist,mbid){
		$.getJSON('susic.php', {fn: "get_topalbums", "artist": artist, "mbid": mbid}, function(albumdata, textStatus) {
			
			var noofalbums = albumdata.length;
			
			if(noofalbums > 0){
				
				$("#main-content").append("<div class='artistinfo'></div>")
				susic.ArtistInfo(artist, susic.PlaceArtistDataSearch);
				
				albumdata.sort(function(a, b){
				 //console.log(b.playcount);
				 //console.log(a.playcount);
				 return b.playcount-a.playcount
				})

				var mbidmissingArray = new Array();
				//Going to take albums without MBID out of array, then place at the end:
				for (i=0;i<=noofalbums - 1;i++){
					try{
						if(albumdata[i].mbid === ""){
							var addtoend = albumdata.splice(i, 1);
							mbidmissingArray.push(addtoend[0]);
							//console.log(addtoend[0]);
						}
					}catch(err){

					}

				}

				albumdata = albumdata.concat(mbidmissingArray);

				//console.log(albumdata);

				var albumsinlist = new Array();

				for (i=0;i<=noofalbums - 1;i++){
					var currentalbum = albumdata[i];

					var alreadyprinted = jQuery.inArray(currentalbum.name,albumsinlist);

					//console.log(alreadyprinted);

					if(alreadyprinted === -1){
						albumsinlist.push(currentalbum.mbid);
						susic.GetAlbum(currentalbum.name,artist,currentalbum.mbid);
					}


					if(i==noofalbums-1){
						$(".main-loading").remove();
					}
				}
			}
			else{
				$("#main-content").append("<p>Susic couldn't find any albums by that artist.</p>")
			}
			
			
			
		});
	}
	
	this.DebugLn = function(line){
		$('<p>' + line + '</p>').appendTo('#debuginternal');
	}
	
	//Playlist:
	this.Playlist = {}
	this.PlaylistPosition = -1;
	//Takes all the .track's on the page and builds an array:
	this.ConstructPlaylist = function(){
		//Place in-construction playlist into cPlaylist
		var cPlaylist = new Array();
		var tracks = $("#main .track");
		
		$(tracks).each(function(index) {
		    var cTrack = {}
			$(this).attr("data-playlistpos", index);
			cTrack["guid"] = $(this).attr("data-trackguid");
			cTrack["artistguid"] = $(this).attr("data-artistguid");
			cTrack["name"] = $(this).attr("data-track");
			cTrack["artist"] = $(this).attr("data-artist");
			cTrack["albumart"] = $(this).attr("data-albumart");
			cPlaylist.push(cTrack);
		});
		
		susic.PlaylistPosition = 0;
		return cPlaylist;
	}
	//End Playlist
	
	this.CreateAlbum = function(albumdata){//Start of Create Album
		console.log(albumdata);
		var returnhtml = "<!--FAIL " + albumdata.name + " -->";
		try
		{
			//most of the time if the MBID is missing then its not valid..
			//BUT
			//we should check if its different, if it is, then add it anyway
				
				trackshtml = "";
				var albumarturl = albumdata.image.large;
				if(albumdata.tracks != undefined){
					nooftracks = albumdata.tracks.length;
					console.log(nooftracks);

					var releaseyear = (new Date(albumdata.releasedate*1000)).getFullYear();
					//if its 1970 then just ---- because we can't verify it and its most likely wrong
					if(releaseyear == "1970"){ releaseyear = "----"; }

					for (i=0;i<=nooftracks - 1;i++){

						var ctrackdata = albumdata.tracks[i];

						var genre;

						if(albumdata.toptags != undefined){
							var gt = albumdata.toptags[0]["name"]
							genre = gt.charAt(0).toUpperCase() + gt.slice(1);
						}
						else{
							genre = "-----"
						}



						trackshtml = trackshtml + '<tr class="track" data-artistguid="' + ctrackdata['artistGUID'] + '" data-trackguid="' + ctrackdata['trackGUID'] + '" data-artist="' + albumdata.artist + '" data-track="' + ctrackdata.name + '" data-library="false" data-albumart="' + albumarturl + '">\
							<td class="trackno">' + (i + 1) + '</td>\
							<td class="trackname">' + ctrackdata['name'] + '</td>\
							<td class="tracktime">' + ((ctrackdata.duration / 60).toFixed(2)).replace(".",":") + '</td>\
							<td class="trackyear">' + releaseyear + '</td>\
							<td class="trackplays">210</td>\
							<td class="trackvotes">+20</td>\
							<td class="trackgenre">' + genre + '</td>\
							<td class="trackadd">+</td>\
						</tr>';
					}

					var mbidmissing = "";
					if(albumdata["mbid"] === ""){
						mbidmissing = " mbidmissing";
					}

					returnhtml = '<div class="album clearfix ' + mbidmissing + '" data-releasedate="' + albumdata.releasedate + '">\
							<div class="left-info">\
								<div class="left-info-top">\
									<img src="' + albumarturl + '" width="140" height="137" title="MBID: ' + albumdata["mbid"] + '" />\
									<div class="left-info-top-info">\
										<h2>' + albumdata.name + '</h2>\
										<h3>' + albumdata.artist + '</h3>\
									</div>\
									<div class="left-info-bottom">\
										<ul>\
											<li>' + albumdata.playcount + ' Plays</li>\
											<li>In 20378 Libraries</li>\
											<li>Average rating of 9.2/10</li>\
										</ul>\
									</div>\
								</div>\
							</div>\
							<table class="tracktable">\
								<tbody>' + trackshtml + '</tbody>\
							</table>\
						</div>';
				}
				else{
					console.log("No tracks on album");
				}

			susic.Playlist = susic.ConstructPlaylist();
		}
		catch(err){
			console.log(err);
		}
		
		return returnhtml;
	}//End of Create Album
	
	this.ShowSidebarSection = function(name){
		if($("#sidebar #sidebar-" + name).length > 0){
			$("#sidebar .sidebar-section").hide();
			$("#sidebar #sidebar-" + name).show();
		}
	}
	this.GoToSignup = function(){
		var cUsername = $("#login-username").val();
		var cPassword = $("#login-password").val();
		
		$("#signup-username").attr("value", cUsername);
		$("#signup-password").attr("value", cPassword);
		
		susic.ShowSidebarSection("signup");
		
		$("#signup-emailaddress").focus();
	}
	this.signup = function(){
		
		$("#sidebar-signup-btnsignup").button('loading');
		
		var signupdata = new Array();
		signupdata.username = $("#signup-username").val();
		signupdata.email = $("#signup-emailaddress").val();
		signupdata.password = $("#signup-password").val();
		signupdata.confirmpassword = $("#signup-confirmpassword").val();
		
		if(signupdata.password != signupdata.confirmpassword){
			console.log("Passwords don't match");
			$("#sidebar-signup-btnsignup").button('reset');
			$("#signup-password-wrap").addClass("error");
			$("#signup-confirmpassword-wrap").addClass("error");
		}
		else{
			if(signupdata.username.length < 3){
				console.log("Username must be > 3 characters")
				$("#sidebar-signup-btnsignup").button('reset');
				$("#signup-username-wrap").addClass("error");
			}
			else{
				$.post('signup.php', {"signup-username": signupdata.username, "signup-emailaddress": signupdata.email, "signup-password": signupdata.password}, function(data, textStatus, xhr) {
					
					console.log(data);
					
					$("#sidebar-signup-btnsignup").button('reset');
					if(xhr.status != 200){
						$("#signup-confirmpassword").after("<p class='loginerror'>An error occurred, its been logged and the finest young monkey will soon be pouring over its details to figure out why your fine-self encountered this problem.</p>")
					}
					else{
						if(data == "errorabc"){
							$("#signup-confirmpassword").after("<p class='loginerror'>Sorry but the username you chose has already been taken, why not try \"swaggonwheelbbygrl\"? Only kidding, but seriously you must find a new username to signup.</p>");
						}
						else if(data == "success"){
							susic.ShowSidebarSection("home");
						}
						else{
							$("#signup-confirmpassword").after("<p class='loginerror'>I don't know what just happened. Try again soon.</p>");
						}
					}
				});
			}
		}
		return false;
	}
	
	this.test = function(qalbum, qartist){
		$.getJSON('test.php', {"album": qalbum, "artist": qartist}, function(albumdata, textStatus) {
			//console.log(albumdata);
			
			trackshtml = "";
			nooftracks = albumdata.tracks.length;
			console.log(nooftracks);
			
			var releaseyear = (new Date(albumdata.releasedate*1000)).getFullYear();
			
			for (i=0;i<=nooftracks - 1;i++){
				var ctrackdata = albumdata.tracks[i];
				trackshtml = trackshtml + '<tr class="track" data-library="false">\
					<td class="trackno">' + (i + 1) + '</td>\
					<td class="trackname">' + ctrackdata['name'] + '</td>\
					<td class="tracktime">' + ((ctrackdata.duration / 60).toFixed(2)).replace(".",":") + '</td>\
					<td class="trackyear">' + releaseyear + '</td>\
					<td class="trackplays">210</td>\
					<td class="trackvotes">+20</td>\
					<td class="trackgenre">Alternative</td>\
					<td class="trackadd">+</td>\
				</tr>';
				
			}
			
			var albumarturl = albumdata.image.large;
			
			$("#main-content").html('<div class="album clearfix">\
					<div class="left-info">\
						<div class="left-info-top">\
							<img src="' + albumarturl + '" width="140" height="137" />\
							<div class="left-info-top-info">\
								<h2>' + albumdata.name + '</h2>\
								<h3>' + albumdata.artist + '</h3>\
							</div>\
							<div class="left-info-bottom">\
								<ul>\
									<li>' + albumdata.playcount + ' Plays</li>\
									<li>In 20378 Libraries</li>\
									<li>Average rating of 9.2/10</li>\
								</ul>\
							</div>\
						</div>\
					</div>\
					<table class="tracktable">\
						<tbody>' + trackshtml + '</tbody>\
					</table>\
				</div>');
			
		});
		
	}
	
}
susic = new susic;
susic.init();
Marmalade = new Marmalade;