export type Currency = {
    img: string
    symbol: string
    backdropIcon: string
    cryptoCurrency?: boolean
    dollarValue?: number
    usdValue?: number
    format: (value: number, setting?: number, exact?: boolean) => string
    formatNoLabel: (value: number, setting?: number, exact?: boolean) => string
    fromDollar?: (usdValue: number, btcPerUsd: number) => number
}

export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function fiatWithCommas(x: number) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const currencies: Map<string, Currency> = new Map();
currencies.set('GBP', {
    img: 'british-pound-currency.svg',
    backdropIcon: '/currencies/british-pound-currency.svg',
    symbol: '£',
    format: (value: number, setting?: number, exact?: boolean) => {
        return fiatWithCommas(value);
    },
    formatNoLabel: (value: number) => {
        return fiatWithCommas(value);
    }
})
currencies.set('USD', {
    img: 'dollar-currency.svg',
    backdropIcon: '/currencies/dollar-currency.svg',
    symbol: '$',
    format: (value: number, setting?: number, exact?: boolean) => {
        return fiatWithCommas(value);
    },
    formatNoLabel: (value: number) => {
        return fiatWithCommas(value);
    }
})
currencies.set('EUR', {
    img: 'eur-currency.svg',
    backdropIcon: '/currencies/eur-currency.svg',
    symbol: '€',
    format: (value: number, setting?: number, exact?: boolean) => {
        return fiatWithCommas(value);
    },
    formatNoLabel: (value: number) => {
        return fiatWithCommas(value);
    }
})
currencies.set('BTC', {
    img: 'btc.svg',
    backdropIcon: '/currencies/btc.svg',
    symbol: '₿ ',
    cryptoCurrency: true,
    dollarValue: 0.000029,
    usdValue: 34306.60,
    format: (value: number, setting?: number, exact?: boolean) => {
        return value.toFixed(setting && setting != -1 ? setting: 8) + ' BTC';
    },
    formatNoLabel: (value: number, setting?: number, exact?: boolean) => {
        return value.toFixed(setting && setting != -1 ? setting: 8);
    },
    fromDollar: (usd: number): number => {
        return usd * 0.000029
    }
})
currencies.set('LTC', {
    img: 'ltc.svg',
    backdropIcon: '/currencies/ltc.svg',
    symbol: 'Ł',
    cryptoCurrency: true,
    dollarValue: 0.000029,
    usdValue: 34306.60,
    format: (value: number, setting?: number, exact?: boolean) => {
        return value.toFixed(setting && setting != -1 ? setting: 8) + ' LTC';
    },
    formatNoLabel: (value: number) => {
        return value.toFixed(8);
    },
    fromDollar: (usd: number): number => {
        return usd * 0.000029
    }
})
currencies.set('ETH', {
    img: 'eth.png',
    backdropIcon: '/currencies/eth.png',
    symbol: 'Ξ',
    cryptoCurrency: true,
    usdValue: 0,
    format: (value: number, setting?: number, exact?: boolean) => {
        return value.toFixed(setting && setting != -1 ? setting: 8) + ' ETH';
    },
    formatNoLabel: (value: number, setting?: number, exact?: boolean) => {
        return value.toFixed(8);
    },
    fromDollar: (value: number): number => {
        return value
    }
})
currencies.set('OSRS', {
    img: 'osrs.png',
    backdropIcon: '/assets/gp.png',
    symbol: '',
    format: (value: number, setting?: number, exact?: boolean) => {
        if (exact)
            return toRuneScapeFormatFromExact(value ?? 0) + ' OSRS GP'
        return toRuneScapeFormatFromDecimal(value ?? 0) + ' OSRS GP';
    },
    formatNoLabel: (value: number, setting?: number, exact?: boolean) => {
        if (exact)
            return toRuneScapeFormatFromExact(value ?? 0)
        return toRuneScapeFormatFromDecimal(value ?? 0);
    }
})
currencies.set('RS3', {
    img: 'rs3.png',
    backdropIcon: '/assets/gp.png',
    symbol: '',
    format: (value: number, setting?: number, exact?: boolean) => {
        if (exact)
            return toRuneScapeFormatFromExact(value ?? 0) + ' RS3 GP'
        return toRuneScapeFormatFromDecimal(value ?? 0) + ' RS3 GP';
    },
    formatNoLabel: (value: number, setting?: number, exact?: boolean) => {
        if (exact)
            return toRuneScapeFormatFromExact(value ?? 0);
        return toRuneScapeFormatFromDecimal(value ?? 0);
    }
})
currencies.set('WOW', {
    img: 'wow.png',
    backdropIcon: '/currencies/wow.png',
    symbol: '',
    format: (value: number, setting?: number, exact?: boolean) => {
        if (exact)
            return toRuneScapeFormatFromExact(value ?? 0) + ' WoW Gold'
        return toWorldOfWarcraftFormatFromDecimal(value ?? 0) + ' WoW Gold';
    },
    formatNoLabel: (value: number, setting?: number, exact?: boolean) => {
        if (exact)
            return toRuneScapeFormatFromExact(value ?? 0);
        return toWorldOfWarcraftFormatFromDecimal(value ?? 0);
    }
})

export function toRuneScapeFormatFromExact(value: number): string {
    const negative = value < 0;
    if (negative) {
        value *= -1;
    }
    if (value >= 1_000_000_000) {
        const amountLeftOver = value % 1_000_000_000
        if (amountLeftOver > 100_000_000) {
            return (negative ? "-" : "") + (value / 1_000_000_000).toFixed(1) + 'B'
        }
        return (negative ? "-" : "") + (value - amountLeftOver) / 1_000_000_000 + 'B'
    }
    if (value >= 10_000_000) {
        const amountLeftOver = value % 1_000_000
        return (negative ? "-" : "") + (value - amountLeftOver) / 1_000_000 + 'M'
    }
    if (value >= 1_000_000) {
        const amountLeftOver = value % 100_000
        if (amountLeftOver == 0) {
            return (negative ? "-" : "") + (value / 1_000_000).toFixed(0) + 'M'
        }
        return (negative ? "-" : "") + ((value - amountLeftOver) / 1_000_000).toFixed(1) + 'M'
    }
    if (value >= 100_000) {
        const amountLeftOver = value % 1_000
        return (negative ? "-" : "") + ((value - amountLeftOver) / 1_000) + 'K'
    }
    if (value >= 1_000) {
        return (negative ? "-" : "" ) + ((value) / 1_000).toFixed((((value) / 1_000) % 1) == 0 ? 0 : 2) + 'K'
    }
    return (negative ? "-" : "") + value.toString()
}

export function toRuneScapeFormatFromDecimal(value: number) {
    // return toRuneScapeFormatFromExact(Number(((decimal / 0.01) * 10_000).toFixed(2)));
    return toRuneScapeFormatFromExact(value);
}

export function toWorldOfWarcraftFormatFromDecimal(value: number) {
    // return toRuneScapeFormatFromExact(Number(((decimal / 0.01) * 100).toFixed(2)))
    return toRuneScapeFormatFromExact(value)
}