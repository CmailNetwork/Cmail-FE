import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import {
  Flex,
  Heading,
  Text,
  Box,
  ButtonProps,
} from '@chakra-ui/react'
import {
  NAVBAR_GUTTER,
  NAVBAR_HEIGHT,
} from '../../constants'
import { AuthModal } from '../Auth'
import {
  useAuth,
  useIsAuthenticated,
  useIsAuthModalOpen,
} from '../../hooks/useLogin'

import { ConnectWallet } from '../ConnectWallet'
import {Button} from "../../ui/Button";
import {truncateMiddle} from "../../utils";
import {useAccount} from "../../hooks/connectors";

const Container = styled(Flex)`
  height: calc(100vh - ${NAVBAR_GUTTER + NAVBAR_HEIGHT}px);
  position: relative;
  flex-direction: column;
  align-items: center;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 80%;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  max-width: 100%;
  margin-top: ${NAVBAR_GUTTER}px;

  justify-content: center;
  

  .title {
    font-size: 28px;
    font-weight: 700;
  }

  .desc {
    margin-top: 20px;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
  }

  .footer {
    position: absolute;
    bottom: 0;
  }
`

const COLORFUL_BTN_BG = `linear-gradient(90.02deg, #FFB1B1 0.01%, #FFCD4B 50.26%, #916BFF 99.99%)`

interface RenderedButtonProps extends ButtonProps {
  addr: string
}

const RenderedButton: React.FC<RenderedButtonProps> = ({ addr, ...props }) => (
  <Button w="185px" fontSize="14px" variant="outline" {...props}>
    {truncateMiddle(addr, 6, 4)}
  </Button>
)

export const Testing: React.FC = () => {
  useAuth()
  const account = useAccount()
  const isAuth = useIsAuthenticated()

  const isAuthModalOpen = useIsAuthModalOpen()
  const index = useMemo(() => {
    if (!account || isAuthModalOpen) {
      return 1
    }
    if (isAuth) {
      return 2
    }
    return 3
  }, [account, isAuth, isAuthModalOpen])

  const desc = useMemo(() => {
    if (index === 1) {
      return 'not-connected'
    }
    if (index === 2) {
      return 'success'
    }
    return ''
  }, [index])
  return (
    <>
      <Container>
        <Heading className="title">{'Cmail Alpha is opening now \uD83D\uDD25'}</Heading>
        <Text className="desc">{desc}</Text>
        <Box marginTop="32px">
          <ConnectWallet
            bg={COLORFUL_BTN_BG}
            fontSize="14px"
            _hover={{
              bg: COLORFUL_BTN_BG,
              opacity: 0.8,
            }}
            w="185px"
            renderConnected={(addr) => (
              <RenderedButton
                border="none"
                _hover={{ bg: 'transparent' }}
                addr={addr}
              />
            )}
          />
        </Box>
      </Container>
      <AuthModal />
    </>
  )
}
