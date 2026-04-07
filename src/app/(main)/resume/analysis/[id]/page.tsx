import Link from 'next/link';

export default async ({ params }: { params: { id: string } }) => {
    const { id } = params;

    return (
        <div>
            <h1>Analysis</h1>
            <p>Resume ID: {id}</p>
            <Link href={'/resume'}>{'Go to resume list'}</Link>
        </div>
    );
};
