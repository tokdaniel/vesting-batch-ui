# Qwik + Vite

## Qwik in CSR mode

This starter is using a pure CSR (Client Side Rendering) mode. This means, that the application is fully bootstrapped in the browser. Most of Qwik innovations however take advantage of SSR (Server Side Rendering) mode.

```ts
export default defineConfig({
  plugins: [
    qwikVite({
      csr: true,
    }),
  ],
})
```

Use `npm create qwik@latest` to create a full production ready Qwik application, using SSR and [QwikCity](https://qwik.builder.io/docs/qwikcity/), our server-side metaframwork.

## Usage

```bash
$ npm install # or pnpm install or yarn install
```

Learn more on the [Qwik Website](https://qwik.builder.io) and join our community on our [Discord](https://qwik.builder.io/chat)

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `pnpm build`

Builds the app for production to the `dist` folder.<br>

## Vercel Edge

This starter site is configured to deploy to [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), which means it will be rendered at an edge location near to your users.

## Installation

The adaptor will add a new `vite.config.ts` within the `adapters/` directory, and a new entry file will be created, such as:

```
└── adapters/
    └── vercel-edge/
        └── vite.config.ts
└── src/
    └── entry.vercel-edge.tsx
```

Additionally, within the `package.json`, the `build.server` script will be updated with the Vercel Edge build.

## Production build

To build the application for production, use the `build` command, this command will automatically run `pnpm build.server` and `pnpm build.client`:

```shell
pnpm build
```

[Read the full guide here](https://github.com/BuilderIO/qwik/blob/main/starters/adapters/vercel-edge/README.md)

## Dev deploy

To deploy the application for development:

```shell
pnpm deploy
```

Notice that you might need a [Vercel account](https://docs.Vercel.com/get-started/) in order to complete this step!

## Production deploy

The project is ready to be deployed to Vercel. However, you will need to create a git repository and push the code to it.

You can [deploy your site to Vercel](https://vercel.com/docs/concepts/deployments/overview) either via a Git provider integration or through the Vercel CLI.
