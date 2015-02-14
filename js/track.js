/* jshint node: true, esnext: true */
"use strict";

/*
title <string>
duration <number>
lyrics <string>
bpm <number>
artist(s) <array>[string]
featuring artist(s) <array>[string]
song writer(s) <array>[string]
producer <array>[string]
genre <string>
price <number>
release day <date>

album <album>
*/

var Utils = require('./utils.js');

class Track {

    constructor(data = {}) {

        Utils.assertString(data.name,'Title should be a string');
        this.title = data.name;
        this.id = data.id;

        Utils.assertNumber(data.duration_ms, 'Duration should be a number');
        this.duration = data.duration_ms;

        this.preview_url = data.preview_url;

        // Utils.assertString(data.genre,'Genre should be a string');

        // Utils.assertNumber(data.price, 'Price should be a number');
        // this.price = data.price;

        // this.releaseDay = new Date(data.releaseDay);
        this.artists = [];
        this.featuringArtists = [];
        this.songWriters = [];
        this.producers = [];
        // this.genres = [];

        this.addArtists(data);

    }

    addArtists(data){
        var that = this;
        data.artists.forEach( function (artist){
            that.addArtist(artist.name);
        });
    }

    addArtist(artist){
        Utils.assertString(artist, 'Artist should be a string.');
        this.artists.push(artist);
    }

    addFeaturingArtist(featuringArtist){
        Utils.assertString(featuringArtist, 'Featuring artist should be a string.');
        this.featuringArtists.push(featuringArtist);
    }

    addSongWriter(songWriter){
        Utils.assertString(songWriter, 'Song writter should be a string.');
        this.songWriters.push(songWriter);
    }

    addProducer(producer){
        Utils.assertString(producer, 'Producer should be a string.');
        this.producer.push(producer);
    }
}

module.exports = Track;
