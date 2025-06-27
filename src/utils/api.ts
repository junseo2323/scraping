// utils/api.ts

import axios from "axios";

export const api = {
  async get<T = any>(url: string): Promise<T> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    return res.json();
  },

  async post<T = any>(url: string, body: any): Promise<T> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `POST ${url} failed: ${res.status}`);
    }

    return res.json();
  },

  async patch<T = any>(url: string, body: any): Promise<T> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `PATCH ${url} failed: ${res.status}`);
    }

    return res.json();
  },

  async delete<T = any>(url: string): Promise<T> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `DELETE ${url} failed: ${res.status}`);
    }

    return res.json();
  },
};

export const fetcher = (url: string) => axios.get(url)
                                              .then(res => res.data);
