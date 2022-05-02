import React, { Fragment } from "react";
import Navbar from "../../shared/navbar/navbar";
import styles from "../../../styles/support/support.module.scss";
import SupportCard from "./support-card/supportCard";
import User from "../../shared/svg/user";
import Orders from "../../shared/svg/orders";
import logo from "../../../assets/images/logo.png";
import supportSvg from "../../../assets/images/help.svg";

export default function Support() {
  return (
    <Fragment>
      <Navbar />
      <div
        className="container"
        style={{ height: "calc(100vh - 60px)", overflow: "auto" }}
      >
        <div className={styles.content_align}>
          <div className="row">
            <div className="col-md-6 col-lg-4 col-xl-3 py-3">
              <SupportCard
                link={"https://google.com"}
                img={<Orders width="90" height="90" />}
                header="Our Policy"
                description="Read Abc's condition of Use & Sale, privacy policy and other applicable user's policy"
              />
            </div>
            <div className="col-md-6 col-lg-4 col-xl-3 py-3">
              <SupportCard
                link={"https://google.com"}
                img={
                  <img
                    src={supportSvg}
                    alt="support"
                    style={{ width: "65%" }}
                  />
                }
                header="FAQs"
                description="Browse through the questions frequently asked by users"
              />
            </div>
            <div className="col-md-6 col-lg-4 col-xl-3 py-3">
              <SupportCard
                link={"https://google.com"}
                img={<img src={logo} alt="logo" style={{ width: "100%" }} />}
                header="ONDC Policy"
                description="Read the policy and confitions of the ONDC network"
              />
            </div>
            <div className="col-md-6 col-lg-4 col-xl-3 py-3">
              <SupportCard
                link={"https://google.com"}
                img={<User width="80" height="80" />}
                header="Contact Us"
                description="Not Satisfied? You can reach out to Customer Care"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
