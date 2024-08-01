"use server";

import { gql, GraphQLClient } from "graphql-request";

interface TokenLockWallet {
  beneficiary: string;
  address: string;
}

interface MyQueryResponse {
  tokenLockWallets: TokenLockWallet[];
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


export const getUserDetails = async () => {
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
    address: "0x12dd27a8419d79dc748e8573d4b8b8b3484aa917",
  };

  try {
    const data = await graphQLClient.request(query, variables);
    console.log(data);
  } catch (e) {
    throw new Error((e as unknown as Error).toString());
  }
};
getUserDetails();


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
  return data.Socials.Social[0].profileName;
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

      // Fetch profile names for each bid
      const bidsWithProfileNames = await Promise.all(bidsData.orders.map(async (bid) => {
        // const beneficiary = await getUserDetails(bid.userWalletAddress);
        // const profileName = await getUserNameFromBeneficiary(beneficiary);
        return { ...bid, auctioningToken: auction.auctioningToken, auctionId: auction.auctionId };
      }));

      return bidsWithProfileNames;
    });

    const bidsArray = await Promise.all(bidsPromises);
    const allBids = bidsArray.flat();

    // Sort bids by timestamp
    return allBids.sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    throw new Error((e as unknown as Error).toString());
  }
};