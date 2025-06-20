import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <h1>404: Page Not Found</h1>
    <p>Sorry, the page you're looking for doesn't exist. Please check the URL or navigate back to the homepage.</p>
  </Layout>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
