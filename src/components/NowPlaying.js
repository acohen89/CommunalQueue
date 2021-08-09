import React, { useState } from 'react';
import axios from 'axios';
import testImage from '../assets/test album cover.jpg';
import { BsFillSkipEndFill, BsFillSkipStartFill } from 'react-icons/bs';
import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai';
const token = localStorage.getItem('token');
const CURRENTLY_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing?market=US';
const TOGGLE_REPEAT_ENDPOINT =
  'https://api.spotify.com/v1/me/player/repeat?state=off';
const TOGGLE_SHUFFLE_ENDPOINT =
  'https://api.spotify.com/v1/me/player/shuffle?state=false';
const PREVIOUS_TRACK_ENDPOINT = 'https://api.spotify.com/v1/me/player/previous';
const SKIP_ENDPOINT = 'https://api.spotify.com/v1/me/player/next';
const PLAY_ENDPOINT = 'https://api.spotify.com/v1/me/player/play';
const PAUSE_ENDPOINT = 'https://api.spotify.com/v1/me/player/pause';
export const ALERT_MESSAGE =
  'No active player found! Please open Spotify on your device. If error persists, play a random song to get it started.';

//TODO: when device has been found make sure we display shuffle and repeat when play is clicked
const NowPlaying = ({ isMaster }) => {
  const [isPaused, setPaused] = useState([true]);

  const switchPlayPause = () => {
    if (isPaused) {
      play();
      setPaused(false);
    } else {
      pause();
      setPaused(true);
    }
  };

  return (
    <div
      style={{
        background: 'rgb(52,52,52)',
        background:
          'linear-gradient(326deg, rgba(52,52,52,1) 0%, rgba(102,102,102,1) 100%)',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'column',
        padding: 15,
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <p
          style={{
            textAlign: 'left',
            margin: 5,
            marginBottom: 10,
            fontSize: 25,
            fontWeight: 'bold',
          }}
        >
          Now Playing
        </p>
        <p style={{ color: '#c2c2c2', textAlign: 'left' }}>
          Added by Ploni Almoni
        </p>
      </div>

      <div style={{ height: 75, width: '100%', display: 'flex' }}>
        <img
          src={testImage}
          style={{
            height: '100%',
            borderRadius: 10,
            marginRight: 10,
            boxShadow: '-2px 2px 5px 5px rgba(0, 0, 0, .1)',
          }}
        />
        <div
          style={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 10,
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'left',
            }}
          >
            Default Title
          </p>
          <p style={{ margin: 0, color: '#c2c2c2', textAlign: 'left' }}>
            Default Artist
          </p>
        </div>
        {true ? (
          <div className="controlBox">
            <BsFillSkipStartFill
              style={{ color: 'white', cursor: 'pointer' }}
              size={30}
              onClick={() => previousTrack()}
            />
            {isPaused ? (
              <AiFillPlayCircle
                style={{ color: 'white', cursor: 'pointer' }}
                size={35}
                onClick={switchPlayPause}
              />
            ) : (
              <AiFillPauseCircle
                style={{ color: 'white', cursor: 'pointer' }}
                size={35}
                onClick={switchPlayPause}
              />
            )}
            <BsFillSkipEndFill
              style={{ color: 'white', cursor: 'pointer' }}
              size={30}
              onClick={() => skipTrack()}
            />
          </div>
        ) : (
          <p>Only the host has controls</p>
        )}
      </div>
    </div>
  );
};

export function pause() {
  const requestOptions = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  };
  fetch(PAUSE_ENDPOINT, requestOptions).then(
    (response) =>
      function () {
        if (response.status === 204) {
          localStorage.setItem('noActiveDevice', true);
          alert(ALERT_MESSAGE);
        } else if (response.status === 200) {
          localStorage.setItem('noActiveDevice', false);
          console.log('Paused Song');
        }
      }
  );
}

export function play() {
  const requestOptions = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  };
  fetch(PLAY_ENDPOINT, requestOptions).then(
    (response) =>
      function () {
        if (response.status === 204) {
          localStorage.setItem('noActiveDevice', true);
          alert(ALERT_MESSAGE);
        } else if (response.status === 200) {
          localStorage.setItem('noActiveDevice', false);
          console.log('Played Song');
        }
      }
  );
}
export function skipTrack() {
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  };
  fetch(SKIP_ENDPOINT, requestOptions).then(
    (response) =>
      function () {
        if (response.status === 204) {
          localStorage.setItem('noActiveDevice', true);
          alert('No active player found! Please open Spotify on your device.');
        } else if (response.status === 200) {
          localStorage.setItem('noActiveDevice', false);
          console.log('Skipped Song');
        }
      }
  );
}
export function previousTrack() {
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  };
  fetch(PREVIOUS_TRACK_ENDPOINT, requestOptions).then(
    (response) =>
      function () {
        if (response.status === 204) {
          localStorage.setItem('noActiveDevice', true);
          alert(ALERT_MESSAGE);
        } else if (response.status === 200) {
          localStorage.setItem('noActiveDevice', false);
          console.log('Went back a Song');
        }
      }
  );
}
export function disableShuffleandRepeat() {
  const requestOptions = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  };
  fetch(TOGGLE_REPEAT_ENDPOINT, requestOptions).then(
    (data) =>
      function () {
        if (data.status === 404) {
          localStorage.setItem('noActiveDevice', true);
          alert(ALERT_MESSAGE);
        } else if (data.status === 200) {
          localStorage.setItem('noActiveDevice', false);
          console.log('Disabled repeat');
        }
      }
  );
  fetch(TOGGLE_SHUFFLE_ENDPOINT, requestOptions).then(
    (data) =>
      function () {
        if (data.status === 404) {
          localStorage.setItem('noActiveDevice', true);
          alert(ALERT_MESSAGE);
        } else if (data.status === 200) {
          localStorage.setItem('noActiveDevice', false);
          console.log('Disabled shuffle');
        }
      }
  );
}

export async function getNowPlaying() {
  let ret = '';
  await axios
    .get(CURRENTLY_PLAYING_ENDPOINT, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        ret = {
          title: response.data.item.name,
          artist: response.data.item.artists[0].name,
          uri: response.data.item.uri,
        };
      } else if (response.status === 204) {
        if (!localStorage.getItem('noActiveDevice')) {
          localStorage.setItem('noActiveDevice', true);
          alert(ALERT_MESSAGE);
        }
      }
    })
    .catch((error) => {
      console.log(error + ' with getting songs in playlist');
    });
  return ret;
}
export default NowPlaying;
