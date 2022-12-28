import { useWallet } from "@cosmos-kit/react";
import {
  Box,
  Center,
  Grid,
  GridItem,
  Icon,
  Stack,
  useColorModeValue,
  Text,
  Flex,
  Img,
  useMediaQuery,
  Slide,
} from "@chakra-ui/react";
import { MouseEventHandler, useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Astronaut,
  Error,
  Connected,
  ConnectedShowAddress,
  ConnectedUserInfo,
  Connecting,
  ConnectStatusWarn,
  CopyAddressBtn,
  Disconnected,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnectComponent,
  ChainCard,
} from "../components";
import { chainName } from "../config";

import Logo from "../public/TradooorsLogo3.png";
import { shortenAddress } from "../utils";
import { Dispatch, SetStateAction } from "react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

interface WalletSection {
  setDashboard: Dispatch<SetStateAction<boolean>>;
}

export const MobileWallet = () => {
  const walletManager = useWallet();
  const [isMobileDevice] = useMediaQuery("(max-width: 750px)");
  const [isOpen, setisOpen] = useState(false);
  const {
    connect,
    openView,
    walletStatus,
    username,
    address,
    message,
    currentChainName,
    currentWallet,
    currentChainRecord,
    getChainLogo,
    setCurrentChain,
  } = walletManager;

  useEffect(() => {
    setCurrentChain(chainName);
  }, [setCurrentChain]);

  const chain = {
    chainName: currentChainName,
    label: currentChainRecord?.chain.pretty_name,
    value: currentChainName,
    icon: getChainLogo(currentChainName),
  };

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={walletStatus}
      disconnect={
        <Disconnected buttonText='Connect Wallet' onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected
          buttonText={shortenAddress(address as string)}
          onClick={onClickOpenView}
        />
      }
      rejected={<Rejected buttonText='Reconnect' onClick={onClickConnect} />}
      error={<Error buttonText='Change Wallet' onClick={onClickOpenView} />}
      notExist={
        <NotExist buttonText='Install Wallet' onClick={onClickOpenView} />
      }
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={walletStatus}
      rejected={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${currentWallet?.walletInfo.prettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${currentWallet?.walletInfo.prettyName}: ${message}`}
        />
      }
    />
  );

  const userInfo = username && (
    <ConnectedUserInfo username={username} icon={<Astronaut />} />
  );
  const addressBtn = currentChainName && (
    <CopyAddressBtn
      walletStatus={walletStatus}
      connected={<ConnectedShowAddress address={address} isLoading={false} />}
    />
  );

  return (
    <Flex
      w='100%'
      position={"fixed"}
      bottom={0}
      bgColor={"#4C0F25"}
      alignItems={"center"}
      justifyContent={"center"}
      mx={0}
      px={isMobileDevice ? 4 : 10}
      py={2}
    >
      <Flex alignItems={"center"}>
        <Grid
          w='full'
          maxW='sm'
          // templateColumns='1fr'
          rowGap={4}
          justifyContent='flex-end'
        >
          <GridItem>
            <Stack
              justifyContent='center'
              alignItems='center'
              borderRadius='lg'
            >
              <Box w='full' maxW={{ base: 52, md: 64 }}>
                {connectWalletButton}
              </Box>
              {connectWalletWarn && <GridItem>{connectWalletWarn}</GridItem>}
            </Stack>
          </GridItem>
        </Grid>
      </Flex>
    </Flex>
  );
};
