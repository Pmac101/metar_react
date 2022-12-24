import React, {useState} from 'react'

//TODO: remove all commented console.logs
function App() {
    //TODO: instead of creating elements in functions, do 'useState' and create elements in return html like originally done
    //TODO: eliminate duplicate text when submitting new query without refreshing page
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const [rule, setRule] = useState('')

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

    function weatherIcon(weather) {
        let image = document.createElement('img')

        if (weather.clouds[0] && (weather.clouds[0].text === 'Few' || weather.clouds[0].text === 'Scattered')) {
            image.src = require('./assets/few_clouds_day.svg').default
            document.getElementsByClassName('weather')[0].appendChild(image)
        }
    }

    // retrieves local date/time
    function dateTime(localInfo) {
        let dateElement = document.createElement('p')
        let dataElement_text = document.createTextNode(`Local time/date: ${localInfo.current_time.substring(0,5)} ${localInfo.date}`)

        dateElement.appendChild(dataElement_text)
        document.getElementsByClassName('airport')[0].appendChild(dateElement)
        dateElement.style.fontSize = '1.2rem'
    }
    // ----------------------------------------End Functions----------------------------------------

    // takes user input and fetches JSON response for designated airport
    const searchAirport = (event) => {

        if (event.key === 'Enter') {
            fetch(`https://api.checkwx.com/metar/${location}/decoded?x-api-key=429d0470f1b747b4b9de564ff9`)
                .then((response) => response.json())
                .then(response => {
                    if (response.data[0]) {
                        // console.log(response.data[0])
                        // makes json data available for hook
                        setData(response.data[0])
                        return response.data[0]
                    }
                })
                .then(response => {
                    flightRule(response)
                    weatherIcon(response)
                    return response
                })
                .then( response => {
                    // ipgeolocation.io API: 30k requests per month, 1k daily. Used to retrieve local time
                    fetch(`https://api.ipgeolocation.io/astronomy?apiKey=eedd7b3a85c34b0ca7438dfaa288a358&lat=${response.station.geometry.coordinates[1]}&long=${response.station.geometry.coordinates[0]}`)
                        .then(response => response.json())
                        .then(response => {
                            dateTime(response)
                            // console.log('date/time: ' + response.date_time_txt)
                            // console.log('timezone: ' + response.timezone)
                        })

                    // console.log(response.station.geometry.coordinates)
                    // API call to openweathermap. Takes the coordinates from previous API and uses them to get other local data
                    // fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${response.station.geometry.coordinates[1]}&lon=${response.station.geometry.coordinates[0]}&appid=f77078a3b256ade5ae31b9e8ab8422c6`)
                    //     .then((response) => response.json())
                    //     .then(response => {
                    //
                    //     })
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
                    <p>{data.icao ? data.icao : null} - {data.station ? data.station.name : null}</p>
                    <p>{data.station ? data.station.location : null}</p>
                </div>
                <div className='weather'>
                    {data.temperature ? <h1>{data.temperature.fahrenheit}°F</h1> : null}
                </div>
            </section>
            {/*--------------------Bottom section--------------------*/}
            {/*TODO: need to fix this so it does not show upon initial page load*/}
            <section className='bottom'>
                <div className="bottom-header">
                    <h3>METAR</h3>
                    {data.raw_text ? <p className='bold'>{data.raw_text}</p> : null}
                </div>
                <div className="bottom-data">
                    <div className="flight-rules">
                        <p>Flight Rules</p>
                        {<p className='rule-color'>{rule}</p>}
                    </div>
                    <div className="wind">
                        <p>Wind</p>
                        {/*TODO: need to fix this to display 'none' when there is no wind*/}
                        {data.wind ? <p className='bold'>{data.wind.degrees}° at {data.wind.speed_kts} knots</p> : 'None'}
                    </div>
                    <div className="altimeter">
                        <p>Altimeter</p>
                        {data.barometer ? <p className='bold'>{data.barometer.hg} inHg</p> : null}
                    </div>
                    <div className="clouds">
                        <p>Clouds</p>
                        {data.clouds ? <p className='bold'>{data.clouds[0].text} {data.clouds[0].base_feet_agl}</p> : null}
                    </div>
                    <div className="dewpoint">
                        <p>Dewpoint</p>
                        {data.dewpoint ? <p className='bold'>{data.dewpoint.fahrenheit}°F</p> : null}
                    </div>
                    <div className="visibility">
                        <p>Visibility</p>
                        {data.visibility ? <p className='bold'>{data.visibility.miles}SM</p> : null}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;