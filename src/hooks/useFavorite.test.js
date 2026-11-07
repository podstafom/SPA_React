import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import useFavorite from "./useFavorite.js";

const firstBook = {
    guid: "book-1",
    Title: "Гарри Поттер и философский камень",
    AuthorName: "Дж. К. Роулинг",
    ISBN: "9780747532699",
};

const secondBook = {
    guid: "book-2",
    Title: "Властелин колец",
    AuthorName: "Дж. Р. Р. Толкин",
    ISBN: "9780261103573",
};

describe("useFavorite", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("возвращает пустой список, если избранное отсутствует", () => {
        const { result } = renderHook(() => useFavorite());
        expect(result.current.favorites).toEqual([]);
    });

    it("добавляет книгу в избранное", () => {
        const { result } = renderHook(() => useFavorite());

        act(() => {
            result.current.addFavorite(firstBook);
        });

        expect(result.current.favorites).toEqual([firstBook]);
        expect(result.current.isFavorite(firstBook)).toBe(true);

        const savedFavorites = JSON.parse(
            localStorage.getItem("favoriteBooks")
        );

        expect(savedFavorites).toEqual([firstBook]);
    });

    it("не добавляет одну книгу в избранное повторно", () => {
        const { result } = renderHook(() => useFavorite());

        act(() => {
            result.current.addFavorite(firstBook);
            result.current.addFavorite(firstBook);
        });

        expect(result.current.favorites).toEqual([firstBook]);
        expect(result.current.favorites).toHaveLength(1);
    });

    it("удаляет книгу из избранного", () => {
        localStorage.setItem(
            "favoriteBooks",
            JSON.stringify([firstBook, secondBook])
        );

        const { result } = renderHook(() => useFavorite());

        act(() => {
            result.current.removeFavorite(firstBook);
        });

        expect(result.current.favorites).toEqual([secondBook]);
        expect(result.current.isFavorite(firstBook)).toBe(false);

        const savedFavorites = JSON.parse(
            localStorage.getItem("favoriteBooks")
        );

        expect(savedFavorites).toEqual([secondBook]);
    });

    it("правильно определяет наличие книги в избранном", () => {
        const { result } = renderHook(() => useFavorite());
        expect(result.current.isFavorite(firstBook)).toBe(false);
        act(() => {
            result.current.addFavorite(firstBook);
        });
        expect(result.current.isFavorite(firstBook)).toBe(true);
        act(() => {
            result.current.removeFavorite(firstBook);
        });
        expect(result.current.isFavorite(firstBook)).toBe(false);
    });

    it("восстанавливает книги из localStorage при запуске", () => {
        localStorage.setItem(
            "favoriteBooks",
            JSON.stringify([firstBook, secondBook])
        );

        const { result } = renderHook(() => useFavorite());

        expect(result.current.favorites).toEqual([
            firstBook,
            secondBook,
        ]);
    });
});