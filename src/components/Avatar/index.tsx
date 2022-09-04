import {
  AvatarProps as RawAvatarProps,
  SkeletonProps,
  LayoutProps,
  WrapItem,
  Image,
} from '@chakra-ui/react'

import BoringAvatar from 'boring-avatars'
import {generateAvatarSrc} from "../../utils/avatar";

const IS_SAFARI =
  typeof navigator !== 'undefined' &&
  navigator.vendor?.includes('Apple') &&
  !navigator.userAgent.includes('CriOS') &&
  !navigator.userAgent.includes('FxiOS')

export interface AvatarProps extends RawAvatarProps {
  address: string
  skeletonProps?: SkeletonProps
  w?: LayoutProps['w']
  h?: LayoutProps['h']
  isSquare?: boolean
  isUseSvg?: boolean
}

export const Avatar: React.FC<AvatarProps> = ({
  address,
  size,
  skeletonProps,
  isSquare,
  onClick,
  isUseSvg = false,
  ...props
}) => {
  const width = props?.w
  return <WrapItem
          w={width}
          h={width}
          maxW={width}
          maxH={width}
          borderRadius={isSquare ? undefined : '50%'}
          overflow="hidden"
          onClick={onClick}
          cursor={onClick ? 'pointer' : undefined}
          {...props}
      >
        {!IS_SAFARI || isUseSvg ? (
            <BoringAvatar
                name={address.toLowerCase()}
                variant="marble"
                square
                size="100%"
                colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
            />
        ) : (
            <Image
                src={generateAvatarSrc(address.toLowerCase())}
                w={width}
                h={width}
            />
        )}
      </WrapItem>
}
