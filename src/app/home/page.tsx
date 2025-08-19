
'use client';
import 'swiper/css';
import 'swiper/css/pagination';
import { IFood } from '../types/backend';
import SwiperBanner from './app.banner';
import Dish from './app.dish';


interface IProps {
    food: IFood[];
}
const HomePage = ({ food }: IProps) => {
    return (
        <div>
            <SwiperBanner />
            <Dish food={food} />

        </div>
    );
};

export default HomePage;
