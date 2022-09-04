
const generateCurrentURL = () =>
  `${window.location.host}${
    window.location.pathname !== '/' ? window.location.pathname : ''
  }`

export const generateMetamaskDeepLink = () =>
  `https://metamask.app.link/dapp/${generateCurrentURL()}`

export const isRejectedMessage = (error: any) =>
  error?.message && error.message.includes('rejected')
