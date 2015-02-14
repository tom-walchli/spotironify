/* jshint node: true */
"use strict";
var AlbumClass = require('./album.js');
var TrackClass = require('./track.js');


$('#searchBtn').click(startSearch);

function startSearch(event) 
{
	event.preventDefault();
	var query = "https://api.spotify.com/v1/search?type=album&query=" + $('#searchBar').val();
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


///////////////////////////////////////////




// var firstAlbum = new AlbumClass({
//     title: 'album title goes here...',
//     duration: 10 * 85,
//     price: 10
// });

// // adding a comment
// var firstTrack = new TrackClass({
//     title: 'this is track one',
//     duration: 84,
//     price: 0.99
// });
// firstTrack.addArtist('foo');
// firstTrack.addArtist('abc');

// firstAlbum.addTrack(firstTrack);

// var secondTrack = new TrackClass({
//     title: 'this is track two',
//     duration: 90,
//     price: 1.10
// });
// secondTrack.addArtist('abc');
// secondTrack.addArtist('xyz');
// firstAlbum.addTrack(secondTrack);

// console.log('Album: ', firstAlbum);
// console.log('Artists: ', firstAlbum.getArtists());
