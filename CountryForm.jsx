// src/CountryForm.jsx
import React, { useState } from "react";
import { useCountry } from "./hooks";

const CountryForm = () => {
  const [name, setName] = useState("");
  const country = useCountry(name);

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="country name"
      />
      <CountryInfo country={country} />
    </div>
  );
};

const CountryInfo = ({ country }) => {
  if (country === null) {
    return <div>Type a country name to search</div>;
  }
  if (!country.found) {
    return <div>not found...</div>;
  }

  const c = country.data;
  const commonName = c.name?.common || c.name || c.toString?.();
  const capital = Array.isArray(c.capital) ? c.capital[0] : c.capital;
  const population = c.population;
  const flag = c.flags?.svg || c.flag || "";

  return (
    <div>
      <h3>{commonName}</h3>
      <div>capital {capital}</div>
      <div>population {population}</div>
      {flag && <img src={flag} alt={`flag of ${commonName}`} width="150" />}
    </div>
  );
};

export default CountryForm;
