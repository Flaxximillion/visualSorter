import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell} from 'recharts';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            activeIndex: 0
        };

        this.randomData = this.randomData.bind(this);
        this.bubbleSort = this.bubbleSort.bind(this);
    }

    randomData() {
        let i = 0;
        let randomData = [];

        do {
            i++;
            randomData.push({
                "Index": i,
                "Value": (Math.floor(Math.random() * 100) + 1)
            });
        } while (i < 20);

        this.setState({
            data: randomData
        })
    }

    bubbleSort() {
        let stateSave = this,
            swapped,
            initialIndex = 0,
            swapIndex = 0,
            maxIndex = this.state.data.length,
            data = this.state.data;

        this.refs.btn.setAttribute("disabled", "disabled");

        function swapController() {
            stateSave.setState({
                activeIndex: swapIndex + 1
            });
            let swapPromise = new Promise((resolve, reject) => {
                if (swapIndex < maxIndex - 1) {
                    if (data[swapIndex]["Value"] > data[swapIndex + 1]["Value"]) {
                        console.log("swapping");
                        let temp = data[swapIndex]["Value"];
                        data[swapIndex]["Value"] = data[swapIndex + 1]["Value"];
                        data[swapIndex + 1]["Value"] = temp;
                        swapped = true;
                        stateSave.setState({
                            data: data
                        });
                    }
                }
                setTimeout(function () {
                    resolve(swapped);
                }, 5)
            });

            swapPromise.then((ifSwapped) => {
                console.log(ifSwapped, swapIndex, initialIndex);
                if (swapIndex < maxIndex - 1) {
                    swapIndex++;
                    swapController();
                } else if (initialIndex < data.length - 1 && swapped) {
                    swapIndex = 0;
                    maxIndex--;
                    swapped = false;
                    initialIndex++;
                    swapController();
                } else {
                    stateSave.setState({
                        activeIndex: 0
                    });
                    stateSave.refs.btn.removeAttribute("disabled");
                }
            });
        }

        swapController();
    }

    render() {
        return (
            <section style={{textAlign: 'center'}}>

                <h1>Data Visualizer</h1>

                <Chart data={this.state.data} activeIndex={this.state.activeIndex}/>

                <div>
                    <button className="button" id="randomData" onClick={this.randomData}>Random Dataset</button>
                    <button className="button" id="sortData" ref="btn" onClick={this.bubbleSort}>Bubble Sort</button>
                </div>

            </section>
        );
    }
}

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={this.props.data}
                          margin={{top: 5, right: 30, left: 20, bottom: 5}}
                          maxBarSize={30}>
                    <XAxis dataKey="Index"
                           type="number"
                           domain={[1, 20]}
                           tickCount={20}
                           interval={0}
                           padding={{left: 20, right: 20}}/>
                    <YAxis domain={[0, 100]}/>
                    <CartesianGrid strokeDashArray="3 3"/>
                    <Bar dataKey="Value">
                        {
                            this.props.data.map((entry, index) =>(
                                <Cell key={`cell-${index}`} fill={this.props.activeIndex === index ? 'red' : 'black'}/>
                            ))
                        }
                    </Bar>
                    <Tooltip/>
                </BarChart>
            </ResponsiveContainer>
        )
    }
}

export default App;