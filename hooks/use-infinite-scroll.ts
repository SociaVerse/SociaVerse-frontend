import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
    callback: () => void;
    isLoading: boolean;
    hasMore: boolean;
    rootMargin?: string;
    threshold?: number;
}

/**
 * A custom hook for implementing infinite scroll using Intersection Observer.
 * 
 * @param callback - Function to call when the sentinel element becomes visible.
 * @param isLoading - Current loading state to prevent multiple concurrent fetches.
 * @param hasMore - Whether there is more data to fetch.
 * @param rootMargin - Intersection Observer root margin.
 * @param threshold - Intersection Observer threshold.
 * @returns A ref function to be attached to the sentinel element.
 */
export function useInfiniteScroll({
    callback,
    isLoading,
    hasMore,
    rootMargin = "100px",
    threshold = 0.1
}: UseInfiniteScrollProps) {
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (isLoading) return;

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore) {
                        callback();
                    }
                },
                { rootMargin, threshold }
            );

            if (node) {
                observer.current.observe(node);
            }
        },
        [isLoading, hasMore, callback, rootMargin, threshold]
    );

    return lastElementRef;
}
