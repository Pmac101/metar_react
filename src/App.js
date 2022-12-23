import React, {useState} from 'react'


function App() {
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')

    // pass JSON response as parameter and function will return the current flight rule
    function flightRule(response) {
        let flightStatus_paragraph = document.createElement('p')

        if (response.flight_category === 'VFR') {
            let flightStatus_text = document.createTextNode('VFR')
            flightStatus_paragraph.appendChild(flightStatus_text)
            document.getElementsByClassName('flight-rules')[0].appendChild(flightStatus_paragraph)
            flightStatus_paragraph.style.color = '#1CC115'
        }
        else if (response.flight_category === 'MVFR') {
            let flightStatus_text = document.createTextNode('MVFR')
            flightStatus_paragraph.appendChild(flightStatus_text)
            document.getElementsByClassName('flight-rules')[0].appendChild(flightStatus_paragraph)
            flightStatus_paragraph.style.color = '#2CA4CA'
        }
        else if (response.flight_category === 'IFR') {
            let flightStatus_text = document.createTextNode('IFR')
            flightStatus_paragraph.appendChild(flightStatus_text)
            document.getElementsByClassName('flight-rules')[0].appendChild(flightStatus_paragraph)
            flightStatus_paragraph.style.color = '#E31111'
        }
        else if (response.flight_category === 'LIFR') {
            let flightStatus_text = document.createTextNode('LIFR')
            flightStatus_paragraph.appendChild(flightStatus_text)
            document.getElementsByClassName('flight-rules')[0].appendChild(flightStatus_paragraph)
            flightStatus_paragraph.style.color = '#753098'
        }
    }

    function weatherIcon(weather) {
        let image = document.createElement('img')


        if (weather.clouds[0].text === 'Few' || weather.clouds[0].text === 'Scattered') {
            console.log('few clouds')
            image.src = require('./assets/few_clouds_day.svg').default
            document.getElementsByClassName('temperature')[0].appendChild(image)
        }
    }

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
            <section className='bottom'>
                <div className="bottom-header">
                    <h3>METAR - {location.toUpperCase()}</h3>
                    {data.observed ? <p className='bold'>{data.observed}</p> : null}
                </div>
                <div className="bottom-data">
                    <div className="flight-rules">
                        <p>Flight Rules</p>
                    </div>
                    <div className="wind">
                        <p>Wind</p>
                        {data.wind ? <p className='bold'>{data.wind.degrees}° at {data.wind.speed_kts} knots</p> : null}
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