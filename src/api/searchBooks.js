import axios from "axios";
import { API_URL, REQUEST_TIMEOUT_MS } from "./constants.js";

function prepareQuery(query) {
  const normalizedISBN = query.replace(/[\s-]/g, "");
  const isISBN = /^\d{9}[\dXx]$|^\d{13}$/.test(normalizedISBN);

  return isISBN ? normalizedISBN.toUpperCase() : query;
}

export async function searchBooks(query, fields) {
  let response;

  const params = {
    q: prepareQuery(query),
  };

  if (fields) {
    params.fields = fields;
  }

  try {
    response = await axios.get(API_URL, {
      params,
      timeout: REQUEST_TIMEOUT_MS,
    });
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    if (error.response) {
      if (error.response.status === 429) {
        throw new Error(
          "Слишком много запросов. Попробуйте немного позже.",
          {
            cause: error,
          }
        );
      }

      throw new Error(
        `Ошибка сервера: HTTP ${error.response.status}`,
        {
          cause: error,
        }
      );
    }

    if (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    ) {
      throw new Error(
        "Сервер не ответил за 10 секунд. Попробуйте ещё раз.",
        {
          cause: error,
        }
      );
    }

    if (error.request) {
      throw new Error(
        "Не удалось получить ответ от API. Проверьте интернет или доступность сервера.",
        {
          cause: error,
        }
      );
    }

    throw new Error("Не удалось выполнить запрос к API.", {
      cause: error,
    });
  }

  if (!Array.isArray(response.data)) {
    throw new Error(
      "Сервер вернул данные в неизвестном формате"
    );
  }

  return response.data;
}