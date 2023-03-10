declare namespace Express {
  interface Request {
    auth: {
      user: string
      password: string
    }
  }
}
const enum SortBy {
  PRICE = 'price',
  SHIPPING_LIMIT_DATE = 'shipping_limit_date',
}

declare module 'qs' {
  interface ParsedQs {
    sortBy: SortBy
    offset: string
    limit: strin
  }
}
