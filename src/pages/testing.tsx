import React from 'react'
import { Testing } from '../components/Testing'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {PageContainer} from "../ui/PageContainer";

export const TestingPage = () => {
  useDocumentTitle('Beta')
  return (
    <PageContainer>
      <Testing />
    </PageContainer>
  )
}
