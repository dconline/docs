import React from 'react'
import graphql from 'graphql'
import Hero from '../components/hero'

class GuideTemplate extends React.Component {
  render () {
    const { data } = this.props
    const { postBySlug: post } = data
    return (
      <div>
        <Hero title='DCONLINE之指南' subtitle='这个真的是指南' />
        <section className='section'>
          <div className='container'>
            <h1 className='title'>{post.frontmatter.title}</h1>
            <hr />
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
      }
      fields {
        slug
      }
    }
  }
`
