import {
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Box,
  PopoverAnchor,
  usePopoverContext,
} from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import React, { useMemo, useRef } from 'react'
import { useEmailAddress } from '../../hooks/useEmailAddress'
import { ButtonList, ButtonListItemProps } from '../ButtonList'
import { ReactComponent as LogoutSvg } from '../../assets/images/logout.svg'
import {removeMailSuffix, truncateMailAddress} from '../../utils'
import { useLogout, userPropertiesAtom } from '../../hooks/useLogin'
import {useConnectWalletDialog} from "../../hooks/connectors";
import {useToast} from "../../hooks/useToast";
import { Button } from '../../ui/Button'
import { Avatar } from '../Avatar'

const PopoverBodyWrapper: React.FC<{ address: string }> = ({ address }) => {
  const context = usePopoverContext()
  const userProps = useAtomValue(userPropertiesAtom)
  const emailAddress = useEmailAddress()
  const { onOpen } = useConnectWalletDialog()
  const toast = useToast()
  const logout = useLogout()
  const btns: ButtonListItemProps[] = useMemo(
    () => [
      {
        label: 'Disconnect',
        icon: <LogoutSvg />,
        onClick() {
          context.onClose()
          logout()
        },
      },
    ],
    [address, userProps, emailAddress]
  )
  return <ButtonList items={btns} />
}

export const ConnectedButton: React.FC<{ address: string }> = ({ address }) => {
  const emailAddress = useEmailAddress()
  const popoverRef = useRef<HTMLElement>(null)
  const userProps = useAtomValue(userPropertiesAtom)

  const addr = useMemo(() => {
    const defaultAddress = userProps?.defaultAddress
    if (defaultAddress) {
      return truncateMailAddress(defaultAddress, 6, 4)
    }
    return emailAddress
  }, [userProps, emailAddress])

  return (
    <Popover
      arrowSize={18}
      autoFocus
      offset={[0, 20]}
      closeOnBlur
      strategy="fixed"
    >
      <PopoverTrigger>
        <Box cursor="pointer">
          <Button
            variant="outline"
            paddingLeft="6px"
            paddingRight="6px"
            minH="40px"
          >
            <PopoverAnchor>
              <Box>
                <Avatar
                  w="32px"
                  h="32px"
                  address={removeMailSuffix(
                    userProps?.defaultAddress || address
                  )}
                />
              </Box>
            </PopoverAnchor>
            <Text ml="6px" fontSize="12px" fontWeight="normal">
              {addr}
            </Text>
          </Button>
        </Box>
      </PopoverTrigger>
      <PopoverContent
        _focus={{
          boxShadow: '0px 0px 16px 12px rgba(192, 192, 192, 0.25)',
          outline: 'none',
        }}
        w="250px"
        border="none"
        borderRadius="12px"
        boxShadow="0px 0px 16px 12px rgba(192, 192, 192, 0.25)"
        ref={popoverRef}
      >
        <PopoverArrow />
        <PopoverBody padding="20px 16px 20px 16px">
          <PopoverBodyWrapper address={address} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
