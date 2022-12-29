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
  setAdminPage: Dispatch<SetStateAction<boolean>>;
  isAdmin: boolean;
}

export const WalletSection = ({
  setDashboard,
  isAdmin,
  setAdminPage,
}: WalletSection) => {
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

  console.log("admin", isAdmin);

  return (
    <Flex
      bgColor={"#4C0F25"}
      alignItems={"center"}
      justifyContent={"space-between"}
      mx={0}
      px={isMobileDevice ? 4 : 10}
      py={2}
    >
      <Flex
        cursor={"pointer"}
        onClick={() => {
          setDashboard(false);
          setAdminPage(false);
        }}
      >
        <Img src={Logo.src} h={"70px"} w={"140px"} />
      </Flex>
      {isMobileDevice ? (
        <HamburgerIcon
          w={8}
          h={8}
          onClick={() => setisOpen(true)}
          color={"#ffffff"}
        />
      ) : (
        <Flex alignItems={"center"}>
          <Text
            onClick={() => setDashboard(true)}
            cursor={"pointer"}
            mr={10}
            fontSize={"18px"}
            color='white'
            fontWeight={"800"}
          >
            Dashboard
          </Text>
          <a
            href='https://nft-juno.loop.markets/exploreCollection/tradooors'
            target={"_blank"}
            rel='noreferrer'
          >
            <Text
              cursor={"pointer"}
              mr={10}
              fontSize={"18px"}
              color='white'
              fontWeight={"800"}
            >
              Marketplace
            </Text>
          </a>
          <a
            href='https://www.mintscan.io/juno/validators/junovaloper1ssptq8zljxmvm9h7g5yaxyv9khpf84793dkt3j'
            target={"_blank"}
            rel='noreferrer'
          >
            <Text
              cursor={"pointer"}
              mr={10}
              fontSize={"18px"}
              color='white'
              fontWeight={"800"}
            >
              Validator
            </Text>
          </a>
          {isAdmin && (
            <Text
              onClick={() => setAdminPage(true)}
              cursor={"pointer"}
              mr={10}
              fontSize={"18px"}
              color='white'
              fontWeight={"800"}
            >
              Admin
            </Text>
          )}
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
      )}

      {isMobileDevice && (
        <Slide direction='left' in={isOpen} style={{ zIndex: 10 }}>
          <Box color='white' bg='black' rounded='md' shadow='md' h='100vh'>
            <Flex p={4} justifyContent={"flex-end"}>
              <CloseIcon
                mt={4}
                w={6}
                h={6}
                onClick={() => setisOpen(false)}
                color={"#ffffff"}
              />
            </Flex>

            <Flex px={10} color={"#ffffff"} flexDirection={"column"}>
              <Text
                fontSize={"20px"}
                onClick={() => {
                  setDashboard(true);
                  setisOpen(false);
                }}
              >
                Dashboard
              </Text>

              <a
                href='https://nft-juno.loop.markets/exploreCollection/tradooors'
                target={"_blank"}
                rel='noreferrer'
              >
                <Text mt={5} fontSize={"20px"}>
                  Marketplace
                </Text>
              </a>

              <a
                href='https://www.mintscan.io/juno/validators/junovaloper1ssptq8zljxmvm9h7g5yaxyv9khpf84793dkt3j'
                target={"_blank"}
                rel='noreferrer'
              >
                <Text mt={5} fontSize={"20px"}>
                  Validator
                </Text>
              </a>

              {isAdmin && (
                <Text
                  fontSize={"20px"}
                  onClick={() => {
                    setAdminPage(true);
                  }}
                >
                  Admin
                </Text>
              )}
            </Flex>
          </Box>
        </Slide>
      )}
    </Flex>
  );
};
