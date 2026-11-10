import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from "@mui/material";

import { Link } from "react-router-dom";
import BookCard from "../bookCard.jsx";
import useFavorite from "../hooks/useFavorite.js";

function Favorites() {
    const [searchQuery, setSearchQuery] = useState("");

    const {
        favorites,
        removeFavorite,
        isFavorite,
    } = useFavorite();

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredFavorites = favorites.filter((book) => {
    const searchableText = [
        book.Title || "",
        book.AuthorName || "",
        book.ISBN || "",
    ]
        .join(" ")
        .toLowerCase();

    return searchableText.includes(normalizedQuery);
    });

    return (
        <Container maxWidth="lg" className="app-container">
            <Box className="app-header">
                <Typography variant="h3" component="h1">
                    Избранное
                </Typography>

                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                >
                    Вернуться к поиску
                </Button>
            </Box>
                <TextField
                    fullWidth
                    label="Поиск в избранном"
                    placeholder="Введите название книги, автора или ISBN"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                />
                {favorites.length === 0 && (
                    <Alert severity="info">
                    В избранном пока нет книг.
                    </Alert>
                )}

                {favorites.length > 0 && filteredFavorites.length === 0 && (
                    <Alert severity="info">
                    По вашему запросу ничего не найдено.
                    </Alert>
                )}

                {filteredFavorites.length > 0 && (
                    <Box className="books-grid">
                        {filteredFavorites.map((book, index) => (
                            <BookCard
                            key={book.guid || book.ISBN || index}
                            book={book}
                            isFavorite={isFavorite(book)}
                            onToggleFavorite={removeFavorite}
                            />
                        ))}
                    </Box>
                )}
        </Container>
    );
}

export default Favorites;