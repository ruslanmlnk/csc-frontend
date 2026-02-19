import LoginPageClient from './LoginPageClient'
import { getAuthPageGlobals } from '@/lib/backend/authPageGlobals'

const LoginPage = async () => {
  const { leftBanner, rightBanner } = await getAuthPageGlobals('login-page')

  return <LoginPageClient leftBanner={leftBanner} rightBanner={rightBanner} />
}

export default LoginPage
