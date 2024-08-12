import Image from "next/image";

const Navbar = () => {
    return (
        <div className="flex flex-row px-12 py-6 rounded-lg justify-between font-rubik">
            <div className="text-2xl font-bold">
                MoxieScan
            </div>
            <button className="px-6 py-2 rounded-full text-base font-semibold bg-[#7F5FC6] flex flex-row items-center justify-center gap-2">
                <Image src="/farcaster.png" alt="farcaster" width={20} height={20} />
                <span>Connect</span>
            </button>
        </div>
    )
}

export default Navbar;