# 🌟 Pay-per-Minute Streaming Portal

The client is deployed [here](y-centaur-52717b.netlify.app). To use it, follow the steps outlined below.

<b> ⚠️ It is important that these steps are completed before the client is interacted with ⚠️ </b>

1. Install the [MetaMask](https://metamask.io/download/) browser extension (wallet)
2. The Smart Contracts are deployed to the Fantom Testnet. Follow [this guide](https://docs.fantom.foundation/tutorials/set-up-metamask-testnet) to add the testnet to your MetaMask wallet
3. Open the web app
4. Before you click on 'Next', open the MetaMask wallet and select the network you added in Step 2

![image](https://user-images.githubusercontent.com/3578608/193537417-d21879fd-e9a5-4247-b07c-a71895c1d30c.png)

5. Add the customer account to your MetaMask wallet. Use the private key, which was sent to you privately; it should be precharged with FTM and SIM tokens
6. Select the newly added address and continue with the onboarding

The workings of the system can be verified by deploying the contracts via [Remix](remix.ethereum.org). Follow the steps outlined below.

1. Open [Remix](remix.ethereum.org)
2. Upload the Smart Contracts to the workspace
3. Go to 'Deploy & run transactions'
4. Make sure you selected the Fantom Testnet in MetaMask
5. Under 'Environment' choose 'Injected Provider - MetaMask'
6. Select the correct Smart Contract under 'Contract'
7. Deploy the Smart Contract 'At Address' and paste the corresponding address from the list below

![image](https://user-images.githubusercontent.com/3578608/193539105-c063ff1d-ada5-4cb7-a6b4-a96207f721e8.png)

The Smart Contracts are deployed at the following addresses. You do not need to interact with the UsageOracle; hence adding it can be skipped.

- SimpleToken: 0xd926F6aD528DC3539453893EA035444AD55a175C
- SubscriptionStore: 0x065cc7bD39abfa21E0e245D4704Ab2522b21D11f 
