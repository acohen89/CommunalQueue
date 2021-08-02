import React from 'react';
import {MdAdd} from "react-icons/md";
import firebase from "./firesbase";
const db = firebase.firestore();

const Song = ({uri, title, artist, inQueue}) => {
    console.log("title " + title + " artist " + artist + " inQueue " + inQueue )
    
    const queueID = localStorage.getItem("queueID");
    const docRef = db.collection("Active Ques").doc(queueID);
    const addSong = () => {
        if(artist === "" || title === "" || uri === ""){ 
            console.error("Can't add an empty song");
            return;
        }
        docRef.update({songs:firebase.firestore.FieldValue.arrayUnion({
            artist: artist,
            id: uri,    
            title: title})
        })
        .then(() => {
            console.log("Added " + title + " to database!");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    }
    if(inQueue){
        return (
            <div>
                 <p id={uri} key = {uri} > {title} {artist} </p> 
            </div>
                )
    } else{
        return (
            <div>
                 <p id={uri} key = {uri} > {title} {artist} <MdAdd onClick={addSong}/> </p> 
            </div>
                )
    }
}
Song.defaultProps = {
    uri: "testURi",
    name: "TestName",
    artist: "Test Artist",
    inQueue: true,
}

export default Song