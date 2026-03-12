import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
    callback: () => void;
    isLoading: boolean;
    hasMore: boolean;
    rootMargin?: string;
    threshold?: number;
}

export function useInfiniteScroll({
    callback,
    isLoading,
    hasMore,
    rootMargin = "100px",
    threshold = 0.1
}: UseInfiniteScrollProps) {
    const observer = useRef<IntersectionObserver | null>(null);

    const callbackRef = useRef(callback);
    const isLoadingRef = useRef(isLoading);
    const hasMoreRef = useRef(hasMore);

    useEffect(() => {
        callbackRef.current = callback;
        isLoadingRef.current = isLoading;
        hasMoreRef.current = hasMore;
    }, [callback, isLoading, hasMore]);

    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (observer.current) {
                observer.current.disconnect();
            }

            if (!node) return;

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (
                        entries[0].isIntersecting && 
                        hasMoreRef.current && 
                        !isLoadingRef.current
                    ) {
                        callbackRef.current();
                    }
                },
                { rootMargin, threshold }
            );

            observer.current.observe(node);
        },
        [rootMargin, threshold] 
    );

    return lastElementRef;
}