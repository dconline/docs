import React from 'react'
import Hero from '../components/hero'

const PostsPage = ({ data }) => {
  const {edges} = data.allMarkdownRemark

  const postNodes = []

  edges.forEach(post => {
    postNodes.push(
      <li key={postNodes.length}>
        <a href={post.node.fields.slug}>
          {post.node.frontmatter.title}
        </a>
      </li>
    )
  })

  return (
    <main>
      <Hero title='Posts' />
      <section className='section'>
        <div className='container has-text-centered'>
          <p>
            总共 {edges.length} 篇文章
          </p>

          <div className='content is-inline-block has-text-left'>
            <ul>
              {postNodes}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PostsPage

export const pageQuery = graphql`
  query PostList {
    allMarkdownRemark(filter: { frontmatter: { type: { eq: "post" }}}) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
