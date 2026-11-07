import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { searchBooks } from "../api/searchBooks.js";
import useLogic from "./useLogic.js";

vi.mock("../api/searchBooks.js", () => ({
    searchBooks: vi.fn(),
}));

describe("useLogic", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("не выполняет запрос при пустом поисковом поле", async () => {
        const { result } = renderHook(() => useLogic());

        await act(async () => {
            await result.current.handleSearch(null, "   ");
        });

        expect(searchBooks).not.toHaveBeenCalled();
        expect(result.current.books).toEqual([]);
        expect(result.current.error).toBe("Введите название книги для поиска.");
        expect(result.current.searched).toBe(false);
    });

    it("сохраняет найденные книги после успешного поиска", async () => {
        const books = [
            {
            guid: "book-1",
            Title: "Гарри Поттер и философский камень",
            AuthorName: "Дж. К. Роулинг",
            },
            {
            guid: "book-2",
            Title: "Гарри Поттер и Тайная комната",
            AuthorName: "Дж. К. Роулинг",
            },
        ];

        searchBooks.mockResolvedValue(books);

        const { result } = renderHook(() => useLogic());

        await act(async () => {
            await result.current.handleSearch(null, "Гарри Поттер");
        });

        expect(searchBooks).toHaveBeenCalledWith("Гарри Поттер");
        expect(result.current.books).toEqual(books);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.searched).toBe(true);
    });
});