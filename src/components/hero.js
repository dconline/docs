import React from 'react'

const Hero = ({ title, subtitle }) => {
  return (
    <section className='hero is-link'>
      <div className='hero-body'>
        <div className='container'>
          <p className='title'>{title}</p>
          <p className='subtitle'>{subtitle}</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
