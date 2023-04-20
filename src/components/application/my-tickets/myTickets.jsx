import React, {
    Fragment,
    useEffect,
    useState,
    useCallback,
    useContext,
} from "react";
import styles from "../../../styles/orders/orders.module.scss";
import Navbar from "../../shared/navbar/navbar";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";
import { useHistory } from "react-router-dom";
import { getCall } from "../../../api/axios";
import Loading from "../../shared/loading/loading";
import { ONDC_COLORS } from "../../shared/colors";
import TicketCard from "./ticket-card/ticketCard";
import Pagination from "../../shared/pagination/pagination";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { ToastContext } from "../../../context/toastContext";
import useCancellablePromise from "../../../api/cancelRequest";

export default function MyTickets() {
    // HISTORY
    const history = useHistory();

    // STATES
    const [tickets, setTickets] = useState([
        {
            "_id": "643fcec874c7ad1cf610a16f",
            "userId": "l91dAy8czpcyBQCVNVzL19VI9lg1",
            "category": "ITEM",
            "sub_category": "Product Quality",
            "bppId": "vlccstaging.thesellerapp.com",
            "bpp_uri": "https://vlccstaging.thesellerapp.com/v1",
            "complainant_info": {
                "person": {
                    "name": "Sam Manuel"
                },
                "contact": {
                    "phone": 9879879870
                }
            },
            "order_details": {
                "id": "643902cffcb50d68be56e79e",
                "state": "Completed",
                "items": [
                    {
                        "id": "item_1",
                        "quantity": {
                            "count": 1
                        },
                        "product": {
                            "id": "item_1",
                            "descriptor": {
                                "name": "Eiosys item 1"
                            },
                            "location_id": "Eiosys_location",
                            "price": {
                                "currency": "INR",
                                "value": "40.0"
                            },
                            "matched": true,
                            "provider_details": {
                                "id": "eiosys1",
                                "descriptor": {
                                    "name": "Eiosys Store 1"
                                }
                            },
                            "location_details": {
                                "id": "Eiosys_location",
                                "gps": "19.23587,73.1311240000001"
                            },
                            "bpp_details": {
                                "name": "Shop Eiosys",
                                "bpp_id": "ondc.staging.seller.eiosys.com"
                            }
                        }
                    }
                ],
                "fulfillments": [
                    {
                        "id": "fid1",
                        "type": "Delivery",
                        "tracking": false,
                        "start": {
                            "location": {
                                "id": "store_location_1",
                                "descriptor": {
                                    "name": "Eiosys Store 1",
                                    "images": []
                                },
                                "gps": "19.23587,73.1311240000001"
                            },
                            "time": {
                                "range": {
                                    "start": "2022-11-22T07:09:30.000Z",
                                    "end": "2022-11-22T07:10:30.000Z"
                                }
                            },
                            "instructions": {
                                "name": "pick up instructions",
                                "images": []
                            },
                            "contact": {
                                "phone": "+919999999999",
                                "email": "support@eiosys.com"
                            }
                        },
                        "end": {
                            "location": {
                                "gps": "12.914028, 77.638698",
                                "address": {
                                    "door": "21A",
                                    "name": "ABC Apartments",
                                    "locality": "HSR Layout",
                                    "city": "Bengaluru",
                                    "state": "Karnataka",
                                    "country": "India",
                                    "areaCode": "560102"
                                }
                            },
                            "time": {
                                "range": {
                                    "start": "2022-11-22T07:11:36.212Z",
                                    "end": "2022-11-22T07:12:36.212Z"
                                }
                            },
                            "instructions": {
                                "name": "drop off instructions",
                                "images": []
                            },
                            "contact": {
                                "phone": "+919876543210",
                                "email": "user@example.com"
                            }
                        },
                        "customer": {
                            "person": {
                                "name": "sahil"
                            }
                        }
                    }
                ],
                "provider_id": "P1"
            },
            "description": {
                "short_desc": "Issue with product quality",
                "long_desc": "product quality is not correct. facing issues while using the product",
                "additional_desc": {
                    "url": "https://buyerapp.com/additonal-details/desc.txt",
                    "content_type": "text/plain"
                },
                "images": [
                    "http://localhost:6969/uploads/1681903304395.png"
                ]
            },
            "issue_actions": {
                "complainant_actions": [
                    {
                        "complainant_action": "OPEN",
                        "remarks": "Complaint created",
                        "updated_at": "2023-01-15T10:00:00.469Z",
                        "updated_by": {
                            "org": {
                                "name": "buyerapp.com::nic2004:52110"
                            },
                            "contact": {
                                "phone": "9450394039",
                                "email": "buyerapp@interface.com"
                            },
                            "person": {
                                "name": "John Doe"
                            }
                        }
                    }
                ]
            },
            "created_at": "2023-01-15T10:00:00.469Z",
            "updated_at": "2023-01-15T10:00:00.469Z",
            "issueId": "92879134-bb3d-4004-b8de-74617e814581"
        }
    ]);
    const [fetchOrderLoading, setFetchOrderLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalCount: 0,
        postPerPage: 10,
    });
    const [currentSelectedAccordion, setCurrentSelectedAccordion] = useState("");

    // CONTEXT
    const dispatch = useContext(ToastContext);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getAllTickets = useCallback(async () => {
        setFetchOrderLoading(true);
        try {
            const { totalCount, issues } = await cancellablePromise(
                getCall(
                    `/clientApis/v1/orders?pageNumber=${pagination.currentPage}&limit=${pagination.postPerPage}`
                )
            );

            setPagination((prev) => ({
                ...prev,
                totalCount,
            }));
            setTickets(issues);
            setFetchOrderLoading(false);
        } catch (err) {
            dispatch({
                type: toast_actions.ADD_TOAST,
                payload: {
                    id: Math.floor(Math.random() * 100),
                    type: toast_types.error,
                    message: "Something went wrong!",
                },
            });
            setFetchOrderLoading(false);
        }
        // eslint-disable-next-line
    }, [pagination.currentPage, pagination.postPerPage]);

    useEffect(() => {
        // getAllTickets();
    }, [getAllTickets, pagination.currentPage]);

    // loading UI
    const loadingSpin = (
        <div
            className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
        >
            <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
        </div>
    );

    // empty state ui
    const empty_orders_state = (
        <div
            className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
        >
            <div className="text-center">
                <div className="py-2">
                    <img
                        src={no_result_empty_illustration}
                        alt="empty_search"
                        style={{ height: "130px" }}
                    />
                </div>
                <div className="py-2">
                    <p className={styles.illustration_header}>No Tickets found!</p>
                </div>
            </div>
        </div>
    );

    return (
        <Fragment>
            <Navbar />
            {fetchOrderLoading ? (
                loadingSpin
            ) : tickets.length <= 0 ? (
                empty_orders_state
            ) : (
                <div
                    className={styles.playground_height}
                    style={{ height: "calc(100vh - 60px)" }}
                >
                    <div className="accordion" id="ordersAccordion">
                        <div className="container">
                            <div className="row py-3">
                                <div className="col-12">
                                    <p className={styles.cart_label}>My Tickets</p>
                                </div>
                            </div>
                            <div className={styles.order_list_wrapper}>
                                {tickets.map(
                                    (
                                        {
                                            product,
                                            quantity,
                                            billing_address,
                                            delivery_address,
                                            status,
                                            order_id,
                                            transaction_id,
                                            createdAt,
                                            bpp_id,
                                            quote
                                        },
                                        index
                                    ) => {
                                        return (
                                            <div className="py-2" key={`order_id_${index}`}>
                                                <TicketCard
                                                    product={product}
                                                    quantity={quantity}
                                                    quote={quote}
                                                    billing_address={billing_address}
                                                    delivery_address={delivery_address}
                                                    status={status}
                                                    transaction_id={transaction_id}
                                                    order_id={order_id}
                                                    created_at={createdAt}
                                                    bpp_id={bpp_id}
                                                    accoodion_id={`order_id_${index}`}
                                                    onFetchUpdatedOrder={() => {
                                                        setCurrentSelectedAccordion("");
                                                        dispatch({
                                                            type: toast_actions.ADD_TOAST,
                                                            payload: {
                                                                id: Math.floor(Math.random() * 100),
                                                                type: toast_types.success,
                                                                message: "Order status updated successfully!",
                                                            },
                                                        });
                                                        getAllTickets();
                                                    }}
                                                    currentSelectedAccordion={currentSelectedAccordion}
                                                    setCurrentSelectedAccordion={(value) => {
                                                        if (
                                                            currentSelectedAccordion.toLowerCase() ===
                                                            `order_id_${index}`.toLowerCase()
                                                        ) {
                                                            setCurrentSelectedAccordion("");
                                                            return;
                                                        }
                                                        setCurrentSelectedAccordion(value);
                                                    }}
                                                />
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ height: "60px" }}
                    >
                        <Pagination
                            className="m-0"
                            currentPage={pagination.currentPage}
                            totalCount={pagination.totalCount}
                            pageSize={pagination.postPerPage}
                            onPageChange={(page) => {
                                setPagination((prev) => ({
                                    ...prev,
                                    currentPage: page,
                                }));
                                setCurrentSelectedAccordion("");
                            }}
                        />
                    </div>
                </div>
            )}
        </Fragment>
    );
}
