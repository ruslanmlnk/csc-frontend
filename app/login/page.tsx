import LoginPageClient from './LoginPageClient'
import { getAuthPageGlobals } from '@/lib/backend/authPageGlobals'
import { getServerLanguage } from '@/lib/i18n/server'

const LoginPage = async () => {
  const language = await getServerLanguage()
  const { leftBanner, rightBanner } = await getAuthPageGlobals('login-page', language)

  return <LoginPageClient leftBanner={leftBanner} rightBanner={rightBanner} />
}

export default LoginPage
