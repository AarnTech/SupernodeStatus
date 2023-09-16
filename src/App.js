//import React, { Component } from 'react';
//import { Route } from 'react-router';
//import { Layout } from './components/Layout';
//import { Home } from './components/Home';
////import { FetchData } from './components/FetchData';
////import { Counter } from './components/Counter';

//import './custom.css'

//export default class App extends Component {
//  static displayName = App.name;

//  render () {
//    return (
//      <Layout>
//        <Route exact path='/' component={Home} />
//            {/* <Route path='/counter' component={Counter} />
//            <Route path='/fetch-data' component={FetchData} /> */}
//      </Layout>
//    );
//  }
//}

import React from 'react';
import './custom.css';
//import { Button } from '@material-ui/core';
//{ Button } from 'semantic-ui-react';

// Aarne Andreas�n //
export default class Supernode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filteredData: [],
            height: null,
            length: null,
            address: '',
            publicId: '',
            isLoadingData: false,
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    addressChanged(e) {
        this.setState({ address: e.target.value });
    }
    publicIdChanged(e) {
        this.setState({ publicId: e.target.value });
    }

    async fetchData() {
        this.setState({ data: [] });
        this.setState({ noData: '' });
        this.setState({ isLoadingData: true });

        try {
            let response = await fetch("/debug/supernode_list/0");
            //console.log("Response = ", response);
            let data_from_server = [];
            if (response.status !== 404) {
                data_from_server = await response.json();
            }
            this.setState({ data: data_from_server.result.items });
            this.setState({ height: data_from_server.result.height });
            this.setState({ length: data_from_server.result.items.length, isLoadingData: false });
            //console.log("length = ", this.state.length);
            //console.log("Data = ", this.state.data);
        }
        catch (error) {
            console.log("Virhe", error);
        }
    }
    async fetchFilteredData() {
        // const tyyli = { border: "1px solid grey", textAlign: "left", fontSize: 10, background: "gray" }
        this.setState({ data: [] });
        this.setState({ noData: '' });
        //console.log("Address = ", this.state.address);
        this.setState({ isLoadingData: true });
        let filterAddress = this.state.address;
        try {
            let response = await fetch("/debug/supernode_list/0");
            //console.log("Response = ", response);
            let data_from_server = [];
            if (response.status !== 404) {
                data_from_server = await response.json();
            }
            //this.setState({ data: data_from_server.result.items, isLoadingData: false });
            this.setState({ height: data_from_server.result.height });
            this.setState({ length: data_from_server.result.items.length, isLoadingData: false });
            //console.log("Data = ", this.state.data);
            //console.log("length = ", this.state.length);
            //console.log("Address = ", this.state.address);
            this.setState({
                data: data_from_server.result.items.filter(function (item) {
                    return item.Address.includes(filterAddress);
                })
            });
            // if (this.state.data.length === 0) {
            //     this.setState({noData:<tbody><tr><td colSpan="8"style={tyyli}>No supernodes found with this address</td></tr></tbody>});
            // }
            //console.log("FilteredData = ", this.state.data);
            //console.log("FilteredData = ", this.state.filteredData);
            //this.setState({ data: this.state.filteredData })
        }
        catch (error) {
            console.log("Virhe", error);
        }
    }

    render() {
        //const tyyli = { border: "2px solid grey", textAlign: "left", fontSize: 12, background: "#282c34", padding: 2, width: "100 %" }

        let lataaData;
        const { isLoadingData } = this.state;
        if (isLoadingData) {
            lataaData = <tbody><tr><td className="zero" colSpan="8">Loading...</td></tr></tbody>;
        }

        let noData;
        if (this.state.data.length === 0 && this.state.isLoadingData === false) {
            noData = <tbody><tr><td className="zero" colSpan="8">No supernodes found</td></tr></tbody>;
        }

        //let data2 = this.state.data
        //    .sort((a, b) => (a.Address > b.Address) ? 1 : -1);           

        let rows = this.state.data.map((item, i) => {
            return <tbody key={i}>
                <tr>
                    <td className="one">{i + 1}</td>
                    <td className="ellipsis first"><span>{item.Address}</span></td>
                    <td className="ellipsis second"><span>{item.PublicId}</span></td>
                    <td className="ellipsis third"><span>{(item.StakeAmount / 10000000000).toFixed(0)}</span></td>
                    {/*<td className="ellipsis third"><span>{item.StakeFirstValidBlock}</span></td>*/}
                    <td className="ellipsis third"><span>{item.StakeExpiringBlock}</span></td>
                    <td className="ellipsis third"><span>{(Math.floor((((item.StakeExpiringBlock - this.state.height) * 2) * 60) / 86400)) + "d " + (Math.floor(((((item.StakeExpiringBlock - this.state.height) * 2) * 60) % 86400) / 3600)) + "h " + (((((((item.StakeExpiringBlock - this.state.height) * 2) * 60) % 86400) % 3600) / 60)) + "m"}</span></td>
                    <td className="ellipsis third"><span>{(item.LastUpdateAge / 60).toFixed(0) + "m ago"}</span></td>
                    {/* <td>{item.BlockchainBasedListTier}</td>
                    <td>{item.AuthSampleBlockchainBasedListTier}</td>
                    <td>{item.IsAvailableForAuthSample}</td>
                    <td>{item.IsStakeValid}</td> */}
                </tr>
            </tbody>
        });
        return (
            <div style={{ marginLeft: 40, marginRight: 40, marginBottom: 40, marginTop: 40 }}>
                <header className="App-header">
                    <div>
                        <div>
                            <h4>Graft Supernode status</h4>
                            <h6>Blockhain height: {this.state.height}</h6>
                            <h6>Supernodes online: {this.state.length}</h6>
                        </div>
                        <br />
                        <div>
                            <input style={{ width: 684 }} type="text" id="Address" placeholder="Address" value={this.state.address} onChange={(e) => this.addressChanged(e)} />
                            <br />
                            {/* <input type="text" id="PublicId" placeholder="PublicId" value={this.state.publicId} onChange={(e) => this.publicIdChanged(e)} />
                        <br /> */}
                        </div>
                        <br />
                        <div>
                            <button onClick={() => this.fetchFilteredData()}>Search</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={() => this.fetchData()}>Show all</button>
                        </div>
                        <br />
                    </div>
                    <div className="tablediv">
                        <table>
                            <thead>
                                <tr>
                                    <th className="one">Id</th>
                                    <th className="two">Address</th>
                                    <th className="three">Public Id</th>
                                    <th className="four">Stake Amount</th>
                                    {/*<th className="four">First Block</th>*/}
                                    <th className="four">Expiring Block</th>
                                    <th className="four">Stake Expires</th>
                                    <th className="four">Last Update</th>
                                    {/* <th>Blockchain Based List Tier</th>
                                <th>Auth Sample Blockchain Based List Tier</th>
                                <th>Is Available For Auth Sample</th>
                                <th>Is Stake Valid</th> */}
                                </tr>
                            </thead>
                            {rows}
                            {lataaData}
                            {noData}
                        </table>
                    </div>
                    {/* <br />
                <div style={{ fontSize: 11 }}>
                    <h6>If you find SupernodeStatus useful, please buy me a beer :)</h6>
                    <p>GRFT: G5DYgKDX2MPYnPZDeUDjfyJVJXS9ALRJQBCQSrudNJLQ9GtYpSTforkfQobNQzPiLpeDrfS9gvWQaVBbnNUMJZU2HDfC5ma<br />
                    LOKI: LDN2qvjShw89w1LtiFY91AHGVH4XtbEM8FYb92DH75bKR2szRAWB8h81JXE3CHthh3JBRNX6tLzJqCzoKWgEmWroSCsyztD<br />
                    XMR: 46WKFJuGdqRJ698Amt2TvcAqLnBFmrUYSdD4CDbEwwCR4XFnz9uAhUmjPpSR3FxaRyKVPDQv7pASQ2XcmEJF832YGsvAdHh<br />
                    BTC: 12mYwahXfkMmyzbsafVybAgZ7p2Dxc8x4K</p>
                </div> */}
                </header>
            </div>
        );
    }
}