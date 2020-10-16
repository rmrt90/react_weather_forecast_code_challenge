import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './App.css';
import { Button, Card, Container, Grid } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios';
import cities from './cities';

function App(): JSX.Element {
  interface City {
    title: string;
    location_type: string;
    woeid: number;
    latt_long: string;
  }

  interface WeatherData {
    id: number;
    weather_state_name: string;
    weather_state_abbr: string;
    wind_direction_compass: string;
    created: string;
    applicable_date: string;
    min_temp: number;
    max_temp: number;
    the_temp: null;
    wind_speed: number;
    wind_direction: number;
    air_pressure: null;
    humidity: number;
    visibility: number;
    predictability: number;
  }

  const [selectedCity, setSelectedCity] = useState<City>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weatherData, setWeatherData] = useState<[WeatherData]>();

  const handleDateChange = (date: Date | null): void => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCityChange = (city: City | null): void => {
    if (city) {
      setSelectedCity(city);
    }
  };

  const getWeatherData = (): void => {
    if (selectedCity && selectedDate) {
      axios
        .get(
          `http://localhost:8080/api/getWeatherData/${
            selectedCity.woeid
          }/${selectedDate.getFullYear().toString()}/${(
            selectedDate.getMonth() + 1
          ).toString()}/${selectedDate.getDate().toString()}`
        )
        .then((response) => {
          setWeatherData([response.data[0]]);
        });
    }
  };

  const getTodayWeatherData = (): void => {
    if (selectedCity) {
      axios
        .get(
          `http://localhost:8080/api/getTodayWeatherData/${selectedCity.woeid}`
        )
        .then((response) => {
          setWeatherData(response.data.consolidated_weather);
        });
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="App">
        <header className="App-header">
          <h1>Weather Forecast</h1>
        </header>
        <body className="App-body">
          <Container style={{ padding: '5vh', backgroundColor: 'white' }}>
            <Grid container spacing={3}>
              <Grid item sm={12} md={12}>
                <h1>Select a city and a date</h1>
              </Grid>
              <Grid item sm={12} md={4} style={{ display: 'ruby' }}>
                <Autocomplete
                  id="combo-box-demo"
                  options={cities}
                  getOptionLabel={(option): string => option.title}
                  onChange={(event, value): void => handleCityChange(value)}
                  style={{ width: 225, marginTop: '10px' }}
                  renderInput={(params): React.ReactNode => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <TextField {...params} label="City" variant="outlined" />
                  )}
                />
              </Grid>
              <Grid item sm={12} md={4}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item sm={12} md={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={getWeatherData}
                >
                  Selected Date&apos;s weather
                </Button>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={getTodayWeatherData}
                >
                  Today&apos;s weather
                </Button>
              </Grid>
              {!!weatherData &&
                weatherData.length > 0 &&
                weatherData.map((wData: WeatherData) => (
                  <Grid item md={4}>
                    <Card style={{ textAlign: 'center' }}>
                      <h2>{wData.applicable_date}</h2>
                      <img
                        src={`https://www.metaweather.com/static/img/weather/png/64/${wData.weather_state_abbr}.png`}
                        alt=""
                      />
                      <h2>{wData.weather_state_name}</h2>
                      Max Temp: {wData.max_temp} <br />
                      Min Temp: {wData.min_temp} <br />
                      Humidity: {wData.humidity} <br />
                      Predictability: {wData.predictability} <br />
                      Air pressure: {wData.air_pressure} <br />
                      Wind Speed: {wData.wind_speed} <br />
                      Wind Direction: {wData.wind_direction_compass} <br />
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Container>
        </body>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default App;
