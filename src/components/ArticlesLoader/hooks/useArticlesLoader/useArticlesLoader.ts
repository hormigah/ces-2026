import { useReducer, useCallback } from "react";
import type { Article } from "@/types";

type State = {
  articles: Article[];
  page: number;
  isLoading: boolean;
  hasMore: boolean;
};

type Action =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Article[], hasMore: boolean }
  | { type: "LOAD_END" }
  | { type: "SET_NO_MORE" };

const initialState: State = {
  articles: [],
  page: 1,
  isLoading: false,
  hasMore: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true };
    case "LOAD_SUCCESS":
      return {
        ...state,
        articles: [...state.articles, ...action.payload],
        hasMore: action.hasMore,
        page: state.page + 1,
      };
    case "LOAD_END":
      return { ...state, isLoading: false };
    case "SET_NO_MORE":
      return { ...state, hasMore: false };
    default:
      return state;
  }
}

export default function useArticlesLoader() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadMoreArticles = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const response = await fetch(`/api/load-more?page=${state.page}`);

      if (!response.ok) {
        console.error('Failed to load more articles');
        return;
      }

      const newArticles: Article[] = await response.json();

      if (newArticles.length > 0) {
        dispatch({ type: "LOAD_SUCCESS", payload: newArticles, hasMore: newArticles.length >= 5 });
      } else {
        dispatch({ type: "SET_NO_MORE" });
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      dispatch({ type: "LOAD_END" });
    }
  }, [state.page, dispatch]);

  return {
    ...state,
    loadMoreArticles,
  };
}