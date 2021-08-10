import React from 'react';
import { removeSong, convert } from '../Song';
import { FiTrash } from 'react-icons/fi';

const MQSong = ({
  uri,
  title,
  artist,
  played,
  duration,
  coverImage,
  addedBy,
  docRef,
}) => {
  let artistKey = uri + artist;
  if (uri === 'testURi') {
    uri = 'Random uri ' + Math.floor(Math.random() * 99999);
    artistKey = uri + Math.floor(Math.random() * 999);
  }
  if (played || played === undefined) {
    return <></>;
  } else {
    // add a place of who the song was added by
    return (
      <div style={{ display: 'flex' }}>
        <p className="song" key={uri}>
          {' '}
          {title}
        </p>
        <p className="songArtist" style={{ color: 'gray' }} key={artistKey}>
          {' '}
          {artist}
        </p>
        <p style={{ color: 'white' }}>{convert(duration)}</p>
        {addedBy === localStorage.getItem('name') ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexGrow: 2,
            }}
          >
            <FiTrash
              style={{ color: 'gray', marginRight: 20, cursor: 'pointer' }}
              onClick={() => removeSong(uri, docRef)}
            />
          </div>
        ) : null}
      </div>
    );
  }
};

export default MQSong;
