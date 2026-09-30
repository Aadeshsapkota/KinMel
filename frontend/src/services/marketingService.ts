import { api } from "../api/axios";

export async function sendCampaign(
  subject: string,
  message: string,
  bannerImageUrl: string,
) {
  const response = await api.post(
    "/marketing/campaign",
    {
      subject,
      message,
      bannerImageUrl,
    },
  );

  return response.data;
}