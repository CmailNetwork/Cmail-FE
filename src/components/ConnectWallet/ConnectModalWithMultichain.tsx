import {
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tabs,
  TabList,
  Tab,
  Box,
  Text,
  Image,
  Flex,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import React, { ReactNode, useMemo, useState } from 'react'

import EthIconPath from '../../assets/images/eth.png'
import { EthButtons } from './EthButtons'
import {useCloseOnChangePathname} from "../../hooks/useCloseOnChangePathname";

interface ChainItem {
  name: string
  icon: string
  description: ReactNode
  walletButtons: ReactNode[]
}

export const ConnectModalWithMultichain: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const chains: ChainItem[] = useMemo(
    () => [
      {
        name: 'ETH',
        icon: EthIconPath,
        description: 'EVM compatible chain: Ethereum, Polygon, BSC',
        walletButtons: [<EthButtons onClose={onClose} key="ethbuttons" />],
      },
    ],
    []
  )
  const currentChain = chains[0]

  useCloseOnChangePathname(onClose)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const maximumLengthOfWalletButtons = useMemo(
    () => Math.max(...chains.map((chain) => chain.walletButtons.length)),
    [chains]
  )

  const currentWalletButtonsLength = currentChain?.walletButtons?.length || 3

  const contentEl = (
    <>
      <Heading fontSize="16px" lineHeight="24px" mb="32px" textAlign="center">
        {'Connect Your Wallet'}
      </Heading>
      <Tabs
        variant="unstyled"
        index={0}
      >
        <TabList>
          <Flex
            w="auto"
            maxW="full"
            overflowX="auto"
            overflowY="hidden"
            mx="auto"
          >
            {chains.map((chain, index) => (
              <Tab
                key={chain.name}
                color={'#000'}
                fontSize="14px"
                fontWeight={600}
                position="relative"
                px="8px"
                pb="7px"
                flexShrink={0}
              >
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  w="16px"
                  h="16px"
                  objectFit="contain"
                  mr="2px"
                />
                {chain.name}
                <Box
                  position="absolute"
                  bottom="5px"
                  left="26px"
                  h="3px"
                  w="calc(100% - 18px - 16px)"
                  bg="#000"
                  rounded="5px"
                  opacity={1}
                  transition="200ms"
                />
              </Tab>
            ))}
          </Flex>
        </TabList>
      </Tabs>
      <Box as="hr" borderColor="#E0E0E0" mx="30px" />
      <Box bg="#F3F3F3">
        <Text
          fontSize="12px"
          lineHeight="18px"
          color="#6F6F6F"
          textAlign="center"
          my="24px"
        >
          {currentChain?.description}&nbsp;
        </Text>
        <Box
          overflowX="hidden"
          overflowY="hidden"
          minH="223px"
          position="relative"
          mb="24px"
          display='flex'
          justifyContent="center"
        >
            {currentChain?.walletButtons}
        </Box>
      </Box>
      <Box
        textAlign="center"
        mt="17px"
        maxW="324px"
        w="full"
        mx="auto"
        fontSize="12px"
        lineHeight="16px"
        color="#6F6F6F"
      >
        {'We do not own your private keys and cannot access your assets without your confirmation.'}
      </Box>
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
      <ModalOverlay />
      <ModalContent maxW="520px" rounded="24px" pt="24px" pb="32px">
        <ModalCloseButton />
        {contentEl}
      </ModalContent>
    </Modal>
  )
}
