"use client";

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
