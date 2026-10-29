import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import BookCard from "./bookCard.jsx";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const activeRequestRef = useRef(null);

  async function handleSearch(event) {
    event.preventDefault();

    if (activeRequestRef.current) {
      return;
    }

    const searchQuery = query.trim();

    if (searchQuery === "") {
      setError("Не, так не правильно. Нужно ввести чётенькое произведение или чётенький ISBN <3");
      setBooks([]);
      setSearched(false);
      return;
    }

    setError("");
    setBooks([]);
    setSearched(false);
    setLoading(true);

    const normalizedISBN = searchQuery.replace(/[\s-]/g, "");
    const isISBN = /^\d{9}[\dXx]$|^\d{13}$/.test(normalizedISBN);
    const apiQuery = isISBN ? normalizedISBN.toUpperCase() : searchQuery;
    const url = "https://bookmetadata.ru/api/v1/search?q=" + encodeURIComponent(apiQuery);
    const controller = new AbortController();
    activeRequestRef.current = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Слишком много запросов"
          );
        }

        if (response.status === 400) {
          throw new Error(
            "API отклонил запрос, проверьте корректность запроса"
          );
        }

        throw new Error(`Ошибка сервера (HTTP ${response.status}).`);
      }

      const data = await response.json();

      if (
        !Array.isArray(data) ||
        data.some(
          (book) => !book || typeof book !== "object" || Array.isArray(book)
        )
      ) {
        throw new Error("Сервер вернул данные в неизвестном формате");
      }

      setBooks(data);
      setSearched(true);
    } catch (err) {
      if (activeRequestRef.current !== controller) {
        return;
      }

      console.error("Ошибка поиска книг:", err);

      if (err instanceof Error && err.name === "AbortError") {
        setError("Сервер не ответил за 10 секунд,  повторите ЕЩЕЕЕ раз запрос");
      } else if (err instanceof TypeError) {
        setError(
          "Не удалось подключиться к API, проверьте свой не скоростной интернет"
        );
      } else if (err instanceof SyntaxError) {
        setError("Сервер вернул некорректный ответ");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Произошла неизвестная ошибка"
        );
      }
    } finally {
      clearTimeout(timeoutId);

      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setLoading(false);
      }
    }
  }

  return (
    <Container maxWidth="lg" className="app-container">
      <Box className="app-header">
        <Typography variant="h3" component="h1">
          Поиск книжечек
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Здесь можно найти кНИГУ по названию или ISBN
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSearch} className="search-form">
        <TextField
          fullWidth
          label="Введите название приколдесной кНИГИ или ISBN"
          placeholder="Например, писят два или 67"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={loading}
        />

        <Button type="submit" variant="contained" disabled={loading}>
          Найти нигу
        </Button>
      </Box>

      {loading && (
        <Box className="loading-box" aria-live="polite">
          <CircularProgress aria-label="Загрузка результатов поиска" />
          <Typography>Усердно ищу, подождите ;)</Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" className="status-message">
          {error}
        </Alert>
      )}

      {!loading && searched && books.length === 0 && (
        <Alert severity="info" className="status-message">
          Такой книженции нет, не было и не будет. Попробуйте другой запросик пж
        </Alert>
      )}

      {!loading && books.length > 0 && (
        <Typography variant="h5" component="h2" className="results-title">
          Успешно нашел твои книжечки: {books.length}
        </Typography>
      )}

      {!loading && (
        <Box className="books-grid">
          {books.map((book, index) => (
            <BookCard
              key={book.guid || book.ISBN || index}
              book={book}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}

export default App;