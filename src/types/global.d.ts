interface UserOrder {
    price: string;
    protocolToken: string;
    protocolTokenAmount: string;
    protocolFeeTransfer: {
        txHash: string;
        amount: string;
    };
    subjectToken: {
        name: string;
        symbol: string;
    };
    subjectAmount: string;
    subjectFeeTransfer: {
        txHash: string;
        amount: string;
    };
}

interface Token {
    address: string;
    name?: string;
    symbol?: string;
}

interface FanToken {
    buySideVolume: string;
    currentPriceInMoxie: string;
    currentPriceInWeiInMoxie: string;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    createdAtBlockInfo: {
        id: string;
    };
}

interface BlockInfo {
    blockNumber: number;
    hash: string;
    timestamp: number;
}

interface Token {
    address: string;
    name?: string;
    symbol?: string;
}

interface User {
    address: string;
}

interface Order {
    blockInfo: BlockInfo;
    orderType: string;
    price: string;
    protocolToken: string;
    protocolTokenAmount: string;
    subjectAmount: string;
    subjectToken: Token;
    user: User;
}

interface Portfolio {
    balance: string;
    buyVolume: string;
    sellVolume: string;
    subjectToken: Token;
}

interface UserWithPortfolio {
    address: string;
    portfolio: Portfolio[];
}

// interface Auction {
//     auctionId: string;
//     auctionSupply: string;
//     decimals: number;
//     entityId: string;
//     entityName: string;
//     entitySymbol: string;
//     entityType: string;
//     estimatedEndTimestamp: number;
//     estimatedStartTimestamp: number;
//     launchCastUrl: string;
//     minBiddingAmount: string;
//     minFundingAmount: string;
//     minPriceInMoxie: string;
//     subjectAddress: string;
// }

interface AllAuction {
    allowListContract: string;
    allowListData: string;
    auctionEndDate: string;
    auctionId: string;
    auctionedSellAmount: string;
    auctioningToken: string;
    biddingToken: string;
    blockInfo: {
        blockNumber: number;
        hash: string;
        timestamp: string;
    };
    minBuyAmount: string;
    minFundingThreshold: string;
    minimumBiddingAmountPerOrder: string;
    orderCancellationEndDate: string;
    userId: string;
}


interface TrendingFanToken {
    buySideVolume: string;
    currentPriceInMoxie: string;
    currentPriceInWeiInMoxie: string;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    createdAtBlockInfo: {
        id: string;
    };
}

interface BidUser {
    address: string;
}

interface Bid {
    buyAmount: string;
    sellAmount: string;
    timestamp: number;
    user: BidUser;
    encodedOrderId: string;
    isExactOrder: boolean;
    price: string;
    status: string;
    txHash: string;
    userWalletAddress: string;
    volume: string;
    auctioningToken?: string;
    auctionId?: string;
    profileName?: string | null;
}

