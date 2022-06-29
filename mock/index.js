import ethers from 'ethers';

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner();

const contractAdd = '0x0BDDE00E0d2c8655cd3c3E7D182eFf5fA7e28534';

const abi = ['function balanceOf(address) view returns (uint)'];

const main = async () => {
    const contract = new ethers.Contract(contractAdd, abi, provider);

    const rawBalance = await contract.balanceOf(
        '0x4FB96dd5B9E2d90084aD08E8137B1c7C6C7b19eF'
    );
    console.log(rawBalance.toNumber());

    process.exit(1);
};

main();
