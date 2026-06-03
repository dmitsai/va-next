import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next';
import { getServerSession as nextGetServerSession } from 'next-auth';
import { authOptions } from '~/server/auth';

export function getServerSession(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return nextGetServerSession(...args, authOptions);
}
