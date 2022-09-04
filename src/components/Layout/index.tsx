import React from 'react'
import { Outlet } from 'react-router-dom'
import { PageContainer } from '../../ui/PageContainer'
import {Navbar} from "../Navbar";

export const Layout: React.FC = () => {
  return (
    <>
        <PageContainer>
          <Navbar/>
        </PageContainer>
      <Outlet />
    </>
  )
}
