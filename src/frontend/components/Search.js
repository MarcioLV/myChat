import React, { useState, useEffect, useContext } from "react";

// import config from '../../../config'
import config from '../../../config'
const API_URL = `${config.api.host}/${config.api.name}/`
// const API_URL = `http://localhost:3000/api/`;

import { AppContext } from "../context/AppProvider";
import searchIcon from "../assets/icons/search-icon.png";
import cerrarIcon from "../assets/icons/cerrar-icon.png";
import "./style/Search.css";

const Search = (props) => {
  const { state, addSearch, deleteSearch } = useContext(AppContext);
  const { search, user } = state;
  const [searchInp, setSearchInp] = useState("");

  useEffect(() => {
    handleSearchInp();
  }, [searchInp]);

  const handleSearchInp = () => {
    props.handleSearchInp(searchInp);
  };

  const handleDeleteSearch = () => {
    deleteSearch();
    setSearchInp("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInp) {
      return;
    }
    const response = await fetchSearch(searchInp);
    if (response.error) {
      console.error(response.body);
      return alert("Sucedio un error");
    }
    const index = response.body.findIndex((e) => e.user_id === user._id);
    if (index !== -1) {
      response.body.splice(index, 1);
    }
    addSearch(response.body);
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
    <div className="search-container">
      <div className="Main_container">
        <form className="search-input">
          <button
            type="submit"
            onClick={(e) => handleSearch(e)}
            className="search-input_search"
          >
            <img src={searchIcon} alt="search-Icon" />
          </button>
          <input
            type="text"
            placeholder="Buscar"
            value={searchInp}
            onChange={(e) => setSearchInp(e.target.value)}
          />
          <button
            type="button"
            onClick={handleDeleteSearch}
            className="search-input_delete"
            style={searchInp !== "" ? { visibility: "visible" } : {}}
          >
            <img src={cerrarIcon} alt="cerrar-Icon" />
          </button>
        </form>
        {searchInp !== "" && (
          <div
            className="searchMore"
            // style={{padding: "10px 0"}}
            // key={chat.user_id + 10000}
            onClick={(e) => handleSearch(e)}
          >
            Buscar mas
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
