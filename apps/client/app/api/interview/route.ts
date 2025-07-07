'use server';
import { createSessionTsType, createSessionZodType } from "@repo/types/userTypes";
import axios from "axios";
import { cookies } from "next/headers";

const base = (process.env.NEXTAUTH_BEURL ?? "http://localhost:8080/api/v1/");

export const submitNewSessionReq = async (payload: createSessionTsType) => {
  console.debug("called");

  const url = base + "interview/new";
  console.debug(payload);

  const parsedPayload = createSessionZodType.safeParse(payload);
  if (!parsedPayload.success) {
    console.debug("payload failure");
    return {
      success: false,
      status: 400,
      error: "Invalid payload",
      issues: parsedPayload.error.issues,
    };
  }
  console.debug("payload success");
  try {
    console.debug(url);
		const cookieStore = await cookies();
  	const accessToken = cookieStore.get('accessToken');
  	const refreshToken = cookieStore.get('refreshToken');
		const result = await axios.post(url, parsedPayload.data, {
      headers: {
        Cookie: `accessToken=${accessToken?.value}; refreshToken=${refreshToken?.value}`
      }
    });
    console.debug("this is the true received data");
    console.debug(result);
    return {
      success: true,
      status: 200,
      data: result.data,
    };
  } catch (err: any) {
    console.debug("failure");
    console.error("Axios error:", err?.response?.data || err.message);
    return {
      success: false,
      status: err?.response?.status || 500,
      error: err?.response?.data?.message || "Failed to submit session",
    };
  }
};

export const getInterviewDetails = async (userId: string) => {
  const url = base + "interview/new";
  const payload = {
    id: userId
  }

  try {
		const cookieStore = await cookies();
  	const accessToken = cookieStore.get('accessToken');
  	const refreshToken = cookieStore.get('refreshToken');
		const result = await axios.post(url, payload, {
      headers: {
        Cookie: `accessToken=${accessToken?.value}; refreshToken=${refreshToken?.value}`
      }
    });
    return {
      success: true,
      status: 200,
      data: result.data,
    };
  } catch (err: any) {
    console.error("Axios error:", err?.response?.data || err.message);
    return {
      success: false,
      status: err?.response?.status || 500,
      error: err?.response?.data?.message || "Failed to submit session",
    };
  }
}

export const getUserHostedSessions = async (userId: string) => {
	const url = base + "user/hosted";
	const payload = {
    userId: userId
  }

	try {
		const cookieStore = await cookies();
  	const accessToken = cookieStore.get('accessToken');
  	const refreshToken = cookieStore.get('refreshToken');
		const result = await axios.post(url, payload, {
      headers: {
        Cookie: `accessToken=${accessToken?.value}; refreshToken=${refreshToken?.value}`
      }
    });
		return {
      success: true,
      status: 200,
      data: result.data,
    }
	} catch (err) {
    console.error("Axios error:", err?.response?.data || err.message);
    return {
      success: false,
      status: err?.response?.status || 500,
      error: err?.response?.data?.message || "Failed to submit session",
    };
  }
}

export const getUserParticipatedSessions = async (userId: string) => {
	const url = base + "user/participated";
	const payload = {
    userId: userId
  }

	try {
		const cookieStore = await cookies();
  	const accessToken = cookieStore.get('accessToken');
  	const refreshToken = cookieStore.get('refreshToken');
		const result = await axios.post(url, payload, {
      headers: {
        Cookie: `accessToken=${accessToken?.value}; refreshToken=${refreshToken?.value}`
      }
    });
		return {
      success: true,
      status: 200,
      data: result.data,
    }
	} catch (err) {
    console.error("Axios error:", err?.response?.data || err.message);
    return {
      success: false,
      status: err?.response?.status || 500,
      error: err?.response?.data?.message || "Failed to submit session",
    };
  }
}
