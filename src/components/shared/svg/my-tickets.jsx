import React from "react";
import { ONDC_COLORS } from "../colors";

export default function MyTickets(props) {
    const {
        width = "20",
        height = "20",
        color = ONDC_COLORS.ACCENTCOLOR,
    } = props;
    return (
        <svg
            fill={color}
            width={width}
            height={height} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>alt-list</title>
            <path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408zM8 24h6.016v-5.984h-6.016v5.984zM8 14.016h6.016v-6.016h-6.016v6.016zM10.016 22.016v-2.016h1.984v2.016h-1.984zM10.016 12v-1.984h1.984v1.984h-1.984zM16 22.016h8v-2.016h-8v2.016zM16 12h8v-1.984h-8v1.984z"></path>
        </svg>
    )
}