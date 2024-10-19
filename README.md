# 🏗 Civkit

<h4 align="center">
  <a href="https://civikit.vercel.app">Live Civikit UI</a> |
  <a href="https://docs.scaffoldeth.io">Scaffold ETH 2</a> |
  <a href="https://github.com/allo-protocol">Gitcoin Allo</a>
</h4>

🧪 An open-source toolkit for building decentralized grant stacks and various capital allocation and accountability platforms, tools, as well as various other things for the Ethereum and EVM blockchains. It's designed to make it easier for developers to create and deploy custom smart contracts and build more easily edit user interfaces that interact with a custom version of the Allo v1 contracts, with abstracted components to make it easier to understand, modify, experiment, and learn with.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it! Customize your grant stack and automatically generate web-hooks for custom contracts and functions. 
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/Novus-Initium/Civikit
cd Civikit
yarn install
```

2. Add Pinata API Keys and Gateway in your packages/nextjs/.env

- PINATA_API_KEY=
- PINATA_SECRET_API_KEY=
- PINATA_GATEWAY=

3. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.



4. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

5. In the Next folder, find the env.example to connect to an IPFS gateway and API key to submit and retrieve data to render the UI faster at scale. 

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app's homepage in config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your smart contracts controlling capital allocation and grants management` in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`
- Edit your smart contract test in: `packages/hardhat/test`. To run test use `yarn hardhat:test`

## Documentation

To learn more about Scaffold-Eth-2 and allo visit [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
