var data;
var songUrl = 'https://api.spotify.com/v1/search?type=track&query='
var albumUrl = 'https://api.spotify.com/v1/search?type=album&query='
var artistUrl = 'https://api.spotify.com/v1/search?type=artist&query='
var artistSearchUrl = 'https://api.spotify.com/v1/artists/'
var albumSearchUrl = 'https://api.spotify.com/v1/albums/'
var songSearchUrl ='https://api.spotify.com/v1/tracks/'

var myApp = angular.module('myApp', [])

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {};
  // function that allows user to find artists based on user input
  $scope.getArtists = function() {
    $scope.findAlbum = null;
    $scope.findTrack = null;
    $http.get(artistUrl + $scope.findArtist).success(function(response){
      data = $scope.artists = response.artists.items;
    });
  };
  // function that allows user to find songs based on user input
  $scope.getSongs = function() {
    $scope.findArtist = null;
    $scope.findAlbum = null;
    $http.get(songUrl + $scope.findTrack).success(function(response){
      data = $scope.tracks = response.tracks.items;
    });
  };
  // function that allows user to find albums based on user input
  $scope.getAlbums = function() {    
    $scope.findArtist = null;
    $scope.findTrack = null;
    $http.get(albumUrl + $scope.findAlbum).success(function(response){
      data = $scope.albums = response.albums.items;
    });
  };
  // function that allows user to find related artists and top-tracks by click on album covers
  $scope.relatedArtist = function(artist) {
    $scope.albums = [];
    $scope.songs = [];
    $http.get(artistSearchUrl + artist.id + '/albums').success(function(response){
        data = $scope.albums = response.items;
    });
    $http.get(artistSearchUrl + artist.id + '/top-tracks').success(function(response){
        data = $scope.tracks = response.tracks;
    });
  };
  // function that allows user to see related artists by click on albums or tracks
  function findTheArtists(artists) {
    artists.forEach(function(artist) {
        $http.get(artistSearchUrl + artist.id).success(function(response){
            data = $scope.artists.push(response);
        });
    });
  }
  // function that allows user to see related artists and tracks by click on album covers
  $scope.relatedAlbum = function(album) {
    $scope.artists = [];
    $scope.tracks = [];
    $http.get(albumSearchUrl + album.id).success(function(response){
        findTheArtists(response.artists);
        response.tracks.items.forEach(function(track) {
            $http.get(songSearchUrl + track.id).success(function(response){
                data = $scope.tracks.push(response);
            });
        });
    });
  };
  // function that allows user to see related albums and artists by click on songs
  $scope.relatedSong = function(track) {
    $scope.artists = [];
    $scope.albums = [];
    $http.get(songSearchUrl + track.id).success(function(response){
        findTheArtists(response.artists);
        data = $scope.albums = [response.album];
    });
  };
  // function that allows user to listen preview of certain song
  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause()
      $scope.currentSong = false
      return
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play()  
      $scope.currentSong = song
    }
  }
});
// Add tool tips to anything with a title property
$('body').tooltip({
  selector: '[title]'
});