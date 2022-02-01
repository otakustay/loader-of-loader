# loader-of-loader

This is a webpack loader designed to load and run another loader but very limited implemented to satisfy author's need.

By loading and running another loader from this, you can unlock features like:

1. Resolve a loader's path asynchronously.
2. Load an ESM loader without webpack's current support of ESM loaders.
3. Prepare options aynchronously.

## Install

```
npm install -D loader-of-loader
```

## Usage

The only option is `resolveLoader`, which returns a `Promise` resolve to structure like this:

```ts
interface LoaderResolveResult {
    loader: string; // The path of loader
    type?: 'module' | 'commonjs' | undefined; // The module type
    options: any; // Options pass to actual loader
}
```

Configure this in webpack like:

```js
{
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'loader-of-loader',
                        options: {
                            resolveLoader: async () => {
                                const config = await getBabelConfigFromRemote();
                                return {
                                    loader: 'babel-loader',
                                    options: config,
                                };
                            },
                        },
                    },
                ],
            },
        ],
    },
}
```
