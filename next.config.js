const { createLoader } = require('simple-functional-loader')
const rehypePrism = require('@mapbox/rehype-prism')
const visit = require('unist-util-visit')
const emoji = require('remark-emoji')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const tokenClassNames = {
  tag: 'text-code-red',
  'attr-name': 'text-code-yellow',
  'attr-value': 'text-code-green',
  deleted: 'text-code-red',
  inserted: 'text-code-green',
  punctuation: 'text-code-white',
  keyword: 'text-code-purple',
  string: 'text-code-green',
  'double-quoted-string': 'text-code-green',
  'single-quoted-string': 'text-code-green',
  function: 'text-code-blue',
  boolean: 'text-code-red',
  comment: 'text-gray-400 italic',
  scope: 'text-code-yellow',
  variable: 'text-code-white',
  operator: 'text-code-white',
  'this': 'text-code-white',
  'class-name': 'text-code-white',
  'number': 'text-code-white',
  'interpolation': 'text-code-white',
  'key': 'text-code-red',
  'property': 'text-code-cyan',
  'scalar': 'text-code-cyan',
}

module.exports = withBundleAnalyzer({
  pageExtensions: ['js', 'jsx', 'mdx'],
  experimental: {
    modern: true,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    })

    const mdx = [
      options.defaultLoaders.babel,
      {
        loader: '@mdx-js/loader',
        options: {
          remarkPlugins: [emoji],
          rehypePlugins: [
            rehypePrism,
            () => {
              return (tree) => {
                visit(tree, 'element', (node, index, parent) => {
                  let [token, type] = node.properties.className || []
                  if (token === 'token') {
                    if (Object.keys(tokenClassNames).indexOf(type) === -1) {
                        console.log(type);
                    }
                    node.properties.className = [tokenClassNames[type]]
                  }
                })
              }
            },
          ],
        },
      },
    ]

    config.module.rules.push({
      test: /\.mdx$/,
      oneOf: [
        {
          resourceQuery: /preview/,
          use: [
            ...mdx,
            createLoader(function (src) {
              if (src.includes('<!--more-->')) {
                const [preview] = src.split('<!--more-->')
                return this.callback(null, preview)
              }

              const [preview] = src.split('<!--/excerpt-->')
              return this.callback(null, preview.replace('<!--excerpt-->', ''))
            }),
          ],
        },
        {
          use: [
            ...mdx,
            createLoader(function (src) {
              const content = [
                'import Post from "@/components/Post"',
                'export { getStaticProps } from "@/getStaticProps"',
                src,
                'export default (props) => <Post meta={meta} {...props} />',
              ].join('\n')

              if (content.includes('<!--more-->')) {
                return this.callback(null, content.split('<!--more-->').join('\n'))
              }

              return this.callback(null, content.replace(/<!--excerpt-->.*<!--\/excerpt-->/s, ''))
            }),
          ],
        },
      ],
    })

    if (!options.dev && options.isServer) {
      const originalEntry = config.entry

      config.entry = async () => {
        const entries = { ...(await originalEntry()) }
        entries['./scripts/build-rss.js'] = './scripts/build-rss.js'
        return entries
      }
    }

    return config
  },
})
