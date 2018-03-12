const siteMetadata = require('./src/data/site-config')

module.exports = {
  siteMetadata,
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/posts`,
        name: 'markdown-pages'
      }
    }, {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-'
            }
          }
        ]
      }
    }, {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'DCONLINE',
        short_name: 'DCONLINE',
        start_url: '/',
        background_color: '#f9c44e',
        theme_color: '#202020',
        display: 'minimal-ui'
      }
    },
    'gatsby-plugin-offline'
  ]
}
