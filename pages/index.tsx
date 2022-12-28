import { useState, useEffect } from "react";
import Head from "next/head";
import { useWallet } from "@cosmos-kit/react";
import { StdFee } from "@cosmjs/amino";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import BigNumber from "bignumber.js";
import Select from "react-select";
import axios from "axios";

import {
  Box,
  Text,
  Button,
  Flex,
  useColorMode,
  Image,
  Input,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useMediaQuery,
} from "@chakra-ui/react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import {
  chainassets,
  chainName,
  coin,
  dependencies,
  products,
} from "../config";

import { WalletStatus } from "@cosmos-kit/core";
import {
  Product,
  Dependency,
  WalletSection,
  handleChangeColorModeValue,
} from "../components";
import { cosmos } from "juno-network";
import Atom from "../public/images/cosmos-atom-logo.png";
import Juno from "../public/images/juno.svg";
import SCRT from "../public/images/secret-scrt-logo.png";
import OSMO from "../public/images/cosmos-atom-logo.png";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DR_ADDRESS, NFT_ADDRESS } from "../utils/constants";
import TransactionModal from "../components/modals/TransactionModal";
import SelectNFT from "../components/modals/SelectNFT";
import DISCORD from "../public/discord-icon.svg";
import TWITTER from "../public/twitter-icon.svg";
import { MobileWallet } from "../components/mobilewallet";
import { coin as COIN } from "@cosmjs/stargate";

const library = {
  title: "Juno Network",
  text: "Typescript libraries for the Juno ecosystem",
  href: "https://github.com/CosmosContracts/typescript",
};

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(
    "Juno"
  );
  const [selectedDashboardAsset, setselectedDashboardAsset] = useState<
    string | undefined
  >("Juno");

  const [dashboard, setDashboard] = useState(false);
  const [list, setList] = useState([]);
  const [price, setPrice] = useState("");
  const [tokenid, settokenid] = useState("");
  const [nftStatus, setnftStatus] = useState<{ [id: string]: boolean }>({});
  const [rolloverStatus, setrolloverStatus] = useState<{
    [id: string]: boolean;
  }>({});
  const [rolloverRound, setrolloverRound] = useState<{ [id: string]: number }>(
    {}
  );
  const [recheckStatusCounter, setrecheckStatusCounter] = useState(0);
  const [prediction, setPrediction] = useState("");
  const [userPredictions, setuserPredictions] = useState<any[]>([]);
  const [round, setRound] = useState(0);
  const [openModal, setopenModal] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [openNFTModal, setopenNFTModal] = useState(false);
  const [allNFTs, setallNFTs] = useState<any[]>([]);
  const [selectedNFT, setselectedNFT] = useState<any>();
  const {
    getSigningStargateClient,
    address,
    walletStatus,
    getRpcEndpoint,
    getSigningCosmWasmClient,
  } = useWallet();

  const [balance, setBalance] = useState(new BigNumber(0));
  const [isFetchingBalance, setFetchingBalance] = useState(false);
  const [resp, setResp] = useState("");
  const [isMobileDevice] = useMediaQuery("(max-width: 750px)");
  const [isAdmin, setisAdmin] = useState(false);
  const [adminPage, setadminPage] = useState(false);
  const [junoFinal, setjunoFinal] = useState("");
  const [scrtFinal, setscrtFinal] = useState("");
  const [osmoFinal, setosmoFinal] = useState("");
  const [atomFinal, setAtomFinal] = useState("");
  const [tokenAmount, settokenAmount] = useState("");

  const getBalance = async () => {
    if (!address) {
      setBalance(new BigNumber(0));
      setFetchingBalance(false);
      return;
    }

    let rpcEndpoint = await getRpcEndpoint();

    if (!rpcEndpoint) {
      console.log("no rpc endpoint — using a fallback");
      rpcEndpoint = `https://rpc.cosmos.directory/${chainName}`;
    }

    // get RPC client
    const client = await cosmos.ClientFactory.createRPCQueryClient({
      rpcEndpoint,
    });

    // fetch balance
    const balance = await client.cosmos.bank.v1beta1.balance({
      address,
      denom: chainassets?.assets[0].base as string,
    });

    // Get the display exponent
    // we can get the exponent from chain registry asset denom_units
    const exp = coin.denom_units.find((unit) => unit.denom === coin.display)
      ?.exponent as number;

    // show balance in display values by exponentiating it
    const a = new BigNumber(balance.balance.amount);
    const amount = a.multipliedBy(10 ** -exp);
    setBalance(amount);
    setFetchingBalance(false);
  };

  const assets = [
    {
      label: "Atom",
      image:
        "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png",
    },
    {
      label: "Juno",
      image: "https://assets.coingecko.com/coins/images/19249/large/juno.png",
    },
    {
      label: "SCRT",
      image: "https://assets.coingecko.com/coins/images/11871/large/Secret.png",
    },
    {
      label: "OSMO",
      image: "https://assets.coingecko.com/coins/images/16724/large/osmo.png",
    },
  ];

  const selectStyles = {
    input: (styles) => ({
      ...styles,
      width: "250px",
      // backgroundColor: "transparent",
      color: "white",
    }),
    control: (styles, {}) => ({
      ...styles,
      backgroundColor: "transparent",
      borderColor: "rgba(255, 0, 89, 0.474)",
      color: "white",
      cursor: "pointer",
      ":hover": {
        borderColor: "rgba(255, 0, 89, 0.474)",
      },
      ":focus": {
        borderColor: "rgba(255, 0, 89, 0.474)",
      },
      ":active": {
        borderColor: "rgba(255, 0, 89, 0.474)",
      },
    }),
    valueContainer: (style) => ({
      ...style,
      color: "white",
    }),
    menuList: (styles) => {
      return {
        ...styles,
        backgroundColor: "black",
      };
    },
    option: (styles, {}) => {
      return {
        ...styles,
        color: "white",
        fontSize: "16px",
        backgroundColor: "black",
        border: "1px solid",
        borderColor: "rgba(255, 0, 89, 0.474)",
        cursor: "pointer",
        ":hover": {
          backgroundColor: "rgba(255, 0, 89, 0.474)",
        },
      };
    },
  };

  console.log(nftStatus);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await axios.get(
          "https://api.coingecko.com/api/v3/coins/list"
        );
        setList(list.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchList();
  }, []);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (address) {
        try {
          const cosmwasmClient = await getSigningCosmWasmClient();

          if (!cosmwasmClient || !address) {
            console.error("stargateClient undefined or address undefined.");
            return;
          }
          const allTokens = [];
          const msg = {
            get_user_locked_tokens: {
              user: address,
            },
          };
          const obj = { tokens: { owner: address, limit: 200 } };
          var encoded = window.btoa(JSON.stringify(obj));
          console.log("encoded", encoded);
          const tokens = await axios.get(`
               https://api.uni.junonetwork.io/cosmwasm/wasm/v1/contract/${NFT_ADDRESS}/smart/${encoded}`);
          console.log(tokens);

          const query = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            msg
          );

          for (let i = 0; i < tokens.data.data.tokens.length; i++) {
            const nft = { used: false, id: tokens.data.data.tokens[i] };
            allTokens.push(nft);
          }

          for (let i = 0; query?.locked_tokens.length; i++) {
            const nft = { used: true, id: query?.locked_token[i] };
            allTokens.push(nft);
          }

          console.log("query", allTokens);

          setallNFTs(allTokens);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchNFTs();
  }, [address]);

  useEffect(() => {
    const getPrice = async () => {
      if (list) {
        try {
          const asset = list.filter(
            (item) => item.symbol === selectedAsset?.toLowerCase()
          );

          const coinInfo = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${asset[0].id}`
          );

          const price = coinInfo.data.market_data.current_price.usd;

          setPrice(price);
        } catch (err) {
          console.log(err);
        }
      }
    };

    // return () => clearInterval(intervalId);
    getPrice();
  }, [list, selectedAsset]);

  // console.log(list);

  useEffect(() => {
    const checktokenid = async () => {
      if (selectedNFT?.id) {
        try {
          const cosmwasmClient = await getSigningCosmWasmClient();

          console.log(address);
          console.log(cosmwasmClient);

          if (!cosmwasmClient || !address) {
            console.error("stargateClient undefined or address undefined.");
            return;
          }

          const entrypoint = {
            get_locked_nft_info: {
              nft_id: selectedNFT?.id,
            },
          };

          const query = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            entrypoint
          );

          console.log("query", query);

          setnftStatus((prev) => ({
            ...prev,
            [selectedNFT?.id]: query?.has_been_sent === true ? true : false,
          }));

          setrolloverStatus((prev) => ({
            ...prev,
            [selectedNFT?.id]:
              query?.is_used === true && query?.has_been_sent === true
                ? true
                : false,
          }));

          setrolloverRound((prev) => ({
            ...prev,
            [selectedNFT?.id]:
              query?.is_used === true && query?.has_been_sent === true
                ? query?.game_round
                : 0,
          }));
        } catch (err) {
          setnftStatus((prev) => ({
            ...prev,
            [selectedNFT?.id]: false,
          }));
          console.log(err);
        }
      }
    };

    checktokenid();
  }, [selectedNFT?.id, recheckStatusCounter]);

  useEffect(() => {
    const getRound = async () => {
      try {
        const cosmwasmClient = await getSigningCosmWasmClient();
        if (!cosmwasmClient || !address) {
          console.error("stargateClient undefined or address undefined.");
          return;
        }

        const msg = {
          get_count: {},
        };

        const query = await cosmwasmClient.queryContractSmart(DR_ADDRESS, msg);

        setRound(query?.count);

        console.log("round", query);
      } catch (err) {
        console.log(err);
      }
    };

    getRound();
  }, [address]);

  useEffect(() => {
    const checkTransactions = async () => {
      if (dashboard) {
        try {
          const cosmwasmClient = await getSigningCosmWasmClient();

          if (!cosmwasmClient || !address) {
            console.error("stargateClient undefined or address undefined.");
            return;
          }

          const entrypoint = {
            get_user_predictions: {
              round: round,
              asset: selectedDashboardAsset?.toLowerCase(),
              address: address,
            },
          };

          const query = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            entrypoint
          );

          const predictions = [];

          for (let i = 0; i < query.predictions.length; i++) {
            const msg = {
              get_prediction: {
                round: round,
                asset: selectedDashboardAsset?.toLowerCase(),
                pred_id: query.predictions[i],
              },
            };
            const prediction_query = await cosmwasmClient.queryContractSmart(
              DR_ADDRESS,
              msg
            );

            predictions.push(prediction_query);
          }

          setuserPredictions(
            predictions.filter((prediction) => prediction.owner === address)
          );

          console.log("query", query);
        } catch (err) {
          console.log(err);
        }
      }
    };

    checkTransactions();
  }, [selectedDashboardAsset, dashboard, address, round]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const cosmwasmClient = await getSigningCosmWasmClient();

        if (!cosmwasmClient || !address) {
          console.error("stargateClient undefined or address undefined.");
          return;
        }

        const entrypoint = {
          get_admin: {},
        };

        console.log("admin..");

        const query = await cosmwasmClient.queryContractSmart(
          DR_ADDRESS,
          entrypoint
        );

        setisAdmin(query === address);
      } catch (err) {
        setisAdmin(false);
        console.log(err);
      }
    };

    checkAdmin();
  }, [address]);

  const sendToken = async (
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient | undefined>,
    address: string | undefined
  ) => {
    try {
      const cosmwasmClient = await getSigningCosmWasmClient();
      if (!cosmwasmClient || !address) {
        console.error("stargateClient undefined or address undefined.");
        return;
      }

      setopenModal(true);
      setTransactionStatus("pending");

      if (nftStatus[selectedNFT?.id] === false) {
        let owner_nft = {
          owner_of: {
            token_id: selectedNFT?.id,
          },
        };

        const owner = await cosmwasmClient.queryContractSmart(
          NFT_ADDRESS,
          owner_nft
        );

        console.log(owner);

        console.log("sending");

        console.log(address);

        let entrypoint = {
          send_nft: {
            contract: DR_ADDRESS,
            token_id: selectedNFT?.id,
            msg: "eyJwcmljZSI6MjU0LCJhc3NldCI6Imp1bm8ifQ==",
          },
        };

        const tx = await cosmwasmClient.execute(
          address,
          NFT_ADDRESS,
          entrypoint,
          "auto"
        );

        if (tx.logs[0]) {
          setrecheckStatusCounter(recheckStatusCounter + 1);
          setopenModal(true);
          setTransactionStatus("success");
        }

        console.log("tx", tx);
      }
    } catch (err) {
      setopenModal(true);
      setTransactionStatus("failed");
      console.log(err);
    }
  };

  const predict = async () => {
    try {
      const cosmwasmClient = await getSigningCosmWasmClient();
      if (!cosmwasmClient || !address) {
        console.error("stargateClient undefined or address undefined.");
        return;
      }
      setopenModal(true);
      setTransactionStatus("pending");

      let msg = {
        predict: {
          asset: selectedAsset?.toLowerCase(),
          price: parseFloat(prediction),
          nft_id: tokenid,
        },
      };

      const tx = await cosmwasmClient.execute(address, DR_ADDRESS, msg, "auto");

      if (tx.logs[0]) {
        console.log("Transaction successful");
        setopenModal(true);
        setTransactionStatus("success");
      }
    } catch (err) {
      console.log(err);
      setopenModal(true);
      setTransactionStatus("failed");
      // toast.error("An error occured", {
      //   toastId: 2,
      // });
    }
  };

  const rollover = async () => {
    if (rolloverStatus[tokenid] === true) {
      try {
        const cosmwasmClient = await getSigningCosmWasmClient();
        if (!cosmwasmClient || !address) {
          console.error("stargateClient undefined or address undefined.");
          return;
        }

        let msg = {
          roll_over_nft: { round: rolloverRound[tokenid], nft_id: tokenid },
        };

        const tx = await cosmwasmClient.execute(
          address,
          DR_ADDRESS,
          msg,
          "auto"
        );

        if (tx.logs[0]) {
          console.log("Transaction successful");
          // toast.success("Transaction Succesful! 🚀", {
          //   toastId: 1,
          // });
        }
      } catch (err) {
        console.log(err);
        // toast.error("An error occured", {
        //   toastId: 2,
        // });
      }
    }
  };

  const startGame = async () => {
    try {
      const cosmwasmClient = await getSigningCosmWasmClient();
      if (!cosmwasmClient || !address) {
        console.error("stargateClient undefined or address undefined.");
        return;
      }

      setopenModal(true);
      setTransactionStatus("pending");

      let msg = {
        start_round: {},
      };

      const tx = await cosmwasmClient.execute(
        address,
        DR_ADDRESS,
        msg,
        "auto",
        undefined,
        [COIN(parseFloat(tokenAmount), "ujunox")]
      );

      if (tx.logs[0]) {
        console.log("Transaction successful");
        setopenModal(true);
        setTransactionStatus("success");
      }
    } catch (err) {
      console.log(err);
      setopenModal(true);
      setTransactionStatus("failed");
    }
  };

  const endGame = async () => {
    try {
      const cosmwasmClient = await getSigningCosmWasmClient();
      if (!cosmwasmClient || !address) {
        console.error("stargateClient undefined or address undefined.");
        return;
      }

      setopenModal(true);
      setTransactionStatus("pending");

      let msg = {
        set_winning_prices: {
          prices: [junoFinal, scrtFinal, osmoFinal, atomFinal],
        },
      };

      const tx = await cosmwasmClient.execute(address, DR_ADDRESS, msg, "auto");

      if (tx.logs[0]) {
        console.log("Transaction successful");
        setopenModal(true);
        setTransactionStatus("success");
      }
    } catch (err) {
      console.log(err);
      setopenModal(true);
      setTransactionStatus("failed");
    }
  };

  console.log(userPredictions);

  return (
    // <Container margin={0} maxW='100%'>
    <>
      <Head>
        <title>Tradoors Prediction Game</title>
        <meta name='description' content='Tradoors Prediction Game' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <WalletSection
        setAdminPage={setadminPage}
        isAdmin={isAdmin}
        setDashboard={setDashboard}
      />

      {/* <ToastContainer style={{ zIndex: 99 }} /> */}

      <Box
        color='white'
        minH='100vh'
        zIndex={1}
        backgroundAttachment={"fixed"}
        backgroundRepeat={"no-repeat"}
        backgroundSize={"cover"}
        filter={"blur(3px)"}
        bg="linear-gradient(0deg, rgba(0, 11, 30, 0.603), rgba(7, 7, 7, 0.603)) ,url('https://images.unsplash.com/photo-1498736297812-3a08021f206f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2271&q=80')"
      ></Box>

      <Flex
        color='white'
        position={"absolute"}
        left={"50%"}
        top={isMobileDevice && dashboard ? "30%" : "55%"}
        flexDirection={"column"}
        transform={"translate(-50%, -50%)"}
        alignItems={"center"}
        w={"80%"}
      >
        {dashboard ? (
          <>
            <Flex
              w={"100%"}
              border='1px solid "rgba(255, 0, 89, 0.474)"'
              flexDirection={"column"}
            >
              <Flex mb={20} justifyContent={"center"}>
                <Select
                  styles={selectStyles}
                  defaultValue={assets[1]}
                  onChange={(value) => setselectedDashboardAsset(value?.label)}
                  options={assets}
                  formatOptionLabel={(assets) => (
                    <Flex justifyContent={"space-between"}>
                      <Image
                        w={"30px"}
                        h={"30px"}
                        src={assets.image}
                        alt='image'
                      />
                      <span style={{ color: "white" }}>{assets.label}</span>
                    </Flex>
                  )}
                />
              </Flex>
              <Text fontWeight={"bold"} fontSize={"18px"} mb={5}>
                Transactions
              </Text>
              <TableContainer>
                <Table w={"100%"}>
                  <Thead>
                    <Tr>
                      <Th
                        borderColor={"rgba(255, 0, 89, 0.474)"}
                        color={"white"}
                      >
                        Status
                      </Th>
                      <Th
                        borderColor={"rgba(255, 0, 89, 0.474)"}
                        color={"white"}
                      >
                        Prediction
                      </Th>
                      <Th
                        borderColor={"rgba(255, 0, 89, 0.474)"}
                        color={"white"}
                      >
                        Prediction Time
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userPredictions?.map((prediction) => (
                      <Tr>
                        <Td borderColor={"rgba(255, 0, 89, 0.474)"}>
                          {prediction?.is_winner === false ? "Pending" : "Won"}
                        </Td>
                        <Td borderColor={"rgba(255, 0, 89, 0.474)"}>
                          ${prediction?.prediction}
                        </Td>
                        <Td borderColor={"rgba(255, 0, 89, 0.474)"}>
                          {new Date(prediction?.time * 1000).toLocaleString()}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          </>
        ) : adminPage ? (
          <Flex
            w={isMobileDevice ? "350px" : "500px"}
            borderRadius={"4px"}
            mt={5}
            py={5}
            px={5}
            border={"2px solid rgba(255, 0, 89, 0.474)"}
            alignItems={"center"}
            bgColor={"black"}
            flexDirection={"column"}
          >
            <Flex alignItems={"center"}>
              <Input
                value={tokenAmount}
                onChange={(e) => settokenAmount(e.target.value)}
              />
              <Button
                ml={2}
                _hover={{
                  bgColor: "rgba(255, 0, 89, 0.474)",
                }}
                _active={{
                  bgColor: "rgba(255, 0, 89, 0.474)",
                }}
                _focus={{
                  bgColor: "rgba(255, 0, 89, 0.474)",
                }}
                bgColor={"rgba(255, 0, 89, 0.474)"}
                my={10}
                px={6}
                onClick={() => startGame()}
              >
                Start Game
              </Button>
            </Flex>

            <Flex flexDirection={"column"}>
              <Flex alignItems={"center"}>
                <Text>JUNO</Text> <Text mx={5}>-</Text>{" "}
                <Input
                  value={junoFinal}
                  onChange={(e) => setjunoFinal(e.target.value)}
                />
              </Flex>
              <Flex mt={5} alignItems={"center"}>
                <Text>SCRT</Text> <Text mx={5}>-</Text>{" "}
                <Input
                  value={scrtFinal}
                  onChange={(e) => setscrtFinal(e.target.value)}
                />
              </Flex>
              <Flex mt={5} alignItems={"center"}>
                <Text>OSMO</Text> <Text mx={5}>-</Text>{" "}
                <Input
                  value={osmoFinal}
                  onChange={(e) => setosmoFinal(e.target.value)}
                />
              </Flex>
              <Flex mt={5} alignItems={"center"}>
                <Text>ATOM</Text> <Text mx={5}>-</Text>{" "}
                <Input
                  value={atomFinal}
                  onChange={(e) => setAtomFinal(e.target.value)}
                />
              </Flex>
            </Flex>

            <Button
              onClick={() => endGame()}
              ml={2}
              _hover={{
                bgColor: "rgba(255, 0, 89, 0.474)",
              }}
              _active={{
                bgColor: "rgba(255, 0, 89, 0.474)",
              }}
              _focus={{
                bgColor: "rgba(255, 0, 89, 0.474)",
              }}
              bgColor={"rgba(255, 0, 89, 0.474)"}
              my={10}
              px={6}
            >
              End Round
            </Button>
          </Flex>
        ) : (
          <>
            <Flex
              mt={20}
              borderRadius={"6px"}
              px={10}
              py={5}
              border={"3px solid rgba(255, 0, 89, 0.474)"}
              flexDirection={"column"}
              w={"200px"}
            >
              <Text fontWeight={"bold"} fontSize={"24px"} textAlign={"center"}>
                $6000
              </Text>
              <Text>In Weekly Pot</Text>
            </Flex>

            <Flex
              w={isMobileDevice ? "350px" : "500px"}
              borderRadius={"4px"}
              mt={5}
              py={5}
              px={5}
              border={"2px solid rgba(255, 0, 89, 0.474)"}
              alignItems={"center"}
              bgColor={"black"}
              flexDirection={"column"}
            >
              <Select
                styles={selectStyles}
                defaultValue={assets[1]}
                onChange={(value) => setSelectedAsset(value?.label)}
                options={assets}
                formatOptionLabel={(assets) => (
                  <Flex justifyContent={"space-between"}>
                    <Image
                      w={"30px"}
                      h={"30px"}
                      src={assets.image}
                      alt='image'
                    />
                    <span style={{ color: "white" }}>{assets.label}</span>
                  </Flex>
                )}
              />

              <Text mt={10} color='rgba(255, 0, 89, 0.474)' fontSize={"22px"}>
                Current Price - {selectedAsset}
              </Text>
              <Text fontWeight={"bold"} fontSize={"20px"}>
                ${price}
              </Text>
              <Text mt={10} color='rgba(255, 0, 89, 0.474)' fontSize={"22px"}>
                Select NFT
              </Text>
              <Flex
                onClick={() => setopenNFTModal(true)}
                border={"1px solid"}
                h='10'
                borderRadius={"4px"}
                w='300px'
                color='white'
                borderColor={"rgba(255, 0, 89, 0.474)"}
                alignItems={"center"}
                cursor={"pointer"}
                pl={2}
                _hover={{
                  borderColor: "none",
                }}
                _focus={{
                  borderColor: "none",
                }}
                _active={{
                  borderColor: "none",
                }}
              >
                {selectedNFT?.id}
              </Flex>
              {/* <Input
                value={tokenid}
                onChange={(e) => {
                  const re = /^[0-9]*$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    settokenid(e.target.value);
                  }
                }}
                h='10'
                borderRadius={"4px"}
                w='300px'
                color='white'
                borderColor={"rgba(255, 0, 89, 0.474)"}
                _hover={{
                  borderColor: "none",
                }}
                _focus={{
                  borderColor: "none",
                }}
                _active={{
                  borderColor: "none",
                }}
              /> */}

              <>
                <Text mt={10} color='rgba(255, 0, 89, 0.474)' fontSize={"22px"}>
                  Prediction:
                </Text>
                <Input
                  value={prediction}
                  onChange={(e) => {
                    const re = /^\d*\.?\d*$/;

                    if (e.target.value === "" || re.test(e.target.value)) {
                      setPrediction(e.target.value);
                    }
                  }}
                  disabled={nftStatus[selectedNFT?.id] === false}
                  h='10'
                  borderRadius={"4px"}
                  w='300px'
                  color='white'
                  borderColor={"rgba(255, 0, 89, 0.474)"}
                  _hover={{
                    borderColor: "none",
                  }}
                  _focus={{
                    borderColor: "none",
                  }}
                  _active={{
                    borderColor: "none",
                  }}
                />
              </>

              {nftStatus[selectedNFT?.id] === false && (
                <Flex>
                  <Button
                    mr={5}
                    onClick={() => {
                      sendToken(getSigningCosmWasmClient, address);
                    }}
                    px={6}
                    _focus={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    _active={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    _hover={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    bgColor={"rgba(255, 0, 89, 0.474)"}
                    mt={5}
                  >
                    Lock NFT
                  </Button>
                  {/*                   
                  <Button
                    onClick={() => {
                      console.log("withdraw");
                      // sendToken(getSigningCosmWasmClient, address);
                    }}
                    px={6}
                    _focus={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    _active={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    _hover={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    bgColor={"rgba(255, 0, 89, 0.474)"}
                    mt={5}
                  >
                    unstake NFT
                  </Button> */}
                </Flex>
              )}
              {nftStatus[selectedNFT?.id] === true ? (
                <Flex>
                  <Button
                    onClick={() => {
                      console.log("clicked");
                      predict();
                    }}
                    px={6}
                    _focus={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    _active={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    _hover={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    bgColor={"rgba(255, 0, 89, 0.474)"}
                    mt={5}
                    disabled={!prediction}
                  >
                    Play
                  </Button>
                  <Button
                    ml={5}
                    onClick={() => {
                      console.log("clicked");
                      predict();
                    }}
                    px={6}
                    _focus={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    _active={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    _hover={{
                      bgColor: "rgba(255, 0, 89, 0.474)",
                    }}
                    bgColor={"rgba(255, 0, 89, 0.474)"}
                    mt={5}
                  >
                    Unstake
                  </Button>
                </Flex>
              ) : !selectedNFT?.id ? (
                <Button
                  disabled
                  px={6}
                  _focus={{
                    bgColor: "rgba(255, 0, 89, 0.474)",
                  }}
                  _active={{
                    bgColor: "rgba(255, 0, 89, 0.474)",
                  }}
                  _hover={{
                    bgColor: "rgba(255, 0, 89, 0.474)",
                  }}
                  bgColor={"rgba(255, 0, 89, 0.474)"}
                  mt={5}
                >
                  Play
                </Button>
              ) : nftStatus[selectedNFT?.id] === undefined ? (
                <Button
                  disabled
                  px={6}
                  _focus={{
                    bgColor: "rgba(255, 0, 89, 0.474)",
                  }}
                  _active={{
                    bgColor: "rgba(255, 0, 89, 0.474)",
                  }}
                  _hover={{
                    bgColor: "rgba(255, 0, 89, 0.474)",
                  }}
                  bgColor={"rgba(255, 0, 89, 0.474)"}
                  mt={5}
                >
                  Play
                </Button>
              ) : null}
            </Flex>
          </>
        )}
        <Flex
          display={dashboard || adminPage ? "none" : undefined}
          alignItems={"center"}
          my={6}
          justifyContent={"center"}
        >
          <Text fontSize={"18px"} fontWeight={"600"} color='#ffffff'>
            Socials -
          </Text>
          <a href='https://discord.gg/hhfu8snRtX' target={"_blank"}>
            <Image cursor={"pointer"} src={DISCORD.src} />
          </a>
          <a href='https://twitter.com/TradooorsNFT'>
            <Image src={TWITTER.src} />
          </a>
        </Flex>
      </Flex>

      {isMobileDevice && <MobileWallet />}

      {/* <Center mb={16}>
        <SendTokensCard
          isConnectWallet={walletStatus === WalletStatus.Connected}
          balance={balance.toNumber()}
          isFetchingBalance={isFetchingBalance}
          response={resp}
          sendTokensButtonText='Send Tokens'
          handleClickSendTokens={sendTokens(
            getSigningStargateClient as () => Promise<SigningStargateClient>,
            setResp as () => any,
            address as string
          )}
          handleClickGetBalance={() => {
            setFetchingBalance(true);
            getBalance();
          }}
        />
      </Center> */}
      {/* </Container> */}
      <TransactionModal
        isOpen={openModal}
        onClose={() => setopenModal(false)}
        transactionStatus={transactionStatus}
      />

      <SelectNFT
        isOpen={openNFTModal}
        onClose={() => setopenNFTModal(false)}
        NFTs={allNFTs}
        setselectedNFT={setselectedNFT}
        selectedNFT={selectedNFT}
      />
    </>
  );
}
