import React, { useState, useEffect } from "react";
import axios from "axios";


const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    if (!country.capital) return;
    const capital = country.capital[0];
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
      .then(res => setWeather(res.data))
      .catch(() => setWeather(null));
  }, [country, api_key]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital?.[0]}</p>
      <p>Area: {country.area} km²</p>
      <h3>Languages:</h3>
      <ul>
        {country.languages && Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags?.png} alt={`Flag of ${country.name.common}`} width="150" />

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Wind: {weather.wind.speed} m/s</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
    </div>
  );
};


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
