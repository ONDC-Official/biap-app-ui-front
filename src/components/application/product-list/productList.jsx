import React, { Fragment, useState } from "react";
import styles from "../../../styles/products/productList.module.scss";
import Navbar from "../../shared/navbar/navbar";
import search_empty_illustration from "../../../assets/images/search_prod_illustration.png";
import Button from "../../shared/button/button";
import { buttonTypes } from "../../../utils/button";
import SearchProductModal from "../search-product-modal/searchProductModal";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState({
    name: "",
    lat: "",
    lng: "",
  });
  const [searchedProduct, setSearchedProduct] = useState();
  const [toggleSearchProductModal, setToggleSearchProductModal] = useState();
  const search_empty_state = (
    <div
      className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
    >
      <div className="text-center">
        <div className="py-2">
          <img
            src={search_empty_illustration}
            alt="empty_search"
            style={{ height: "150px" }}
          />
        </div>
        <div className="py-2">
          <p className={styles.illustration_header}>Looking for Something</p>
          <p className={styles.illustration_body}>
            Search what you are looking fro by clicking on the button below
          </p>
        </div>
        <div className="py-3">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Search"
            onClick={() => setToggleSearchProductModal(true)}
          />
        </div>
      </div>
    </div>
  );
  return (
    <Fragment>
      <Navbar />
      {toggleSearchProductModal && (
        <SearchProductModal
          onClose={() => setToggleSearchProductModal(false)}
          onSearch={({ search }) => {
            setSearchedProduct(search?.value);
            setToggleSearchProductModal(false);
          }}
          searchedLocation={searchedLocation}
          setSearchedLocation={(value) => {
            setSearchedLocation(value);
          }}
        />
      )}
      {!searchedProduct || !searchedLocation ? (
        search_empty_state
      ) : (
        <div className={styles.playground_height}></div>
      )}
    </Fragment>
  );
}
