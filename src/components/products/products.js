import React, {useEffect, useState} from 'react';

import CategoriesHeader from '../category/categories/categories';
import SubCategoriesHeader from '../product/subCategories/subCategories';
import SubCategories from '../category/subCategories/subCategories';
import ProductList from '../product/productList/productList';

import Home from '../home/home';

import {useLocation} from "react-router-dom";

const Products = () => {

    const lodationData = useLocation();
    const useQuery = () => {
        const { search } = lodationData;
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };
    let query = useQuery();
    const [isCatAvailable, setIsCatAvailable] = useState(false);
    const [isSubCatAvailable, setIsSubCatAvailable] = useState(false);
    const [isSearchAvailable, setIsSearchAvailable] = useState(false);

    useEffect(() => {
        if(lodationData){
            const cat = query.get("c");
            const subCat = query.get("sc");
            const product = query.get("s");
            if(cat){
                setIsCatAvailable(true);
            }
            if(subCat){
                setIsSubCatAvailable(true);
            }
            if(product){
                setIsSearchAvailable(true);
            }
        }
    }, [lodationData]);

    if(isSearchAvailable && isSubCatAvailable && isCatAvailable){
        return (
            <>
                <SubCategoriesHeader />
                <ProductList />
            </>
        )
    }else if(!isSearchAvailable && isSubCatAvailable && isCatAvailable){
        return (
            <>
                <SubCategoriesHeader />
                <ProductList />
            </>
        )
    }else if(!isSearchAvailable && !isSubCatAvailable && isCatAvailable){
        return (
            <>
                <CategoriesHeader />
                <SubCategories />
            </>
        )
    }
    else if(isSearchAvailable && !isSubCatAvailable && !isCatAvailable) {
        return (
            <>
                <ProductList />
            </>
        )
    }
    else if(isSearchAvailable && !isSubCatAvailable && isCatAvailable) {
        return (
            <>
                <ProductList />
            </>
        )
    }
    else{
        return (
            <Home />
        )
    }


};

export default Products;