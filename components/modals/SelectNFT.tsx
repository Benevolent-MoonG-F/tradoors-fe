import {
  ModalBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  Flex,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { Dispatch, SetStateAction } from "react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  NFTs: any[];
  setselectedNFT: Dispatch<SetStateAction<string>>;
  selectedNFT: any;
}

const CircleIcon = (props: any) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
);

const SelectNFT = ({
  isOpen,
  onClose,
  NFTs,
  selectedNFT,
  setselectedNFT,
}: TransactionModalProps) => {
  return (
    <Modal
      closeOnOverlayClick={false}
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size={"sm"}
    >
      <ModalOverlay />
      <ModalContent
        border='1px'
        bgColor={"black"}
        borderColor={"rgba(255, 0, 89, 0.474)"}
        color={"#ffffff"}
      >
        <ModalHeader>Select NFT</ModalHeader>
        <ModalCloseButton mt={2} />
        <ModalBody p={6}>
          <Flex maxH={"200px"} overflowY={"scroll"} flexDirection={"column"}>
            {NFTs?.map((NFT) => (
              <Flex
                key={NFT?.id}
                border={selectedNFT?.id === NFT?.id ? "1px solid" : "none"}
                borderRadius='4px'
                borderColor='rgba(255, 0, 89, 0.474)'
                _hover={{
                  border: "1px solid",
                  borderRadius: "4px",
                  borderColor: "rgba(255, 0, 89, 0.474)",
                }}
                onClick={() => {
                  setselectedNFT(NFT);
                  onClose();
                }}
                cursor={"pointer"}
                p={2}
                justifyContent={"space-between"}
              >
                <Text> #{NFT?.id}</Text>
                {NFT?.used === true && (
                  <Flex alignItems={"center"}>
                    <CircleIcon boxSize={2} />
                    <Text ml={1} fontSize={"14px"}>
                      staked
                    </Text>
                  </Flex>
                )}
              </Flex>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SelectNFT;
