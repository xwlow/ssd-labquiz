import React from 'react';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ReactContext, { createContext, useContext } from 'react';
import {validateInput} from './validateInput'; // Import the validateInput function for testing

// Context for search term
const SearchTermContext = createContext<{term: string, setTerm: (t: string) => void}>({term: "", setTerm: () => {}});



function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { setTerm } = useContext(SearchTermContext);

  const handleSearch = () => {
    if (validateInput(searchTerm)) {
      alert("Potential XSS or SQL Injection detected. Input cleared.");
      setSearchTerm("");
      return;
    }
    setTerm(searchTerm);
    navigate("/search");
  };

  return (
    <div className="App-content">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

function SearchPage() {
  const navigate = useNavigate();
  const { term } = useContext(SearchTermContext);

  return (
    <div className="App-content">
      <h2>Search Results for: "{term}"</h2>
      {/* You can add actual search results here */}
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

function App() {
  const [term, setTerm] = useState("");
  return (
    <SearchTermContext.Provider value={{ term, setTerm }}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>
      </Router>
    </SearchTermContext.Provider>
  );
}

export default App;
