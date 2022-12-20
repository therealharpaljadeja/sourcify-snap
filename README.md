# Sourcify Metamask Snap

![Screen-Recording-2022-12-20-at-7](https://user-images.githubusercontent.com/38040789/208689315-76f3e13e-cd7a-4145-86d1-c3ea616ab5f4.gif)

MetaMask Snaps is a system that allows anyone to safely expand the capabilities of MetaMask. A _snap_ is a program that we run in an isolated environment that can customize the wallet experience.

This snap uses Sourcify to get information about the contract with which the transaction is about to happen and provides a human-readable description of what is about to happen in the transaction.

> **Warning**
> The human-readable description of the funciton is generated from the NatSpec comment on the function. So don't trust it blindly!

> **Note**
> The site has a example tx inside `packages/site/pages/index.tsx`

## Getting Started

Clone the repository and setup the development environment:

```shell
yarn install && yarn start
```

## Cloning

This repository contains GitHub Actions that you may find useful, see `.github/workflows` and [Releasing & Publishing](https://github.com/MetaMask/template-snap-monorepo/edit/main/README.md#releasing--publishing) below for more information.

If you clone or create this repository outside the MetaMask GitHub organization, you probably want to run `./scripts/cleanup.sh` to remove some files that will not work properly outside the MetaMask GitHub organization.

Note that the `action-publish-relase.yml` workflow contains a step that publishes the frontend of this snap (contained in the `public/` directory) to GitHub pages. If you do not want to publish the frontend to GitHub pages, simply remove the step named "Publish to GitHub Pages" in that workflow.

If you don't wish to use any of the existing GitHub actions in this repository, simply delete the `.github/workflows` directory.

## Contributing

- Snap Code is in `packages/snap`

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```
- [Sourcify Repo for Contract includes code and metadata file](https://repo.sourcify.dev/contracts/full_match/80001/0xcDcE084825c30a919FA74B55903a974511f131E7/)

_Questions? Dm @harpaljadeja11 on twitter_
