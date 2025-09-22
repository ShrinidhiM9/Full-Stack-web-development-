import React, { useState, useEffect } from "react";
import axios from "axios";

const Country = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital?.[0]}</p>
    <p>Area: {country.area} km²</p>
    <h3>Languages:</h3>
    <ul>
      {country.languages && Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
    </ul>
    <img src={country.flags?.png} alt={`Flag of ${country.name.common}`} width="150" />
  </div>
);

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [showCountry, setShowCountry] = useState(null);

  useEffect(() => {
    if (search) {
      axios.get(`https://restcountries.com/v3.1/name/${search}`)
        .then(res => setCountries(res.data))
        .catch(() => setCountries([]));
    } else {
      setCountries([]);
    }
  }, [search]);

  const handleShow = (country) => setShowCountry(country);

  let content;

  if (showCountry) {
    content = <Country country={showCountry} />;
  } else if (countries.length > 10) {
    content = <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    content = countries.map(c => (
      <div key={c.cca3}>
        {c.name.common} <button onClick={() => handleShow(c)}>Show</button>
      </div>
    ));
  } else if (countries.length === 1) {
    content = <Country country={countries[0]} />;
  } else {
    content = <p>No matches</p>;
  }

  return (
    <div>
      <h1>Country Info</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search countries"
      />
      {content}
    </div>
  );
};

export default App;
