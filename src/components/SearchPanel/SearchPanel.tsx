import { useState, useEffect, useMemo, useCallback } from 'react';
import { WeatherCard } from '../weatherCard';
import useThrottledFunction from '../../hooks/useThrottledFunction';
import './styles.css';

export const SearchPanel = () => {
  const [city, setCity] = useState('');
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState();
  const [cities, setCities] = useState([]);
  const url = useMemo(
    () =>
      `https://referential.p.rapidapi.com/v1/city?lang=en&name=${city}&fields=iso_a2&limit=10`,
    [city]
  );

  const options = useMemo(() => {
    return {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'ed5b573779msh10424b7e1779214p134a5ajsnd19705800906',
        'X-RapidAPI-Host': 'referential.p.rapidapi.com',
      },
    };
  }, []);

  const loadCities = useCallback(async () => {
    if (city.length > 0) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const result = await response.json();
          setCities(result);
        } else throw new Error('Try again later');
      } catch (error) {
        console.error(error);
      }
    }
  }, [city, setCities, options, url]);

  const callbackFnToThrottle = useCallback(() => {
    loadCities();
  }, [loadCities]);

  const { throttledFn } = useThrottledFunction({
    callbackFn: callbackFnToThrottle,
    throttleMs: 1000,
  });

  useEffect(() => {
    throttledFn();
  }, [city, setCity, throttledFn]);

  async function loadData() {
    setErr(undefined);
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
          import.meta.env.VITE_REACT_APP_API_KEY
        }`
      );

      if (!response.ok) {
        const err = await response.json();
        setErr(err.message);
        throw new Error(err.message);
      }
      const data = await response.json();
      setData(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="panel">
      <div className="search">
        <input
          list="city-input"
          className="inp"
          name="city"
          type="text"
          placeholder="Enter a city name"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
        <datalist id="city-input">
          {cities?.map((city) => {
            return (
              <option value={city?.value}>{(city?.value, city?.iso_a2)}</option>
            );
          })}
        </datalist>
        <button className="btn" onClick={() => loadData()}>
          <svg
            className="searchIcon"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="28"
            height="28"
            viewBox="0 0 50 50">
            <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
          </svg>
        </button>
      </div>
      {isLoading && <div>loading ...</div>}
      {data && <WeatherCard data={data} />}
      {err && <div>{err}</div>}
    </div>
  );
};
