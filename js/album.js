/* jshint node: true, esnext: true */
"use strict";

/*
title <string>
duration <number>
producers <array>[string]
genre <string>
label <string>
cover <url:string>
price <number>
release day <date>
tracks <array>[track]
*/

var TrackClass  = require('./track.js');
var Utils       = require('./utils.js');


class Album {

    constructor(data = {}) {

        Album.audioPlaying        = void 0;
        Album.playingProgressBar  = void 0;
        
        Utils.assertString(data.name, 'Title should be a string');
        this.title = data.name;

        this.producers = [];
        this.id = data.id;

//        Utils.assertString(data.url, 'URL should be a string');
        this.cover = data.images[1].url;

        this.elements = [];

        this.fullUrl = data.href;

        this.thumb = "<img src='" + data.images[2].url + "'></a>";
        this.elements.push(this.thumb);

        this.elements.push("<h4>" + this.title + "</h4>");

            // `<a href="${this.cover}">`

        this.li = `${this.elements.join("\n")}`;

        // Utils.assertString(data.genre, 'Genre should be a string');
        // this.genre = data.genre;

        // Utils.assertString(data.label, 'Label should be a string');
        // this.label = data.label;

        // Utils.assertNumber(data.price, 'Price should be a number');
        // this.price = data.price;

        // Utils.assertDate(data.release, 'Release date should be in date format');
        // this.release = data.release;

        this.tracks = [];
    }

    addTrack(track) {
        if (!track instanceof TrackClass) {
            console.log('Track should be an instance of TrackClass');
        }
        this.tracks.push(track);
    }

    getArtists() {
        var artists = [];
        this.tracks.forEach(function(track) {
            artists = artists.concat(track.artists);
        });
        return Utils.uniq(artists);
    }

    getDuration() {
        var duration = 0;
        this.tracks.forEach(function(track) {
            duration = duration + track.duration;
        });
        return duration;
    }

    getProducers() {
        var producers = [];
        this.tracks.forEach(function(track) {
            producers = producers.concat(track.producers);
        });
        return Utils.uniq(producers);
    }

    getFull(event,div) {
//        event.preventDefault();
        $.get(this.fullUrl, (data) => {
            this.loadTracks(data, div);
        });

    }

    loadTracks(data,div) {

        var that = this;
        data.tracks.items.forEach(function(track){
            that.loadTrack(track);
        });

        this.artists = this.getArtists();
        this.duration = this.getDuration();

        this.buildFull(div);
    }

    loadTrack(data){
        var track = new TrackClass(data);
        this.addTrack(track);
    }

    buildFull(div){
        $(div).empty();
        var html = `
            <img id=${'img_' + this.id} src=${this.cover}></a>
            <h3>${this.title}</h3>
            ${this.artists.join(' ')}
            <ol class="tracksOL" id=${this.id}>
            </ol>
            `;

        $(div).html(html);
        var that = this;
        this.tracks.forEach(function(track){
            var innerHtml = `
                    <li class="track--li">
                        <div class="detailTrack">
                            <img preview_url=${track.preview_url} id=${track.id} src="img/soundPreview.jpg">
                            <h5>${track.title}</h5>
                        </div>
                    </li>`;
            var innerDiv = document.createElement('div');
            $(innerDiv).html(innerHtml);
            $('#' + that.id).append(innerDiv);
            innerDiv.className = 'innerDiv';
            var audioIcon = $('#' + track.id);
            var hasClick = $(audioIcon).data('events') && $(audioIcon).data('events')['click']; 
            if (!hasClick){
                $(audioIcon).click(function(event){
                    console.log('AUDI ICON');
                    that.playAudio($(audioIcon).attr('preview_url'), innerDiv);
                });
            }
        });

        $('#img_' + this.id).click(function (event){
            console.log('WAT img click');
            that.collapse(event,div);
        });
    }

    playAudio (preview_url, innerDiv){
        var audio = new Audio(preview_url);

        var that = this;
        audio.oncanplaythrough = function(){
            audio.play();
            var progressBar = document.createElement('progress');
            $(progressBar).attr('max',audio.duration);
            $(progressBar).attr('value',0);
            $(innerDiv).append(progressBar);

            if (Album.audioPlaying) {
                that.audioEnded(Album.audioPlaying,Album.playingProgressBar);
            }

            Album.audioPlaying        = audio;
            Album.playingProgressBar  = progressBar;

            that.whilePlaying(audio,progressBar);
        }
    }

    audioEnded(audio, progressBar){
        progressBar.remove();
        audio.pause();
        audio = void 0;
        progressBar = void 0;
        // Album.audioPlaying        = void 0;
        // Album.playingProgressBar  = void 0;
        return;
    }

    whilePlaying(audio,progressBar) {
        if (audio.ended){
            this.audioEnded(audio, progressBar);
        }
        $(progressBar).attr('value',audio.currentTime);
        var that = this;
        setTimeout(function(){
            that.whilePlaying(audio,progressBar);
        },100);
    }

    addEventListeners(div){
        var that = this;
        console.log('ADD EVENT LISTENERS', div);
        var img = $(div).children().first();

        $(img).on('click', function(event){
             console.log('DIV CLICK');
             that.getFull(event,div);
        });
        $(img).on('mouseOver').css('cursor', 'hand');
        $(img).on('mouseOut').css('cursor', 'pointer');
    }

    collapse(event,div){
        event.preventDefault();
        $(div).empty();        
        div.innerHTML = this.li;
        this.addEventListeners(div);
    }
}

module.exports = Album;
