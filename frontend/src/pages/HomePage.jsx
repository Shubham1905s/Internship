import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = () => {
    setLoading(true);
    api
      .get(`/books?page=${page}&search=${search}&genre=${genre}&sort=${sort}`)
      .then((res) => {
        setBooks(res.data?.data?.books || []);
        setTotalPages(res.data?.data?.totalPages || 1);
      })
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [page, search, genre, sort]);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          📚 Explore Books
        </h1>
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          Browse your favorite reads, discover genres, and see top-rated books.
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search title or author"
          className="flex-1 min-w-[180px] border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="🎭 Genre"
          className="flex-1 min-w-[120px] border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Sort By</option>
          <option value="year">📅 Year ↑</option>
          <option value="-year">📅 Year ↓</option>
          <option value="averageRating">⭐ Rating ↑</option>
          <option value="-averageRating">⭐ Rating ↓</option>
        </select>
        <button
          onClick={() => setPage(1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium shadow transition-all"
        >
          Apply Filters
        </button>
      </div>

      {/* Books Section */}
      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {books.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              No books found 😢
            </div>
          )}
          {books.map((book) => (
            <motion.a
              key={book._id}
              href={`/books/${book._id}`}
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-5 shadow hover:shadow-lg transition-shadow"
            >
              <div className="font-bold text-lg mb-1">{book.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                {book.author} • {book.year}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {book.genre}
              </div>
              <div className="flex items-center text-yellow-500 font-medium text-sm">
                ★ {book.averageRating?.toFixed(1) || 0}{" "}
                <span className="text-gray-500 ml-1">
                  ({book.reviewCount || 0} reviews)
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          ← Prev
        </button>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
