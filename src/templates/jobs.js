import React from 'react'
import graphql from 'graphql'
import TableOfContents from '../components/table-of-contents'
import Hero from '../components/hero'

class JobsTemplate extends React.Component {
  render () {
    const { data } = this.props
    const { allMarkdownRemark, markdownRemark: post } = data
    return (
      <div>
        <Hero title='Join us' subtitle='' />
        <TableOfContents
          posts={allMarkdownRemark.edges}
          currentSlug={post.fields.slug}
        />
        <section className='section'>
          <div className='container'>
            <div className='content' dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </section>
      </div>
    )
  }
}

export default JobsTemplate

export const pageQuery = graphql`
  query JobsBySlug($slug: String!) {
    allMarkdownRemark(filter: { frontmatter: {type: { eq: "jobs" }}}) {
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
      }
      fields {
        slug
      }
    }
  }
`
