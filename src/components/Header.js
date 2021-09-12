import React from 'react'

const Header = () => {
    return (
        <header className="header">
          <h1>
          {/* <img src="/public/service.JPG" alt="CCOVID"/> */}
          <img src="service.JPG" alt="CCOVID"/>
          </h1>
          <select>
            <option>국내</option>
            <option>국외</option>
          </select>
        </header>
    )
}

export default Header
