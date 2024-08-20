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

interface Window {
    ethereum?: any;
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
    tokenProfileImage?: string | null;
    tokenProfileName?: string | null;
    isFid?: boolean;
    channelId?: string | null;
}

interface TokenLockWallet {
    beneficiary?: string;
    address: string;
}

interface MyQueryResponse {
    tokenLockWallets: TokenLockWallet[];
}
interface Order {
    buyAmount: string;
    sellAmount: string;
    price: string;
    status: string;
    timestamp: string;
    txHash: string;
    auctionId: string;
}

interface User {
    orders: Order[];
}

interface UsersResponse {
    users: User[];
}

interface TokenLockWalletsResponse {
    tokenLockWallets: TokenLockWallet[];
}

type ClearingPriceResponse = {
    clearingPrice: string;
    auctionId: string;
    chainId: string;
};

type LifetimeMoxieEarningsResponse = {
    data: {
        FarcasterMoxieEarningStats: {
            FarcasterMoxieEarningStat: {
                allEarningsAmount: string;
            }[];
        };
    };
};

type AuctionDetailsResponse = {
    auctionDetails: {
        auctionId: string;
        allowListManager: string;
        allowListSigner: string;
        auctionEndDate: string;
        currentBiddingAmount: string;
        currentClearingOrderBuyAmount: string;
        currentClearingOrderSellAmount: string;
        currentClearingPrice: string;
        currentVolume: string;
        interestScore: string;
        isAtomicClosureAllowed: boolean;
        isCleared: boolean;
        isPrivateAuction: boolean;
        minFundingThreshold: string;
        minimumBiddingAmountPerOrder: string;
        orderCancellationEndDate: string;
        startingTimeStamp: string;
        totalOrders: string;
        txHash: string;
        uniqueBidders: string;
        minBuyAmount: string;
    }[];
};

