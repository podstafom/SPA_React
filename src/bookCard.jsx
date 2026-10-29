import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

function BookCard({ book }) {
  const [expanded, setExpanded] = useState(false);
  const [failedCoverUrl, setFailedCoverUrl] = useState("");

  const title =
    typeof book.Title === "string" && book.Title.trim()
      ? book.Title
      : "Эх, названия нет";
  const author =
    typeof book.AuthorName === "string" && book.AuthorName.trim()
      ? book.AuthorName
      : "Эх, автор неизвестен";
  const publishedYear =
    (typeof book.PublishedYear === "string" &&
      book.PublishedYear.trim()) ||
    (typeof book.PublishedYear === "number" &&
      Number.isFinite(book.PublishedYear))
      ? book.PublishedYear
      : "Эх, год издания неизвестен";
  const isbn =
    typeof book.ISBN === "string" && book.ISBN.trim()
      ? book.ISBN
      : "Эх, ISBN не указан";
  const publisher =
    typeof book.Publisher === "string" && book.Publisher.trim()
      ? book.Publisher
      : "Эх, издательство не указано";
  const description =
    typeof book.Description === "string" && book.Description.trim()
      ? book.Description
      : "Эх, описание отсутствует";
  const coverUrl =
    typeof book.CoverUrl === "string" && book.CoverUrl.trim()
      ? book.CoverUrl
      : "";

  return (
    <Card className="book-card">
      {coverUrl && failedCoverUrl !== coverUrl ? (
        <CardMedia
          component="img"
          image={coverUrl}
          alt={title}
          className="book-cover"
          onError={() => setFailedCoverUrl(coverUrl)}
        />
      ) : (
        <Box className="book-cover-placeholder">
          <Typography variant="body2">
            Ну тут тип обложка должна быть, но автор не добавил
          </Typography>
        </Box>
      )}

      <CardContent>
        <Typography variant="h6" component="h2">{title}</Typography>

        <Typography color="text.secondary">Автор АКА крутой перец: {author}</Typography>

        <Typography>Год издания невероятен: {publishedYear}</Typography>

        <Typography>ISBN ваще четкий: {isbn}</Typography>

        <Typography>Издательство пушечка: {publisher}</Typography>

        <Typography className="book-description">
          {expanded
            ? description
            : description.length > 150
              ? description.slice(0, 150) + "..."
              : description}
        </Typography>

        {description.length > 150 && (
          <Button
            onClick={() => setExpanded(!expanded)}
            size="small"
            aria-expanded={expanded}
          >
            {expanded ? "Сверни меня" : "Разверни меня"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default BookCard;