import { SkeletonVancy } from '~/entities/vacancies';

export default () => (
    <div className={'max-w-card grid h-fit w-full shrink-0 grid-rows-4 gap-3'}>
        {Array.from({ length: 4 }).map((_v, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <SkeletonVancy key={`skeleton-${index}`} />
        ))}
    </div>
);
