import Fashion from '../assets/images/category/Fashion1.png';
import Grocery from '../assets/images/category/Grocery.png';
import Electronics from '../assets/images/category/Electronics3.png';
import Food from '../assets/images/category/Food.png';
import Home from '../assets/images/category/Home1.png';
import Health from '../assets/images/category/Health1.png';
import BPC from '../assets/images/category/BPC.png';

const categoryList = [
    {id: '1', name: 'Fashion', shortName: 'Fashion', imageUrl: Fashion, routeName: 'fashion'},
    {id: '2', name: 'Grocery', shortName: 'Grocery', imageUrl: Grocery, routeName: 'grocery'},
    {id: '3', name: 'Electronics', shortName: 'Electronics', imageUrl: Electronics, routeName: 'electronics'},
    {id: '4', name: 'Food & Beverage', shortName: 'Food & Beverage', imageUrl: Food, routeName: 'foodBeverage'},
    {id: '5', name: 'Home & Decor', shortName: 'Home & Decor', imageUrl: Home, routeName: 'homeDecor'},
    {id: '6', name: 'Health & Wellness', shortName: 'Health & Wellness', imageUrl: Health, routeName: 'healthWellness'},
    {id: '7', name: 'Beauty & Personal Care', shortName: 'BPC', imageUrl: BPC, routeName: 'beautyCare'},
];

export default categoryList;