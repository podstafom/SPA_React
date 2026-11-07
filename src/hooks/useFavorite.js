import { useEffect, useState } from "react";

const STORAGE_KEY = "favoriteBooks";

function getStoredFavorites() {
    try {
        const savedFavorites = localStorage.getItem(STORAGE_KEY);

        if (!savedFavorites) {
        return [];
        }

        const parsedFavorites = JSON.parse(savedFavorites);

        return Array.isArray(parsedFavorites)
            ? parsedFavorites
            : [];
    } catch (error) {
        console.error("Ошибка чтения избранного:", error);
        return [];
    }
}

function getBookId(book) {
    if (!book || typeof book !== "object") {
        return null;
    }

    if (book.guid) {
        return `guid:${book.guid}`;
    }

    if (book.ISBN) {
        const normalizedISBN = String(book.ISBN)
            .replace(/[\s-]/g, "")
            .toUpperCase();

        return `isbn:${normalizedISBN}`;
    }

    if (typeof book.Title === "string" && book.Title.trim()) {
        const title = book.Title.trim().toLowerCase();
        const author =
            typeof book.AuthorName === "string"
                ? book.AuthorName.trim().toLowerCase()
                : "";

        return `title:${title}|author:${author}`;
    }

    return null;
}

export default function useFavorite() {
    const [favorites, setFavorites] = useState(getStoredFavorites);

    useEffect(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(favorites)
            );
        } catch (error) {
            console.error("Ошибка сохранения избранного:", error);
        }
    }, [favorites]);

    const addFavorite = (book) => {
        const bookId = getBookId(book);

        if (!bookId) {
            return;
        }

        setFavorites((currentFavorites) => {
            const alreadyExists = currentFavorites.some(
                (favorite) => getBookId(favorite) === bookId
            );

        if (alreadyExists) {
            return currentFavorites;
        }

        return [...currentFavorites, book];
        });
    };

    const removeFavorite = (book) => {
        const bookId = getBookId(book);

        if (!bookId) {
            return;
        }

        setFavorites((currentFavorites) =>
            currentFavorites.filter(
                (favorite) => getBookId(favorite) !== bookId
            )
        );
    };

    const isFavorite = (book) => {
        const bookId = getBookId(book);

        if (!bookId) {
            return false;
        }

        return favorites.some(
            (favorite) => getBookId(favorite) === bookId
        );
    };

    return {
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
    };
}
