import {
  ModalBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  Button,
  Spinner,
  Flex,
  Text,
  Circle,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Dispatch, SetStateAction } from "react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  NFTs: any[];
  setselectedNFT: Dispatch<SetStateAction<string>>;
  selectedNFT: any;
}

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
              >
                #{NFT?.id}
              </Flex>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SelectNFT;
