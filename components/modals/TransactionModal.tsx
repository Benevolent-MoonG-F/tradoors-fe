import {
  ModalBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Button,
  Spinner,
  Flex,
  Text,
  Circle,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionStatus: string;
}

const TransactionModal = ({
  isOpen,
  onClose,
  transactionStatus,
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
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p={6}>
          <Flex justifyContent={"center"}>
            {transactionStatus === "pending" ? (
              <Spinner
                color='red'
                speed='0.8s'
                my={10}
                width='100px'
                height='100px'
                thickness='4px'
                size='xl'
              />
            ) : transactionStatus === "success" ? (
              <Circle size='90px' background={"#75F083"} my={8}>
                <Circle size='80px' background={"#ffffff"} my={3}>
                  <CheckIcon fontSize='40px' color={"#75F083"} />
                </Circle>
              </Circle>
            ) : transactionStatus === "failed" ? (
              <Circle size='90px' background={"#FF3358"} my={8}>
                <Circle size='80px' background={"#ffffff"} my={3}>
                  <CloseIcon fontSize='40px' color={"#FF3358"} />
                </Circle>
              </Circle>
            ) : null}
          </Flex>

          {transactionStatus === "pending" ? (
            <Text align={"center"}>Waiting For Confirmation...</Text>
          ) : transactionStatus === "failed" ? (
            <Text align={"center"}>Transaction Failed</Text>
          ) : transactionStatus === "success" ? (
            <Text align={"center"}>Transaction Successful</Text>
          ) : null}

          {/* <Button w='100%' colorScheme='blue'>
            Close
          </Button> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransactionModal;
