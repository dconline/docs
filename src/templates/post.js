import React from 'react'
import graphql from 'graphql'
import Tags from '../components/tags'
import Hero from '../components/hero'

class PostTemplate extends React.Component {
  render () {
    const { data } = this.props
    const { markdownRemark: post } = data
    console.log(post.frontmatter)
    return (
      <div>
        <Hero title={post.frontmatter.title} subtitle='' />
        <section className='section'>
          <div className='container has-text-centered'>
            <Tags data={post.frontmatter.tags} />
            <div className='content has-text-left is-inline-block' dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </section>
      </div>
    )
  }
}

export default PostTemplate

export const pageQuery = graphql`
  query PostBySlug($slug: String!) {
    allMarkdownRemark(filter: { frontmatter: {type: { eq: "post" }}}) {
      edges {
        node {
          frontmatter {
            title
            type
          }
          fields {
            slug
          }
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        tags
      }
      fields {
        slug
      }
    }
  }
`
