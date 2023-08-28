import React, {useState} from 'react';
import useStyles from './style';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import KFC from '../../../assets/images/brands/KFC.png'
import HNM from '../../../assets/images/brands/HNM.png'
import Croma from '../../../assets/images/brands/Croma.png'
import Woodland from '../../../assets/images/brands/Woodland.png'
import MI from '../../../assets/images/brands/MI.png'
import Apple from '../../../assets/images/brands/Apple.png'
import PizzaHut from '../../../assets/images/brands/PizzaHut.png'

const BrandCard = ({data, index, onMouseOver}) => {
    const classes = useStyles();
    return (
        <Card className={classes.brandCard} onMouseOver={onMouseOver}>
            <img className={classes.brandImage} src={data.imgUrl} alt={`brand-${index}`}/>
        </Card>
    )
};

const TopBrands = () => {
    const classes = useStyles();
    const [activeBrandIndex, setActiveBrandIndex] = useState(1);
    const brandsList = [
        {name: 'KFC', imgUrl: KFC},
        {name: 'HNM', imgUrl: HNM},
        {name: 'Croma', imgUrl: Croma},
        {name: 'Woodland', imgUrl: Woodland},
        {name: 'MI', imgUrl: MI},
        {name: 'Apple', imgUrl: Apple},
        {name: 'PizzaHut', imgUrl: PizzaHut},
        {name: 'KFC', imgUrl: KFC},
        {name: 'HNM', imgUrl: HNM},
        {name: 'Croma', imgUrl: Croma},
        {name: 'Woodland', imgUrl: Woodland},
        {name: 'MI', imgUrl: MI},
        {name: 'Apple', imgUrl: Apple},
        {name: 'PizzaHut', imgUrl: PizzaHut},
    ];
    return (
        <Grid container spacing={3} className={classes.topBrandsContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4">
                    Top Brands
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.brandsContainer}>
                {
                    brandsList.map((brand, index) => {
                        return (
                            <BrandCard
                                key={index}
                                data={brand}
                                index={index}
                                onMouseOver={() => setActiveBrandIndex(index)}
                            />
                        )
                    })
                }
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.dotsContainer}>
                {
                    brandsList.map((brand, index) => (
                        <span key={`dot-${index}`} className={activeBrandIndex === index?classes.selectedDot:classes.dot} />
                    ))
                }
            </Grid>
        </Grid>
    )

};
export default TopBrands;