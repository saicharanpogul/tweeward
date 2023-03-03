import { changeProgress, selectProgress } from "@/store/progressSlice";
import { Icon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { HiCheckCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  isModalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
}

const ProgressModal: React.FC<Props> = ({
  isModalOpen,
  onModalOpen,
  onModalClose,
}) => {
  const progress = useSelector(selectProgress).progress;
  const dispatch = useDispatch();
  const initialized = progress === "initialized";
  const updated = progress === "updated";
  const closed = progress === "closed";
  useEffect(() => {
    if (!progress) {
      onModalClose();
    }
  }, [onModalClose, progress]);
  const getInitializeText = () => {
    if (initialized) return "Initialized";
    else if (closed || updated) return "Initialized";
    else return "Initializing...";
  };
  const getUpdateText = () => {
    if (updated || closed) return "Updated";
    else if (!initialized) return "Update pending";
    else return "Updating...";
  };
  const getCloseText = () => {
    if (closed) return "Closed";
    else if (!updated) return "Close pending";
    else return "Closing...";
  };
  const getInitializeIcon = () => {
    if (initialized) return <Icon as={HiCheckCircle} h="4" w="4" />;
    else if (closed || updated) return <Icon as={HiCheckCircle} h="4" w="4" />;
    else return <Spinner h="4" w="4" />;
  };
  const getUpdateIcon = () => {
    if (updated || closed) return <Icon as={HiCheckCircle} h="4" w="4" />;
    else if (!initialized) return <Icon as={BiTimeFive} h="4" w="4" />;
    else return <Spinner h="4" w="4" />;
  };
  const getCloseIcon = () => {
    if (closed) return <Icon as={HiCheckCircle} h="4" w="4" />;
    else if (!updated) return <Icon as={BiTimeFive} h="4" w="4" />;
    else return <Spinner h="4" w="4" />;
  };
  const getInitializeColor = () => {
    if (initialized) return "green.300";
    else if (closed || updated) return "green.300";
    else return "warning.500";
  };
  const getUpdateColor = () => {
    if (updated || closed) return "green.300";
    else if (!initialized) return "gray.400";
    else return "warning.500";
  };
  const getCloseColor = () => {
    if (closed) return "green.300";
    else if (!updated) return "gray.400";
    else return "warning.500";
  };
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={onModalClose}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Progress</ModalHeader>
          <ModalBody>
            <Flex alignItems="center">
              {getInitializeIcon()}
              <Text ml="2" color={getInitializeColor()}>
                {getInitializeText()}
              </Text>
            </Flex>
            <Divider orientation="vertical" h="5" ml="2" />
            <Flex alignItems="center">
              {getUpdateIcon()}
              <Text ml="2" color={getUpdateColor()}>
                {getUpdateText()}
              </Text>
            </Flex>
            <Divider orientation="vertical" h="5" ml="2" />
            <Flex alignItems="center">
              {getCloseIcon()}
              <Text ml="2" color={getCloseColor()}>
                {getCloseText()}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent={"space-between"}>
            <Text fontSize="14">{"Please don't close the window"}</Text>
            <Button
              opacity={closed ? "1" : "0.4"}
              cursor={closed ? "pointer" : "not-allowed"}
              mr={3}
              onClick={() => {
                closed && onModalClose();
                dispatch(changeProgress(undefined));
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProgressModal;
