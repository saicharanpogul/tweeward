import { getTweetStats } from "@/api";
import useSignature from "@/hooks/useSignature";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useCallback, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Icon } from "@chakra-ui/icons";
import { Tweeward } from "@/utils/firebase";

const Stat = ({ title, value }: { title: string; value: number }) => {
  return (
    <Flex flexDir="column" alignItems={"center"} my="2" mx="2">
      <Text color="gray.300" fontSize="14">
        {title}
      </Text>
      <Text color="white" fontWeight="bold" fontSize="20">
        {value}
      </Text>
    </Flex>
  );
};

const StatCard = ({
  tweet,
  fetchStats,
}: {
  tweet: any;
  fetchStats: () => Promise<void>;
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const { connection } = useConnection();
  const walletAdapter = useWallet();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { signature, getSignature } = useSignature();
  const refreshStat = useCallback(
    async (id: string) => {
      try {
        setRefreshing(true);
        let _signature = signature;
        if (!_signature) _signature = (await getSignature()) as string;
        if (
          !walletAdapter.connected ||
          !connection ||
          !walletAdapter.publicKey
        ) {
          return toast({
            title: "Wallet not connected!",
            description: "Connect you wallet.",
            status: "error",
            duration: 4000,
          });
        }
        const resData = await getTweetStats(
          id,
          _signature,
          walletAdapter.publicKey.toBase58()
        );
      } catch (error) {
        console.log(error);
      } finally {
        setRefreshing(false);
      }
    },
    [
      connection,
      getSignature,
      signature,
      toast,
      walletAdapter.connected,
      walletAdapter.publicKey,
    ]
  );
  const deleteTweet = useCallback(async () => {
    try {
      if (!walletAdapter.connected || !connection || !walletAdapter.publicKey) {
        return toast({
          title: "Wallet not connected!",
          description: "Connect you wallet.",
          status: "error",
          duration: 4000,
        });
      }
      const tweeward = new Tweeward(walletAdapter.publicKey?.toBase58());
      await tweeward.removeStat(tweet?.tweetId);
      await fetchStats();
      toast({
        title: "Deleted!",
        description: `Deleted ${tweet?.tweetId}`,
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } catch (error) {
      console.log(error);
    }
  }, [
    connection,
    fetchStats,
    toast,
    tweet?.tweetId,
    walletAdapter.connected,
    walletAdapter.publicKey,
  ]);
  return (
    <Flex p="4" bg="background.500" m="2" borderRadius="12" flexDir="column">
      <Text color="white" my="4" fontSize="14">
        {tweet?.text}
      </Text>
      <Flex justifyContent={"space-evenly"} flexWrap="wrap">
        <Stat title="Impressions" value={tweet?.impression_count} />
        <Stat title="Likes" value={tweet?.like_count} />
        <Stat title="Quotes" value={tweet?.quote_count} />
        <Stat title="Replies" value={tweet?.reply_count} />
        <Stat title="Retweets" value={tweet?.retweet_count} />
      </Flex>
      <Flex
        justifyContent={"space-evenly"}
        mt="4"
        flexDir={["column", "column", "row", "row", "row"]}
      >
        <Button
          w="full"
          mx="2"
          loadingText="Refreshing..."
          isLoading={refreshing}
          onClick={() => refreshStat(tweet?.tweetId)}
          variant={"outline"}
          color="white"
          _hover={{ backgroundColor: "transparent" }}
        >
          Refresh
        </Button>
        <Button w="full" mx="2" mt={["2", "2", "0", "0", "0"]}>
          Claim
        </Button>
        <Menu
          onOpen={onOpen}
          onClose={onClose}
          isOpen={isOpen}
          placement="bottom-end"
        >
          {({ isOpen }) => (
            <>
              <MenuButton
                isActive={isOpen}
                as={Button}
                alignItems={"center"}
                justifyContent="center"
                rightIcon={<FiMoreVertical color="white" />}
                variant="ghost"
                pl="2"
                border="1px solid white"
                _hover={{ backgroundColor: "transparent" }}
                _active={{ backgroundColor: "transparent" }}
              />
              <MenuList bg="secondary.900">
                <MenuItem
                  bg="secondary.900"
                  color="white"
                  onClick={deleteTweet}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
        {/* <Icon
          as={FiMoreVertical}
          w="6"
          h="10"
          color="white"
          py="2"
          border="1px solid white"
          borderRadius="6"
          cursor="pointer"
          onClick={onOpen}
        /> */}
      </Flex>
    </Flex>
  );
};

export default StatCard;