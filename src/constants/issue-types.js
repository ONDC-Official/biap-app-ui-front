  export const ISSUE_TYPES = [
    // {
    //   key: "001",
    //   value: "Order",
    //   subCategory: [
    //     {
    //         key: '01',
    //         value: 'Order not recieved',
    //         enums: 'ORD01'
    //     },
    //     {
    //         key: '02',
    //         value: 'Quality issue',
    //         enums: 'ORD02'
    //     },
    //     {
    //         key: '03',
    //         value: 'Delayed delivery',
    //         enums: 'ORD03'
    //     }
    //   ],
    // },
    {
      key: "002",
      value: "Item",
      subCategory: [
        {
            key: '01',
            value: 'Missing items',
            enums: 'ITM01'
        },
        {
            key: '02',
            value: 'Quantity issue',
            enums: 'ITM02'
        },
        {
            key: '03',
            value: 'Item mismatch',
            enums: 'ITM03'
        },
        {
            key: '04',
            value: 'Quality issue',
            enums: 'ITM04'
        }
      ],
    },
    {
      key: "003",
      value: "Fulfillment",
      subCategory: [
        {
            key: '01',
            value: 'Wrong delivery address',
            enums: 'FLM01'
        },
        {
            key: '02',
            value: 'Delay in delivery',
            enums: 'FLM02'
        }, {
            key: '03',
            value: 'Delayed delivery',
            enums: 'FLM03'
        }, {
            key: '04',
            value: 'Packaging',
            enums: 'FLM04'
         },
        // {
        //     key: '05',
        //     value: 'Buyer not found',
        //     enums: 'FLM05'
        // }, {
        //     key: '06',
        //     value: 'Seller not found',
        //     enums: 'FLM06'
        // },
         {
            key: '07',
            value: 'Package info mismatch',
            enums: 'FLM07'
        },
    ]
    },
    // {
    //   key: "004",
    //   value: "Agent",
    //   subCategory: [
    //     {
    //         key: '01',
    //         value: 'Agent behavioral issue',
    //         enums: 'AGT01'
    //     },
    //     {
    //         key: '01',
    //         value: 'Buyer behavioral issue',
    //         enums: 'AGT02'
    //     },
    // ]
    // },
    // {
    //   key: "005",
    //   value: "Payment",
    //   subCategory: [
    //     {
    //         key: '01',
    //         value: 'Refund not received',
    //         enums: 'PTM01'
    //     },
    //     {
    //         key: '02',
    //         value: 'Underpaid',
    //         enums: 'PTM02'
    //     }, {
    //         key: '03',
    //         value: 'Over paid',
    //         enums: 'PTM03'
    //     }, {
    //         key: '04',
    //         value: 'Not paid',
    //         enums: 'PTM04'
    //     },
    // ]
    // }
  ]