'use server';
import { createSessionTsType, createSessionZodType } from "@repo/types/userTypes";
import axios from "axios";

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
    const result = await axios.post(url, parsedPayload.data);
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
    const result = await axios.post(url, payload);
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
