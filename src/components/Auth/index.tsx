import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  Heading,
  Flex,
  VStack,
  Text,
  Box,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { ReactComponent as WalletSvg } from '../../assets/images/wallet.svg'
import { ReactComponent as LeftArrowSvg } from '../../assets/images/left-arrow.svg'

import { RoutePath } from '../../route/path'
import {Button} from "../../ui/Button";
import {truncateMiddle} from "../../utils";
import {useAuth, useAuthModalOnBack, useCloseAuthModal, useIsAuthModalOpen, useLogin} from "../../hooks/useLogin";
import {useAccount, useProvider} from "../../hooks/connectors";
import {useToast} from "../../hooks/useToast";

export const AuthModal: React.FC = () => {
  const account = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const signatureDesc = 'I authorize sending and checking my emails on Cmail from this device. This doesn\'t cost anything.'
  const provider = useProvider()
  const _toast = useToast()
  const toast = (s: string) => _toast(s, { position: 'top', duration: 2000 })
  const login = useLogin()
  const closeAuthModal = useCloseAuthModal()
  const isAuthModalOpen = useIsAuthModalOpen()
  const navi = useNavigate()
  const onBack = useAuthModalOnBack()

  const onRemember = async () => {
    if (provider == null) {
      toast('Wallet is not connected, please connect your wallet')
      return null
    }
    setIsLoading(true)
    try {
      const signature = await provider.getSigner().signMessage(signatureDesc)
        await login(
            signatureDesc,
            signature)
        closeAuthModal()
        navi(RoutePath.Home)
    } catch (error: any) {
      if (error && error.msg) {
        toast(error.message ?? 'Unknown error, please try again later')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent maxWidth="340px">
        <ModalHeader
          display="flex"
          fontSize="16px"
          position="relative"
          alignItems="center"
          justifyContent="center"
          borderBottom="1px solid #F4F4F4"
        >
          <Box
            cursor="pointer"
            position="absolute"
            left="24px"
            onClick={onBack}
          >
            <LeftArrowSvg />
          </Box>
          <Heading fontSize="16px">{'Connect Wallet'}</Heading>
        </ModalHeader>
        <ModalBody padding="24px 30px 32px 30px">
          <VStack spacing="20px">
            <Text>Skip approving every interaction with your wallet by allowing CMail to remember you.</Text>
            <Button
                w='100%'
              colorScheme="gray"
              color="black"
              cursor="text"
              bg="#f7f7f7"
              as="div"
              _hover={{
                bg: '#f7f7f7',
              }}
            >
              <Flex w="100%" alignItems="center" justifyContent="space-between">
                <Text fontWeight={600} fontSize="16px">
                  {truncateMiddle(account, 6, 4)}
                </Text>
                <WalletSvg />
              </Flex>
            </Button>
            <Button
                w='100%'
              isLoading={isLoading}
              loadingText={'Check Wallet'}
              onClick={onRemember}
            >
              Check
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const Auth: React.FC = () => {
  useAuth()
  return null
}
