import React from 'react'
import { ButtonProps } from '@chakra-ui/react'
import { ConnectModalWithMultichain } from './ConnectModalWithMultichain'
import {useAccount, useConnectWalletDialog, useEagerConnect} from "../../hooks/connectors";
import {Button} from "../../ui/Button";
import {ConfirmDialog} from "../../hooks/useDialog";

export interface ConnectWalletProps extends ButtonProps {
  renderConnected: (address: string) => React.ReactNode
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  renderConnected,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useConnectWalletDialog()
  const account = useAccount()

  useEagerConnect()

  return (
    <>
      {account ? (
        renderConnected(account)
      ) : (
        <Button
          onClick={onOpen}
          w="200px"
          loadingText={'Connecting'}
          {...props}
        >
          {'Connect Wallet'}
        </Button>
      )}
      <ConfirmDialog />
      <ConnectModalWithMultichain isOpen={isOpen} onClose={onClose} />
    </>
  )
}
