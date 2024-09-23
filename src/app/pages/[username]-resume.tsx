"use client";
import Portfolio from '../portfolio/[username]/page';

const UserPortfolio = ({ params }: { params: { username: string } }) => {
  return <Portfolio username={params.username} />;
};

export default UserPortfolio;

export async function getServerSideProps({ params }: { params: { username: string } }) {
  const { username } = params;
  return {
    props: { username },
  };
}