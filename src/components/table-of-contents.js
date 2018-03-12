import React from 'react'
import Link from 'gatsby-link'

export default ({posts, currentSlug}) => {
  const postNodes = []
  posts.forEach(post => {
    // {node:{frontmatter: {title, path}}}
    let classNames = 'navbar-item is-tab'
    if (post.node.fields.slug === currentSlug) {
      classNames += ' is-active'
    }
    postNodes.push(
      <Link key={postNodes.length} className={classNames} to={post.node.fields.slug}>
        <span>
          <h6 className='is-uppercase'>{post.node.frontmatter.title}</h6>
        </span>
      </Link>
    )
  })

  return (
    <nav className='navbar has-shadow'>
      <div className='container'>
        <div className='navbar-tabs'>
          {postNodes}
        </div>
      </div>
    </nav>
  )
}
