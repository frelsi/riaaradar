define(["release-group", "lastfm", "jquery"], function (ReleaseGroup, LastFm, $) {
    var baseAPI = "http://www.musicbrainz.org/ws/2/";

    // MusicBrainz artist from API
    var Artist = function ($mbArtist) {
         // Name of the artist 
        this.name = $mbArtist.children("name").text();

        // MusicBrainz identifier associated with the artist
        this.mbid = $mbArtist.attr("id");

        // Disambiguation comment to help distinguish identically named artists
        this.disambig = $mbArtist.children("disambiguation").text();
    };

    // Get the release groups for this artist
    Artist.prototype.getReleaseGroups = function (callback) {
        var query = baseAPI + "release-group?artist=" + this.mbid;
        $.ajax({
            url: query,
            dataType: "xml",
            success: function (data) {
                var releases = [];
                $(data).find("release-group").each(function () {
                    releases.push(new ReleaseGroup($(this)));
                });
                callback(releases);
            },
            failure: function () {
                alert("Unable to connect to the MusicBrainz servers");
            }
        });
    };

    // Get the artist image
    Artist.prototype.getImage = function (callback) {
        LastFm.getArtistImage(this.mbid, callback);
    };

    // Generates thumbnail html
    Artist.prototype.getThumbnailHtml = function () {
        var html = [
            "<li class='span3'>",
            "<div class='thumbnail'>",
            "<img src='http://img.ehowcdn.com/article-new/ehow/images/a07/bg/74/easiest-album-art-itunes-8-800x800.jpg' alt=''>",
            "<div class='caption'>",
            this.name + "<br><em>" + this.disambig + "</em>",
            "</div></div></li>"
        ].join("");
        return html;
    };

    return Artist;
});