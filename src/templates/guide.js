import React from 'react'
import graphql from 'graphql'
import Helmet from 'react-helmet'
import Hero from '../components/hero'

class GuideTemplate extends React.Component {
  render () {
    const { data } = this.props
    const { postBySlug: post, site: { siteMetadata } } = data
    return (
      <div>
        <Helmet title={`${siteMetadata.title} - ${post.frontmatter.title}`} />
        <Hero title={post.frontmatter.title} subtitle='' />
        <section className='section'>
          <div className='container'>
            <div className='content' dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </section>
      </div>
    )
  }
}

export default GuideTemplate

export const pageQuery = graphql`
  query GuideBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allPostTitles: allMarkdownRemark(filter: { frontmatter: {type: { eq: "guide" }}}) {
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
    postBySlug: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        update_date
        create_date
      }
      fields {
        slug
      }
    }
  }
`
