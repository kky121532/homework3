import React, { Component } from 'react';
import Axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

class App extends Component {
    state = {
        birthday: '',
        data: '',
    }

    handleChange = e => {
        const {name, value} = e.target;

        this.setState({
            [name]: value,
        });
    }

    getLotto = () => {
        let lottoData;

        const arrayJoin = array => {
            let st = array.join(' ');

            return st;
        }

        Axios.get('http://askat.me:8000/api/lotto')
            .then(response => {
                lottoData = arrayJoin(response.data);
                
                this.setState({
                    data: lottoData,
                });
            })
            .catch(error => {
                alert('oooops!');
            });
    }

    getFortune = () => {
        this.state.birthday == '' ?
            alert('생일을 입력해주세요')
            : Axios.get('http://askat.me:8000/api/fortune/' + this.state.birthday)
                .then(response => {
                    this.setState({
                        data: response.data,
                    });
                })
                .catch(error => {
                    alert('oooops!');
                });
    }

    getBad = () => {
        Axios.get('http://askat.me:8000/api/bad')
            .then(response => {
                this.setState({
                    data: response.data,
                });
            })
            .catch(error => {
                alert('oooops!');
            });
    }

    getSlow = () => {
        const cache = setupCache({
            maxAge: 15 * 60 * 1000
        })

        const api = Axios.create({
            adapter: cache.adapter
        })
        
        api({
            url: 'http://askat.me:8000/api/slow',
            method: 'get'
        }).then(async (response) => {
            console.log(response.request.fromCache);
            this.setState({
                number: response.data,
            });
        })
    }

    render() {
        // const ai = () => {
        //     Axios.get('http://askat.me:8000/api/slow')
        //         .then(response => {
        //             console.log(response)
        //         })
        // }
        // ai();

        const {birthday} = this.state;
        
        return (
            <div>
                <input type="text" name="birthday" value={birthday} onChange={this.handleChange} placeholder="YYYY-MM-DD" />
                <button type="button" onClick={this.getLotto}>로또 얻기</button>
                <button type="button" onClick={this.getFortune}>생일 얻기</button>
                <button type="button" onClick={this.getBad}>BAD</button>
                <button type="button" onClick={this.getSlow}>Slow</button>

                <br />
                {this.state.data}
                {this.state.number}
            </div>
        );
    }
}

export default App;
