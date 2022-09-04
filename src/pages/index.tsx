import { useRedirectHome } from '../hooks/useRedirectHome'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {PageContainer} from "../ui/PageContainer";

export const HomePage = () => {
  const { redirectHome, isAuth } = useRedirectHome()
  useDocumentTitle(isAuth ? 'Inbox' : 'Home')
  if (!isAuth) {
    return redirectHome()
  }

  return (
    <>
      <PageContainer>{!isAuth}</PageContainer>
      {/*{isAuth && <InboxComponent />}*/}
    </>
  )
}
