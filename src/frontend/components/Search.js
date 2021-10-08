import React, { useState, useEffect, useContext } from "react";

const API_URL = "http://localhost:3000/api/";

import {AppContext} from '../context/AppProvider'
import './style/Search.css'

const Search = (props) => {
  const {state, addSearch, deleteSearch} = useContext(AppContext)
  const {search} = state
  const [searchInp, setSearchInp] = useState("");

  const handleSearchInp = () => {
    props.handleSearchInp(searchInp)
  }

  useEffect(()=> {
    handleSearchInp()
  },[searchInp])

  const handleDeleteSearch = () => {
    deleteSearch();
    setSearchInp('')

  };
  const handleSearch = async () => {
    if (!searchInp) {
      return alert("Search Vacio");
    }
    const response = await fetchSearch(searchInp);
    if (response.error) {
      console.error(response.body);
      return alert("Sucedio un error");
    }
    addSearch(response.body)
  };

  const fetchSearch = async (data) => {
    try {
      let response = await fetch(`${API_URL}user/` + data);
      response = await response.json();
      return response;
    } catch (error) {
      let err = {
        error: true,
        body: error,
      };
      return err;
    }
  };

  return (
    <>
      <div className="search-container">
        <div className="search-input">
          <input
            type="text"
            placeholder="Buscar"
            value={searchInp}
            onChange={(e) => setSearchInp(e.target.value)}
          />
          <button onClick={handleSearch}>Buscar</button>
          {searchInp !== '' && <button onClick={handleDeleteSearch}>Volver</button>
}
        </div>
      </div>
    </>
  );
};

export default Search;
