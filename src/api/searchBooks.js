import axios from "axios";
import { API_URL, REQUEST_TIMEOUT_MS } from "./constants.js";

function prepareQuery(query) {
  const normalizedISBN = query.replace(/[\s-]/g, "");
  const isISBN = /^\d{9}[\dXx]$|^\d{13}$/.test(normalizedISBN);

  return isISBN ? normalizedISBN.toUpperCase() : query;
}

export async function searchBooks(query) {
  const response = await axios.get(API_URL, {
    params: { q: prepareQuery(query) },
    timeout: REQUEST_TIMEOUT_MS,
  });

  return response.data;
}