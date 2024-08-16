import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
    return (
        <div className="flex flex-row px-12 py-6 rounded-lg justify-between font-rubik">
            <div className="text-2xl font-bold">
                MoxieScan
            </div>
            <ConnectButton  accountStatus="address" showBalance={false} chainStatus="name"/>
        </div>
    )
}

export default Navbar;
