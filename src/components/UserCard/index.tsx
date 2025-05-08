interface IProps {
  name: string;
  email?: string;
}
const UserCard = ({ name, email }: IProps) => {
  return (
    <section className="user-card">
      <h2 className="user-name">{name}</h2>
      {email && <p className="user-email">{email}</p>}
    </section>
  );
};

export default UserCard;
