var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
    +  '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +  '<td class="song-item-title">' + songName + '</td>'
    +  '<td class="song-item-duration">' + songLength + '</td>'
    +'</tr>'
    ;

    var $row = $(template);

    var clickHandler = function() {
      var songNumber = parseInt($(this).attr('data-song-number'));

      if (currentlyPlayingSongNumber !== null) {
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }

      if (currentlyPlayingSongNumber !== songNumber) {
        //Switch from Play to Pause
        setSong(songNumber);
        currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();

      } else if (currentlyPlayingSongNumber === songNumber) {
        if (currentSoundFile.isPaused()) {
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          currentSoundFile.play();
        } else {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentSoundFile.pause();
        }

      }
    };

    var onHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
      }
    };

    var offHover = function(event) {
      //make number of song track appear
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(songNumber);
      }
    };


    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setSong = function(songNumber){
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'mp3' ],
    preload: true
  });

  setVolume(currentVolume);
}

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
}

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
}


var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
}

var updatePlayerBarSong = function () {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
}

var nextSong = function() {
  //Use trackIndex to get the index of current song and increment value
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
  //know next song (needs to wrap to beginning song)
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  var lastSongNumber = currentlyPlayingSongNumber;
  //set a new current song to currentSongFromAlbum
  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  //updatePlayerBarSong
  updatePlayerBarSong();

  //update HTML of previous song's .song-item-number with a songNumber
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  //update the HTML of new song's .song-item-number element with pause button
  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
}

var previousSong = function() {
  //Use trackIndex to get the index of current song and increment value
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
  //know next song (needs to wrap to beginning song)
  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  var lastSongNumber = currentlyPlayingSongNumber;
  //set a new current song to currentSongFromAlbum
  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  //updatePlayerBarSong
  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);

  //update HTML of previous song's .song-item-number with a songNumber
  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
  //update the HTML of new song's .song-item-number element with pause button
  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
}

var togglePlayFromPlayerBar = function() {
  if (!currentlyPlayingSongNumber) {
    alert("pressing play with no song selected.");
    return;
  }
  var selector = "td.song-item-number[data-song-number='" + currentlyPlayingSongNumber + "']";
  var currentlyPlayingCell = $(selector);

  if (currentSoundFile.isPaused()) {
    //find the song number of currentSoundFile
    //select the correct row, change the song number cell from a play button to a pause nextButton

    currentlyPlayingCell.html(pauseButtonTemplate);
    //change the HTML of the player bar's play button to a pause nextButton
    $(this).html(playerBarPauseButton);
    //play the song
    currentSoundFile.play();

  } else {

    //change the song number cell to a play button
    currentlyPlayingCell.html(playButtonTemplate);
    //change the HTML of player bar's pause button to player
    $(this).html(playerBarPlayButton);
    //pause the song
    currentSoundFile.pause();
  }

}

//Elements with listeners
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $mainPlayPause = $('.main-controls .play-pause');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $mainPlayPause.click(togglePlayFromPlayerBar);

});
