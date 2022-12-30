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
  Tooltip,
} from "@chakra-ui/react";

import {
  Product,
  Dependency,
  WalletSection,
  handleChangeColorModeValue,
} from "../components";
import { cosmos } from "juno-network";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DR_ADDRESS, NFT_ADDRESS } from "../utils/constants";
import TransactionModal from "../components/modals/TransactionModal";
import SelectNFT from "../components/modals/SelectNFT";
import DISCORD from "../public/discord-icon.svg";
import TWITTER from "../public/twitter-icon.svg";
import { MobileWallet } from "../components/mobilewallet";
import { coin as COIN } from "@cosmjs/stargate";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

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

  const [resp, setResp] = useState("");
  const [isMobileDevice] = useMediaQuery("(max-width: 750px)");
  const [isAdmin, setisAdmin] = useState(false);
  const [adminPage, setadminPage] = useState(false);
  const [junoFinal, setjunoFinal] = useState("");
  const [scrtFinal, setscrtFinal] = useState("");
  const [osmoFinal, setosmoFinal] = useState("");
  const [atomFinal, setAtomFinal] = useState("");
  const [tokenAmount, settokenAmount] = useState("");
  const [selectedRound, setSelectedRound] = useState(0);
  const [currentPrecision, setcurrentPrecision] = useState(0);
  const [junoPrecision, setjunoPrecision] = useState(0);
  const [scrtPrecision, setscrtPrecision] = useState(0);
  const [osmoPrecision, setosmoPrecision] = useState(0);
  const [atomPrecision, setatomPrecision] = useState(0);
  const [previousroundInfo, setpreviousroundInfo] = useState<any>();
  const [recheckRoundCounter, setrecheckRoundCounter] = useState(0);
  const [recheckTransactionCounter, setrecheckTransactionCounter] = useState(0);

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
    input: (styles: any) => ({
      ...styles,
      width: "250px",
      // backgroundColor: "transparent",
      color: "white",
    }),
    control: (styles: any, {}) => ({
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
    valueContainer: (style: any) => ({
      ...style,
      color: "white",
    }),
    menuList: (styles: any) => {
      return {
        ...styles,
        backgroundColor: "black",
      };
    },
    option: (styles: any, {}) => {
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
          // const allTokens = [];
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

          console.log("token", query?.locked_tokens.length);

          const wallet_nfts = [];
          const used_nfts = [];

          for (let i = 0; i < tokens.data.data.tokens.length; i++) {
            const nft = { used: false, id: tokens.data.data.tokens[i] };
            wallet_nfts.push(nft);
          }

          for (let j = 0; j < query?.locked_tokens.length; j++) {
            const nft = { used: true, id: query?.locked_tokens[j] };
            used_nfts.push(nft);
          }

          // console.log("query", allTokens);

          const allTokens = wallet_nfts.concat(used_nfts);

          allTokens.sort(function (a, b) {
            return a.id - b.id;
          });

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
          const asset: any[] = list.filter(
            (item: any) => item.symbol === selectedAsset?.toLowerCase()
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
        setSelectedRound(query?.count);

        if (query?.count > 1) {
          const dayInfoMsg = {
            get_day_info: { round: query?.count - 1 },
          };
          const previousday = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            dayInfoMsg
          );

          setpreviousroundInfo(previousday);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getRound();
  }, [address, recheckRoundCounter]);

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
              round: selectedRound,
              asset: selectedDashboardAsset?.toLowerCase(),
              address: address,
            },
          };

          const round_info_msg = {
            get_day_info: { round: selectedRound },
          };

          const roundquery = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            round_info_msg
          );

          console.log("roundquery", roundquery);

          const query = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            entrypoint
          );

          const predictions = [];

          for (let i = 0; i < query.predictions.length; i++) {
            const msg = {
              get_prediction: {
                round: selectedRound,
                asset: selectedDashboardAsset?.toLowerCase(),
                pred_id: query.predictions[i],
              },
            };
            let prediction_query = await cosmwasmClient.queryContractSmart(
              DR_ADDRESS,
              msg
            );

            // console.log("prediction_query", query.predictions[i]);

            prediction_query["endTime"] = roundquery?.close_time;
            prediction_query["id"] = query.predictions[i];

            predictions.push(prediction_query);
          }

          setuserPredictions(
            predictions.filter((prediction) => prediction.owner === address)
          );

          console.log("query", query);
        } catch (err) {
          setuserPredictions([]);
          console.log(err);
        }
      }
    };

    checkTransactions();
  }, [
    selectedDashboardAsset,
    dashboard,
    address,
    round,
    selectedRound,
    recheckTransactionCounter,
  ]);

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

        const query = await cosmwasmClient.queryContractSmart(
          DR_ADDRESS,
          entrypoint
        );

        setisAdmin(query?.admin === address);
      } catch (err) {
        setisAdmin(false);
        console.log(err);
      }
    };

    checkAdmin();
  }, [address]);

  useEffect(() => {
    const getPrecision = async () => {
      if (selectedAsset) {
        try {
          const cosmwasmClient = await getSigningCosmWasmClient();

          if (!cosmwasmClient || !address) {
            console.error("stargateClient undefined or address undefined.");
            return;
          }

          if (dashboard) {
            const entrypoint = {
              get_asset_prescission: {
                asset: selectedDashboardAsset?.toLowerCase(),
              },
            };

            const query = await cosmwasmClient.queryContractSmart(
              DR_ADDRESS,
              entrypoint
            );

            setcurrentPrecision(query?.response);
          } else {
            const entrypoint = {
              get_asset_prescission: { asset: selectedAsset.toLowerCase() },
            };

            const query = await cosmwasmClient.queryContractSmart(
              DR_ADDRESS,
              entrypoint
            );

            setcurrentPrecision(query?.response);
          }
        } catch (err) {
          setcurrentPrecision(0);
          console.log(err);
        }
      }
    };

    getPrecision();
  }, [address, selectedAsset, selectedDashboardAsset]);

  useEffect(() => {
    const getPrecisions = async () => {
      if (selectedAsset) {
        try {
          const cosmwasmClient = await getSigningCosmWasmClient();

          if (!cosmwasmClient || !address) {
            console.error("stargateClient undefined or address undefined.");
            return;
          }

          const juno = {
            get_asset_prescission: {
              asset: "juno",
            },
          };

          const scrt = {
            get_asset_prescission: {
              asset: "srct",
            },
          };

          const osmo = {
            get_asset_prescission: {
              asset: "osmo",
            },
          };

          const atom = {
            get_asset_prescission: {
              asset: "atom",
            },
          };

          const junoquery = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            juno
          );
          const scrtquery = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            scrt
          );
          const osmoquery = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            osmo
          );
          const atomquery = await cosmwasmClient.queryContractSmart(
            DR_ADDRESS,
            atom
          );

          setjunoPrecision(junoquery?.response);
          setscrtPrecision(scrtquery?.response);
          setosmoPrecision(osmoquery?.response);
          setatomPrecision(atomquery?.response);
        } catch (err) {
          console.log(err);
        }
      }
    };

    getPrecisions();
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

      console.log("selected", selectedNFT?.id);

      let msg = {
        predict: {
          asset: selectedAsset?.toLowerCase(),
          price: parseFloat(prediction) * currentPrecision,
          nft_id: selectedNFT?.id,
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
          roll_over_nft: {
            round: rolloverRound[selectedNFT?.id],
            nft_id: selectedNFT?.id,
          },
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
        [COIN(parseFloat(tokenAmount) * 1000000, "ujunox")]
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
          prices: [
            parseFloat(junoFinal) * junoPrecision,
            parseFloat(scrtFinal) * scrtPrecision,
            parseFloat(osmoFinal) * osmoPrecision,
            parseFloat(atomFinal) * atomPrecision,
          ],
        },
      };

      const tx = await cosmwasmClient.execute(address, DR_ADDRESS, msg, "auto");

      if (tx.logs[0]) {
        console.log("Transaction successful");
        setopenModal(true);
        setTransactionStatus("success");
        setjunoFinal("");
        setscrtFinal("");
        setosmoFinal("");
        setAtomFinal("");
      }
    } catch (err) {
      console.log(err);
      setopenModal(true);
      setTransactionStatus("failed");
    }
  };

  const pickWinner = async (asset: string) => {
    try {
      const cosmwasmClient = await getSigningCosmWasmClient();
      if (!cosmwasmClient || !address) {
        console.error("stargateClient undefined or address undefined.");
        return;
      }

      setopenModal(true);
      setTransactionStatus("pending");

      let msg = {
        decide_asset_winners: { asset: asset },
      };

      const tx = await cosmwasmClient.execute(address, DR_ADDRESS, msg, "auto");

      if (tx.logs[0]) {
        console.log("Transaction successful");
        setopenModal(true);
        setTransactionStatus("success");
        setrecheckRoundCounter(recheckRoundCounter + 1);
      }
    } catch (err) {
      console.log(err);
      setopenModal(true);
      setTransactionStatus("failed");
    }
  };

  const claimWinning = async () => {
    try {
      const cosmwasmClient = await getSigningCosmWasmClient();
      if (!cosmwasmClient || !address) {
        console.error("stargateClient undefined or address undefined.");
        return;
      }

      setopenModal(true);
      setTransactionStatus("pending");

      let msg = {
        claim_winnings: {
          round: selectedRound,
          asset: selectedDashboardAsset?.toLowerCase(),
        },
      };

      const tx = await cosmwasmClient.execute(address, DR_ADDRESS, msg, "auto");

      if (tx.logs[0]) {
        console.log("Transaction successful");
        setopenModal(true);
        setTransactionStatus("success");
        setrecheckTransactionCounter(recheckTransactionCounter + 1);
      }
    } catch (err) {
      console.log(err);
      setopenModal(true);
      setTransactionStatus("failed");
    }
  };

  // useEffect(() => {}, [selectedRound]);

  console.log("userPredictions", userPredictions);

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
      {/* 
      <Box
        color='white'
        // minH='100vh'
        zIndex={1}
        backgroundAttachment={"fixed"}
        backgroundRepeat={"no-repeat"}
        backgroundSize={"cover"}
        filter={"blur(3px)"}
        bg="linear-gradient(0deg, rgba(0, 11, 30, 0.603), rgba(7, 7, 7, 0.603)) ,url('https://images.unsplash.com/photo-1498736297812-3a08021f206f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2271&q=80')"
      ></Box> */}

      <Box
        // zIndex={1}
        // backgroundAttachment={"fixed"}
        // backgroundRepeat={"no-repeat"}
        // backgroundSize={"cover"}
        // filter={"blur(3px)"}
        bg="linear-gradient(0deg, rgba(0, 11, 30, 0.603), rgba(7, 7, 7, 0.603)) ,url('https://images.unsplash.com/photo-1498736297812-3a08021f206f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2271&q=80')"
      >
        <Flex
          color='white'
          // position={"absolute"}
          // left={"50%"}
          // top={isMobileDevice && dashboard ? "30%" : "55%"}
          flexDirection={"column"}
          // transform={"translate(-50%, -50%)"}
          alignItems={"center"}
          justifyContent={"center"}
          // w={"80%"}
        >
          {dashboard ? (
            <>
              <Flex
                mt={20}
                minH={"100vh"}
                w={"80%"}
                border='1px solid "rgba(255, 0, 89, 0.474)"'
                flexDirection={"column"}
              >
                <Flex mb={10} justifyContent={"center"}>
                  <Select
                    styles={selectStyles}
                    defaultValue={assets[1]}
                    onChange={(value) =>
                      setselectedDashboardAsset(value?.label)
                    }
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
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text fontWeight={"bold"} fontSize={"18px"} mb={5}>
                    Transactions
                  </Text>
                  <Flex alignItems={"center"}>
                    <Flex
                      onClick={() => {
                        if (selectedRound !== 1) {
                          setSelectedRound((prev) => prev - 1);
                        }
                      }}
                      alignItems={"center"}
                      cursor={"pointer"}
                    >
                      <ArrowBackIcon mr={1} />
                      <Text>Prev</Text>
                    </Flex>
                    <Text fontWeight={"bold"} mx={5}>
                      {selectedRound}
                    </Text>
                    <Flex
                      cursor={"pointer"}
                      onClick={() => {
                        if (selectedRound !== round) {
                          setSelectedRound((prev) => prev + 1);
                        }
                      }}
                      alignItems={"center"}
                    >
                      <Text>Next</Text>
                      <ArrowForwardIcon ml={1} />
                    </Flex>
                  </Flex>
                </Flex>
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
                        <Th
                          borderColor={"rgba(255, 0, 89, 0.474)"}
                          color={"white"}
                        >
                          Close Time
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {userPredictions?.map((prediction, i) => (
                        <Tr key={i}>
                          <Td
                            cursor={
                              prediction?.is_winner === true &&
                              prediction?.paid === false
                                ? "pointer"
                                : undefined
                            }
                            onClick={() => claimWinning()}
                            borderColor={"rgba(255, 0, 89, 0.474)"}
                          >
                            {prediction?.is_winner === false
                              ? "Pending"
                              : prediction?.is_winner === true &&
                                prediction?.paid === false
                              ? "Won(Click to claim)"
                              : "Won(Claimed)"}
                          </Td>
                          <Td borderColor={"rgba(255, 0, 89, 0.474)"}>
                            $
                            {currentPrecision &&
                              parseFloat(prediction?.prediction) /
                                currentPrecision}
                          </Td>
                          <Td borderColor={"rgba(255, 0, 89, 0.474)"}>
                            {new Date(prediction?.time * 1000).toLocaleString()}
                          </Td>
                          <Td borderColor={"rgba(255, 0, 89, 0.474)"}>
                            {new Date(
                              prediction?.endTime * 1000
                            ).toLocaleString()}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Flex>
            </>
          ) : adminPage ? (
            <Flex minH={"100vh"} flexDirection={"column"}>
              <Flex
                w={isMobileDevice ? "350px" : "500px"}
                borderRadius={"4px"}
                mt={5}
                py={5}
                px={5}
                border={"2px solid rgba(255, 0, 89, 0.474)"}
                justifyContent={"center"}
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

                <Button
                  disabled={
                    previousroundInfo &&
                    previousroundInfo?.assets_decided[0] === true
                  }
                  onClick={() => pickWinner("juno")}
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
                  my={2}
                  px={6}
                >
                  Pick JUNO Winner
                </Button>
                <Button
                  onClick={() => pickWinner("scrt")}
                  disabled={
                    previousroundInfo &&
                    previousroundInfo?.assets_decided[1] === true
                  }
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
                  my={2}
                  px={6}
                >
                  Pick SCRT Winner
                </Button>
                <Button
                  onClick={() => pickWinner("osmo")}
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
                  my={2}
                  px={6}
                  disabled={
                    previousroundInfo &&
                    previousroundInfo?.assets_decided[2] === true
                  }
                >
                  Pick OSMO Winner
                </Button>
                <Button
                  onClick={() => pickWinner("atom")}
                  disabled={
                    previousroundInfo &&
                    previousroundInfo?.assets_decided[3] === true
                  }
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
                  my={2}
                  px={6}
                >
                  Pick ATOM Winner
                </Button>
              </Flex>
            </Flex>
          ) : (
            <>
              <Tooltip
                hasArrow
                label='Weekly Prize Pots are generated through commission earned on the Tradooors Validatoors, stake with us to increase the size of the prize pool each week'
                bg='black'
                placement='left-start'
                border={"3px solid rgba(255, 0, 89, 0.474)"}
              >
                <Flex
                  cursor={"pointer"}
                  mt={20}
                  borderRadius={"6px"}
                  px={10}
                  py={5}
                  border={"3px solid rgba(255, 0, 89, 0.474)"}
                  flexDirection={"column"}
                  w={"200px"}
                >
                  <Text
                    fontWeight={"bold"}
                    fontSize={"24px"}
                    textAlign={"center"}
                  >
                    $6000
                  </Text>
                  <Text>In Weekly Pot</Text>
                </Flex>
              </Tooltip>

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

                <>
                  <Text
                    mt={10}
                    color='rgba(255, 0, 89, 0.474)'
                    fontSize={"22px"}
                  >
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
            <a
              href='https://discord.gg/hhfu8snRtX'
              rel='noreferrer'
              target={"_blank"}
            >
              <Image cursor={"pointer"} src={DISCORD.src} />
            </a>
            <a
              rel='noreferrer'
              target={"_blank"}
              href='https://twitter.com/TradooorsNFT'
            >
              <Image src={TWITTER.src} />
            </a>
          </Flex>
        </Flex>
      </Box>

      {isMobileDevice && <MobileWallet />}
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
