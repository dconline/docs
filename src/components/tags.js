import React from 'react'

const Tags = ({data = []}) => {
  const tagNodes = []
  data.forEach(tag => {
    tagNodes.push(
      <span className='tag' key={tagNodes.length}>
        {tag}
      </span>
    )
  })
  return (
    <div className='tags'>
      {tagNodes}
    </div>
  )
}

export default Tags
