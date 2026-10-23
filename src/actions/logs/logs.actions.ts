"use server";
import { serverApi } from "@/infrastructure/lib/api/server-api";
import {
  FindLogsRequest,
  LogFiltersResponse,
  NextServerResponse,
  PaginatedLogsResponse,
} from "@/interfaces";

export async function getLogs(
  filters: FindLogsRequest = {},
): Promise<NextServerResponse<PaginatedLogsResponse>> {
  try {
    const response = await serverApi.get<PaginatedLogsResponse>("/logs", {
      params: filters,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al cargar los registros del sistema.",
    };
  }
}

export async function getLogFilters(): Promise<
  NextServerResponse<LogFiltersResponse>
> {
  try {
    const response = await serverApi.get<LogFiltersResponse>("/logs/filters");

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al cargar los filtros de logs.",
    };
  }
}
