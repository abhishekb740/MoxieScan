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
    profileImage?: string | null;
}

interface TokenLockWallet {
    beneficiary: string;
    address: string;
}

interface MyQueryResponse {
    tokenLockWallets: TokenLockWallet[];
}

