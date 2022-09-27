import '../styles/globals.scss'
import Layout from '../components/layout'
import 'antd/dist/antd.css';

function MyApp({ Component, pageProps, session, appConfig, menus, ...appProps }) {
  return <Layout><Component {...pageProps} /></Layout>
}

export default MyApp