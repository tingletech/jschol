import React from 'react'
import { Link } from 'react-router'
import Form from 'react-router-form'
import { Subscriber } from 'react-broadcast'

import PageBase from './PageBase.jsx'
import Header1Comp from '../components/Header1Comp.jsx'
import Nav1Comp from '../components/Nav1Comp.jsx'
import FooterComp from '../components/FooterComp.jsx'

class LoginPage extends PageBase
{
  // PageBase will fetch the following URL for us, and place the results in this.state.pageData
  pageDataURL() {
    return "/api/loginStart"
  }

  renderData(data) {
    if (!(typeof document === "undefined")) {
      // Only redirect on browser, not on server
      setTimeout(()=>{
        window.location = "https://submit.escholarship.org/secure/jscholLogin?returnTo=" +
          encodeURIComponent(window.location.href.replace("/login", "/loginSuccess")) +
          "&nonce=" + this.state.pageData.nonce}, 100)
    }
    return (
      <div>
        <Header1Comp/>
        <Nav1Comp />
        <div className="c-columns">
          <main>
            <section className="o-columnbox1">
              <header>
                <h1 className="o-columnbox1__heading">Login</h1>
              </header>
              <p>Redirecting to login page...</p>
            </section>
          </main>
        </div>
      </div>
    )
  }
}

module.exports = LoginPage
