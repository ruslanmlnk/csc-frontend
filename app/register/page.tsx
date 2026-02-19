import RegisterPageClient from './RegisterPageClient'
import { getAuthPageGlobals } from '@/lib/backend/authPageGlobals'

const RegisterPage = async () => {
  const { leftBanner, rightBanner } = await getAuthPageGlobals('register-page')

  return <RegisterPageClient leftBanner={leftBanner} rightBanner={rightBanner} />
}

export default RegisterPage
