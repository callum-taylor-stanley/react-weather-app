import React from "react";
import ReactDOM from "react-dom";
import './assets/css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Structure of returned data object
    {coord: {lat: Int, lon: Int},
    weather: [{
        id: Int,
        main: String,
        description: String,
        icon: String
    }],
    base: String,
    main: {
        temp: Int,
        feels_like: Int,
        temp_min: Int,
        temp_max: Int,
        pressure: Int,
        humidity: Int
    },
    visibility: Int,
    wind: {
        speed: Int,
        deg: Int
    },
    clouds: {
        all: Int
    },
    dt: Int,
    sys: {
        type: Int,
        id: Int,
        country: String,
        sunrise: Int,
        sunset: Int
    },
    timezone: Int,
    id: Int,
    name: String,
    cod: Int}
 */

class Weather extends React.Component {
    initialState = {
        results: {
            error: {
                code: null,
                message: null
            },
            data: {
                coord: {lat: 0, lon: 0},
                weather: [{
                    id: 0,
                    main: "",
                    description: "",
                    icon: ""
                }],
                base: "",
                main: {
                    temp: 0,
                    feels_like: 0,
                    temp_min: 0,
                    temp_max: 0,
                    pressure: 0,
                    humidity: 0
                },
                visibility: 0,
                wind: {
                    speed: 0,
                    deg: 0
                },
                clouds: {
                    all: 0
                },
                dt: 0,
                sys: {
                    type: 0,
                    id: 0,
                    country: "",
                    sunrise: 0,
                    sunset: 0
                },
                timezone: 0,
                id: 0,
                name: "",
                cod: 0
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    isError = () => {
        return this.state.results.error.code !== null && this.state.results.error.code !== 200;
    }

    updateResults = (uResults) => {
        this.setState({
            results: uResults
        });
    }

    resetState = () => {
        this.setState(this.initialState);
    }

    render() {
        return (
            <div>
                {this.isError() &&
                    <div className="search-error alert alert-danger">
                            <strong>Error!</strong> <span>Sorry, an error occurred fetching the weather forecast.</span>
                            <span>Error code: {this.state.results.error.code}</span>
                            <span>Error message: {this.state.results.error.message}</span>
                    </div>
                }

                <div className="main">
                    <Search updateResults={this.updateResults}  resetState={this.resetState}/>

                    {!this.isError() && 
                        <div>
                            <Results results={this.state.results}/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

class Results extends React.Component {
    isEmptyData = () => {
        return this.props.results.data.cod === 0;
    }

    render() {
        return (
            <div>
                {!this.isEmptyData() && 
                <div>
                    <h1>{this.props.results.data.name}</h1>
                    <p>Co-ordinates (Latitude, Longitude) - {this.props.results.data.coord.lat}, {this.props.results.data.coord.lon}</p>
                </div>
                }
            </div>
        );
    }
}

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: '',
        };
        this.updateCity = this.updateCity.bind(this);
        this.searchByCity = this.searchByCity.bind(this);
    }

    updateCity = (e) => {
        this.setState({city: e.target.value});
        //this.props.resetState();
    }

    searchByCity = () => {
        this.props.resetState();

        const apiKey = '<<API_KEY>>';
        const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + this.state.city + '&APPID=' + apiKey;

        fetch(url)
            .then(res => res.json())
            .then((response) => {
                if (response.cod !== 200) {
                    console.log({cod: response, message: response.message});
                    throw new ResponseError(response.cod, response.message);
                }
                    
                this.props.updateResults({
                    error: {
                        code: null,
                        message: null
                    },                    
                    data: response
                });
            })
            .catch((response) => {
                this.props.updateResults({
                    error: {
                        code: response.code,
                        message: response.message
                    },
                    data: null
                });
            })
    }

    render() {
        return (
            <div>
                Enter a city: <input type="text"  onChange={this.updateCity} />
                <input type="button" value="Submit" onClick={this.searchByCity} />
            </div>
        );
    }
}

class ResponseError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}

ReactDOM.render(
    <Weather />,
    document.getElementById('root')
);