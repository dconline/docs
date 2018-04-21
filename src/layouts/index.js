import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import graphql from 'graphql'
import Header from '../components/header'
import Footer from '../components/footer'
import '@fortawesome/fontawesome'
import 'bulma'
import './index.scss'

const TemplateWrapper = ({ children, data }) => {
  const { social, menu, title, description, keywords } = data.site.siteMetadata
  return (
    <div>
      <Helmet
        title={title}
        meta={[
          { name: 'description', content: description },
          { name: 'keywords', content: keywords }
        ]}
      />
      <Header title={title} menu={menu} social={social} />
      {children()}
      <Footer />
    </div>
  )
}

TemplateWrapper.propTypes = {
  children: PropTypes.func
}

export const pageQuery = graphql`
  query Layout {
    site {
      siteMetadata {
        title
        description
        keywords
        menu {
          label
          slug
        }
        social {
          icon
          url
          color
        }
      }
    }
  }
`

export default TemplateWrapper
