import { RouteProps } from 'react-router-dom'
import { RoutePath } from './path'
import {TestingPage} from "../pages/testing";
import {HomePage} from "../pages";

interface Mail3RouterProps extends RouteProps {
  key: string
  params?: string
  path: string
}

export const routes: Mail3RouterProps[] = [
  {
    path: RoutePath.Home,
    key: 'home',
    element: <HomePage />,
  },
  {
    path: RoutePath.Testing,
    key: 'beta',
    element: <TestingPage />,
  },
]
