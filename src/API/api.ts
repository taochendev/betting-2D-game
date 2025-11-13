export type PlayerDetails = {
    username: string
    image: string
    balance: number
    authority: string
    profiles: Array<string>
    currentProfile: string
}

export type StaticList = {
    strings: string
}

export type BlacklistRequest = {
    list: string
}

export type Casino = {
    users: number | undefined
    bets: Array<Bet>
    wagered: number
    payout: number
    profit: number
    totalRakeback: number
    unclaimedRakeback: number
    topGamblers: Array<Rating>
    topGames: Array<Rating>
    topBets: Array<Rating>
}

export type Rating = {
    name: string
    game: string
    value: number
    avgBet: number
}
export type Bet = {
    game: string
    user: string
    wagered: number
    payout: number
    multiplier: number
}

export type Player = {
    username: string
    wagers: number
    totalWagered: number
    totalEarned: number
}

export type AccountVerbose = {
    username: string
    profiles: Array<PlayerVerbose>
    balance: number
    rakeback: number
}

export type PlayerVerbose = {
    username: string
    since: Date
    seen: Date
    streak: number
    totalWagers: number
    totalWagered: number
    totalEarned: number
    totalRakeback: number
    rakeback: number
    wagers: Array<WagerDTO>
}

export type BotDTO = {
    username: string
    displayName: string
    wagers: number
    totalWagered: number
    totalEarned: number
    combatLevel: number
    status: string
}

export type EarningsDay = {
    time: Date
    count: number
}

export type Bot = {
    username: string
    displayName: string
    combatLevel: number
    totalLevel: number
    credentialsValid: boolean
    membership: number
    gold: number
    tokens: number
    minWealth: number
    maxWealth: number
    minWager: number
    maxWager: number
    online: boolean
    usePublicChat: boolean
    lost: boolean
    totalWagers: number
    totalWagered: number
    netProfit: number
    wagers: Array<Wager>
}

export type TrackedPlayerCount = {
    count: string
    time: Date
}

export type PlatformOverview = {
    betsToday: number,
    signupsToday: number,
    signupsMonth: number,
    netProfit: number,
    botsOnline: number,
}

export type Wager = {
    id: string,
    player: Player,
    bot: Bot,
    clientSeed: string,
    serverSeed: string,
    nonce: number,
    betGold: number,
    betTokens: number,
    game: string,
    betTime: Date,
    payout: number,
}

export type WagerDTO = {
    id: string,
    player: string,
    bot: string,
    clientSeed: string,
    serverSeed: string,
    nonce: number,
    wagered: number,
    betTime: Date,
    game: string,
    won: boolean,
    payout: number,
}

export type PendingWager = {
    id: string,
    player: string,
    time: Date,
    game: string,
    wagers: number,
    payout: number,
    wagered: number,
}

export type Challenge = {
    id: string
    name: string
    game: string
    image: string
    challengeEnum: string
    expired: boolean
    creationDate: Date
    endDate: any
    winnerName?: string
}

export type CreateChallengeRequest = {
    name: string
    game: string
    image: string
    enum: string
    end: any
}

export type EditChallengeRequest = {
    id: string
    name: string
    game: string
    image: string
    enum: string
    end: any
}

export type ShuffleChallengers = {
    username: string
    image: string
    completed: number
    earned: number
    prize: string
}

export type ShuffleChallenge = {
    name: string
    game: string
    image: string
    description: string
    amount: number
    winner?: string
    reward: number
    start: Date
    end: any
    timed: boolean
}

export type Giveaway = {
    id: string
    name: string
    image: string
    description: string
    link: string
    end: string
}

export type CreateGiveawayRequest = {
    name: string
    image: string
    description?: string
    link?: string
    end?: string
}

export type EditGiveawayRequest = {
    id: string
    name: string
    image: string
    description?: string
    link?: string
    end?: string
}

export type ShuffleGiveaway = {
    name: string
    image: string
    streamer: string
    category: string
    description: string
    link: string
    end: Date
    shuffle: boolean
    youtube: string
    twitter: string
    kickHours: number
    twitchHours: number
}

export type TwitchAuthCodeGrantFlow = {
     access_token: string
     refresh_token: string
     expires_in: number
}

export type AccountProfile = {
    username: string
    image: string
    balance: number
    accounts: Array<string>
}

export type AccountPlayerOverview = {
    username: string
    totalBets: number
    netWagered: number
    netWon: number
    streak: number
    totalRakeback: number
    memberSince: Date
    lastSeen: Date
    challenges: number
    totalBalance: number
    held: number
    fills: number
    rakeback: number
    owes: number
}

export type Transaction = {
    type: string
    amount: number
    time: Date
}

export type WonChallenge = {
    name: string
    image: string
    winnings: number
    date: Date
}

export type WonLeaderboardRanking = {
    name: string
    image: string
    ranking: number
    wagered: number
    winnings?: number
    date: Date
}