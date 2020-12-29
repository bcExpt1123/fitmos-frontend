export default {
  header: {
    self: {},
    items: []
  },
  aside: {
    self: {},
    items: [
      {
        title: "Dashboard",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "admin/dashboard",
        translate: "MENU.DASHBOARD",
        bullet: "dot"
      },
      {
        title: "Customers",
        root: true,
        icon: "flaticon2-avatar",
        can:["customers"],
        page: "admin/customers"
      },
      {
        title: "Subscriptions",
        root: true,
        icon: "flaticon2-browser",
        can:["subscriptions"],
        page: "admin/subscriptions"
      },
      {
        title: "Transactions",
        root: true,
        icon: "flaticon2-checking",
        can:["transactions"],
        page: "admin/transactions"
      },
      {
        title: "Bank Transfer Requests",
        root: true,
        icon: "flaticon2-checking",
        can:["transactions"],
        page: "admin/bank-transfer-requests"
      },
      {
        title: "Invoices",
        root: true,
        icon: "flaticon2-list",
        can:["invoices"],
        page: "admin/invoices"
      },
      {
        title: "Coupons",
        root: true,
        icon: "flaticon2-open-box",
        can:["coupons"],
        page: "admin/coupons",
        submenu:[
          {
            title: "Coupon Code",
            can:["coupons"],
            page: "admin/coupons"    
          },
          {
            title: "Link Code",
            can:["coupons"],
            page: "admin/link-coupons"    
          }
        ]
      },
      {
        title: "Subscription Manager",
        root: true,
        icon: "flaticon2-calendar-9",
        can:["subscription pricing","subscription workout content"],
        page: "admin/subscription-manager"
      },
      {
        title: "News & Event",
        root: true,
        icon: "flaticon2-open-text-book",
        can:["events"],
        page: "admin/events"
      },
      {
        title: "Shortcodes",
        root: true,
        icon: "flaticon2-sort-alphabetically",
        can:["shortcodes"],
        page: "admin/shortcodes"
      },
      {
        title: "Keywords",
        root: true,
        icon: "flaticon2-sort-alphabetically",
        can:["shortcodes"],
        page: "admin/keywords"
      },
      {
        title: "Benchmarks",
        root: true,
        icon: "flaticon2-time",
        can:["benchmarks"],
        page: "admin/benchmarks"
      },
      {
        title: "Admin Users",
        root: true,
        icon: "flaticon2-user-outline-symbol",
        can:["adminUsers"],
        page: "admin/users"
      },
      {
        title: "Medals",
        root: true,
        icon: "flaticon2-correct",
        can:["medals"],
        page: "admin/medals"
      },
/*      {
        title: "Roles & Permissions",
        root: true,
        icon: "flaticon2-list-1",
        page: "admin/settings/permissions"
      },*/
      {
        title: "Settings",
        root: true,
        icon: "flaticon2-settings",
        can:["settings"],
        page: "admin/settings/cart"
      },
      {
        title: "Surveys",
        root: true,
        icon: "flaticon2-search",
        can:["survey"],
        page: "admin/survey"
      },
      {
        title: "Shop",
        root: true,
        icon: "flaticon2-shopping-cart-1",
        can:["shop"],
        page: "admin/companies"
      },
    ]
  }
};
