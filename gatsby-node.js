/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path')
const _ = require('lodash')
const webpackLodashPlugin = require('lodash-webpack-plugin')

exports.onCreateNode = ({node, boundActionCreators, getNode}) => {
  const {createNodeField} = boundActionCreators
  let slug
  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent)
    const parsedFilePath = path.parse(fileNode.relativePath)
    if (
      Object.prototype.hasOwnProperty.call(node, 'frontmatter') &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, 'slug')
    ) {
      slug = `/${_.kebabCase(node.frontmatter.slug)}`
    }

    if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
      slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`
    } else if (parsedFilePath.dir === '') {
      slug = `/${parsedFilePath.name}/`
    } else {
      slug = `/${parsedFilePath.dir}/`
    }
    createNodeField({node, name: 'slug', value: slug})
  }
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators
  const guideTemplate = path.resolve(`src/templates/guide.js`)
  const jobsTemplate = path.resolve(`src/templates/jobs.js`)

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date]}
      ) {
        edges {
          node {
            frontmatter {
              type
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      console.log(result.errors)
      return Promise.reject(result.errors)
    }
    //
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const type = node.frontmatter.type
      if (type === 'guide') {
        createPage({
          path: node.fields.slug,
          component: guideTemplate,
          context: {
            slug: node.fields.slug
          }
        })
      } else if (type === 'jobs') {
        createPage({
          path: node.fields.slug,
          component: jobsTemplate,
          context: {
            slug: node.fields.slug
          }
        })
      }
    })
  })
}

exports.modifyWebpackConfig = ({config, stage}) => {
  if (stage === 'build-javascript') {
    config.plugin('Lodash', webpackLodashPlugin, null)
  }
}
