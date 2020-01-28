import React from "react";
import ReactDOM from "react-dom";

class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            results: null
        });
    }

    updateResults = (results) => {
        this.setState({
            results: results
        });
    }

    render() {
        return (
            <div>
                <Search updateResults={this.updateResults}  results={this.state.results}/>
                <Results updateResults={this.updateResults}  results={this.state.results}/>
            </div>
        );
    }
}

class Results extends React.Component {
    updateResults = (results) => {
        this.props.updateResults(results);
    }

    render() {
        return (
            <div>
                {this.props.results}
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

    updateResults = (results) => {
        this.props.updateResults(results);
    }

    updateCity = (e) => {
        this.setState({city: e.target.value});
    }

    searchByCity = () => {
        const apiKey = '';
        const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + this.state.city + '&APPID=' + apiKey;

        fetch(url)
            .then(res => res.json())
            .then(
                (results) => {
                    this.props.updateResults(JSON.stringify(results));
                },
                (error) => {
                    console.log("ruh roh");
                }
            )
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

ReactDOM.render(
    <Weather />,
    document.getElementById('root')
);