import { useGetUserInfoQuery } from '../../slices/userApi.slice';

function Home() {
  const { data: session, isLoading, isError } = useGetUserInfoQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !session) {
    return <div>Error</div>;
  }

  return (
    <div className="h-full w-full p-4">
      <img
        className="rounded-full w-20 h-20"
        src={session.picture}
        alt={session.name}
      />
      <h1>Welcome {session.name}</h1>
    </div>
  );
}

export default Home;
