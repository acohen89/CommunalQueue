import React from 'react';
import EQSong from './EQSong';

const ExistingQueueSongs = ({ songs, docRef }) => {
  function processKey(id) {
    return id === 'testURi' || id === undefined || id === ''
      ? 'Random URI' + Math.floor(Math.random() * 999999999)
      : id;
  }
  return (
    <>
      {songs.map((song) => (
        <EQSong
          uri={processKey(song.id)}
          title={song.title}
          artist={song.artist}
          played={song.played}
          duration={song.duration}
          addedBy={song.addedBy}
          docRef={docRef}
        />
      ))}
    </>
  );
};

export default ExistingQueueSongs;
