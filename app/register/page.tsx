import RegisterPageClient from './RegisterPageClient'
import { getAuthPageGlobals } from '@/lib/backend/authPageGlobals'
import { getServerLanguage } from '@/lib/i18n/server'

const RegisterPage = async () => {
  const language = await getServerLanguage()
  const { leftBanner, rightBanner } = await getAuthPageGlobals('register-page', language)

  return <RegisterPageClient leftBanner={leftBanner} rightBanner={rightBanner} />
}

export default RegisterPage
