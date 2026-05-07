"use client";

import { API } from "@/interfaces";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const clientApi = axios.create({
  baseURL: `${API}/api`,
});

clientApi.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: "/auth/login" });
    }

    return Promise.reject(error);
  },
);
