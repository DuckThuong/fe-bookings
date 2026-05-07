import { Carousel } from "antd";
import { HomeCard, type HomeCardProps } from "../HomeCard/HomeCard";
import "./homeCarousel.scss";
interface HomeCarouselProps {
  items: HomeCardProps[];
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  dots?: boolean;
  slidesToShow?: number;
}
export const HomeCarousel = (props: HomeCarouselProps) => {
  return (
    <div className="home__carousel">
      <Carousel
        autoplay={props.autoPlay}
        autoplaySpeed={props.autoPlaySpeed}
        dots={props.dots}
        slidesToShow={props.slidesToShow}
        infinite
        className="home__carousel-wrapper"
        speed={500}
        cssEase="ease-in-out"
        arrows={false}
      >
        {props.items.map((item, index) => (
          <div key={index} className="home__carousel-item">
            <HomeCard {...item} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};
