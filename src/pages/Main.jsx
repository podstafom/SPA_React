import useLogic from "../hooks/useLogic.js";
import useFavorite from "../hooks/useFavorite.js";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import BookCard from "../bookCard.jsx";

function Main() {
    const {
        query,
        setQuery,
        books,
        loading,
        error,
        searched,
        handleSearch,
        suggestions,
        suggestionsLoading,
        clearSuggestions,
    } = useLogic();

    const {
        addFavorite,
        removeFavorite,
        isFavorite
    } = useFavorite();

    const handleToggleFavorite = (book) => {
        if (isFavorite(book)) {
            removeFavorite(book);
        } else {
            addFavorite(book);
        }
    };

    const handleInputChange = (event, newInputValue, reason) => {
        if (reason === "input" || reason === "clear") {
            setQuery(newInputValue);

            if (newInputValue.trim().length < 3) {
            clearSuggestions();
            }
        }
    };

    const handleAutocompleteChange = (event, selectedBook) => {
        if (selectedBook && typeof selectedBook !== "string") {
            const selectedTitle = selectedBook.Title || "";

            setQuery(selectedTitle);
            handleSearch(null, selectedTitle);
        }
    };

    const filterAutocompleteOptions = (options) => {
        return options;
    };

    const getAutocompleteOptionLabel = (option) => {
        if (typeof option === "string") {
            return option;
        }

    return option.Title || "";
    };

    const renderAutocompleteOption = (props, option) => {
        return (
            <li {...props}>
                <Box>
                    <Typography variant="body1">
                        {option.Title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {option.AuthorName || "Автор не указан"}
                    </Typography>
                </Box>
            </li>
        );
    };

    const renderAutocompleteInput = (params) => (
        <TextField
        {...params}
        label="Введите название приколдесной книги или ISBN"
        placeholder="Например, писят два или 67"
        />
    );

    const noOptionsMessage = query.trim().length < 3
        ? "Введите не менее 3 символов"
        : "Подходящих книг не найдено";

    return (
        <Container maxWidth="lg" className="app-container">
        <Box className="app-header">
            <Typography variant="h3" component="h1">
            Поиск книжечек
            </Typography>

            <Typography variant="body1" color="text.secondary">
            Здесь можно найти книгу по названию или ISBN
            </Typography>

            <Button
            component={Link}
            to="/favorites"
            variant="outlined"
            >
            Избранное
            </Button>
        </Box>

        <Box component="form" onSubmit={handleSearch} className="search-form">
            <Autocomplete
            fullWidth
            freeSolo
            options={suggestions}
            loading={suggestionsLoading}
            disabled={loading}
            inputValue={query}
            onInputChange={handleInputChange}
            onChange={handleAutocompleteChange}
            filterOptions={filterAutocompleteOptions}
            getOptionLabel={getAutocompleteOptionLabel}
            loadingText="Загружаем подсказки..."
            noOptionsText={noOptionsMessage}
            renderOption={renderAutocompleteOption}
            renderInput={renderAutocompleteInput}
            />
            <Button type="submit" variant="contained" disabled={loading}>
            Найти
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
                isFavorite={isFavorite(book)}
                onToggleFavorite={handleToggleFavorite}
                />
            ))}
            </Box>
        )}
        </Container>
    );
}

export default Main;