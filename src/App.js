import React, {useState} from 'react'

//TODO: remove all commented console.logs
function App() {
    //TODO: instead of creating elements in functions, do 'useState' and create elements in return html like originally done
    //TODO: eliminate duplicate text when submitting new query without refreshing page
    //TODO: add some effects when data loads
    const [metarData, setMetarData] = useState({})
    const [location, setLocation] = useState('')
    const [rule, setRule] = useState('')
    const [icon, setIcon] = useState('')
    const [weather, setWeather] = useState('')
    const [time, setTime] = useState('')

    // ----------------------------------------Functions----------------------------------------

    // pass JSON response as parameter and function will return the current flight rule
    function flightRule(response) {
        setRule(response.flight_category)
        let element = document.getElementsByClassName('rule-color')

        if (response.flight_category === 'VFR') {
            element[0].classList.add('vfr')
        }
        else if (response.flight_category === 'MVFR') {
            element[0].classList.add('mvfr')
        }
        else if (response.flight_category === 'IFR') {
            element[0].classList.add('ifr')
        }
        else if (response.flight_category === 'LIFR') {
            element[0].classList.add('lifr')
        }
    }

    // checks checkwx API response for current cloud condition and also checks ipgeolocation API for current sunrise/sunset time. Returns appropriate image based on response data
    function weatherIcon(weather) {
        setIcon(weather.current.weather[0].icon)
    }

    // converts unit timestamp to human-readable format
    function timeConversion(unix) {
        const milliseconds = unix.current.dt * 1000
        const dateObject = new Date(milliseconds)
        const readableTime = dateObject.toLocaleString()
        setTime(readableTime)
    }
    // ----------------------------------------End Functions----------------------------------------

    // takes user input and makes 2 API calls to retrieve METAR and weather data
    const searchAirport = (event) => {

        if (event.key === 'Enter') {
            // Call to CheckWX API - retrieves METAR data
            fetch(`https://api.checkwx.com/metar/${location}/decoded?x-api-key=429d0470f1b747b4b9de564ff9`)
                .then((response) => response.json())
                .then(response => {
                    if (response.data[0]) {
                        setMetarData(response.data[0])
                        return response.data[0]
                    }
                })
                .then(response => {
                    flightRule(response)
                    return response
                })
                .then( response => {
                    // API call to openweathermap. Airport coordinates from CheckWX API response are used to retrieve current weather conditions
                    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${response.station.geometry.coordinates[1]}&lon=${response.station.geometry.coordinates[0]}&exclude=minutely&units=imperial&appid=f77078a3b256ade5ae31b9e8ab8422c6`)
                        .then((response) => response.json())
                        .then(response => {
                            setWeather(response.current.temp.toFixed(0))
                            weatherIcon(response)
                            timeConversion(response)
                        })
                })
        }

    }

    return (
        <div className="app">
            {/*--------------------Search Bar--------------------*/}
            <section className="search">
                <input
                    value={location}
                    onChange={event => setLocation(event.target.value)}
                    onKeyPress={searchAirport}
                    placeholder='Enter Airport ID'
                    type='text'/>
            </section>
            {/*--------------------Middle section--------------------*/}
            <section className='top'>
                <div className='airport'>
                    <h2>{metarData.icao ? metarData.icao +' -' : null} {metarData.station ? metarData.station.name : null}</h2>
                    <h2>{metarData.station ? metarData.station.location : null}</h2>
                    <h3 className='time'>{time}</h3>
                </div>
                <div className='weather'>
                    {icon !== '' ? <img className='weather-icon' src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="weather icon"></img> : null}
                    {weather !== '' ? <h3>{weather}°F</h3> : null}
                </div>
            </section>
            {/*--------------------Bottom section--------------------*/}
            {/*TODO: need to fix this so it does not show upon initial page load*/}
            <section className='bottom'>
                <div className="bottom-header">
                    <h3>METAR</h3>
                    {metarData.raw_text ? <p className='bold'>{metarData.raw_text}</p> : null}
                </div>
                <div className="bottom-data">
                    <div className="flight-rules">
                        <p>Flight Rules</p>
                        {<p className='rule-color'>{rule}</p>}
                    </div>
                    <div className="wind">
                        <p>Wind</p>
                        {/*TODO: need to fix this to display 'none' when there is no wind*/}
                        {metarData.wind ? <p className='bold'>{metarData.wind.degrees}° at {metarData.wind.speed_kts} knots</p> : 'None'}
                    </div>
                    <div className="altimeter">
                        <p>Altimeter</p>
                        {metarData.barometer ? <p className='bold'>{metarData.barometer.hg} inHg</p> : null}
                    </div>
                    <div className="clouds">
                        <p>Clouds</p>
                        {metarData.clouds ? <p className='bold'>{metarData.clouds[0].text} {metarData.clouds[0].base_feet_agl}</p> : null}
                    </div>
                    <div className="dewpoint">
                        <p>Dewpoint</p>
                        {metarData.dewpoint ? <p className='bold'>{metarData.dewpoint.fahrenheit}°F</p> : null}
                    </div>
                    <div className="visibility">
                        <p>Visibility</p>
                        {metarData.visibility ? <p className='bold'>{metarData.visibility.miles}SM</p> : null}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;