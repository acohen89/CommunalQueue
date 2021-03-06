import React, { useState, useEffect } from 'react';
import axios from 'axios';
import firebase from '../firesbase';
import Button from '../Button';
import SearchBar from '../SearchBar/SearchBar';
import ExistingQueueSongs from './ExistingQueueSongs';
import { HASH_LENGTH } from '../MainQueue/MainQue';
import { getNowPlaying } from '../NowPlaying';
import '../styles/ZevsStyles.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const urlParams = new URLSearchParams(window.location.search);
const db = firebase.firestore();
const USER_ID_ENDPOINT = 'https://api.spotify.com/v1/me';

let docRef;
urlParams.get('queueID')
  ? (docRef = db.collection('Active Ques').doc(urlParams.get('queueID')))
  : (docRef = null);
const queueID = urlParams.get('queueID');
localStorage.setItem('queueID', queueID);
export { docRef };

const ExistingQueue = () => {

  const notify = (message, milliseconds) =>
    toast(message, { autoClose: milliseconds });
  const [songs, setSongs] = useState([
    { id: '1', title: 'No Songs In Queue', artist: '', inQueue: true, addedBy: "no One"  },
    { id: '2', title: '', artist: '', inQueue: true },
  ]);
  const [curSong, setCurSong] = useState({
    id: '2',
    title: '',
    artist: '',
    inQueue: true,
    addedBy: 'Spotify',
    duration: 0,
  });

  updateNowPlaying();
  useEffect(() => {
    getNameFromSpot();
    docRef.onSnapshot((doc) => {
      refresh();
    });
    docRef.get().then((doc) => {
      if (!doc.exists) {
        alert("Queue with that ID does not exist");
        window.history.back()
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  }, []);

  useEffect(() => {
    setInterval(() => updateNowPlaying(), 5500);
  }, []);


  async function updateNowPlaying() {
    (async () => {
      const cSong = await getNowPlaying();
      if (cSong.title !== curSong.title) {
        if (
          cSong.addedBy === 'Spotify' ||
          cSong.addedBy === null ||
          cSong.addedBy === undefined
        ) {
          let addedBy = await getAddedByFromDB(cSong);
          if ((addedBy !== null || addedBy !== undefined) && cSong.addedBy) {
            cSong.addedBy = addedBy;
          }
        }
        setCurSong((curSong) => (curSong = cSong));
      }
    })();
  }
  async function getAddedByFromDB(curSong) {
    let ret = null;
    await docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          if(doc.data().songs !== undefined){
            if(doc.data().songs.length !== 0){
              for (let i = 0; i < doc.data().songs.length; i++) {
                if (doc.data().songs[i].id === curSong.uri) {
                  ret = doc.data().songs[i].addedBy;
                }
              }
            }
          }
        } else {
          console.error('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
    return ret;
  }

  function getNameFromSpot() {
    const token = localStorage.getItem('token');
    axios
      .get(USER_ID_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        localStorage.setItem('name', response.data.display_name);
      })
      .catch((error) => {
        console.log(error + '\n with token \n ' + token);
      });
  }
  const refresh = () => {
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          if(doc.data().songs !== undefined){
            if(doc.data().songs.length !== 0){
              setSongs((songs) => (songs = doc.data().songs));
            } else {
              setSongs((songs) => ([{ id: '1', title: 'No Songs In Queue', artist: '', inQueue: true, addedBy: "no One" },{ id: '2', title: '', artist: '', inQueue: true },]));
            }  
          }
        } else {
          console.error('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
  };
  const back = () => {
    window.history.back();
  };
  if (
    !urlParams.get('queueID') ||
    urlParams.get('queueID').length !== HASH_LENGTH
  ) {
    return (
      <div className="bg">
        <p className="body" style={{ margin: 70 }}>
          {' '}
          Enter a valid Queue ID
        </p>
        <Button text="Back" onClick={back} />
      </div>
    );
  } else {
    return (
      <div className="bg">
        <div style={{ position: 'absolute', margin: 30, top: 0, right: 0 }}>
          <SearchBar docRef={docRef} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div className="darkContainer">
            <p
              className="queueTitle"
              style={{ marginLeft: 35, marginRight: 10 }}
            >
              Queue
            </p>
            <p className="queueID">ID: {urlParams.get('queueID')}</p>
            <div style={{ margin: 20 }}>
              <Button text="Back" onClick={back} />
            </div>
          </div>
          <div
            className="darkContainer"
            style={{
              padding: 30,
              flexDirection: 'column',
              alignItems: 'stretch',
              minWidth: 700,
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexGrow: 2,
                justifyContent: 'space-between',
              }}
            >
              <p className="queueTitle" style={{ fontSize: 30, color: 'gray' }}>
                Songs in queue
              </p>
            </div>
            {/* <NowPlaying curSong={curSong} /> */}
            <ExistingQueueSongs songs={songs} docRef={docRef} />
          </div>
          <p className="credits">Created by Adam Cohen and Zev Ross</p>
        </div>
      </div>
    );
  }
};

export default ExistingQueue;
