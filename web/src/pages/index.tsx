import { getSession } from '@auth0/nextjs-auth0'
import { GetServerSideProps } from 'next'
import { APP, LOGIN } from '../../constants'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const session = getSession(req, res)

  if (!session) {
    return {
      redirect: {
        destination: LOGIN,
        permanent: false,
      },
    }
  } else {
    return {
      redirect: {
        destination: APP,
        permanent: false,
      },
    }
  }
}
