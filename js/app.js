/* jshint node: true */
"use strict";
var AlbumClass = require('./album.js');
var TrackClass = require('./track.js');


$('#searchBtn').click(startSearch);

function startSearch(event) 
{
	event.preventDefault();
	var query = "https://api.spotify.com/v1/search?type=album&limit=20&query=" + $('#searchBar').val();
	console.log("QUERY:",query);

	$.get( query, function(data) {
		clearList();
		loadAlbums(data);
	});
}

function loadAlbums(data){
	var albums = [];
	data.albums.items.forEach(function(item){
		loadAlbum(item, albums);
	});
}

function loadAlbum(data, albums){
	var album = new AlbumClass(data);	
	albums.push(album);
	var div = document.createElement('div');
	div.innerHTML = album.li;
	div.className = "albumItem";
	$('#albumList').append(div);
	album.addEventListeners(div);
}

function clearList(){
	$('#albumList').empty();
}



