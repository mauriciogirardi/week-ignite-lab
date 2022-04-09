import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function App() {
  const { user, isLoading } = useUser()

  console.log(user)

  if (isLoading) {
    return <h1>Carregando...</h1>
  }

  return (
    <>
      <h1>App</h1>
      <h2>{`Olá ${user?.name}`}</h2>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()
