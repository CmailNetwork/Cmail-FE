import React from 'react'
import {
    Center,
    Flex,
    Link, Image,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import {
    NAVBAR_HEIGHT, HOME_URL,
} from '../../constants'
import { Auth, AuthModal } from '../Auth'
import { ConnectWallet } from '../ConnectWallet'
import { ConnectedButton } from '../ConnectedButton'

export interface NavbarProps {
  showInbox?: boolean
}

const Logo = () => {
    return  <Center h={`${NAVBAR_HEIGHT}px`}>
        <Link isExternal href={HOME_URL}>
            <Image src={require('../../assets/images/logo.png')} boxSize='100px' objectFit={"contain"} mt='10px'></Image>
        </Link>
    </Center>
}

const NavbarContainer = styled(Flex)`
  height: ${NAVBAR_HEIGHT}px;
  width: 100%;
  align-items: center;
  position: relative;
`

export const Navbar: React.FC<NavbarProps> = () => (
  <NavbarContainer justifyContent={{ base: 'flex-start', md: 'center' }}>
    <Flex alignItems="center">
      <Logo />
    </Flex>
    <Flex alignItems="center" position="absolute" right={0}>
      {/*<Flex pr="15px">*/}
      {/*  <NotificationSwitch />*/}
      {/*</Flex>*/}
      <ConnectWallet
        renderConnected={(address) => <ConnectedButton address={address} />}
      />
    </Flex>
    <AuthModal />
    <Auth />
  </NavbarContainer>
)
