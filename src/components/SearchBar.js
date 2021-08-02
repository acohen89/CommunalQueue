import axios from 'axios';
import React, {useState, useEffect} from 'react'
import SongInQue from "./SongInQue";
const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("token");
    const [songs, setSongs] = useState([{id: "", title: "", artist: "", inQueue:true}, {id: "", title: "", artist: "", inQueue:true}]);
    const searchID = "searchBar";
    let updated = true;
    function updateSearch (){
         setSearch(search => search = document.getElementById(searchID).value);
         updated = false;
    }
    useEffect(() => {
        if(search !== ""){
            const url = SEARCH_ENDPOINT + "?q=" + search + "&type=track";  
            axios.get(url, {
                headers: {
                    Authorization: "Bearer " + token,
                }
              })
              .then(function (response) {
                setSongs(response.data.tracks.items.map(item => ({uri: item.uri, title: item.name, artist: item.artists[0].name})))
              })
              .catch(function (error) {
                console.log(error); 
              })
        }
    }, [search, token])
    return (
        <div>
            <input type="text" name={searchID} id={searchID} placeholder="Search for a song" onChange={updateSearch} />
            <SongInQue songs={songs} inQueue={updated} />
        </div>
    )
}

export default SearchBar