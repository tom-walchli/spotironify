/* jshint node: true, esnext: true */
"use strict";

var TrackClass  = require('./track.js');
var Utils       = require('./utils.js');


class Album {

    constructor(data = {}) {

        Album.audio  = void(0);
        
        Utils.assertString(data.name, 'Title should be a string');
        this.title = data.name;

        this.producers = [];
        this.id = data.id;

        this.cover = data.images[1].url;

        this.elements = [];

        this.fullUrl = data.href;

        this.thumb = "<img src='" + data.images[2].url + "' class='albumThumb' title='Show details'>";
        this.elements.push(this.thumb);

        this.elements.push("<strong>" + this.title + "</strong>");

        this.li = `${this.elements.join("\n")}`;
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
        event.preventDefault();
        $.get(this.fullUrl, (data) => {
            this.loadTracks(data, div);
        });

    }

    loadTracks(data,div) {
        this.tracks = [];
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
            <h3>${this.artists.join(', ')}: ${this.title}</h3>
            <div class="rightSide">
                <ol class="tracksOL" id=${this.id}></ol>
            </div>
            <img class="coverImg" id=${'img_' + this.id} src=${this.cover} title="Collapse...">
        `;

        $(div).html(html);
        var that = this;
        this.tracks.forEach(function(track){
            var innerHtml = `
                <span class="innerDiv" id="div"+${track.id}>
                    <img class="audioIcon" preview_url=${track.preview_url} id=${'audio_'+track.id} src="img/play.jpg" title="Play">
                    <h5 class="trackTitle">${track.title}</h5>
                </span>`;
            var innerLI = document.createElement('li');
            $(innerLI).html(innerHtml);
            $('#' + that.id).append(innerLI);
            var audioIcon = $('#audio_' + track.id);
            var hasClick = $(audioIcon).data('events') && $(audioIcon).data('events')['click']; 
            if (!hasClick){
                $(audioIcon).on('click', function(event){
                    that.playAudio(audioIcon, $(innerLI).children().first());
                });
            }
        });

        $('#img_' + this.id).click(function (event){
            console.log('WAT img click');
            that.collapse(event,div);
        });
    }

    playAudio (icon, innerDiv){

        console.log('play');
        
        if (Album.audio){
            this.audioEnded();
        }

        var that = this;
        $(icon).off('click');
        Album.audio = new Audio($(icon).attr('preview_url'));
        Album.audio.icon = icon;
        Album.audio.innerDiv = innerDiv;

        var that = this;
        Album.audio.oncanplaythrough = function(){
            Album.audio.play();
            Album.audio.done = false;
            Utils.setAttr(icon,'src','img/pause.jpg');
            Utils.setAttr(icon,'title', 'Pause');
            var progressBar = document.createElement('progress');
            $(progressBar).attr('max',Album.audio.duration);
            $(progressBar).attr('value',0);
            $(progressBar).attr('class','progressBar');
            $(innerDiv).append(progressBar);

            var stopBtn = document.createElement('img');
            stopBtn.className = 'audioIcon stopBtn';

            Utils.setAttr(stopBtn,'src','img/stop.jpg');
            Utils.setAttr(stopBtn,'title', 'Stop');

            $(icon).on('click', function(event){
                that.pause(Album.audio, icon, innerDiv);
            });
            
            $(stopBtn).on('click',function(event){
                that.stop();
            });

            $(stopBtn).insertAfter(icon);

            that.whilePlaying(icon,innerDiv);
        }
    }

    pause(){
        console.log('pause');
        var that = this;
        var icon = Album.audio.icon;
        $(icon).off('click');
        Album.audio.pause();
        Utils.setAttr(icon,'src','img/play.jpg');
        Utils.setAttr(icon,'title', 'Play');
        $(icon).on('click', function (event){
            that.resume();
        });
    }

    resume(){
        console.log('resume');
        var that = this;
        var icon = Album.audio.icon;
        $(icon).off('click');
        Album.audio.play();
        Utils.setAttr(icon,'src','img/pause.jpg');
        Utils.setAttr(icon,'title', 'Pause');
        $(icon).on('click', function (event){
            that.pause();
        });
    }

    stop (){
        console.log('stop');
        this.audioEnded();
    }

    audioEnded(){
        console.log('audioEnded');
        $(icon).off('click');
        var icon = Album.audio.icon;
        var innerDiv = Album.audio.innerDiv;
        var stopBtn = $(innerDiv).find('.stopBtn');
        var progressBar = $(innerDiv).find('.progressBar')
        stopBtn.remove();
        progressBar.remove();
        Album.audio.pause();
        var that = this;
        Utils.setAttr(icon,'src','img/play.jpg');
        Utils.setAttr(icon,'title', 'Play');
        $(icon).on('click', function(event){
            that.playAudio(icon, innerDiv);
        });
        Album.audio.done = true;
    }

    whilePlaying() {
        if (Album.audio && Album.audio.ended){
            this.audioEnded();
            return;
        } else if (!Album.audio || Album.audio.done){
            return;
        }
        var innerDiv = Album.audio.innerDiv;
        var progressBar = $(innerDiv).find('.progressBar');
        $(progressBar).attr('value',Album.audio.currentTime);
        var that = this;
        setTimeout(function(){
            that.whilePlaying();
        },100);
    }

    addEventListeners(div){
        var that = this;
        var img = $(div).children().first();

        $(img).on('click', function(event){
             that.getFull(event,div);
        });
    }

    collapse(event,div){
        if (Album.audio){
            this.audioEnded();
        }
        event.preventDefault();
        $(div).empty();        
        div.innerHTML = this.li;
        this.addEventListeners(div);
    }

}

module.exports = Album;
