
import { useEffect,useState } from "react";
import { searchBooks } from "../api/searchBooks.js";

export default function useLogic() {
    const [query, setQueryState] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);

    const setQuery = (value) => {
        setQueryState(value);
        setSuggestions([]);
        setSuggestionsLoading(false);
    };

    useEffect(() => {
        const normalizedQuery = query.trim();

        if (normalizedQuery.length < 3) {
            return;
        }

        const controller = new AbortController();

        const timeoutId = setTimeout(async () => {
            setSuggestionsLoading(true);

            try {
            const result = await searchBooks(
                normalizedQuery,
                "Title,AuthorName",
                controller.signal
            );

            if (!controller.signal.aborted) {
                setSuggestions(result);
            }
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                setSuggestions([]);
                console.error("Ошибка получения подсказок:", error);
            }

            finally {
                if (!controller.signal.aborted) {
                    setSuggestionsLoading(false);
                }
            }
        }, 500);

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [query]);

    const handleSearch = async (event, searchValue = query) => {
        event?.preventDefault();
        const normalizedQuery = searchValue.trim();

        if (!normalizedQuery) {
            setBooks([]);
            setError("Введите название книги для поиска.");
            setSearched(false);
            return;
        }

        setLoading(true);
        setError(null);
        setBooks([]);
        setSearched(false);

        try {
            const result = await searchBooks(normalizedQuery);
            setBooks(result);
            setSearched(true);
        } catch (error) {
        setError(
            error instanceof Error
            ? error.message
            : "Не удалось выполнить поиск. Попробуйте ещё раз."
        );
        } finally {
            setLoading(false);
        }
    };

    return {
        query,
        setQuery,
        books,
        loading,
        error,
        searched,
        handleSearch,
        suggestions,
        suggestionsLoading,
    };
}
