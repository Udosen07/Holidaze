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

export async function getAllVenues() {
  const response = await fetch(`${BASE_URL}/holidaze/venues`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.errors?.[0]?.message ?? "Registration failed");
  }

  return result;
}

export const getVenueById = async (id: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/holidaze/venues/${id}?_bookings=true&_owner=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch venue: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching venue by ID:", error);
    throw error;
  }
};
