export default () => (
    <main className="flex w-full flex-grow flex-col gap-y-8 px-20 py-10">
        <div className="h-8 w-64 animate-pulse rounded-8 bg-surface-tertiary" />
        <div className="flex flex-col gap-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
                <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    className="h-20 w-full animate-pulse rounded-8 bg-surface-tertiary"
                />
            ))}
        </div>
    </main>
);
