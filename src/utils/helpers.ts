import { ethers } from 'ethers';

export const formatNumber = (number: number) => {
    if (number < 1000) {
        return number;
    } else if (number < 1000000) {
        return `${(number / 1000).toFixed(1)}K`;
    } else if (number < 1000000000) {
        return `${(number / 1000000).toFixed(1)}M`;
    } else {
        return `${(number / 1000000000).toFixed(1)}B`;
    }
}

export const formatWeiToEther = (wei: string): string => {
    const etherValue = ethers.utils.formatEther(wei);
    return parseFloat(etherValue).toLocaleString(undefined, { maximumFractionDigits: 2 });
};
