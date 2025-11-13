import React from "react";
import {currencies} from "../Utility/currencies";

export const cryptoDefaults = (currency: string, update: any) => {
    const currencie = currencies.get(currency)!!
    const crypto = currencie.cryptoCurrency
    if (crypto) {
        const wager = currencie.fromDollar ? currencie.fromDollar(0.02, currencie.dollarValue!!) : undefined
        if (wager) {
            update({cryptoWagerAmount: wager});
        }
    }
}

export const getWagerableBalance = (currency: string, balance: any) => {
    const currencie = currencies.get(currency)!!
    const crypto = currencie.cryptoCurrency
    if (crypto) {
        return balance * currencie.usdValue!!
    }
    return balance
}

export const formatBetAmountHeader = (currency: string) => {
    const currencie = currencies.get(currency)!!
    const crypto = currencie.cryptoCurrency
    if (crypto) {
        return 'Bet Amount (USD)'
    }
    return 'Bet Amount'
}

export const formatProfitOnWinHeader = (currency: string) => {
    const currencie = currencies.get(currency)!!
    const crypto = currencie.cryptoCurrency
    if (crypto) {
        return `Profit on Win (${currency})`
    }
    return 'Profit on Win'
}

export const formatProfitOnWinRawValue = (currency: string, wagerAmount: number) => {
    const currencie = currencies.get(currency)!!
    const crypto = currencie.cryptoCurrency
    if (crypto) {
        return currencie.symbol + currencie.format(currencie.fromDollar ? currencie.fromDollar(wagerAmount, currencie.usdValue!!) : wagerAmount)
    }
    return currencie.symbol + currencie.format(wagerAmount)
}

export const formatProfitOnWinValue = (currency: string, wagerAmount: number) => {
    const currencie = currencies.get(currency)!!
    const crypto = currencie.cryptoCurrency
    if (crypto) {
        return '$' + (wagerAmount.toFixed(2));
    }
    return currencie.symbol + currencie.format(wagerAmount)
}

export const formatBetAmount = (currency: string, wagerAmount: any) => {
    const currencie = currencies.get(currency)!!
    const crypto = currencie.cryptoCurrency
    if (crypto) {
        return (currencie.symbol + currencie.format(currencie.fromDollar ? currencie.fromDollar(wagerAmount, currencie.usdValue!!) : wagerAmount))
    }
    return (currencie.symbol + currencie.format(wagerAmount))
}

export const getAmountInput = (currency: string, wagerAmount: any, balance: any, update: any) => {
    const currencie = currencies.get(currency)!!
    const crypto = currencie.cryptoCurrency
    let img = currencie.img
    if (crypto) {
        img = currencies.get('USD')!!.img
    }
    let wagerableBalance = getWagerableBalance(currency, balance)
    return (<>
        <div className="Value">
            <div className="ValueIcon" key={"wagered-" + wagerAmount}>
                <input type="number" step="1000" min={10000} max={100000000}
                       key={wagerAmount} onChange={(e: any) => {
                    const wager = currencie.fromDollar ? currencie.fromDollar(Number(e.target.value), currencie.dollarValue!!) : undefined
                    update(crypto ? {
                        wagerAmount: Number(e.target.value),
                        cryptoWagerAmount: wager,
                        skipUpdate: true
                    }:{
                        wagerAmount: Number(e.target.value),
                        skipUpdate: true
                    })
                }} defaultValue={wagerAmount}/>
                {/*}} defaultValue={wagerAmount.toFixed(2)}/>*/}
            </div>
            <img src={`/currencies/${img}`} className="Currency"/>
        </div>
        <div className="Action" onClick={() => {
            if (wagerAmount > 0) {
                const wager = !crypto ? 0 : (currencie.fromDollar ? currencie.fromDollar(Number(wagerAmount / 2), currencie.dollarValue!!) : undefined)
                update(crypto ? {wagerAmount: wagerAmount / 2, cryptoWagerAmount: wager}:{wagerAmount: wagerAmount / 2})
            }
        }}>½
        </div>
        <a className="ValueDivider"></a>
        <div className="Action" onClick={() => {
            if (wagerAmount > 0 && wagerAmount * 2 < wagerableBalance) {
                const wager = !crypto ? 0 : (currencie.fromDollar ? currencie.fromDollar(Number(wagerAmount * 2), currencie.dollarValue!!) : undefined)
                update(crypto ? {wagerAmount: wagerAmount * 2, cryptoWagerAmount: wager}: {wagerAmount: wagerAmount * 2})
            }
        }}>2x
        </div>
        <a className="ValueDivider"></a>
        <div className="Action" onClick={() => {
            if (balance > 0) {
                const wagerable = !crypto ? 0 : (currencie.fromDollar ? currencie.fromDollar(wagerableBalance, currencie.dollarValue!!) : undefined)
                update(crypto ? {wagerAmount: wagerableBalance, cryptoWagerAmount: wagerable}: {wagerAmount: balance})
            }
        }}>max
        </div>

    </>)
}