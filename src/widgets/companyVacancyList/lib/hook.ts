// eslint-disable-next-line import/no-extraneous-dependencies
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RouterOutputs } from 'trpc/shared';
import { UseHorizontalVirtualVacancies } from './types';

export const useHorizontalVirtualVacancies = ({
    vacancies,
    hasNextPage,
}: UseHorizontalVirtualVacancies) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLastVisible, setIsLastVisible] = useState(false);

    const rows = Math.ceil((vacancies?.length || 0) / 4);

    const virtualizerOptions = useMemo(
        () => ({
            count: hasNextPage ? rows + 1 : rows,
            estimateSize: () => 720,
            getScrollElement: () => containerRef.current,
            overscan: 1,
            horizontal: true,
        }),
        [hasNextPage, rows, containerRef.current]
    );

    const virtualizer = useVirtualizer(virtualizerOptions);
    const items = virtualizer.getVirtualItems();

    useEffect(() => {
        if (items.length === 0) return;
        const last = items[items.length - 1];
        if (last) setIsLastVisible(last.index >= rows - 1);
    }, [rows, items]);

    return {
        rows,
        virtualizer,
        containerRef,
        items,
        isLastVisible,
    };
};
