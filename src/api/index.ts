import { SERVER } from "@/utils";
import axios from "axios";

export const getAccessKey = async (signature: string, publicKey: string) => {
  try {
    const { data } = await axios.post(
      `${SERVER}/api/getAccessKey`,
      { publicKey },
      { headers: { signature } }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTweetStats = async (
  id: string,
  signature: string,
  publicKey: string
) => {
  try {
    const { data } = await axios.post(
      `${SERVER}/api/getTweetStats`,
      { id, publicKey },
      {
        headers: {
          signature,
          authorization: `Bearer ${localStorage.getItem("access-key")}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
