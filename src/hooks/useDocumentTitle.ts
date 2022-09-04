import { useLayoutEffect } from 'react'

export const useDocumentTitle = (title: string) => {
  useLayoutEffect(() => {
    document.title = `${title}`
  }, [])
}
