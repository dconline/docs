import React from 'react'
import fortawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub'
import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebook'
import faTwitter from '@fortawesome/fontawesome-free-brands/faTwitter'
import faInstagram from '@fortawesome/fontawesome-free-brands/faInstagram'

fortawesome.library.add(faGithub, faFacebook, faTwitter, faInstagram)

class Header extends React.Component {
  state = {
    isActive: false
  }

  render () {
    const { title, menu, social } = this.props
    const { isActive } = this.state
    const menuNodes = []
    menu.forEach((m, i) => {
      menuNodes.push(
        <a className='navbar-item' href={m.slug} key={i}>
          <span>{m.label}</span>
        </a>
      )
    })

    const isActiveMenu = isActive ? 'is-active' : ''

    const socialNodes = []
    social.forEach((m, i) => {
      socialNodes.push(
        <a className='navbar-item' href={m.url} key={i}>
          <span className='icon' style={{color: m.color}}>
            <FontAwesomeIcon icon={['fab', m.icon]} size='lg' />
          </span>
        </a>
      )
    })

    return (
      <nav className='navbar is-spaced'>
        <div className='container'>
          <div className='navbar-brand'>
            <a className='navbar-item has-text-weight-bold' href='/'>
              {title}
            </a>
            <div onClick={() => {
              this.setState({
                isActive: !isActive
              })
            }} id='navbarBurger' className={`navbar-burger burger ${isActiveMenu}`} data-target='navMenuDocumentation'>
              <span />
              <span />
              <span />
            </div>
          </div>
          <div id='navMenuDocumentation' className={`navbar-menu ${isActiveMenu}`}>
            <div className='navbar-start'>
              {menuNodes}
            </div>
            <div className='navbar-end'>
              {socialNodes}
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Header
