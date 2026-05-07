import "server-only";

import { auth } from "../auth";
import { API } from "@/interfaces";
import axios from "axios";

export const serverApi = axios.create({
  baseURL: `${API}/api`,
});

serverApi.interceptors.request.use(async (config) => {
  const session = await auth();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});
