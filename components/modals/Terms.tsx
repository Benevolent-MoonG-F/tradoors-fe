import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useColorModeValue,
  Text,
  Divider,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Terms({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms and Conditions</ModalHeader>
          <ModalCloseButton mt={3} size='sm' />

          <ModalBody>
            <Flex maxH='500px' overflowY={"scroll"} flexDirection={"column"}>
              <Text fontSize={"14px"}>
                Welcome to Tradooors Price Prediction Game. By accessing and
                using our site, you agree to be bound by the following terms and
                conditions (&quot;Terms&quot;). If you do not agree to these
                Terms, please do not use Tradooors.
              </Text>
              <Text fontSize={"14px"} my={5}>
                1. Eligibility: You must be at least 18 years of age to use
                Tradooors. It is your responsibility to ensure that our services
                are legal in your jurisdiction. Tradooors does not accept users
                from countries where use of cryptocurrency is illegal. It is
                your responsibility to ensure that it is legal to use the Site
                and participate in our games in your jurisdiction.
              </Text>
              <Text fontSize={"14px"} my={5}>
                2. Account Registration: In order to access certain features of
                Tradooors, you must register for an account. You agree to
                provide accurate and complete information when creating your
                account, and you agree to update your account information as
                needed. You are responsible for maintaining the confidentiality
                of your account and password, and you are solely responsible for
                all activities that occur under your account.
              </Text>
              <Text fontSize={"14px"} my={5}>
                3. Deposits and Withdrawals: Tradooors accepts our NFT
                collection as deposits. You are responsible for ensuring that
                you have sufficient funds in your account to cover any
                predictions you place. Tradooors reserves the right to delay or
                cancel any withdrawal request if we suspect that you have
                engaged in fraudulent or illegal activity.
              </Text>
              <Text fontSize={"14px"} my={5}>
                4. Predictions: All predictions are final once they have been
                placed. Tradooors will not cancel or modify any predictions
                unless it is required to do so by law.
              </Text>
              <Text fontSize={"14px"} my={5}>
                5. Disclaimer of Warranties: Tradooors is provided on an
                &quot;as is&quot; and &quot;as available&quot; basis. Tradooors
                makes no warranties of any kind, whether express or implied,
                including but not limited to implied warranties of
                merchantability, fitness for a particular purpose, and
                non-infringement. Tradooors does not warrant that the website
                will be available at all times or that it will be free from
                errors or viruses.
              </Text>
              <Text fontSize={"14px"} my={5}>
                6. Limitation of Liability: Tradooors will not be liable for any
                damages of any kind arising from the use of Tradooors, including
                but not limited to direct, indirect, incidental, punitive, and
                consequential damages. We are not responsible for any losses or
                damages that may arise from your participation in our games. You
                acknowledge that participating in games of chance carries
                inherent risks, and you agree to assume all such risks.
              </Text>
              <Text fontSize={"14px"} my={5}>
                7. Indemnification: You agree to indemnify and hold Tradooors
                and its affiliates, officers, agents, and employees harmless
                from any claim or demand, including reasonable attorneys&apos;
                fees, made by any third party due to or arising out of your use
                of Tradooors, your violation of these Terms, or your violation
                of any rights of another.
              </Text>
              <Text fontSize={"14px"} my={5}>
                8. Severability: If any provision of these Terms is found to be
                invalid or unenforceable, that provision shall be enforced to
                the maximum extent possible and the remaining provisions shall
                remain in full force and effect.
              </Text>
              <Text fontSize={"14px"} my={5}>
                9. Entire Agreement: These Terms constitute the entire agreement
                between you and Tradooors and supersede all prior or
                contemporaneous communications and proposals, whether oral or
                written.
              </Text>
              <Text fontSize={"14px"} my={5}>
                10. Changes to These Terms: Tradooors reserves the right to
                modify these Terms at any time. Any changes to these Terms will
                be posted on this page. Your continued use of Tradooors after
                any changes to these Terms will be deemed acceptance of those
                changes.
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              width={"100%"}
              // variant={"brand"}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
