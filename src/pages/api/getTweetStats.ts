import { Tweeward } from "@/utils/firebase";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import withProtect from "../../../src/lib/middleware/withProtect";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  signature: string,
  publicKey: string
) => {
  try {
    const id = req.body.id;
    const { data } = await axios.get(
      `https://api.twitter.com/2/tweets?ids=${id}&tweet.fields=attachments,author_id,created_at,public_metrics,source`,
      {
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_TWITTER_API_KEY,
        },
      }
    );
    const tweeward = new Tweeward(publicKey);
    await tweeward.addOrUpdateTweetStats({
      [id]: { ...data.data[0].public_metrics, text: data.data[0].text },
    });
    res.status(200).json({ success: true, data: data.data[0].public_metrics });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default withProtect(handler);
