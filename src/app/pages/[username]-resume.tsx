import Portfolio from '../portfolio/page';

export default function UserPortfolio() {
  return <Portfolio username={username}/>;
}

export async function getServerSideProps({ params }) {
  const { username } = params;
  return {
    props: { username: params.username },
  };
}