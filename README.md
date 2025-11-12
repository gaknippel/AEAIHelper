<img src="src/js/assets/bolt-cep.svg" alt="Bolt CEP" title="Bolt CEP" width="400" />

this extention was built with Bolt Cep.

![npm](https://img.shields.io/npm/v/bolt-cep)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/hyperbrew/bolt-cep/blob/master/LICENSE)
[![Chat](https://img.shields.io/badge/chat-discord-7289da.svg)](https://discord.gg/PC3EvvuRbc)

## AEAI Helper

This extention for After Effects implements a gemini chatbot that can analyze your composition's frame to generate a response that can help you with virtually anything!

Use AEAI Helper to help you make a frame more cinematic, sad, happy, or... _anything!_

### Compatibility

- [Adobe CC Apps](https://www.adobe.com/creativecloud/desktop-app.html) version 2023 or later
- Windows & Mac Intel
- Mac Arm64 (M1-M4) require special setup ([more details](#misc-troubleshooting))

## Support

### Installation Support 🙌

If you have questions with getting started using AEAI Helper, contact _gaknippel@hotmail.com_

## Can I use AEAI in my free or commercial project?

Yes! AEAI Helper is **100% free and open source**, being released under the MIT license with no attribution required. This means you are free to use it in your free or commercial projects.

I would greatly appreciate it if you could provide a link back to my tool's info page in your product's site or about page:

## Prerequisites

- [Node.js 18](https://nodejs.org/en/) or later
- Package manager either
  - NPM (comes with Node.js)
  - [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) ( ensure by running `yarn set version classic` )
  - [PNPM](https://pnpm.io/installation) ( ensure by running `pnpm --version` )

- Adobe CEP's PlayerDebugMode must be enabled on your machine to test `yarn build` or `yarn dev` builds. Only an installed ZXP with `yarn zxp` will work without PlayerDebugMode enabled.
  - Enable this easily with the [aescripts ZXP Installer](https://aescripts.com/learn/zxp-installer/) > Settings > Debug > Enable Debugging
  - Or enable manually per OS by following the CEP Cookbook Instructions: [Adobe CEP 12 Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_12.x/Documentation/CEP%2012%20HTML%20Extension%20Cookbook.md#debugging-unsigned-extensions)
