import { getTweetStats } from "@/api";
import { PageMeta, StatCard } from "@/components";
import useDapp from "@/hooks/useDapp";
import useLocalWallet from "@/hooks/useLocalWallet";
import useSignature from "@/hooks/useSignature";
import { tweetObjArrToArray, tweetUrlToId } from "@/utils";
import { Tweeward } from "@/utils/firebase";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const Scrollable = styled(Flex)`
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
  }
`;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState<any[]>([]);
  const { connection } = useConnection();
  const walletAdapter = useWallet();
  const { balance } = useLocalWallet();
  const { signature, getSignature } = useSignature();
  const toast = useToast();
  const { initializeSolSyncCore } = useDapp();
  const schema = yup.object().shape({
    url: yup.string().required("URL is required"),
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    resetField,
    reset,
    watch,
    clearErrors,
    getValues,
  } = useForm<{
    url: string;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      url: "",
    },
  });
  const fetchStats = useCallback(async () => {
    if (!walletAdapter.connected || !connection || !walletAdapter.publicKey) {
      return;
    }
    const tweeward = new Tweeward(walletAdapter.publicKey?.toBase58());
    const data = await tweeward.getStats();
    setTweets(tweetObjArrToArray(data));
  }, [connection, walletAdapter.connected, walletAdapter.publicKey]);
  const onSubmit = async (data: { url: string }) => {
    try {
      setLoading(true);
      let _signature = signature;
      if (!_signature) _signature = (await getSignature()) as string;
      if (!walletAdapter.connected || !connection || !walletAdapter.publicKey) {
        return toast({
          title: "Wallet not connected!",
          description: "Connect you wallet.",
          status: "error",
          duration: 4000,
        });
      }
      console.log(data);
      const tweetId = tweetUrlToId(data.url);
      if (!tweetId) {
        toast({ title: "Invalid tweet ID.", status: "error" });
      }
      const resData = await getTweetStats(
        tweetId as string,
        _signature,
        walletAdapter.publicKey.toBase58()
      );
      toast({
        title: "Added!",
        description: `Added ${tweetId}`,
        status: "success",
        isClosable: true,
        duration: 5000,
      });
      await fetchStats();
      reset();
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Failed!",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  useEffect(() => {}, [tweets]);
  const buttonTitle = walletAdapter.connected
    ? balance < 30000000
      ? "Insufficient Balance"
      : "Add Tweet"
    : "Connect Wallet";
  const isButtonDisabled = walletAdapter.connected
    ? balance < 30000000
      ? true
      : false
    : true;
  return (
    <Box mt="100px" w="100vw">
      <Container maxW="container.xl" pb="10">
        <PageMeta />
        <Flex w="full" justifyContent={"center"}>
          <Scrollable
            flexDir="column"
            w={["full", "full", "50%", "50%", "50%"]}
            overflowY="auto"
            maxHeight="calc(100vh - 150px)"
            alignItems={"center"}
          >
            <Box
              position="fixed"
              top="80px"
              bg="secondary.100"
              w={["full", "full", "50%", "50%", "50%"]}
              px="4"
              zIndex={99}
              h="130px"
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* @ts-ignore */}
                <FormControl isInvalid={errors.url}>
                  <Input
                    id="url"
                    mt="4"
                    placeholder="Tweet URL"
                    color={"text.500"}
                    focusBorderColor="gray.500"
                    _placeholder={{
                      color: "gray.500",
                    }}
                    autoComplete={"off"}
                    {...register("url")}
                  />
                  <FormErrorMessage>
                    {errors.url && errors.url.message}
                  </FormErrorMessage>
                </FormControl>
                <Button
                  isLoading={loading}
                  loadingText="Adding..."
                  variant={"primary"}
                  mt="4"
                  w="full"
                  type="submit"
                  disabled={isButtonDisabled || loading}
                >
                  {buttonTitle}
                </Button>
              </form>
            </Box>
            <Box mt="40">
              {tweets.map((tweet) => (
                <StatCard
                  tweet={tweet}
                  key={tweet?.tweetId}
                  fetchStats={fetchStats}
                  initializeSolSyncCore={initializeSolSyncCore}
                />
              ))}
            </Box>
          </Scrollable>
        </Flex>
      </Container>
    </Box>
  );
}
