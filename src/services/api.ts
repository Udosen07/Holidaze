import type { RegisterUserData, LoginUserData } from "../types";

const BASE_URL = "https://v2.api.noroff.dev";

export async function registerUser(data: RegisterUserData) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.errors?.[0]?.message ?? "Registration failed");
  }
}

export async function loginUser(data: LoginUserData) {
  const response = await fetch(`${BASE_URL}/auth/login?_holidaze=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.errors?.[0]?.message ?? "Registration failed");
  }

  return result;
}
