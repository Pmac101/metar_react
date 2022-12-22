import React, {useState} from 'react'


function App() {
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')

    const searchAirport = (event) => {

        if (event.key === 'Enter') {

            fetch(`https://api.checkwx.com/metar/${location}/decoded?x-api-key=429d0470f1b747b4b9de564ff9`)
                .then((response) => response.json())
                .then(response => {
                    if (response.data[0]) {
                        console.log(response.data[0])
                        // makes json data available for hook
                        setData(response.data[0])

                        if (response.data[0] && response.data[0].flight_category === 'VFR') {

                        }
                    }
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
                <div className='temperature'>
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
                        {data.flight_category ? <p className='bold'>{data.flight_category}</p> : null}
                        <p>Flight Rules</p>
                    </div>
                    <div className="wind">
                        {data.wind ? <p className='bold'>{data.wind.degrees}° at {data.wind.speed_kts} knots</p> : null}
                        <p>Wind</p>
                    </div>
                    <div className="altimeter">
                        {data.barometer ? <p className='bold'>{data.barometer.hg} inHg</p> : null}
                        <p>Altimeter</p>
                    </div>
                    <div className="clouds">
                        {data.clouds ? <p className='bold'>{data.clouds[0].text} {data.clouds[0].base_feet_agl}</p> : null}
                        <p>Clouds</p>
                    </div>
                    <div className="dewpoint">
                        {data.dewpoint ? <p className='bold'>{data.dewpoint.fahrenheit}°F</p> : null}
                        <p>Dewpoint</p>
                    </div>
                    <div className="visibility">
                        {data.visibility ? <p className='bold'>{data.visibility.miles}SM</p> : null}
                        <p>Visibility</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;