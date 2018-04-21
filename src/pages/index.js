import React from 'react'
import Hero from '../components/hero'

const IndexPage = () => (
  <main>
    <Hero title='与DCONLINE一起掘金南非电商蓝海
' subtitle='广州德思昂拉信息科技有限公司' />
    <section className='section'>
      <div className='container'>
        <div className='columns'>
          <div className='column'>
            <div className='card'>
              <div className='card-content'>
                DCONLINE
              </div>
            </div>
          </div>
          <div className='column'>
            <div className='card'>
              <div className='card-content'>
                WABELANE
              </div>
            </div>
          </div>
          <div className='column'>
            <div className='card'>
              <div className='card-content'>
                DCTRADE
              </div>
            </div>
          </div>
          <div className='column'>
            <div className='card'>
              <div className='card-content'>
                DCTEK
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
)

export default IndexPage
