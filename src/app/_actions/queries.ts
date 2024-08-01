"use server";

import { gql, GraphQLClient } from "graphql-request";

interface TokenLockWallet {
  beneficiary: string;
  address: string;
}

interface MyQueryResponse {
  tokenLockWallets: TokenLockWallet[];
}

interface AllAuction {
  auctionId: string;
  auctioningToken: string;
  biddingToken: string;
}

interface Bid {
  buyAmount: string;
  encodedOrderId: string;
  isExactOrder: boolean;
  price: string;
  sellAmount: string;
  status: string;
  timestamp: number;
  txHash: string;
  user: {
    address: string;
  };
  userWalletAddress: string;
  volume: string;
  auctioningToken: string;
  auctionId: string;
  profileName?: string | null;
}

// Define the queries
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
    return data.Socials.Social[0].profileName;
  } else {
    return null;
  }
};

export const fetchAuctionsWithBids = async (): Promise<Bid[]> => {
  const graphQLClient = new GraphQLClient(
    "https://api.studio.thegraph.com/query/23537/moxie_auction_stats_mainnet/version/latest"
  );

  try {
    // Fetch all auctions
    const auctionsData = await graphQLClient.request<{ newAuctions: AllAuction[] }>(fetchAuctionsQuery);
    const auctions = auctionsData.newAuctions;

    // Fetch bids for each auction
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

    // Sort bids by timestamp and get top 100 latest bids
    const top100Bids = allBids.sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);

    // Fetch profile names for top 100 bids
    const bidsWithProfileNames = await Promise.all(top100Bids.map(async (bid) => {
      const beneficiary = await getUserDetails(bid.user.address);
      let profileName = null;
      if (beneficiary) {
        profileName = await getUserNameFromBeneficiary(beneficiary);
      }
      return { ...bid, profileName};
    }));

    return bidsWithProfileNames;
  } catch (e) {
    throw new Error(`fetchAuctionsWithBids: ${(e as Error).message}`);
  }
};
