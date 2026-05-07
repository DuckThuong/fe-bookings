import { Rate } from "antd";
import "./homeCard.scss";

export interface HomeCardProps {
  imageUrl: string;
  title: string;
  description: string;
  address: string;
  rating: number;
}

export const HomeCard = (props: HomeCardProps) => {
  return (
    <div
      className="home__card"
      style={{ backgroundImage: `url(${props.imageUrl})` }}
    >
      <h1 className="home__card-title">{props.title}</h1>
      <p className="home__card-description">{props.description}</p>
      <p className="home__card-address">{props.address}</p>
      <Rate allowHalf value={props.rating} disabled />
    </div>
  );
};
