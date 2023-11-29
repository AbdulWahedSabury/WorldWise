// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import ButtonBack from "./ButtonBack";
import { useUrlPosition } from "../contexts/UseUrlPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  const [lat, lng] = useUrlPosition();
  const [codingPositionLoading, setCodingPositionLoading] = useState(false);
  const [codingPositionError, setCodingPositionError] = useState(false);
  const [emoji, setEmoji] = useState("");

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const { CreateCity, isLoading } = useCities();
  useEffect(
    function () {
      async function fetchCity() {
        try {
          setCodingPositionLoading(true);
          setCodingPositionError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error("That does't seem a city click somewhere else");
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (e) {
          setCodingPositionError(e.message);
        } finally {
          setCodingPositionLoading(false);
        }
      }
      fetchCity();
    },
    [lat, lng]
  );

  async function handSubmit(e) {
    e.preventDefault();
    const newCity = {
      cityName,
      country,
      date,
      emoji,
      notes,
      position : {
        lat,lng
      }
    }
   await CreateCity(newCity);
   navigate('/app');
  }

  if (codingPositionLoading) return <Spinner />;
  if (codingPositionError) return <Message message={codingPositionError} />;
  if (!lat && !lng) return <Message message='Start by clicking on the map.' />;
  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker 
        id="date"
        selected={date}
        onChange={(date) => setDate(date)}
          />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
