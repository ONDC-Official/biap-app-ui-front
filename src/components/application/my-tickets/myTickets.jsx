import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
} from "react";
import Loading from "../../shared/loading/loading";
import Pagination from '@mui/material/Pagination';

import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { ToastContext } from "../../../context/toastContext";
import useCancellablePromise from "../../../api/cancelRequest";
import useStyles from "../cart/styles";
import { Grid, Typography } from "@mui/material";
import TicketCard from "./ticketCard";

export default function MyTickets() {
    // STATES
    const [tickets, setTickets] = useState([]);
    const [fetchOrderLoading, setFetchOrderLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalCount: 0,
        postPerPage: 10,
    });

    // CONTEXT
    const dispatch = useContext(ToastContext);
    const classes = useStyles();


    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getAllTickets = useCallback(async () => {
        setFetchOrderLoading(true);
        try {
            const { totalCount, issues } = {
                "totalCount": 88,
                "issues": [
                    {
                        "_id": "6512b4853e28c25d761915dc",
                        "transaction_id": "e3ce8dab-1a96-432a-b702-7f0822736a35",
                        "__v": 0,
                        "bppId": "ref-seller-app-preprod.ondc.org",
                        "bpp_uri": "https://ref-seller-app-preprod.ondc.org",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "surender"
                            },
                            "contact": {
                                "phone": 9205450532
                            }
                        },
                        "created_at": "2023-09-26T10:37:56.072Z",
                        "description": {
                            "short_desc": "test",
                            "long_desc": "test",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": []
                        },
                        "issueId": "f0235397-f747-49c9-afa8-b00eaba9ce5e",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-09-26T10:37:56.124Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                },
                                {
                                    "complainant_action": "ESCALATE",
                                    "short_desc": "not satisfied",
                                    "updated_at": "2023-09-26T10:45:03.050Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                },
                                {
                                    "complainant_action": "CLOSE",
                                    "short_desc": "Complaint closed",
                                    "updated_at": "2023-09-26T11:06:11.343Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": [
                                {
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are investigating your concern.",
                                    "updated_at": "2023-09-26T10:42:56.077Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    },
                                    "cascaded_level": 1
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are investigating your concern.",
                                    "updated_at": "2023-09-26T10:42:58.732Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "mikky@mailinator.com",
                                            "phone": "9205450531"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Mikky"
                                        }
                                    }
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "RESOLVED",
                                    "short_desc": "Cancel the request",
                                    "updated_at": "2023-09-26T10:44:16.564Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "mikky@mailinator.com",
                                            "phone": "9205450531"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Mikky"
                                        }
                                    }
                                },
                                {
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are looking into your concern.",
                                    "updated_at": "2023-09-26T10:45:03.232Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "contact": {
                                            "phone": "9876543210",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    },
                                    "cascaded_level": 1
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "RESOLVED",
                                    "short_desc": "No-action ",
                                    "updated_at": "2023-09-26T11:02:21.227Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "mikky@mailinator.com",
                                            "phone": "9205450531"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Mikky"
                                        }
                                    }
                                }
                            ]
                        },
                        "issue_status": "Close",
                        "message_id": "aba9e31c-96f0-4ed5-8aaf-7cb868e58db8",
                        "order_details": {
                            "id": "2023-08-17-222133",
                            "state": "Created",
                            "items": [
                                {
                                    "id": "3d885ff5-02d4-41d3-9993-2bb4f2553c81",
                                    "quantity": {
                                        "count": 2
                                    },
                                    "product": {
                                        "id": "3d885ff5-02d4-41d3-9993-2bb4f2553c81",
                                        "name": "Egg",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "",
                                        "descriptor": {
                                            "name": "Egg",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/c2ac2209-ae83-4156-b160-d75f29704f30/product_image/5_90b5ad8f-22e3-4274-9c51-90bca9d5eabf.webp",
                                            "short_desc": "The hard-shelled reproductive body produced by a bird and especially by the common domestic chicken (Gallus gallus) an animal reproductive body consisting of an ovum together with its nutritive and protective envelopes and having the capacity.",
                                            "long_desc": "The hard-shelled reproductive body produced by a bird and especially by the common domestic chicken (Gallus gallus) an animal reproductive body consisting of an ovum together with its nutritive and protective envelopes.",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/c2ac2209-ae83-4156-b160-d75f29704f30/product_image/5_90b5ad8f-22e3-4274-9c51-90bca9d5eabf.webp"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "2.0",
                                            "maximum_value": "2"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": "2252"
                                            },
                                            "maximum": {
                                                "count": "1230"
                                            }
                                        },
                                        "category_id": "eggs_meat_and_fish",
                                        "location_id": "64ddb7f68fe25ca604b27ef1",
                                        "fulfillment_id": "1",
                                        "matched": true,
                                        "@ondc/org/returnable": false,
                                        "@ondc/org/cancellable": false,
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/time_to_ship": "PT1H",
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "PT123H",
                                        "@ondc/org/contact_details_consumer_care": "Disney Store,sa@mailinator.com,9999999999",
                                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                                            "net_quantity": "123421"
                                        },
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "134",
                                            "manufacturer_or_packer_address": "123124",
                                            "common_or_generic_name_of_commodity": "Egg",
                                            "net_quantity_or_measure_of_commodity_in_pkg": "123421",
                                            "month_year_of_manufacture_packing_import": "10/05/2021"
                                        },
                                        "@ondc/org/statutory_reqs_prepackaged_food": {
                                            "brand_owner_FSSAI_license_no": "NA",
                                            "other_FSSAI_license_no": "NA",
                                            "importer_FSSAI_license_no": "NA"
                                        },
                                        "tags": {
                                            "veg": "no",
                                            "non_veg": "yes"
                                        },
                                        "provider_details": {
                                            "id": "c570fcfc-c555-490b-a940-4ec2aca31a16",
                                            "descriptor": {
                                                "name": "Disney Store",
                                                "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp",
                                                "short_desc": "",
                                                "long_desc": "",
                                                "images": [
                                                    "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "64ddb7f68fe25ca604b27ef1",
                                            "gps": "12.932333337722389,77.68521666526796",
                                            "address": {
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "area_code": "560103",
                                                "street": "Kariyammana Agrahara"
                                            },
                                            "time": {
                                                "days": "1,2,3,4,5",
                                                "schedule": {
                                                    "holidays": [
                                                        "2023-06-10"
                                                    ],
                                                    "frequency": "",
                                                    "times": []
                                                },
                                                "range": {
                                                    "start": "0805",
                                                    "end": "2355"
                                                }
                                            },
                                            "circle": {
                                                "gps": "12.932333337722389,77.68521666526796",
                                                "radius": {
                                                    "unit": "km",
                                                    "value": "10"
                                                }
                                            }
                                        },
                                        "fulfillment_details": {
                                            "id": "1",
                                            "type": "Delivery"
                                        },
                                        "bpp_details": {
                                            "name": "Disney Store",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp",
                                            "short_desc": "",
                                            "long_desc": "",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp"
                                            ],
                                            "bpp_id": "ref-seller-app-preprod.ondc.org"
                                        },
                                        "storeOpenTillDate": "2023-08-17T23:55:00.304Z"
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "lsn_prepaid",
                                    "type": "Delivery",
                                    "state": {
                                        "descriptor": {
                                            "code": "Pending",
                                            "images": []
                                        }
                                    },
                                    "tracking": false,
                                    "start": {
                                        "location": {
                                            "id": "64ddb7f68fe25ca604b27ef1",
                                            "descriptor": {
                                                "name": "Disney Store",
                                                "images": []
                                            },
                                            "gps": "12.932333337722389,77.68521666526796"
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-17T07:20:14.458Z",
                                                "end": "2023-08-18T07:20:14.458Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9999999999",
                                            "email": "sa@mailinator.com"
                                        }
                                    },
                                    "end": {
                                        "location": {
                                            "gps": "12.930037, 77.675391",
                                            "address": {
                                                "name": "Inder",
                                                "building": "",
                                                "locality": "Devarabisanahalli, Bellandur",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-17T07:20:14.458Z",
                                                "end": "2023-08-18T07:20:14.458Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9205450531",
                                            "email": "Surnderg@bdo.in"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "c570fcfc-c555-490b-a940-4ec2aca31a16"
                        },
                        "resolution": {
                            "action_triggered": "NO-ACTION",
                            "long_desc": "Not in a policy",
                            "short_desc": "No-action "
                        },
                        "resolution_provider": {
                            "respondent_info": {
                                "type": "TRANSACTION-COUNTERPARTY-NP",
                                "organization": {
                                    "org": {
                                        "name": "https://ref-seller-app-preprod.ondc.org::"
                                    },
                                    "contact": {
                                        "email": "mikky@mailinator.com",
                                        "phone": "9205450531"
                                    },
                                    "person": {
                                        "name": "Mikky"
                                    }
                                },
                                "resolution_support": {
                                    "chat_link": "http://chat-link/respondent",
                                    "contact": {
                                        "email": "mikky@mailinator.com",
                                        "phone": "9205450531"
                                    },
                                    "gros": [
                                        {
                                            "person": {
                                                "name": "Mikky"
                                            },
                                            "contact": {
                                                "email": "mikky@mailinator.com",
                                                "phone": "9205450531"
                                            },
                                            "gro_type": "TRANSACTION-COUNTERPARTY-NP-GRO"
                                        }
                                    ]
                                }
                            }
                        },
                        "sub_category": "ITM01",
                        "updated_at": "2023-09-26T10:37:56.072Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    },
                    {
                        "_id": "65115a1b3e28c25d76167f60",
                        "transaction_id": "557eac89-85a0-4734-bc72-8a6f814e616d",
                        "__v": 0,
                        "bppId": "ref-seller-app-preprod.ondc.org",
                        "bpp_uri": "https://ref-seller-app-preprod.ondc.org",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "Inder"
                            },
                            "contact": {
                                "phone": 9205450531
                            }
                        },
                        "created_at": "2023-09-25T09:59:54.738Z",
                        "description": {
                            "short_desc": "tt",
                            "long_desc": "gffg",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": [
                                "https://buyer-app-preprod.ondc.org/issueApis/uploads/1695635995308.png"
                            ]
                        },
                        "issueId": "1fae13d9-b4bf-4ce7-8b5b-ed7a23f7f3b3",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-09-25T09:59:55.308Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                },
                                {
                                    "complainant_action": "CLOSE",
                                    "short_desc": "Complaint closed",
                                    "updated_at": "2023-09-27T09:43:05.009Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": [
                                {
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are investigating your concern.",
                                    "updated_at": "2023-09-25T10:04:54.738Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    },
                                    "cascaded_level": 1
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "RESOLVED",
                                    "short_desc": "Refund",
                                    "updated_at": "2023-09-27T09:42:30.887Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "mikky@mailinator.com",
                                            "phone": "9205450531"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Mikky"
                                        }
                                    }
                                }
                            ]
                        },
                        "issue_status": "Close",
                        "message_id": "e5932fa5-d517-4e45-b37b-279750d40d72",
                        "order_details": {
                            "id": "2023-08-17-134757",
                            "state": "Created",
                            "items": [
                                {
                                    "id": "3d885ff5-02d4-41d3-9993-2bb4f2553c81",
                                    "quantity": {
                                        "count": 3
                                    },
                                    "product": {
                                        "id": "3d885ff5-02d4-41d3-9993-2bb4f2553c81",
                                        "name": "Egg",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "",
                                        "descriptor": {
                                            "name": "Egg",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/c2ac2209-ae83-4156-b160-d75f29704f30/product_image/5_90b5ad8f-22e3-4274-9c51-90bca9d5eabf.webp",
                                            "short_desc": "The hard-shelled reproductive body produced by a bird and especially by the common domestic chicken (Gallus gallus) an animal reproductive body consisting of an ovum together with its nutritive and protective envelopes and having the capacity.",
                                            "long_desc": "The hard-shelled reproductive body produced by a bird and especially by the common domestic chicken (Gallus gallus) an animal reproductive body consisting of an ovum together with its nutritive and protective envelopes.",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/c2ac2209-ae83-4156-b160-d75f29704f30/product_image/5_90b5ad8f-22e3-4274-9c51-90bca9d5eabf.webp"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "2.0",
                                            "maximum_value": "2"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": "2239"
                                            },
                                            "maximum": {
                                                "count": "1230"
                                            }
                                        },
                                        "category_id": "eggs_meat_and_fish",
                                        "location_id": "64ddb7f68fe25ca604b27ef1",
                                        "fulfillment_id": "1",
                                        "matched": true,
                                        "@ondc/org/returnable": false,
                                        "@ondc/org/cancellable": false,
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/time_to_ship": "PT1H",
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "PT123H",
                                        "@ondc/org/contact_details_consumer_care": "Disney Store,sa@mailinator.com,9999999999",
                                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                                            "net_quantity": "123421"
                                        },
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "134",
                                            "manufacturer_or_packer_address": "123124",
                                            "common_or_generic_name_of_commodity": "Egg",
                                            "net_quantity_or_measure_of_commodity_in_pkg": "123421",
                                            "month_year_of_manufacture_packing_import": "10/05/2021"
                                        },
                                        "@ondc/org/statutory_reqs_prepackaged_food": {
                                            "brand_owner_FSSAI_license_no": "NA",
                                            "other_FSSAI_license_no": "NA",
                                            "importer_FSSAI_license_no": "NA"
                                        },
                                        "tags": {
                                            "veg": "no",
                                            "non_veg": "yes"
                                        },
                                        "provider_details": {
                                            "id": "c570fcfc-c555-490b-a940-4ec2aca31a16",
                                            "descriptor": {
                                                "name": "Disney Store",
                                                "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp",
                                                "short_desc": "",
                                                "long_desc": "",
                                                "images": [
                                                    "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "64ddb7f68fe25ca604b27ef1",
                                            "gps": "12.932333337722389,77.68521666526796",
                                            "address": {
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "area_code": "560103",
                                                "street": "Kariyammana Agrahara"
                                            },
                                            "time": {
                                                "days": "1,2,3,4,5",
                                                "schedule": {
                                                    "holidays": [
                                                        "2023-06-10"
                                                    ],
                                                    "frequency": "",
                                                    "times": []
                                                },
                                                "range": {
                                                    "start": "0805",
                                                    "end": "2355"
                                                }
                                            },
                                            "circle": {
                                                "gps": "12.932333337722389,77.68521666526796",
                                                "radius": {
                                                    "unit": "km",
                                                    "value": "10"
                                                }
                                            }
                                        },
                                        "fulfillment_details": {
                                            "id": "1",
                                            "type": "Delivery"
                                        },
                                        "context": {
                                            "domain": "nic2004:52110",
                                            "country": "IND",
                                            "city": "std:080",
                                            "action": "on_search",
                                            "core_version": "1.1.0",
                                            "bap_id": "buyer-app-preprod.ondc.org",
                                            "bap_uri": "https://buyer-app-preprod.ondc.org/protocol/v1",
                                            "transaction_id": "557eac89-85a0-4734-bc72-8a6f814e616d",
                                            "message_id": "bce5a4e3-2c5e-49ea-84df-028a3059d50e",
                                            "timestamp": "2023-08-17T08:52:38.229Z",
                                            "ttl": "PT30S",
                                            "bpp_id": "ref-seller-app-preprod.ondc.org",
                                            "bpp_uri": "https://ref-seller-app-preprod.ondc.org"
                                        },
                                        "bpp_details": {
                                            "name": "A1 Store",
                                            "symbol": "e154bd6e-12e6-424b-b67a-5c45702d8497/logo/WhatsApp Image 2023-08-09 at 11.36.22 AM.jpeg",
                                            "short_desc": "",
                                            "long_desc": "",
                                            "images": [
                                                "e154bd6e-12e6-424b-b67a-5c45702d8497/logo/WhatsApp Image 2023-08-09 at 11.36.22 AM.jpeg"
                                            ],
                                            "bpp_id": "ref-seller-app-preprod.ondc.org"
                                        },
                                        "storeOpenTillDate": "2023-08-17T23:55:00.271Z"
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "lsn_prepaid",
                                    "type": "Delivery",
                                    "state": {
                                        "descriptor": {
                                            "code": "Pending",
                                            "images": []
                                        }
                                    },
                                    "tracking": false,
                                    "start": {
                                        "location": {
                                            "id": "64ddb7f68fe25ca604b27ef1",
                                            "descriptor": {
                                                "name": "Disney Store",
                                                "images": []
                                            },
                                            "gps": "12.932333337722389,77.68521666526796"
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-17T08:54:55.830Z",
                                                "end": "2023-08-18T08:54:55.830Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9999999999",
                                            "email": "sa@mailinator.com"
                                        }
                                    },
                                    "end": {
                                        "location": {
                                            "gps": "12.930037, 77.675391",
                                            "address": {
                                                "name": "Inder",
                                                "building": "",
                                                "locality": "Devarabisanahalli, Bellandur",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-17T08:54:55.830Z",
                                                "end": "2023-08-18T08:54:55.830Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9205450531",
                                            "email": "Surnderg@bdo.in"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "c570fcfc-c555-490b-a940-4ec2aca31a16"
                        },
                        "resolution": {
                            "action_triggered": "REFUND",
                            "long_desc": "test Refund",
                            "refund_amount": "599.00",
                            "short_desc": "Refund"
                        },
                        "resolution_provider": {
                            "respondent_info": {
                                "type": "TRANSACTION-COUNTERPARTY-NP",
                                "organization": {
                                    "org": {
                                        "name": "https://ref-seller-app-preprod.ondc.org::"
                                    },
                                    "contact": {
                                        "email": "mikky@mailinator.com",
                                        "phone": "9205450531"
                                    },
                                    "person": {
                                        "name": "Mikky"
                                    }
                                },
                                "resolution_support": {
                                    "chat_link": "http://chat-link/respondent",
                                    "contact": {
                                        "email": "mikky@mailinator.com",
                                        "phone": "9205450531"
                                    },
                                    "gros": [
                                        {
                                            "person": {
                                                "name": "Mikky"
                                            },
                                            "contact": {
                                                "email": "mikky@mailinator.com",
                                                "phone": "9205450531"
                                            },
                                            "gro_type": "TRANSACTION-COUNTERPARTY-NP-GRO"
                                        }
                                    ]
                                }
                            }
                        },
                        "sub_category": "ITM04",
                        "updated_at": "2023-09-25T09:59:54.738Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    },
                    {
                        "_id": "65114a6f3e28c25d761656b0",
                        "transaction_id": "55b8ad3c-836d-409f-8895-b77b9f559fe7",
                        "__v": 0,
                        "bppId": "ref-seller-app-preprod.ondc.org",
                        "bpp_uri": "https://ref-seller-app-preprod.ondc.org",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "Pushpa"
                            },
                            "contact": {
                                "phone": 8800232424
                            }
                        },
                        "created_at": "2023-09-25T08:53:03.470Z",
                        "description": {
                            "short_desc": "missing item",
                            "long_desc": "item",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": []
                        },
                        "issueId": "1930e997-6a5d-4109-8433-9079b431b6e4",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-09-25T08:53:03.506Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                },
                                {
                                    "complainant_action": "CLOSE",
                                    "short_desc": "Complaint closed",
                                    "updated_at": "2023-09-25T09:11:36.806Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": [
                                {
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are investigating your concern.",
                                    "updated_at": "2023-09-25T08:58:03.471Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    },
                                    "cascaded_level": 1
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "RESOLVED",
                                    "short_desc": "cancel",
                                    "updated_at": "2023-09-25T09:10:52.757Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "mikky@mailinator.com",
                                            "phone": "9205450531"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Mikky"
                                        }
                                    }
                                }
                            ]
                        },
                        "issue_status": "Close",
                        "message_id": "6d68d222-a74c-4c9e-9e94-1c16bedabece",
                        "order_details": {
                            "id": "2023-08-17-840041",
                            "state": "Created",
                            "items": [
                                {
                                    "id": "58921a16-c5e3-4121-9874-b4e739585445",
                                    "quantity": {
                                        "count": 2
                                    },
                                    "product": {
                                        "id": "58921a16-c5e3-4121-9874-b4e739585445",
                                        "name": "Hand Sanitizer",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "",
                                        "descriptor": {
                                            "name": "Hand Sanitizer",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/e0a30fed-fda2-4646-a7b6-13c469762e3d/product_image/dettol_instant_hand_sanitizer_original_50_ml_33218_0_1.jpg.jpeg",
                                            "short_desc": "a substance or preparation for killing germs, designed for use especially on food-processing equipment.",
                                            "long_desc": "a substance or preparation for killing germs, designed for use especially on food-processing equipment.",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/e0a30fed-fda2-4646-a7b6-13c469762e3d/product_image/dettol_instant_hand_sanitizer_original_50_ml_33218_0_1.jpg.jpeg"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "150.0",
                                            "maximum_value": "150"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": "99994"
                                            },
                                            "maximum": {
                                                "count": "99"
                                            }
                                        },
                                        "category_id": "baby_care",
                                        "location_id": "64ddb7f68fe25ca604b27ef1",
                                        "fulfillment_id": "1",
                                        "matched": true,
                                        "@ondc/org/returnable": false,
                                        "@ondc/org/cancellable": false,
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/time_to_ship": "PT1H",
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "PT75H",
                                        "@ondc/org/contact_details_consumer_care": "Disney Store,sa@mailinator.com,9999999999",
                                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                                            "net_quantity": "50"
                                        },
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "HOME NINJA",
                                            "manufacturer_or_packer_address": "Noida ",
                                            "common_or_generic_name_of_commodity": "Hand Sanitizer",
                                            "net_quantity_or_measure_of_commodity_in_pkg": "50",
                                            "month_year_of_manufacture_packing_import": "19/07/2023"
                                        },
                                        "@ondc/org/statutory_reqs_prepackaged_food": {
                                            "brand_owner_FSSAI_license_no": "NA",
                                            "other_FSSAI_license_no": "NA",
                                            "importer_FSSAI_license_no": "NA"
                                        },
                                        "tags": {
                                            "veg": "no",
                                            "non_veg": "yes"
                                        },
                                        "provider_details": {
                                            "id": "c570fcfc-c555-490b-a940-4ec2aca31a16",
                                            "descriptor": {
                                                "name": "Disney Store",
                                                "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp",
                                                "short_desc": "",
                                                "long_desc": "",
                                                "images": [
                                                    "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "64ddb7f68fe25ca604b27ef1",
                                            "gps": "12.932333337722389,77.68521666526796",
                                            "address": {
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "area_code": "560103",
                                                "street": "Kariyammana Agrahara"
                                            },
                                            "time": {
                                                "days": "1,2,3,4,5",
                                                "schedule": {
                                                    "holidays": [
                                                        "2023-06-10"
                                                    ],
                                                    "frequency": "",
                                                    "times": []
                                                },
                                                "range": {
                                                    "start": "0805",
                                                    "end": "2355"
                                                }
                                            },
                                            "circle": {
                                                "gps": "12.932333337722389,77.68521666526796",
                                                "radius": {
                                                    "unit": "km",
                                                    "value": "10"
                                                }
                                            }
                                        },
                                        "fulfillment_details": {
                                            "id": "1",
                                            "type": "Delivery"
                                        },
                                        "bpp_details": {
                                            "name": "Root House Cafe",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/94f7e69a-8192-4148-873a-83b05af803a5/logo/health_banner.svg.svg+xml",
                                            "short_desc": "",
                                            "long_desc": "",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/94f7e69a-8192-4148-873a-83b05af803a5/logo/health_banner.svg.svg+xml"
                                            ],
                                            "bpp_id": "ref-seller-app-preprod.ondc.org"
                                        },
                                        "storeOpenTillDate": "2023-08-17T23:55:00.640Z"
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "lsn_prepaid",
                                    "type": "Delivery",
                                    "state": {
                                        "descriptor": {
                                            "code": "Pending",
                                            "images": []
                                        }
                                    },
                                    "tracking": false,
                                    "start": {
                                        "location": {
                                            "id": "64ddb7f68fe25ca604b27ef1",
                                            "descriptor": {
                                                "name": "Disney Store",
                                                "images": []
                                            },
                                            "gps": "12.932333337722389,77.68521666526796"
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-17T07:32:37.403Z",
                                                "end": "2023-08-18T07:32:37.403Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9999999999",
                                            "email": "sa@mailinator.com"
                                        }
                                    },
                                    "end": {
                                        "location": {
                                            "gps": "12.930037, 77.675391",
                                            "address": {
                                                "name": "Inder",
                                                "building": "",
                                                "locality": "Devarabisanahalli, Bellandur",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-17T07:32:37.403Z",
                                                "end": "2023-08-18T07:32:37.403Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9205450531",
                                            "email": "Surnderg@bdo.in"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "c570fcfc-c555-490b-a940-4ec2aca31a16"
                        },
                        "resolution": {
                            "action_triggered": "CANCEL",
                            "long_desc": "",
                            "short_desc": "cancel"
                        },
                        "resolution_provider": {
                            "respondent_info": {
                                "type": "TRANSACTION-COUNTERPARTY-NP",
                                "organization": {
                                    "org": {
                                        "name": "https://ref-seller-app-preprod.ondc.org::"
                                    },
                                    "contact": {
                                        "email": "mikky@mailinator.com",
                                        "phone": "9205450531"
                                    },
                                    "person": {
                                        "name": "Mikky"
                                    }
                                },
                                "resolution_support": {
                                    "chat_link": "http://chat-link/respondent",
                                    "contact": {
                                        "email": "mikky@mailinator.com",
                                        "phone": "9205450531"
                                    },
                                    "gros": [
                                        {
                                            "person": {
                                                "name": "Mikky"
                                            },
                                            "contact": {
                                                "email": "mikky@mailinator.com",
                                                "phone": "9205450531"
                                            },
                                            "gro_type": "TRANSACTION-COUNTERPARTY-NP-GRO"
                                        }
                                    ]
                                }
                            }
                        },
                        "sub_category": "ITM01",
                        "updated_at": "2023-09-25T08:53:03.470Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    },
                    {
                        "_id": "64e6d7d2c38920eb8e045e69",
                        "transaction_id": "5918b458-45ae-474f-95e1-75907eee859d",
                        "__v": 0,
                        "bppId": "ref-seller-app-preprod.ondc.org",
                        "bpp_uri": "https://ref-seller-app-preprod.ondc.org",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "surender"
                            },
                            "contact": {
                                "phone": 9205450532
                            }
                        },
                        "created_at": "2023-08-24T04:08:50.757Z",
                        "description": {
                            "short_desc": "Test Expired item",
                            "long_desc": "test",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": []
                        },
                        "issueId": "989f3d9d-6151-47f3-a6ce-421a390a26eb",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-08-24T04:08:50.609Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                },
                                {
                                    "complainant_action": "ESCALATE",
                                    "short_desc": "Refund amount is not correct.",
                                    "updated_at": "2023-08-24T04:14:26.335Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                },
                                {
                                    "complainant_action": "CLOSE",
                                    "short_desc": "Complaint closed",
                                    "updated_at": "2023-08-24T04:25:45.296Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": [
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are investigating your concern.",
                                    "updated_at": "2023-08-24T04:10:11.576Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "mikky@mailinator.com",
                                            "phone": "9205450531"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Mikky"
                                        }
                                    }
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "RESOLVED",
                                    "short_desc": "As per the complaint, initiated refund.",
                                    "updated_at": "2023-08-24T04:12:31.348Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "mikky@mailinator.com",
                                            "phone": "9205450531"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Mikky"
                                        }
                                    }
                                },
                                {
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are looking into your concern.",
                                    "updated_at": "2023-08-24T04:14:26.254Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "contact": {
                                            "phone": "9876543210",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    },
                                    "cascaded_level": 1
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "RESOLVED",
                                    "short_desc": "As per policy that is correct amount. ",
                                    "updated_at": "2023-08-24T04:17:33.995Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "mikky@mailinator.com",
                                            "phone": "9205450531"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Mikky"
                                        }
                                    }
                                }
                            ]
                        },
                        "issue_status": "Close",
                        "message_id": "72c88c58-b788-4da0-867f-bd33875c902d",
                        "order_details": {
                            "id": "2023-08-24-994668",
                            "state": "Created",
                            "items": [
                                {
                                    "id": "3d885ff5-02d4-41d3-9993-2bb4f2553c81",
                                    "quantity": {
                                        "count": 2
                                    },
                                    "product": {
                                        "id": "3d885ff5-02d4-41d3-9993-2bb4f2553c81",
                                        "name": "Egg",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "",
                                        "descriptor": {
                                            "name": "Egg",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/c2ac2209-ae83-4156-b160-d75f29704f30/product_image/5_90b5ad8f-22e3-4274-9c51-90bca9d5eabf.webp",
                                            "short_desc": "The hard-shelled reproductive body produced by a bird and especially by the common domestic chicken (Gallus gallus) an animal reproductive body consisting of an ovum together with its nutritive and protective envelopes and having the capacity.",
                                            "long_desc": "The hard-shelled reproductive body produced by a bird and especially by the common domestic chicken (Gallus gallus) an animal reproductive body consisting of an ovum together with its nutritive and protective envelopes.",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/c2ac2209-ae83-4156-b160-d75f29704f30/product_image/5_90b5ad8f-22e3-4274-9c51-90bca9d5eabf.webp"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "2.0",
                                            "maximum_value": "2"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": "2236"
                                            },
                                            "maximum": {
                                                "count": "1230"
                                            }
                                        },
                                        "category_id": "eggs_meat_and_fish",
                                        "location_id": "64ddb7f68fe25ca604b27ef1",
                                        "fulfillment_id": "1",
                                        "matched": true,
                                        "@ondc/org/returnable": false,
                                        "@ondc/org/cancellable": false,
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/time_to_ship": "PT1H",
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "PT123H",
                                        "@ondc/org/contact_details_consumer_care": "Disney Store,sa@mailinator.com,9999999999",
                                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                                            "net_quantity": "123421"
                                        },
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "134",
                                            "manufacturer_or_packer_address": "123124",
                                            "common_or_generic_name_of_commodity": "Egg",
                                            "net_quantity_or_measure_of_commodity_in_pkg": "123421",
                                            "month_year_of_manufacture_packing_import": "10/05/2021"
                                        },
                                        "@ondc/org/statutory_reqs_prepackaged_food": {
                                            "brand_owner_FSSAI_license_no": "NA",
                                            "other_FSSAI_license_no": "NA",
                                            "importer_FSSAI_license_no": "NA"
                                        },
                                        "tags": {
                                            "veg": "no",
                                            "non_veg": "yes"
                                        },
                                        "provider_details": {
                                            "id": "c570fcfc-c555-490b-a940-4ec2aca31a16",
                                            "descriptor": {
                                                "name": "Disney Store",
                                                "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp",
                                                "short_desc": "",
                                                "long_desc": "",
                                                "images": [
                                                    "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "64ddb7f68fe25ca604b27ef1",
                                            "gps": "12.932333337722389,77.68521666526796",
                                            "address": {
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "area_code": "560103",
                                                "street": "Kariyammana Agrahara"
                                            },
                                            "time": {
                                                "days": "1,2,3,4,5",
                                                "schedule": {
                                                    "holidays": [
                                                        "2023-06-10"
                                                    ],
                                                    "frequency": "",
                                                    "times": []
                                                },
                                                "range": {
                                                    "start": "0805",
                                                    "end": "2355"
                                                }
                                            },
                                            "circle": {
                                                "gps": "12.932333337722389,77.68521666526796",
                                                "radius": {
                                                    "unit": "km",
                                                    "value": "10"
                                                }
                                            }
                                        },
                                        "fulfillment_details": {
                                            "id": "1",
                                            "type": "Delivery"
                                        },
                                        "bpp_details": {
                                            "name": "Disney Store",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp",
                                            "short_desc": "",
                                            "long_desc": "",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/79bbb0bf-742d-45fe-86d6-a8dde5bd8370/logo/7_c46e4534-b7f5-46ea-9adc-84bad6c1479f.webp"
                                            ],
                                            "bpp_id": "ref-seller-app-preprod.ondc.org"
                                        },
                                        "storeOpenTillDate": "2023-08-24T23:55:00.269Z"
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "lsn_prepaid",
                                    "type": "Delivery",
                                    "state": {
                                        "descriptor": {
                                            "code": "Pending",
                                            "images": []
                                        }
                                    },
                                    "tracking": false,
                                    "start": {
                                        "location": {
                                            "id": "64ddb7f68fe25ca604b27ef1",
                                            "descriptor": {
                                                "name": "Disney Store",
                                                "images": []
                                            },
                                            "gps": "12.932333337722389,77.68521666526796"
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-24T04:06:47.320Z",
                                                "end": "2023-08-25T04:06:47.320Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9999999999",
                                            "email": "sa@mailinator.com"
                                        }
                                    },
                                    "end": {
                                        "location": {
                                            "gps": "12.930037, 77.675391",
                                            "address": {
                                                "name": "Inder",
                                                "building": "",
                                                "locality": "Devarabisanahalli, Bellandur",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-24T04:06:47.320Z",
                                                "end": "2023-08-25T04:06:47.320Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9205450531",
                                            "email": "Surnderg@bdo.in"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "c570fcfc-c555-490b-a940-4ec2aca31a16"
                        },
                        "resolution": {
                            "action_triggered": "NO-ACTION",
                            "long_desc": "",
                            "short_desc": "As per policy that is correct amount. "
                        },
                        "resolution_provider": {
                            "respondent_info": {
                                "type": "TRANSACTION-COUNTERPARTY-NP",
                                "organization": {
                                    "org": {
                                        "name": "https://ref-seller-app-preprod.ondc.org::"
                                    },
                                    "contact": {
                                        "email": "mikky@mailinator.com",
                                        "phone": "9205450531"
                                    },
                                    "person": {
                                        "name": "Mikky"
                                    }
                                },
                                "resolution_support": {
                                    "chat_link": "http://chat-link/respondent",
                                    "contact": {
                                        "email": "mikky@mailinator.com",
                                        "phone": "9205450531"
                                    },
                                    "gros": [
                                        {
                                            "person": {
                                                "name": "Mikky"
                                            },
                                            "contact": {
                                                "email": "mikky@mailinator.com",
                                                "phone": "9205450531"
                                            },
                                            "gro_type": "TRANSACTION-COUNTERPARTY-NP-GRO"
                                        }
                                    ]
                                }
                            }
                        },
                        "sub_category": "ITM01",
                        "updated_at": "2023-08-24T04:08:50.757Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    },
                    {
                        "_id": "64de0a20c38920eb8eedf555",
                        "transaction_id": "e8b44e69-d800-49af-9b5e-2bc7dd51bd83",
                        "__v": 0,
                        "bppId": "ref-seller-app-preprod.ondc.org",
                        "bpp_uri": "https://ref-seller-app-preprod.ondc.org",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "Inder"
                            },
                            "contact": {
                                "phone": 9205450531
                            }
                        },
                        "created_at": "2023-08-17T11:53:03.032Z",
                        "description": {
                            "short_desc": "One item is expired",
                            "long_desc": "Test",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": [
                                "https://buyer-app-preprod.ondc.org/issueApis/uploads/1692273183787.png"
                            ]
                        },
                        "issueId": "da499cc4-de75-4fed-a667-efba2fc9ad24",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-08-17T11:53:03.787Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": [
                                {
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are investigating your concern.",
                                    "updated_at": "2023-08-17T11:58:03.034Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    },
                                    "cascaded_level": 1
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "RESOLVED",
                                    "short_desc": "As per the complaint, initiated refund.",
                                    "updated_at": "2023-08-24T04:12:31.348Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "mikky@mailinator.com",
                                            "phone": "9205450531"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Mikky"
                                        }
                                    }
                                },
                            ]
                        },
                        "issue_status": "Open",
                        "message_id": "b74f319a-893e-4438-8f5d-b09d451727e3",
                        "order_details": {
                            "id": "2023-08-17-504941",
                            "state": "Created",
                            "items": [
                                {
                                    "id": "85376df0-1690-414f-9cff-7a24babc43b8",
                                    "quantity": {
                                        "count": 1
                                    },
                                    "product": {
                                        "id": "85376df0-1690-414f-9cff-7a24babc43b8",
                                        "name": "socks",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "",
                                        "descriptor": {
                                            "name": "socks",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/3dcc17ef-8968-4c1c-aea8-682a6954b9ef/product_image/MicrosoftTeams-image.png",
                                            "short_desc": "noo",
                                            "long_desc": "noo",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/3dcc17ef-8968-4c1c-aea8-682a6954b9ef/product_image/MicrosoftTeams-image.png"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "6.0",
                                            "maximum_value": "6"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": "21"
                                            },
                                            "maximum": {
                                                "count": "12"
                                            }
                                        },
                                        "category_id": "mens_fashion_accessories",
                                        "location_id": "64dde44f8fe25ca604b360c3",
                                        "fulfillment_id": "1",
                                        "matched": true,
                                        "@ondc/org/returnable": true,
                                        "@ondc/org/cancellable": true,
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/time_to_ship": "PT1H",
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "PT72H",
                                        "@ondc/org/contact_details_consumer_care": "krishna general store,nehad@mailinator.com,9028498240",
                                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                                            "net_quantity": "1"
                                        },
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "adidas",
                                            "manufacturer_or_packer_address": "gurugram",
                                            "common_or_generic_name_of_commodity": "socks",
                                            "net_quantity_or_measure_of_commodity_in_pkg": "1",
                                            "month_year_of_manufacture_packing_import": "02/08/2023"
                                        },
                                        "@ondc/org/statutory_reqs_prepackaged_food": {
                                            "nutritional_info": "no",
                                            "additives_info": "no",
                                            "brand_owner_FSSAI_license_no": "3",
                                            "other_FSSAI_license_no": "8",
                                            "importer_FSSAI_license_no": "8"
                                        },
                                        "tags": {
                                            "veg": "no",
                                            "non_veg": "yes"
                                        },
                                        "provider_details": {
                                            "id": "c271e492-90f5-410c-a2c8-ffba50fc597b",
                                            "descriptor": {
                                                "name": "krishna general store",
                                                "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/05c923d5-b31d-4d36-b098-8d2c19b441e1/logo/th.jpg.jpeg",
                                                "short_desc": "",
                                                "long_desc": "",
                                                "images": [
                                                    "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/05c923d5-b31d-4d36-b098-8d2c19b441e1/logo/th.jpg.jpeg"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "64dde44f8fe25ca604b360c3",
                                            "gps": "12.9140160000001,77.6371740000001",
                                            "address": {
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "area_code": "560103",
                                                "street": "HSR Layout"
                                            },
                                            "time": {
                                                "days": "1,2,3,4,5",
                                                "schedule": {
                                                    "holidays": [
                                                        "2023-08-15"
                                                    ],
                                                    "frequency": "",
                                                    "times": []
                                                },
                                                "range": {
                                                    "start": "0800",
                                                    "end": "2000"
                                                }
                                            },
                                            "circle": {
                                                "gps": "12.9140160000001,77.6371740000001",
                                                "radius": {
                                                    "unit": "km",
                                                    "value": "20"
                                                }
                                            }
                                        },
                                        "fulfillment_details": {
                                            "id": "1",
                                            "type": "Delivery"
                                        },
                                        "bpp_details": {
                                            "name": "A1 Store",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/e154bd6e-12e6-424b-b67a-5c45702d8497/logo/WhatsApp Image 2023-08-09 at 11.36.22 AM.jpeg",
                                            "short_desc": "",
                                            "long_desc": "",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/e154bd6e-12e6-424b-b67a-5c45702d8497/logo/WhatsApp Image 2023-08-09 at 11.36.22 AM.jpeg"
                                            ],
                                            "bpp_id": "ref-seller-app-preprod.ondc.org"
                                        },
                                        "storeOpenTillDate": "2023-08-17T20:00:00.449Z"
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "lsn_prepaid",
                                    "type": "Delivery",
                                    "state": {
                                        "descriptor": {
                                            "code": "Pending",
                                            "images": []
                                        }
                                    },
                                    "tracking": false,
                                    "start": {
                                        "location": {
                                            "id": "64dde5998fe25ca604b36cba",
                                            "descriptor": {
                                                "name": "krishna general store",
                                                "images": []
                                            },
                                            "gps": "12.932458818087362,77.68518447875978"
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-17T09:20:32.496Z",
                                                "end": "2023-08-18T09:20:32.496Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9028498240",
                                            "email": "nehad@mailinator.com"
                                        }
                                    },
                                    "end": {
                                        "location": {
                                            "gps": "12.930037, 77.675391",
                                            "address": {
                                                "name": "Inder",
                                                "building": "",
                                                "locality": "Devarabisanahalli, Bellandur",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-08-17T09:20:32.496Z",
                                                "end": "2023-08-18T09:20:32.496Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9205450531",
                                            "email": "Surnderg@bdo.in"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "c271e492-90f5-410c-a2c8-ffba50fc597b"
                        },
                        "sub_category": "ITM05",
                        "updated_at": "2023-08-17T11:53:03.032Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    },
                    {
                        "_id": "64dcaa04c38920eb8eea68b6",
                        "transaction_id": "d20e2f2e-fed5-480d-815f-907f21eebc15",
                        "__v": 0,
                        "bppId": "ref-seller-app-preprod.ondc.org",
                        "bpp_uri": "https://ref-seller-app-preprod.ondc.org",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "Surender kush"
                            },
                            "contact": {
                                "phone": 9205450531
                            }
                        },
                        "created_at": "2023-08-16T10:51:02.005Z",
                        "description": {
                            "short_desc": "tets",
                            "long_desc": "tetstttttt",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": []
                        },
                        "issueId": "fd176a07-9e86-4c74-901e-3b33cc16c187",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-08-16T10:50:44.584Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                },
                                {
                                    "complainant_action": "CLOSE",
                                    "short_desc": "Complaint closed",
                                    "updated_at": "2023-08-16T10:55:43.201Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": [
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are investigating your concern.",
                                    "updated_at": "2023-08-16T10:52:26.423Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "surenderg@bdo.in",
                                            "phone": "8595103126"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Surender kushwaha"
                                        }
                                    }
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "RESOLVED",
                                    "short_desc": "abc",
                                    "updated_at": "2023-08-16T10:55:08.739Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "surenderg@bdo.in",
                                            "phone": "8595103126"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Surender kushwaha"
                                        }
                                    }
                                }
                            ]
                        },
                        "issue_status": "Close",
                        "message_id": "6fe262cb-cecd-4aa3-bd5d-b7ce4486236c",
                        "order_details": {
                            "id": "2023-04-13-845287",
                            "state": "Created",
                            "items": [
                                {
                                    "id": "4d095315-f228-4c21-827d-c24de00c8769",
                                    "quantity": {
                                        "count": 1
                                    },
                                    "product": {
                                        "id": "4d095315-f228-4c21-827d-c24de00c8769",
                                        "name": "Pizza hut",
                                        "cancellation_status": "Return_Initiated",
                                        "return_status": "Return_Initiated",
                                        "fulfillment_status": "",
                                        "descriptor": {
                                            "name": "Pizza hut",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/d941be4d-bf16-4006-91e8-bde50e4e74b4/product_image/p49-1493902576590b24f0cacb9.webp",
                                            "short_desc": "description",
                                            "long_desc": "long",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/d941be4d-bf16-4006-91e8-bde50e4e74b4/product_image/p49-1493902576590b24f0cacb9.webp",
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/d941be4d-bf16-4006-91e8-bde50e4e74b4/product_image/p49-1493902593590b25010d8df.webp"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "999.0",
                                            "maximum_value": "999"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": "67"
                                            },
                                            "maximum": {
                                                "count": "3"
                                            }
                                        },
                                        "category_id": "Fruits and Vegetables",
                                        "location_id": "6417ebad25c76803ac9adc78",
                                        "fulfillment_id": "1",
                                        "matched": true,
                                        "@ondc/org/returnable": false,
                                        "@ondc/org/cancellable": false,
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/time_to_ship": "PT1H",
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "P7D",
                                        "@ondc/org/contact_details_consumer_care": "ZOZO Store,surenderg@bdo.in,8595103126",
                                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                                            "net_quantity": "2"
                                        },
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "Burger king",
                                            "manufacturer_or_packer_address": "Burger king",
                                            "common_or_generic_name_of_commodity": "Pizza hut",
                                            "net_quantity_or_measure_of_commodity_in_pkg": "2",
                                            "month_year_of_manufacture_packing_import": "20-03-2023"
                                        },
                                        "@ondc/org/statutory_reqs_prepackaged_food": {
                                            "nutritional_info": "Info",
                                            "additives_info": "info",
                                            "brand_owner_FSSAI_license_no": "21341rqe2w",
                                            "other_FSSAI_license_no": "21341rqe2w",
                                            "importer_FSSAI_license_no": "21341rqe2w"
                                        },
                                        "tags": {
                                            "veg": "no",
                                            "non_veg": "yes"
                                        },
                                        "provider_details": {
                                            "id": "d941be4d-bf16-4006-91e8-bde50e4e74b4",
                                            "descriptor": {
                                                "name": "ZOZO Store",
                                                "symbol": "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png",
                                                "short_desc": "",
                                                "long_desc": "",
                                                "images": [
                                                    "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "6417ebad25c76803ac9adc78",
                                            "gps": "12.93687150412194,77.62496888637544",
                                            "address": {
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "area_code": "560095",
                                                "street": "Koramangala"
                                            },
                                            "time": {
                                                "range": {
                                                    "start": "0000",
                                                    "end": "2359"
                                                },
                                                "days": "1,2,3,4,5,6,7",
                                                "schedule": {
                                                    "holidays": []
                                                }
                                            }
                                        },
                                        "fulfillment_details": {
                                            "id": "1",
                                            "type": "Delivery"
                                        },
                                        "bpp_details": {
                                            "name": "CASIO Shop",
                                            "symbol": "fe1b3e2a-d84a-4f00-b622-9993872305a1/logo/images.png",
                                            "short_desc": "",
                                            "long_desc": "",
                                            "images": [
                                                "fe1b3e2a-d84a-4f00-b622-9993872305a1/logo/images.png"
                                            ],
                                            "bpp_id": "ref-seller-app-preprod.ondc.org"
                                        },
                                        "storeOpenTillDate": "2023-04-13T23:59:00.287Z"
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "lsn_prepaid",
                                    "type": "Delivery",
                                    "state": {
                                        "descriptor": {
                                            "code": "Pending",
                                            "images": []
                                        }
                                    },
                                    "tracking": false,
                                    "start": {
                                        "location": {
                                            "id": "6417ebad25c76803ac9adc78",
                                            "descriptor": {
                                                "name": "ZOZO Store",
                                                "images": []
                                            },
                                            "gps": "12.93687150412194,77.62496888637544"
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-04-13T06:37:26.567Z",
                                                "end": "2023-04-14T06:37:26.567Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "8595103126",
                                            "email": "surenderg@bdo.in"
                                        }
                                    },
                                    "end": {
                                        "location": {
                                            "gps": "12.938208, 77.619106",
                                            "address": {
                                                "name": "sallu",
                                                "building": "Mangal bazar",
                                                "locality": "3A",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-04-13T06:37:26.567Z",
                                                "end": "2023-04-14T06:37:26.567Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9205450531",
                                            "email": "sallu@mailinator.com"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "d941be4d-bf16-4006-91e8-bde50e4e74b4"
                        },
                        "resolution": {
                            "action_triggered": "REPLACEMENT",
                            "long_desc": "abc",
                            "short_desc": "abc"
                        },
                        "resolution_provider": {
                            "respondent_info": {
                                "type": "TRANSACTION-COUNTERPARTY-NP",
                                "organization": {
                                    "org": {
                                        "name": "https://ref-seller-app-preprod.ondc.org::"
                                    },
                                    "contact": {
                                        "email": "surenderg@bdo.in",
                                        "phone": "8595103126"
                                    },
                                    "person": {
                                        "name": "Surender kushwaha"
                                    }
                                },
                                "resolution_support": {
                                    "chat_link": "http://chat-link/respondent",
                                    "contact": {
                                        "email": "surenderg@bdo.in",
                                        "phone": "8595103126"
                                    },
                                    "gros": [
                                        {
                                            "person": {
                                                "name": "Surender kushwaha"
                                            },
                                            "contact": {
                                                "email": "surenderg@bdo.in",
                                                "phone": "8595103126"
                                            },
                                            "gro_type": "TRANSACTION-COUNTERPARTY-NP-GRO"
                                        }
                                    ]
                                }
                            }
                        },
                        "sub_category": "ITM01",
                        "updated_at": "2023-08-16T10:51:02.005Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    },
                    {
                        "_id": "64dca39ac38920eb8eea5b72",
                        "transaction_id": "13264c08-9b42-4e1f-919a-2d16ed0b4f16",
                        "__v": 0,
                        "bppId": "ref-seller-app-preprod.ondc.org",
                        "bpp_uri": "https://ref-seller-app-preprod.ondc.org",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "Surender kush"
                            },
                            "contact": {
                                "phone": 8595103126
                            }
                        },
                        "created_at": "2023-08-16T10:23:39.698Z",
                        "description": {
                            "short_desc": "bad",
                            "long_desc": "bad",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": []
                        },
                        "issueId": "bd134d06-14dc-4fe7-bdc0-6d10a2244460",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-08-16T10:23:22.341Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                },
                                {
                                    "complainant_action": "ESCALATE",
                                    "short_desc": "not ok with soln",
                                    "updated_at": "2023-08-16T10:31:06.800Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": [
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are investigating your concern.",
                                    "updated_at": "2023-08-16T10:25:10.211Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "surenderg@bdo.in",
                                            "phone": "8595103126"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Surender kushwaha"
                                        }
                                    }
                                },
                                {
                                    "cascaded_level": 1,
                                    "respondent_action": "RESOLVED",
                                    "short_desc": "okk",
                                    "updated_at": "2023-08-16T10:30:08.338Z",
                                    "updated_by": {
                                        "contact": {
                                            "email": "surenderg@bdo.in",
                                            "phone": "8595103126"
                                        },
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "person": {
                                            "name": "Surender kushwaha"
                                        }
                                    }
                                },
                                {
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are looking into your concern.",
                                    "updated_at": "2023-08-16T10:30:49.446Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "contact": {
                                            "phone": "9876543210",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    },
                                    "cascaded_level": 1
                                }
                            ]
                        },
                        "issue_status": "Open",
                        "message_id": "0201eb48-f94d-4a8d-884c-1f0ea53e9dd1",
                        "order_details": {
                            "id": "2023-03-20-929036",
                            "state": "Created",
                            "items": [
                                {
                                    "id": "31db3c1a-6b10-4650-b623-841205e56e58",
                                    "quantity": {
                                        "count": 3
                                    },
                                    "product": {
                                        "id": "31db3c1a-6b10-4650-b623-841205e56e58",
                                        "name": "Meek-HP New Black Laptop Backpack for Upto 15.6 Inch (39.6 cm) Laptop/Chromebook/Mac (Black) For Men Women Unsex Design",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "",
                                        "descriptor": {
                                            "name": "Meek-HP New Black Laptop Backpack for Upto 15.6 Inch (39.6 cm) Laptop/Chromebook/Mac (Black) For Men Women Unsex Design",
                                            "short_desc": "Care Instructions: Norman Machine Hand Wash.\r\nOriginal Meek-HP new laptop Backpack.\r\nMeek-HP New Black Laptop Backpack for Upto 15.6 Inch (39.6 cm) Laptop/Chromebook/Mac (Black) bag.\r\nSuitable for 15.6 Inch laptop Bags.\r\nBuilt with Premium Quality Material.\r\nClassic style with modern appeal: A backpack with the storage you need in a refined design that's noticeably different.",
                                            "long_desc": "Michael Dell founded Dell Computer Corporation, doing business as PC's Limited, in 1984 while a student at the University of Texas at Austin.[16] Operating from Michael Dell's off-campus dormitory room at Dobie Center,[17] the start-up aimed to sell IBM PC-compatible computers built from stock components. Michael Dell started trading in the belief that by selling personal computer systems directly to customers, PC's Limited could better understand customers' needs and provide the most effective computing solutions to meet those needs.[18] Michael Dell dropped out of college upon completion of his freshman year at the University of Texas at Austin in order to focus full-time on his fledgling business, after getting about $1,000 in expansion-capital from his family.[19] As of April 2021, Michael Dell's net worth was estimated to be over $50 billion.[20]\r\n\r\nIn 1985, the company produced the first computer of its own design — the \"Turbo PC\", sold for US$795[21] — containing an Intel 8088-compatible processor capable of running at a maximum speed of 6.66 MHz.[22] PC's Limited advertised the systems in national computer magazines for sale directly to consumers, and custom assembled each ordered unit according to a selection of options. This offered buyers prices lower than those of retail brands, but with greater convenience than assembling the components themselves. Although not the first company to use this business model, PC's Limited became one of the first to succeed with it. The company grossed more than $73 million in its first year of trading.\r\n\r\nThe company dropped the PC's Limited name in 1987 to become Dell Computer Corporation and began expanding globally. At the time, the reasoning was this new company name better reflected its presence in the business market, as well as resolved issues with the use of \"Limited\" in a company name in certain countries.[23] The company set up its first international operations in Britain; eleven more followed within the next four years. In June 1988, Dell Computer's market capitalization grew by $30 million to $80 million from its June 22 initial public offering of 3.5 million shares at $8.50 a share.[24] In 1989, Dell Computer set up its first on-site service programs in order to compensate for the lack of local retailers prepared to act as service centers.",
                                            "images": []
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "6500.0",
                                            "maximum_value": "6500"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": 100
                                            },
                                            "maximum": {
                                                "count": 3
                                            }
                                        },
                                        "category_id": "Home and Decor",
                                        "location_id": "6417ebad25c76803ac9adc78",
                                        "fulfillment_id": "6417ebad25c76803ac9adc78",
                                        "matched": true,
                                        "@ondc/org/returnable": true,
                                        "@ondc/org/cancellable": true,
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/time_to_ship": "PT48H",
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "P7D",
                                        "@ondc/org/contact_details_consumer_care": "surenderg@bdo.in,8595103126",
                                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                                            "net_quantity": 1
                                        },
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "Dell",
                                            "manufacturer_or_packer_address": "Dell",
                                            "common_or_generic_name_of_commodity": "Meek-HP New Black Laptop Backpack for Upto 15.6 Inch (39.6 cm) Laptop/Chromebook/Mac (Black) For Men Women Unsex Design",
                                            "net_quantity_or_measure_of_commodity_in_pkg": 1,
                                            "month_year_of_manufacture_packing_import": "44929"
                                        },
                                        "@ondc/org/statutory_reqs_prepackaged_food": {
                                            "nutritional_info": "Info",
                                            "additives_info": "info",
                                            "brand_owner_FSSAI_license_no": "21341rqe2w",
                                            "other_FSSAI_license_no": "21341rqe2w",
                                            "importer_FSSAI_license_no": "21341rqe2w"
                                        },
                                        "tags": {
                                            "veg": "no",
                                            "non_veg": "yes"
                                        },
                                        "provider_details": {
                                            "id": "d941be4d-bf16-4006-91e8-bde50e4e74b4",
                                            "descriptor": {
                                                "name": "ZOZO Store",
                                                "symbol": "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png",
                                                "short_desc": "",
                                                "long_desc": "",
                                                "images": [
                                                    "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "6417ebad25c76803ac9adc78",
                                            "gps": "12.93687150412194,77.62496888637544",
                                            "address": {
                                                "building": "3A-A/2",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "India",
                                                "area_code": "560095",
                                                "locality": "Koramangala"
                                            },
                                            "time": {
                                                "range": {
                                                    "start": "0000",
                                                    "end": "2359"
                                                },
                                                "days": "1,2,3,4,5,6,7"
                                            }
                                        },
                                        "bpp_details": {
                                            "name": "ZOZO Store",
                                            "symbol": "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png",
                                            "short_desc": "",
                                            "long_desc": "",
                                            "images": [
                                                "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png"
                                            ],
                                            "bpp_id": "ref-seller-app-preprod.ondc.org"
                                        },
                                        "storeOpenTillDate": "2023-03-20T23:59:00.542Z"
                                    }
                                },
                                {
                                    "id": "4d095315-f228-4c21-827d-c24de00c8769",
                                    "quantity": {
                                        "count": 1
                                    },
                                    "product": {
                                        "id": "4d095315-f228-4c21-827d-c24de00c8769",
                                        "name": "Pizza hut",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "",
                                        "descriptor": {
                                            "name": "Pizza hut",
                                            "symbol": "https://reference-buyer-app-assets.s3-accelerate.amazonaws.com/public-assets/d941be4d-bf16-4006-91e8-bde50e4e74b4/product_image/p49-1493902576590b24f0cacb9.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYIRZUKVUDO2QMTL7%2F20230320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230320T061538Z&X-Amz-Expires=216000&X-Amz-Signature=0ea55e2c64a3e22953da3515146b45ea971babc689bec9a2d7506b3c6dc0f7d3&X-Amz-SignedHeaders=host",
                                            "short_desc": "description",
                                            "long_desc": "long",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-accelerate.amazonaws.com/public-assets/d941be4d-bf16-4006-91e8-bde50e4e74b4/product_image/p49-1493902576590b24f0cacb9.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYIRZUKVUDO2QMTL7%2F20230320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230320T061538Z&X-Amz-Expires=216000&X-Amz-Signature=0ea55e2c64a3e22953da3515146b45ea971babc689bec9a2d7506b3c6dc0f7d3&X-Amz-SignedHeaders=host",
                                                "https://reference-buyer-app-assets.s3-accelerate.amazonaws.com/public-assets/d941be4d-bf16-4006-91e8-bde50e4e74b4/product_image/p49-1493902593590b25010d8df.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYIRZUKVUDO2QMTL7%2F20230320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230320T061538Z&X-Amz-Expires=216000&X-Amz-Signature=0afc1ce61a531b196706710153d2ba0b4167ea4b05f63b9439e2cf207d8139d3&X-Amz-SignedHeaders=host"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "999.0",
                                            "maximum_value": "999"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": 98
                                            },
                                            "maximum": {
                                                "count": 3
                                            }
                                        },
                                        "category_id": "f_and_b",
                                        "location_id": "6417ebad25c76803ac9adc78",
                                        "fulfillment_id": "6417ebad25c76803ac9adc78",
                                        "matched": true,
                                        "@ondc/org/returnable": true,
                                        "@ondc/org/cancellable": false,
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/time_to_ship": "PT48H",
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "P7D",
                                        "@ondc/org/contact_details_consumer_care": "surenderg@bdo.in,8595103126",
                                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                                            "net_quantity": 2
                                        },
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "Burger king",
                                            "manufacturer_or_packer_address": "Burger king",
                                            "common_or_generic_name_of_commodity": "Pizza hut",
                                            "net_quantity_or_measure_of_commodity_in_pkg": 2,
                                            "month_year_of_manufacture_packing_import": "20-03-2023"
                                        },
                                        "@ondc/org/statutory_reqs_prepackaged_food": {
                                            "nutritional_info": "Info",
                                            "additives_info": "info",
                                            "brand_owner_FSSAI_license_no": "21341rqe2w",
                                            "other_FSSAI_license_no": "21341rqe2w",
                                            "importer_FSSAI_license_no": "21341rqe2w"
                                        },
                                        "tags": {
                                            "veg": "no",
                                            "non_veg": "yes"
                                        },
                                        "provider_details": {
                                            "id": "d941be4d-bf16-4006-91e8-bde50e4e74b4",
                                            "descriptor": {
                                                "name": "ZOZO Store",
                                                "symbol": "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png",
                                                "short_desc": "",
                                                "long_desc": "",
                                                "images": [
                                                    "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "6417ebad25c76803ac9adc78",
                                            "gps": "12.93687150412194,77.62496888637544",
                                            "address": {
                                                "building": "3A-A/2",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "India",
                                                "area_code": "560095",
                                                "locality": "Koramangala"
                                            },
                                            "time": {
                                                "range": {
                                                    "start": "0000",
                                                    "end": "2359"
                                                },
                                                "days": "1,2,3,4,5,6,7"
                                            }
                                        },
                                        "context": {
                                            "domain": "nic2004:52110",
                                            "country": "IND",
                                            "city": "std:080",
                                            "action": "on_search",
                                            "core_version": "1.1.0",
                                            "bap_id": "buyer-app-preprod.ondc.org",
                                            "bap_uri": "https://buyer-app-preprod.ondc.org/protocol/v1",
                                            "transaction_id": "4cc90c84-5768-4838-9e10-be989d9ae92b",
                                            "message_id": "a51d9260-3cfc-471d-8ec5-185755834aee",
                                            "timestamp": "2023-03-20T06:15:37.977Z",
                                            "ttl": "PT30S",
                                            "bpp_id": "ref-seller-app-preprod.ondc.org",
                                            "bpp_uri": "https://ref-seller-app-preprod.ondc.org"
                                        },
                                        "bpp_details": {
                                            "name": "ZOZO Store",
                                            "symbol": "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png",
                                            "short_desc": "",
                                            "long_desc": "",
                                            "images": [
                                                "d941be4d-bf16-4006-91e8-bde50e4e74b4/logo/images.png"
                                            ],
                                            "bpp_id": "ref-seller-app-preprod.ondc.org"
                                        },
                                        "storeOpenTillDate": "2023-03-20T23:59:00.543Z"
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "lsn_prepaid",
                                    "type": "Delivery",
                                    "end": {
                                        "location": {
                                            "gps": "12.938208, 77.619106",
                                            "address": {
                                                "name": "Surender kush",
                                                "building": "SHIV MANDIR",
                                                "locality": "GALI NO- 3A",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "contact": {
                                            "phone": "8595103126",
                                            "email": "Surenderg@bdo.in"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "d941be4d-bf16-4006-91e8-bde50e4e74b4"
                        },
                        "resolution": {
                            "action_triggered": "REFUND",
                            "long_desc": "kokk",
                            "refund_amount": "2333333",
                            "short_desc": "okk"
                        },
                        "resolution_provider": {
                            "respondent_info": {
                                "type": "TRANSACTION-COUNTERPARTY-NP",
                                "organization": {
                                    "org": {
                                        "name": "https://ref-seller-app-preprod.ondc.org::"
                                    },
                                    "contact": {
                                        "email": "surenderg@bdo.in",
                                        "phone": "8595103126"
                                    },
                                    "person": {
                                        "name": "Surender kushwaha"
                                    }
                                },
                                "resolution_support": {
                                    "chat_link": "http://chat-link/respondent",
                                    "contact": {
                                        "email": "surenderg@bdo.in",
                                        "phone": "8595103126"
                                    },
                                    "gros": [
                                        {
                                            "person": {
                                                "name": "Surender kushwaha"
                                            },
                                            "contact": {
                                                "email": "surenderg@bdo.in",
                                                "phone": "8595103126"
                                            },
                                            "gro_type": "TRANSACTION-COUNTERPARTY-NP-GRO"
                                        }
                                    ]
                                }
                            }
                        },
                        "sub_category": "ITM01",
                        "updated_at": "2023-08-16T10:23:39.698Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    },
                    {
                        "_id": "64d61e86c38920eb8eddc836",
                        "transaction_id": "bf3ce082-d1e5-4fc8-9322-f72d2fde2c6d",
                        "__v": 0,
                        "bppId": "ref-seller-app-preprod.ondc.org",
                        "bpp_uri": "https://ref-seller-app-preprod.ondc.org",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "Pushpa"
                            },
                            "contact": {
                                "phone": 8800232424
                            }
                        },
                        "created_at": "2023-08-11T11:42:16.561Z",
                        "description": {
                            "short_desc": "not ok",
                            "long_desc": "notok",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": [
                                "https://buyer-app-preprod.ondc.org/issueApis/uploads/1691754118441.png"
                            ]
                        },
                        "issueId": "ed57f902-e52f-4f84-9491-ca9e3aafb113",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-08-11T11:41:58.441Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": [
                                {
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "We are investigating your concern.",
                                    "updated_at": "2023-08-11T11:47:16.562Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "https://ref-seller-app-preprod.ondc.org::"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    },
                                    "cascaded_level": 1
                                }
                            ]
                        },
                        "issue_status": "Open",
                        "message_id": "3c073ebe-b15d-441a-8d42-d68b36e64636",
                        "order_details": {
                            "id": "2023-06-06-536276",
                            "state": "Created",
                            "items": [
                                {
                                    "id": "469aee93-f3ff-4ac0-acd3-e221b1ccb86c",
                                    "quantity": {
                                        "count": 4
                                    },
                                    "product": {
                                        "id": "469aee93-f3ff-4ac0-acd3-e221b1ccb86c",
                                        "name": "Namak",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "Pending",
                                        "descriptor": {
                                            "name": "Namak",
                                            "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/be26522b-6123-44fc-ade5-d88fadb4d8bd/product_image/MicrosoftTeams-image (15).png",
                                            "short_desc": "Na",
                                            "long_desc": "Na",
                                            "images": [
                                                "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/be26522b-6123-44fc-ade5-d88fadb4d8bd/product_image/MicrosoftTeams-image (15).png"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "34.0",
                                            "maximum_value": "34"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": "4"
                                            },
                                            "maximum": {
                                                "count": "15"
                                            }
                                        },
                                        "category_id": "masala_and_seasoning",
                                        "location_id": "644f5885d6da422fcda16361",
                                        "fulfillment_id": "1",
                                        "matched": true,
                                        "@ondc/org/returnable": true,
                                        "@ondc/org/cancellable": true,
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/time_to_ship": "PT1H",
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "PT12H",
                                        "@ondc/org/contact_details_consumer_care": "Santu Store1,suri@mailinator.com,9890909828",
                                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                                            "net_quantity": "2"
                                        },
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "Tata sampann ",
                                            "manufacturer_or_packer_address": "Bangalore",
                                            "common_or_generic_name_of_commodity": "Namak",
                                            "net_quantity_or_measure_of_commodity_in_pkg": "2",
                                            "month_year_of_manufacture_packing_import": "01/05/2023"
                                        },
                                        "@ondc/org/statutory_reqs_prepackaged_food": {
                                            "brand_owner_FSSAI_license_no": "NA",
                                            "other_FSSAI_license_no": "NA",
                                            "importer_FSSAI_license_no": "NA"
                                        },
                                        "tags": {
                                            "veg": "yes",
                                            "non_veg": "no"
                                        },
                                        "provider_details": {
                                            "id": "be26522b-6123-44fc-ade5-d88fadb4d8bd",
                                            "descriptor": {
                                                "name": "Santu Store1",
                                                "symbol": "be26522b-6123-44fc-ade5-d88fadb4d8bd/logo/MicrosoftTeams-image (18).png",
                                                "short_desc": "",
                                                "long_desc": "",
                                                "images": [
                                                    "be26522b-6123-44fc-ade5-d88fadb4d8bd/logo/MicrosoftTeams-image (18).png"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "644f5885d6da422fcda16361",
                                            "gps": "12.937185199504679,77.62479535460447",
                                            "address": {
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "area_code": "560095",
                                                "street": "Koramangala"
                                            },
                                            "time": {
                                                "days": "1,2,3,4,5,6,7",
                                                "schedule": {
                                                    "holidays": [],
                                                    "frequency": "",
                                                    "times": []
                                                },
                                                "range": {
                                                    "start": "0000",
                                                    "end": "2300"
                                                }
                                            },
                                            "circle": {
                                                "gps": "12.937185199504679,77.62479535460447",
                                                "radius": {
                                                    "unit": "km",
                                                    "value": "3"
                                                }
                                            }
                                        },
                                        "fulfillment_details": {
                                            "id": "1",
                                            "type": "Delivery"
                                        },
                                        "bpp_details": {
                                            "name": "Santu Store1",
                                            "symbol": "be26522b-6123-44fc-ade5-d88fadb4d8bd/logo/MicrosoftTeams-image (18).png",
                                            "short_desc": "",
                                            "long_desc": "",
                                            "images": [
                                                "be26522b-6123-44fc-ade5-d88fadb4d8bd/logo/MicrosoftTeams-image (18).png"
                                            ],
                                            "bpp_id": "ref-seller-app-preprod.ondc.org"
                                        },
                                        "storeOpenTillDate": "2023-06-06T23:00:00.024Z",
                                        "knowCharges": [],
                                        "quantityMismatch": false
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "lsn_prepaid",
                                    "type": "Delivery",
                                    "state": {
                                        "descriptor": {
                                            "code": "Pending",
                                            "images": []
                                        }
                                    },
                                    "tracking": false,
                                    "start": {
                                        "location": {
                                            "id": "644f5885d6da422fcda16361",
                                            "descriptor": {
                                                "name": "Santu Store1",
                                                "images": []
                                            },
                                            "gps": "12.937185199504679,77.62479535460447"
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-06-06T09:38:50.758Z",
                                                "end": "2023-06-07T09:38:50.758Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9890909828",
                                            "email": "suri@mailinator.com"
                                        }
                                    },
                                    "end": {
                                        "location": {
                                            "gps": "12.938208,77.619106",
                                            "address": {
                                                "name": "Singh g",
                                                "building": "Petrol pump",
                                                "locality": "Petrol pump",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "time": {
                                            "range": {
                                                "start": "2023-06-06T09:38:50.758Z",
                                                "end": "2023-06-07T09:38:50.758Z"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9232094820",
                                            "email": "singhg@gmail.com"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "be26522b-6123-44fc-ade5-d88fadb4d8bd"
                        },
                        "sub_category": "ITM02",
                        "updated_at": "2023-08-11T11:42:16.561Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    },
                    {
                        "_id": "64d61d66c38920eb8eddc3f2",
                        "transaction_id": "ef222b1c-527f-4f3c-8738-f8caf6aa8248",
                        "__v": 0,
                        "bppId": "preprod-wow-bpp.shopalyst.com",
                        "bpp_uri": "https://preprod-wow-bpp.shopalyst.com/wow",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "suren"
                            },
                            "contact": {
                                "phone": 9999999999
                            }
                        },
                        "created_at": "2023-08-11T11:37:10.757Z",
                        "description": {
                            "short_desc": "twst",
                            "long_desc": "df",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": []
                        },
                        "issueId": "68ae016b-b420-4a1d-9f2f-0ecd9bfdc94a",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-08-11T11:37:10.826Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": [
                                {
                                    "respondent_action": "PROCESSING",
                                    "short_desc": "Complaint is being processed",
                                    "updated_at": "2023-08-11T11:37:10.876Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "preprod-wow-bpp.shopalyst.com::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "8042896000",
                                            "email": "support@buywow.in"
                                        },
                                        "person": {
                                            "name": "Customer Support Exec 1"
                                        }
                                    },
                                    "cascaded_level": 1
                                }
                            ]
                        },
                        "issue_status": "Open",
                        "message_id": "74afd191-3d9f-4658-878e-7cdc3dc77512",
                        "order_details": {
                            "id": "2023-08-11-924358",
                            "state": "Accepted",
                            "items": [
                                {
                                    "id": "C4233E783575B4C3E9F5D8ECB2EF95AC_43459946807555_default",
                                    "quantity": {
                                        "count": 2
                                    },
                                    "product": {
                                        "id": "C4233E783575B4C3E9F5D8ECB2EF95AC_43459946807555_default",
                                        "name": "Shea Butter and Cocoa Butter Moisturizing Body Lotion, Deep Hydration 400 ML",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "Pending",
                                        "quantity": {
                                            "available": {
                                                "count": "8"
                                            },
                                            "maximum": {
                                                "count": "8"
                                            }
                                        },
                                        "descriptor": {
                                            "name": "Shea Butter and Cocoa Butter Moisturizing Body Lotion, Deep Hydration 400 ML",
                                            "code": "1:8906105615052",
                                            "symbol": "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2Fshea_cocoabodylotion1_38afde36-a430-4383-b654-15b3e0887978.jpg%3Fv%3D1666790996",
                                            "short_desc": "WOW Skin Science Shea & Cocoa Butter Body Lotion is a fast-absorbing moisturizer that gives intensive moisture and hydration that's suitable for dry skin types, including thirsty and parched skin. It has been powered with Shea &amp; Cocoa Butters, Argan & Sweet Almond Oils, Beetroot Extract, Hyaluronic Acid, D Panthenol(Pro Vitamin B5) and Tocopheryl Acetate(Vitamin E).",
                                            "long_desc": "WOW Skin Science Shea & Cocoa Butter Body Lotion is a fast-absorbing moisturizer that gives intensive moisture and hydration that's suitable for dry skin types, including thirsty and parched skin. It has been powered with Shea & Cocoa Butters, Argan & Sweet Almond Oils, Beetroot Extract, Hyaluronic Acid, D Panthenol(Pro Vitamin B5) and Tocopheryl Acetate(Vitamin E). Its non-greasy and quick absorb formulation wipes away every trace of dryness to leave the skin satiny smooth and richly nourished. Regular application of this moisturizer helps the skin retain hydration, repair damage, boost collagen and soothe inflammation for youthfully vibrant skin. This body lotion is totally without mineral oils, parabens, silicones, colors or polyethylene glycol (PG). 300 mL pump bottle.Formulated with rich and creamy shea butter and cocoa butter to help calm and heal dry skinHelps restore dry, dehydrated skin with this protecting lotion.Helps the skin retain hydration, repair damage, boost collagen and soothe inflammation for youthfully vibrant skin.Non-greasy, quick absorb formulation for long lasting and intensive moisturization to skin.Holistically healthy formulation totally without mineral oil, parabens, silicones, color & propylene glycol (PG).MOISTURIZING BODY LOTION FOR DEEP HYDRATION AND PROTECTION OF DRY SKINMoisturizerRegular use helps restore skin's elasticity & keeps our skin healthy.Proper HydrationUltimately enhances skin tone & makes the skin softer and smoother.Pampering Care for Dry SkinEnriched with the goodness of moisture rich shea butter and creamy cocoa butter.KEY INGREDIENTSPurified Water, Cetyl Alcohol, Dicaprylyl Carbonate, Glyceryl Monostearate, lsopropyl Myristate, Caprylic/ Capric Triglycerides, lsoamyl Laurate, Shea Butter, Cocoa Butter, Sodium PCA, Betaine Anhydrous, Beta Vulgaris (Beet) Root Extract, Moroccan Argan Oil, Sweet Almond Oil, Aloe Vera Extract, D Panthenol (Pro-Vitamin B5), Fragrance, Sodium Hyaluronate (Hyaluronic Acid), Allantoin, Disodium EDTA, Sodium Benzoate, Phenoxyethanol & Ethylhexylglycerin.HOW TO USE WOW SKIN SCIENCE SHEA & COCOA BUTTER MOISTURIZING BODY LOTIONWash and cleanse your body. Dab it dry, leaving it slightly damp. Take a generous amount of the lotion and apply all over your body, starting from the leg upwards. Massage the lotion in circular motions using your fingertips. For extra dry areas, lightly press the lotion into the skin as you apply it.[des]Pamper yourself to a soothing body lotion and keep the skin naturally young.Moisturize regularly to soothe & tone the skin.Is enriched with the goodness of natural ingredients.[/des]",
                                            "images": [
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2Fshea_cocoabodylotion1_38afde36-a430-4383-b654-15b3e0887978.jpg%3Fv%3D1666790996",
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2FKeyIngredientsI_d66b01de-d602-4889-b2f8-2b7dc7677adf.jpg%3Fv%3D1666790996",
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2FHow-to-use_a92ca0b4-9c37-4db8-9e9a-8da00eef6c91.jpg%3Fv%3D1666790996",
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2FShea_Cocoa-lotion-100--1.jpg%3Fv%3D1666790996",
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2Fshea_cocoabodylotion1_38afde36-a430-4383-b654-15b3e0887978-_1.jpg%3Fv%3D1666790996",
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2FShea_Cocoa-lotion-200--1.jpg%3Fv%3D1666790996",
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2Fshea_cocoabodylotion2_65941d35-c282-4c6d-b085-b96d23479826.jpg%3Fv%3D1666790996",
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2FShea_Cocoa-lotion-100--2.jpg%3Fv%3D1666790996",
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2Fshea_cocoabodylotion2_65941d35-c282-4c6d-b085-b96d23479826_1.jpg%3Fv%3D1666790996",
                                                "https://imgcdn.shortlyst.com/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0661%2F9732%2F4035%2Fproducts%2FShea_Cocoa-lotion-200--2.jpg%3Fv%3D1666790996"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "399.0",
                                            "maximum_value": "399.00"
                                        },
                                        "category_id": "Beauty & Hygiene",
                                        "fulfillment_id": "1",
                                        "location_id": "bcedc450f8481e89b1445069acdc3dd9",
                                        "recommended": true,
                                        "@ondc/org/returnable": true,
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "P7D",
                                        "@ondc/org/cancellable": true,
                                        "@ondc/org/time_to_ship": "P1D",
                                        "@ondc/org/available_on_cod": false,
                                        "@ondc/org/contact_details_consumer_care": "Body Cupid India Pvt Ltd, support@buywow.in, 8042896000",
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "Kapco International Limited",
                                            "manufacturer_or_packer_address": "Kapco International Limited, Plot No 10-11, Sector 3, Parwanoo, Himachal Pradesh 173220, India",
                                            "common_or_generic_name_of_commodity": "Body Lotion",
                                            "net_quantity_or_measure_of_commodity_in_pkg": "1",
                                            "month_year_of_manufacture_packing_import": "01/2023",
                                            "imported_product_country_of_origin": "IND"
                                        },
                                        "provider_details": {
                                            "id": "preprod-wow-bpp.shopalyst.com",
                                            "descriptor": {
                                                "name": "Wow Skin Science",
                                                "symbol": "https://cdn.shopify.com/s/files/1/1375/4957/files/wow_logo_2_140x@2x.png?v=1657865995",
                                                "short_desc": "Wow Skin Science",
                                                "long_desc": "Wow Skin Science",
                                                "images": [
                                                    "https://cdn.shopify.com/s/files/1/1375/4957/files/wow_logo_2_140x@2x.png?v=1657865995"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "bcedc450f8481e89b1445069acdc3dd9",
                                            "gps": "12.9684397,77.6010378",
                                            "address": {
                                                "street": "4th Floor, Prestige Dotcom, Field Marshal Cariappa Road, Srinivas Nagar, Shanthala Nagar, Ashok Nagar",
                                                "locality": "4th Floor, Prestige Dotcom, Field Marshal Cariappa Road, Srinivas Nagar, Shanthala Nagar, Ashok Nagar",
                                                "city": "Bangalore",
                                                "state": "Karnataka",
                                                "area_code": "560025"
                                            },
                                            "time": {
                                                "range": {
                                                    "start": "0000",
                                                    "end": "2359"
                                                },
                                                "days": "1,2,3,4,5,6,7",
                                                "schedule": {
                                                    "holidays": []
                                                }
                                            }
                                        },
                                        "fulfillment_details": {
                                            "id": "1",
                                            "type": "Delivery",
                                            "tracking": false
                                        },
                                        "bpp_details": {
                                            "name": "Wow Skin Science",
                                            "symbol": "https://cdn.shopify.com/s/files/1/1375/4957/files/wow_logo_2_140x@2x.png?v=1657865995",
                                            "short_desc": "Wow Skin Science",
                                            "long_desc": "Wow Skin Science",
                                            "images": [
                                                "https://cdn.shopify.com/s/files/1/1375/4957/files/wow_logo_2_140x@2x.png?v=1657865995"
                                            ],
                                            "bpp_id": "preprod-wow-bpp.shopalyst.com"
                                        },
                                        "storeOpenTillDate": "2023-08-11T23:59:00.101Z"
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "bcedc450f8481e89b1445069acdc3dd9_1",
                                    "type": "Delivery",
                                    "state": {
                                        "descriptor": {
                                            "code": "Pending",
                                            "images": []
                                        }
                                    },
                                    "tracking": false,
                                    "start": {
                                        "location": {
                                            "id": "bcedc450f8481e89b1445069acdc3dd9",
                                            "descriptor": {
                                                "name": "Wow Skin Science",
                                                "images": []
                                            },
                                            "gps": "12.9684397,77.6010378"
                                        },
                                        "contact": {
                                            "phone": "8042896000",
                                            "email": "support@buywow.in"
                                        }
                                    },
                                    "end": {
                                        "location": {
                                            "gps": "13.009279, 77.537628",
                                            "address": {
                                                "name": "suren",
                                                "building": "domino",
                                                "locality": "ABC",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9999999999"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "preprod-wow-bpp.shopalyst.com"
                        },
                        "sub_category": "ITM01",
                        "updated_at": "2023-08-11T11:37:10.757Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    },
                    {
                        "_id": "64d61d0cc38920eb8eddc2c1",
                        "transaction_id": "0b1238fa-3ad9-4be4-9fb3-8af7910940b6",
                        "__v": 0,
                        "bppId": "seller.ondc.digiledge.in",
                        "bpp_uri": "https://seller.ondc.digiledge.in/v1/preprod",
                        "category": "ITEM",
                        "complainant_info": {
                            "person": {
                                "name": "Surender kushwaha"
                            },
                            "contact": {
                                "phone": 9205450531
                            }
                        },
                        "created_at": "2023-08-11T11:35:58.652Z",
                        "description": {
                            "short_desc": "not ok",
                            "long_desc": "polished item kjbkjbljbljbjb",
                            "additional_desc": {
                                "url": "https://buyerapp.com/additonal-details/desc.txt",
                                "content_type": "text/plain"
                            },
                            "images": [
                                "https://buyer-app-preprod.ondc.org/issueApis/uploads/1691753740719.png",
                                "https://buyer-app-preprod.ondc.org/issueApis/uploads/1691753740720.png"
                            ]
                        },
                        "issueId": "983df3ce-6931-4b03-985c-86f83465fea1",
                        "issue_actions": {
                            "complainant_actions": [
                                {
                                    "complainant_action": "OPEN",
                                    "short_desc": "Complaint created",
                                    "updated_at": "2023-08-11T11:35:40.720Z",
                                    "updated_by": {
                                        "org": {
                                            "name": "buyer-app-preprod.ondc.org::nic2004:52110"
                                        },
                                        "contact": {
                                            "phone": "6239083807",
                                            "email": "Rishabhnand.singh@ondc.org"
                                        },
                                        "person": {
                                            "name": "Rishabhnand Singh"
                                        }
                                    }
                                }
                            ],
                            "respondent_actions": []
                        },
                        "issue_status": "Open",
                        "message_id": "58c1c39f-a997-41ed-bd2f-2cee6d1b8467",
                        "order_details": {
                            "id": "2023-06-15-225131",
                            "state": "Created",
                            "items": [
                                {
                                    "id": "9e729477-1273-4ce5-b9d7-d4229e6d883e",
                                    "quantity": {
                                        "count": 2
                                    },
                                    "product": {
                                        "id": "9e729477-1273-4ce5-b9d7-d4229e6d883e",
                                        "name": "Renjith King Store Basmati Rice 1kg",
                                        "cancellation_status": "",
                                        "return_status": "",
                                        "fulfillment_status": "",
                                        "descriptor": {
                                            "name": "Renjith King Store Basmati Rice 1kg",
                                            "symbol": "https://d2pyicwmjx3wii.cloudfront.net/s/632dcf060c84820019e5c3eb/63fd87dd6b40654d77d70131/miniket-rice-10-kg.jpg",
                                            "short_desc": "Daawat Traditional Basmati Rice 1kg",
                                            "long_desc": "Daawat Traditional Basmati Rice 1kg",
                                            "images": [
                                                "https://4.imimg.com/data4/UI/NB/MY-2459695/untitled-2-500x500.jpg"
                                            ]
                                        },
                                        "price": {
                                            "currency": "INR",
                                            "value": "30.0",
                                            "maximum_value": "50"
                                        },
                                        "category_id": "Foodgrains",
                                        "fulfillment_id": "505f7d1c-1b39-4b8b-82a3-d32832ab32da",
                                        "location_id": "99068efe-7501-4a9b-9999-26b6ca944a77",
                                        "recommended": true,
                                        "@ondc/org/returnable": true,
                                        "@ondc/org/seller_pickup_return": true,
                                        "@ondc/org/return_window": "P1D",
                                        "@ondc/org/cancellable": true,
                                        "@ondc/org/time_to_ship": "PT30M",
                                        "@ondc/org/available_on_cod": true,
                                        "@ondc/org/contact_details_consumer_care": "Siva,siva@digiledge.com,7660056798",
                                        "@ondc/org/statutory_reqs_packaged_commodities": {
                                            "manufacturer_or_packer_name": "MFD BY PepsiCo India Holdings Pvt. Ltd",
                                            "manufacturer_or_packer_address": "Level 3-6, Pioneer Square, Sector 62, Near Golf Course extension road, Gurugram 122101, Haryana, India",
                                            "common_or_generic_name_of_commodity": "Foodgrains",
                                            "net_quantity_or_measure_of_commodity_in_pkg": "1kg",
                                            "month_year_of_manufacture_packing_import": "12/2022",
                                            "imported_product_country_of_origin": "IND"
                                        },
                                        "quantity": {
                                            "available": {
                                                "count": "14"
                                            },
                                            "maximum": {
                                                "count": "100"
                                            }
                                        },
                                        "provider_details": {
                                            "id": "RK RI773463214",
                                            "descriptor": {
                                                "name": "RK Rice Store",
                                                "code": "RK Rice Store",
                                                "symbol": "https://cdn.logo.com/hotlink-ok/logo-social.png",
                                                "short_desc": "Rajan K Rice Store",
                                                "long_desc": "This is the best rice store in India",
                                                "images": [
                                                    "https://cdn.logo.com/hotlink-ok/logo-social.png"
                                                ]
                                            }
                                        },
                                        "location_details": {
                                            "id": "99068efe-7501-4a9b-9999-26b6ca944a77",
                                            "gps": "13.009326,77.594509",
                                            "address": {
                                                "building": "RK Rice Store",
                                                "street": "J.C. Nagar",
                                                "locality": "JC Nagar Main Rd, Munireddypalya",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND",
                                                "area_code": "560001"
                                            },
                                            "time": {
                                                "timestamp": "0001-01-01T00:00:00Z",
                                                "range": {
                                                    "start": "0900",
                                                    "end": "2100"
                                                },
                                                "days": "1,2,3,4,5,6,7",
                                                "schedule": {
                                                    "holidays": [
                                                        "2023-06-17",
                                                        "2023-06-24"
                                                    ]
                                                }
                                            },
                                            "rateable": true
                                        },
                                        "fulfillment_details": {
                                            "id": "505f7d1c-1b39-4b8b-82a3-d32832ab32da",
                                            "type": "Delivery"
                                        },
                                        "bpp_details": {
                                            "name": "Digiledge",
                                            "symbol": "https://www.digiledge.in/assets/img/logo1.png",
                                            "short_desc": "Digiledge",
                                            "long_desc": "Digiledge",
                                            "images": [
                                                "https://www.digiledge.in/assets/img/logo1.png"
                                            ],
                                            "bpp_id": "seller.ondc.digiledge.in"
                                        },
                                        "storeOpenTillDate": "2023-06-15T21:00:00.509Z"
                                    }
                                }
                            ],
                            "fulfillments": [
                                {
                                    "id": "505f7d1c-1b39-4b8b-82a3-d32832ab32da",
                                    "type": "Delivery",
                                    "state": {
                                        "descriptor": {
                                            "code": "Pending",
                                            "images": []
                                        }
                                    },
                                    "tracking": true,
                                    "start": {
                                        "location": {
                                            "id": "99068efe-7501-4a9b-9999-26b6ca944a77",
                                            "gps": "13.009326,77.594509"
                                        },
                                        "contact": {
                                            "phone": "9886098860",
                                            "email": "abcd.efgh@gmail.com"
                                        }
                                    },
                                    "end": {
                                        "location": {
                                            "gps": "12.938208, 77.619106",
                                            "address": {
                                                "name": "Surender kushwaha",
                                                "locality": "Dwarka",
                                                "city": "Bengaluru",
                                                "state": "Karnataka",
                                                "country": "IND"
                                            }
                                        },
                                        "contact": {
                                            "phone": "9205450531",
                                            "email": "ads@gamil.com"
                                        }
                                    }
                                }
                            ],
                            "provider_id": "RK RI773463214"
                        },
                        "sub_category": "ITM04",
                        "updated_at": "2023-08-11T11:35:58.652Z",
                        "userId": "Mb7MPDYLL3WOumZAYz0K8xShz4G3"
                    }
                ]
            }
            // await cancellablePromise(
            //     getCall(
            //         `/issueApis/v1/getIssues?pageNumber=${pagination.currentPage}&limit=${pagination.postPerPage}`
            //     )
            // );

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
        getAllTickets();
    }, [getAllTickets, pagination.currentPage]);

    // empty state ui
    const empty_orders_state = (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography variant="body1">
                No Complaints available
            </Typography>
        </Grid>
    );

    return (
        <div>
            <div className={classes.headingContainer}>
                <Typography variant="h3" className={classes.heading}>
                    Complaints
                </Typography>
            </div>
            {fetchOrderLoading ? (
                <div className={classes.loadingContainer}>
                    <Loading />
                </div>
            ) : (
                <Grid container spacing={3} >
                    {tickets.length === 0 ? (
                        empty_orders_state
                    ) : (
                        tickets.map((order, orderIndex) => (
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginLeft: '10%' }}
                                key={`order-inx-${orderIndex}`}>
                                <TicketCard
                                    data={order}
                                    orderDetails={order.order_details}
                                />
                            </Grid>
                        ))
                    )}

                    {/* <div
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
                    </div> */}
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ height: "60px", width: "100%" }}
                    >
                        {
                            tickets.length > 0 && (
                                <Pagination
                                    className={classes.pagination}
                                    count={Math.ceil(pagination.totalCount / pagination.postPerPage)}
                                    shape="rounded"
                                    color="primary"
                                    page={pagination.currentPage}
                                    onChange={(evant, page) => {
                                        setPagination((prev) => ({
                                            ...prev,
                                            currentPage: page,
                                        }));

                                    }}
                                />
                            )
                        }
                    </div>
                </Grid>
            )}
        </div>
    );
}
