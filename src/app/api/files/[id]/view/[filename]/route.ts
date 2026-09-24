import { serverApi } from "@/infrastructure/lib/api/server-api";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const response = await serverApi.get(`/folder/file/${id}/view`, {
      responseType: "arraybuffer",
    });

    return new Response(response.data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          response.headers["content-disposition"] ??
          'inline; filename="documento.pdf"',

        "Content-Length":
          response.headers["content-length"] ?? response.data.length.toString(),

        "Cache-Control": "private, no-store",

        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "No fue posible visualizar el archivo.",
      },
      {
        status: 404,
      },
    );
  }
}
