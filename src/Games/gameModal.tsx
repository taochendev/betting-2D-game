import Draggable from "react-draggable";
import {DraggableCore} from "react-draggable";
import React from "react";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, YAxis} from "recharts";
import ProvablyFair from "./ProvablyFair";
import {currencies, toRuneScapeFormatFromDecimal} from "../Utility/currencies";
import "./GameModal.scss";

export const provablyFair = (
    currency: any,
    show: boolean,
    closeModal: any,
    clientSeed: any,
    changeSeed: any,
    setClientSeed: any,
    verifying: any,
): JSX.Element => {
    return (<Draggable>
        <div className={`ProvablyFairModal ${show && "active"}`} draggable="true">
            <div className="Modal-header">
                <p>Provably Fair</p>
                <span onClick={() => closeModal()}>&times;</span>
            </div>
            <div className="Modal_container">
                <div className="Fairness">
                    <ProvablyFair ref={r => {
                        // //@ts-ignore
                        // this.provablyFair = r
                    }} clientSeed={clientSeed} changeSeed={changeSeed}
                                  setClientSeed={setClientSeed}
                                  verifying={verifying}/>
                </div>
            </div>
        </div>
    </Draggable>);
}
export const gameModal = (
    currency: any,
    show: boolean,
    closeModal: any,
    resetData: any,
    wagered: number,
    earnings: number,
    wins: number,
    losses: number,
    showHistoryChart: boolean,
    winningsData: Array<any>,
): JSX.Element => {
    const wageredUnsigned = wagered < 0 ? (wagered * -1) : wagered;
    return (<Draggable>
            <div className={`modalhistory ${show && "active"}`} draggable="true">
                <div className="history-header">
                    <p>Live Stats</p>
                    <span onClick={() => closeModal()}>&times;</span>
                </div>
                <div className="history_container">
                    <div className="select">
                        <select className="history-select">
                            <option>All Time</option>
                            <option>1 Min</option>
                            <option>15 Min</option>
                            <option>1 Hour</option>
                        </select>
                        <div className="history-reset">
                            <img src="/refresh.svg" alt="" onClick={() => resetData()} />
                        </div>
                    </div>
                    <div className="first">
                        <div>
                            <p>Net Gain</p>
                            {earnings >= 0 ? <span className="success text-green">{currencies.get(currency)!!.symbol + currencies.get(currency)!!.format(earnings)}</span> :
                                <span className="success text-red">{currencies.get(currency)!!.symbol + currencies.get(currency)!!.format(earnings)}</span>}
                            <p>Wagered</p>
                            <span>{currencies.get(currency)!!.symbol + currencies.get(currency)!!.format(wageredUnsigned)}</span>
                        </div>
                        <div>
                            <p>Wins</p>
                            <span className="success">{wins}</span>
                            <p>Losses</p>
                            <span className="error">{losses}</span>
                        </div>
                    </div>
                    <div className="second">
                        {/* <span className="success">{this.state.gain}</span> */}
                        {
                            showHistoryChart &&
                            <HistoryChart winningsData={winningsData} />
                        }
                    </div>
                </div>
            </div>
        </Draggable >
    );
}

const HistoryChart = ({ winningsData }: { winningsData: Array<any> }) => {
    return (
        <ResponsiveContainer width='100%' height='100%' key={"chart-" + winningsData.length} aspect={3}>
            <AreaChart
                width={320} height={100}
                data={winningsData}
                style={winningsData.length > 1 && { marginLeft: "-20px" }}
            >
                <defs>
                    <linearGradient id="color" x1="0" y1="0">
                        {
                            winningsData.length > 0 &&
                            winningsData.map((ele, id) => {
                                    if (id) {
                                        if (ele.earnings > 0) {

                                            if (winningsData[id - 1].earnings >= 0)
                                                return <stop offset={`${100 * (id + 1) / winningsData.length}%`} stopColor="#1DB954" stopOpacity={0.5} />
                                            else {
                                                return (
                                                    <>
                                                        <stop offset={`${100 * (id) / winningsData.length}%`} stopColor="#f34223" stopOpacity={0.5} />
                                                        <stop offset={`${100 * (id) / winningsData.length}%`} stopColor="#1DB954" stopOpacity={0.5} />
                                                    </>
                                                )
                                            }

                                        } else {

                                            if (winningsData[id - 1].earnings <= 0)
                                                return <stop offset={`${100 * (id + 1) / winningsData.length}%`} stopColor="#f34223" stopOpacity={0.5} />
                                            else {
                                                return (
                                                    <>
                                                        <stop offset={`${100 * (id) / winningsData.length}%`} stopColor="#1DB954" stopOpacity={0.5} />
                                                        <stop offset={`${100 * (id) / winningsData.length}%`} stopColor="#f34223" stopOpacity={0.5} />
                                                    </>
                                                )
                                            }
                                        }
                                    }
                                }
                            )
                        }
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" vertical={false} />

                {
                    winningsData.length > 1 &&
                    <YAxis tick={{ fill: '#B7BCD2FF', fontSize: 8 }} tickFormatter={tick => {
                        return toRuneScapeFormatFromDecimal(tick);
                    }} >
                        {/* <Label value={Math.min(...winningsData.map(ele => ele.earnings)).toFixed(0)} position="insideBottomLeft" style={{ color: 'white' }} stroke="white" /> */}
                    </YAxis>
                }

                <Tooltip content={
                    //@ts-ignore
                    <CustomTooltip />
                } />
                <Area type="natural" dataKey="earnings" stroke="url(#color)" strokeWidth={2} fill="url(#color)" />
            </AreaChart>
        </ResponsiveContainer>
    )
}

// @ts-ignore
const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="ChartTooltip">
                <ul className="Headings">
                    <li>
                        <p>Time</p>
                    </li>
                    <li>
                        <p>Net Gain</p>
                    </li>
                </ul>
                <ul className="Values">
                    <li>
                        <p>{new Date(label).toString().substr(16, 8)}</p>
                    </li>
                    <li>
                        <p>{toRuneScapeFormatFromDecimal(payload[0].value)}</p>
                    </li>
                </ul>
            </div>
        );
    }

    return null;
};