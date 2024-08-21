"use server";

import { gql, GraphQLClient } from "graphql-request";

const fetchAuctionsQuery = gql`
  query {
    newAuctions {
      auctionId
      auctioningToken
      biddingToken
    }
  }
`;

const fetchBidsQuery = gql`
  query MyQuery($auctionId: String!) {
    orders(where: { auction: $auctionId }) {
      buyAmount
      encodedOrderId
      isExactOrder
      price
      sellAmount
      status
      timestamp
      txHash
      user {
        address
      }
      userWalletAddress
      volume
    }
  }
`;

export const getUserDetails = async (address: string) => {
  const graphQLClient = new GraphQLClient(
    "https://api.studio.thegraph.com/query/23537/moxie_vesting_mainnet/version/latest"
  );

  const query = gql`
    query MyQuery($address: ID!) {
      tokenLockWallets(where: { id: $address }) {
        beneficiary
        address: id
      }
    }
  `;

  const variables = {
    address,
  };

  try {
    const data = await graphQLClient.request<MyQueryResponse>(query, variables);
    if (data.tokenLockWallets.length > 0) {
      return data.tokenLockWallets[0].beneficiary;
    } else {
      return null;
    }
  } catch (e) {
    throw new Error(`getUserDetails: ${(e as Error).message}`);
  }
};

const getUserNameFromBeneficiary = async (beneficiary: string) => {
  const query = `query MyQuery {
      Socials(
        input: {filter: {dappName: {_eq: farcaster}, userAssociatedAddresses: {_eq: "${beneficiary}"}}, blockchain: ethereum}
      ) {
        Social {
          profileName
          profileImage
        }
      }}`;

  const response = await fetch("https://api.airstack.xyz/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AIRSTACK_API_KEY!,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  if (data && data.Socials && data.Socials.Social && data.Socials.Social.length > 0) {
    return {
      profileName: data.Socials.Social[0].profileName,
      profileImage: data.Socials.Social[0].profileImage
    };
  } else {
    return null;
  }
};

export const fetchAuctionsWithBids = async (): Promise<Bid[]> => {
  const graphQLClient = new GraphQLClient(
    "https://api.studio.thegraph.com/query/23537/moxie_auction_stats_mainnet/version/latest"
  );

  try {
    const auctionsData = await graphQLClient.request<{ newAuctions: AllAuction[] }>(fetchAuctionsQuery);
    const auctions = auctionsData.newAuctions;

    const bidsPromises = auctions.map(async (auction) => {
      const bidsData = await graphQLClient.request<{ orders: Bid[] }>(fetchBidsQuery, { auctionId: auction.auctionId });
      return bidsData.orders.map(bid => ({
        ...bid,
        auctioningToken: auction.auctioningToken,
        auctionId: auction.auctionId
      }));
    });

    const bidsArray = await Promise.all(bidsPromises);
    const allBids = bidsArray.flat();

    const top100Bids = allBids.sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);

    const auctioningTokenAddresses = top100Bids.map(bid => bid.auctioningToken);
    let tokenDetails: { id: string, symbol: string }[] = [];
    try {
      tokenDetails = await getFanAuctionTokenDetails(auctioningTokenAddresses);
    } catch (e) {
      console.error(`Error fetching token details: ${(e as Error).message}`);
    }

    const bidsWithDetails = await Promise.all(top100Bids.map(async (bid) => {
      const tokenDetail = tokenDetails.find(token => token.id === bid.auctioningToken);
      if (!tokenDetail) return { ...bid, tokenProfileName: null, tokenProfileImage: null };

      let tokenProfileName = tokenDetail.symbol;
      let tokenProfileImage = null;
      let channelId = null;
      let FTfid = null;
      let isFid = false;

      if (tokenDetail.symbol.startsWith('cid:')) {
        const cid = tokenDetail.symbol.replace('cid:', '');
        try {
          const channelDetail = await getChannelCidDetails(cid);
          if (channelDetail) {
            tokenProfileName = channelDetail.name;
            tokenProfileImage = channelDetail.imageUrl;
            channelId = cid;
          }
        } catch (e) {
          console.error(`Error fetching channel details for cid ${cid}: ${(e as Error).message}`);
        }
      } else if (tokenDetail.symbol.startsWith('fid:')) {
        const fid = tokenDetail.symbol.replace('fid:', '');
        try {
          const userDetail = await getUserFidDetails(fid);
          if (userDetail) {
            tokenProfileName = userDetail.profileName;
            tokenProfileImage = userDetail.profileImage;
            FTfid = fid;
            isFid = true;
          }
        } catch (e) {
          console.error(`Error fetching user details for fid ${fid}: ${(e as Error).message}`);
        }
      }

      return { ...bid, tokenProfileName, tokenProfileImage, isFid, channelId, FTfid };
    }));

    const bidsWithProfileNames = await Promise.all(bidsWithDetails.map(async (bid) => {
      const beneficiary = await getUserDetails(bid.user.address);
      let profileName = null;
      let profileImage = null;
      if (beneficiary) {
        const userInfo = await getUserNameFromBeneficiary(beneficiary);
        if (userInfo) {
          profileName = userInfo.profileName;
          profileImage = userInfo.profileImage;
        }
      }
      return { ...bid, profileName, profileImage };
    }));

    return bidsWithProfileNames;
  } catch (e) {
    throw new Error(`fetchAuctionsWithBids: ${(e as Error).message}`);
  }
};

const getFanAuctionTokenDetails = async (addresses: string[]): Promise<{ id: string, symbol: string }[]> => {
  const graphQLClient = new GraphQLClient(
    "https://api.studio.thegraph.com/query/23537/moxie_auction_stats_mainnet/version/latest"
  );

  const query = gql`
    query MyQuery($addresses: [ID!]) {
      tokens(where: {id_in: $addresses}) {
        symbol
        id
      }
    }
  `;
  const variables = { addresses };

  try {
    const data = await graphQLClient.request<{ tokens: { id: string, symbol: string }[] }>(query, variables);
    return data.tokens;
  } catch (e) {
    throw new Error(`getFanAuctionTokenDetails: ${(e as Error).message}`);
  }
};


const getUserFidDetails = async (fid: string) => {
  const query = `query MyQuery {
  Socials(input: {filter: {userId: {_eq: "${fid}"}}, blockchain: ethereum}) {
    Social {
      profileName
      profileImage
    }
  }
}`;

  const response = await fetch("https://api.airstack.xyz/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AIRSTACK_API_KEY!,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  if (data && data.Socials && data.Socials.Social && data.Socials.Social.length > 0) {
    return data.Socials.Social[0];
  } else {
    return null;
  }
}

const getChannelCidDetails = async (cid: string) => {
  const query = `query MyQuery {
    FarcasterChannels(
      input: {blockchain: ALL, filter: {channelId: {_eq: "${cid}"}}}
    ) {
      FarcasterChannel {
        name
        imageUrl
      }
    }
  }`

  const response = await fetch("https://api.airstack.xyz/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AIRSTACK_API_KEY!,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  if (data && data.FarcasterChannels && data.FarcasterChannels.FarcasterChannel && data.FarcasterChannels.FarcasterChannel.length > 0) {
    return data.FarcasterChannels.FarcasterChannel[0];
  } else {
    return null;
  }
}

export const fetchMoxiePrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=moxie&vs_currencies=usd",
  );
  const data = await response.json();
  let price = 0;
  if (data?.status?.error_code === 429) {
    price = 0.0052;
  } else {
    price = data["moxie"]?.usd;
  }
  return price;
};

export const fetchUserBids = async (userAddresses: string) => {

  const graphQLClient = new GraphQLClient(
    "https://api.studio.thegraph.com/query/23537/moxie_auction_stats_mainnet/version/latest"
  );

  const query = gql`query MyQuery($userAddresses: [Bytes!]) {
    users(where: {address_in: $userAddresses}) {
      orders(where: {status: Placed}) {
        buyAmount
        sellAmount
        price
        status
        timestamp
        txHash
        auctionId
      }
    }
  }
  `;

  const vestingAddress = await fetchUsersVestingContract(userAddresses);

  const variable = {
    "userAddresses": [
      userAddresses,
      vestingAddress
    ]
  }

  try {
    const data = await graphQLClient.request<UsersResponse>(query, variable);
    return data.users;
  } catch (e) {
    throw new Error(`fetchUserBids: ${(e as Error).message}`);
  }
}

const fetchUsersVestingContract = async (userAddress: string) => {
  const graphQLClient = new GraphQLClient(
    "https://api.studio.thegraph.com/query/23537/moxie_vesting_mainnet/version/latest"
  );

  const query = gql`query MyQuery($beneficiary: Bytes) {
    tokenLockWallets(where: {beneficiary: $beneficiary}) {
      address: id
    }
  }`;

  const variable = {
    "beneficiary": userAddress
  }


  try {
    const data = await graphQLClient.request<TokenLockWalletsResponse>(query, variable);
    return data.tokenLockWallets[0].address;
  } catch (e) {
    throw new Error(`fetchUserBids: ${(e as Error).message}`);
  }
}

export const fetchCertainAuctionDetails = async (auctionId: string): Promise<AuctionDetailsResponse | null> => {
  const graphQLClient = new GraphQLClient(
    "https://api.studio.thegraph.com/query/23537/moxie_auction_stats_mainnet/version/latest"
  );

  const query = gql`
  query MyQuery($auctionId: BigInt!) {
    auctionDetails(where: { auctionId: $auctionId }) {
      auctionId
      allowListManager
      allowListSigner
      auctionEndDate
      currentBiddingAmount
      currentClearingOrderBuyAmount
      currentClearingOrderSellAmount
      currentClearingPrice
      currentVolume
      interestScore
      isAtomicClosureAllowed
      isCleared
      isPrivateAuction
      minFundingThreshold
      minimumBiddingAmountPerOrder
      orderCancellationEndDate
      startingTimeStamp
      totalOrders
      txHash
      uniqueBidders
      minBuyAmount
    }
  }`;

  const variable = {
    auctionId,
  };

  try {
    const data: AuctionDetailsResponse = await graphQLClient.request(query, variable);
    return data;
  } catch (e) {
    console.error(`fetchCertainAuctionDetails: ${(e as Error).message}`);
    return null;
  }
};


export const fetchUsersLifetimeMoxieEarned = async (fid: string, isFid: boolean): Promise<number | null> => {
  const UserQuery = `query MyQuery { 
                  FarcasterMoxieEarningStats(
                      input: {filter: {entityType: {_eq: USER}, entityId: {_eq: "${fid}"}}, timeframe: LIFETIME, blockchain: ALL}
                    ) {
                    FarcasterMoxieEarningStat {
                      allEarningsAmount
                    }
                  }
                }`;

  const ChannelQuery = `query MyQuery {
                FarcasterMoxieEarningStats(
                  input: {filter: {entityType: {_eq: CHANNEL}, entityId: {_eq: "${fid}"}}, timeframe: LIFETIME, blockchain: ALL}
                ) {
                  FarcasterMoxieEarningStat {
                    allEarningsAmount
                  }
                }
              }`


  const query = isFid ? UserQuery : ChannelQuery;

  try {
    const response = await fetch("https://api.airstack.xyz/gql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.AIRSTACK_API_KEY!,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user's lifetime Moxie earnings. Status: ${response.status}`);
    }

    const { data }: LifetimeMoxieEarningsResponse = await response.json();
    const earnings = data?.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat[0]?.allEarningsAmount;
    return earnings ? parseFloat(earnings) : null;
  } catch (e) {
    console.error(`fetchUsersLifetimeMoxieEarned: ${(e as Error).message}`);
    return null;
  }
};


export const fetchClearingPriceForAFanToken = async (auctionId: string): Promise<ClearingPriceResponse | null> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  };

  try {
    const res = await fetch(`https://batch-auction.airstack.xyz/api/clearing-price?auctionId=${auctionId}&chainId=8453`, options);

    if (!res.ok) {
      throw new Error(`Failed to fetch clearing price. Status: ${res.status}`);
    }

    const data: ClearingPriceResponse = await res.json();
    return data;
  } catch (e) {
    console.error(`fetchClearingPriceForAFanToken: ${(e as Error).message}`);
    return null;
  }
};

export const fetchAuctionOrders = async (auctionId: string, price: string) => {
  console.log("fetchAuctionOrders", auctionId, price);
  const query = gql`
  query GetAuctionOrders($where: Order_filter, $orderBy: Order_orderBy, $orderDirection: OrderDirection, $first: Int) {
    orders(
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $first
    ) {
      id
      encodedOrderId
      price
      sellAmount
      buyAmount
      user {
        id
        address
      }
    }
  }`;

  const graphQLClient = new GraphQLClient(
    "https://api.studio.thegraph.com/query/23537/moxie_auction_stats_mainnet/version/latest"
  );

  const variables = {
    where: {
      auction: String(auctionId),
      price_gte: Number(price) + 1,
      isExactOrder: false,
    },
    orderBy: "price",
    orderDirection: "asc",
    first: 1,
  }

  try {
    const data = await graphQLClient.request<{ orders: AuctionOrders[] }>(query, variables);
    console.log(data);
    return data.orders;
  } catch (e) {
    throw new Error(`fetchAuctionsOrders: ${(e as Error).message}`);
  }
}

export const fetchLiveAuctionFT = async () => {
  const graphQLClient = new GraphQLClient(
    "https://api.airstack.xyz/gql"
  );

  const query = gql`
  query MyQuery($status: FarcasterFanTokenAuctionStatusType) {
    FarcasterFanTokenAuctions(
      input: {filter: {status: {_eq: $status}, entityType: {_in: [USER, CHANNEL]}}, blockchain: ALL, limit: 200}
    ) {
      FarcasterFanTokenAuction {
        auctionId
        auctionSupply
        decimals
        entityId
        entityName
        entitySymbol
        entityType
        estimatedEndTimestamp
        estimatedStartTimestamp
        launchCastUrl
        minBiddingAmount
        minFundingAmount
        minPriceInMoxie
        subjectAddress
      }
    }
  }
  `;

  const variable = {
    "status": "ACTIVE"
  }

  const headers = {
    Authorization: process.env.AIRSTACK_API_KEY as string,
  }

  try {
    const data = await graphQLClient.request<FarcasterFanTokenAuctionsResponse>(query, variable, headers);
    return data;
  } catch (e) {
    throw new Error(`getLiveAuctionFT: ${(e as Error).message}`) ;
  }
}
