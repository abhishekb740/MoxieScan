"use server";

import { gql, GraphQLClient } from "graphql-request";
import { basePublicClient, baseWalletClient } from "@/lib/config";
import { ethers } from 'ethers';
import BaseABIAndAddress from "@/deployments/base/EasyAuction.json";

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
            isFid = true;
          }
        } catch (e) {
          console.error(`Error fetching user details for fid ${fid}: ${(e as Error).message}`);
        }
      }

      return { ...bid, tokenProfileName, tokenProfileImage, isFid, channelId };
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

export const fetchSellOrdersForAAuction = async (auctionId: string) => {
  const query = gql`query MyQuery {
    orders(where: {status: Placed, auctionId: "${auctionId}"}) {
      user {
        id
      }
      buyAmount
      sellAmount
    }
  }`

  const graphQLClient = new GraphQLClient(
    "https://api.studio.thegraph.com/query/23537/moxie_auction_stats_mainnet/version/latest"
  );

  try {
    const data = await graphQLClient.request<{ orders: { user: { id: string }, buyAmount: string, sellAmount: string }[] }>(query);
    return data.orders;
  } catch (e) {
    throw new Error(`fetchSellOrders: ${(e as Error).message}`);
  }

}


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


export const bidOnAFanToken = async (auctionId: string, buyAmount: string, sellAmount: string, account: string) => {
  const sellOrders = await fetchSellOrdersForAAuction(auctionId);

  const encodeOrder = (order: {
    user: { id: string };
    buyAmount: string;
    sellAmount: string;
  }) => {
    const buyAmountBn = ethers.BigNumber.from(order.buyAmount).mul(ethers.BigNumber.from(10).pow(18));
    const sellAmountBn = ethers.BigNumber.from(order.sellAmount).mul(ethers.BigNumber.from(10).pow(18));

    const userId = ethers.BigNumber.from(order.user.id).toHexString().slice(2).padStart(16, "0");
    const buyAmount = buyAmountBn.toHexString().slice(2).padStart(24, "0");
    const sellAmount = sellAmountBn.toHexString().slice(2).padStart(24, "0");
    const encoded = (userId + buyAmount + sellAmount).slice(0, 64);
    return "0x" + encoded;
  }

  let formattedAccount: `0x${string}` | undefined;

  if (typeof account === 'string' && account.startsWith('0x')) {
    formattedAccount = account as `0x${string}`;
  } else {
    formattedAccount = undefined;
  }

  const encodedOrders = sellOrders.map(encodeOrder);
  console.log(encodedOrders);

  const { request } = await basePublicClient.simulateContract({
    address: `0x${BaseABIAndAddress.address}`,
    abi: BaseABIAndAddress.abi,
    functionName: 'placeSellOrders',
    args: [
      auctionId,
      [ethers.utils.parseUnits(buyAmount, 18)],
      [ethers.utils.parseUnits(sellAmount, 18)],
      encodedOrders,
      '0x'
    ],
    account: formattedAccount,
  });

  await baseWalletClient.writeContract(request);

};
