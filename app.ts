import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import basicAuth, { IBasicAuthedRequest } from 'express-basic-auth'
import { ResponseHandler } from './responseHandler'
dotenv.config()
const app = express()

/** DB CONNECTION */
const uri = process.env.MONGODB_CONNECTION_STRING ?? ''
const client = new MongoClient(uri)
let db: Db
let sellers: Collection
let orderItems: Collection
async function connectAndRun (): Promise<void> {
  try {
    await client.connect()
    db = client.db('techkraft')
    sellers = db.collection('sellers')
    orderItems = db.collection('order_items')
    console.log('Connected successfully to Database')
    //  run the server
    app.listen(port, () => {
      console.log(`App running on port ${port}`)
    })
  } catch (error: any) {
    console.error('Error Connecting to Database', error)
    await client.close()
  }
}
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept')
  res.setHeader('Access-Control-Allow-Methods', ['PUT', 'POST', 'GET', 'OPTIONS'])
  next()
})

/** BASIC AUTHENTICATION */
const authenticateUser = async (
  sellerId: string,
  sellerZipCodePrefix: string,
  callback: (error: any, result: boolean) => void
): Promise<void> => {
  try {
    const user = await sellers.findOne({ seller_id: sellerId })
    if ((user != null) && basicAuth.safeCompare(sellerZipCodePrefix, user.seller_zip_code_prefix)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  } catch (error) {
    console.error(error)
    callback(error, false)
  }
}
function getUnauthorizedResponse (req: IBasicAuthedRequest): string {
  return 'Invalid Credentials'
}

app.use(
  basicAuth({
    authorizeAsync: true,
    authorizer: authenticateUser,
    unauthorizedResponse: getUnauthorizedResponse
  })
)

app.get('', (req: Request, res: Response) => res.redirect('/order_items'))

app.get('/order_items', (req: Request, res: Response) => {
  (async () => {
    const sellerId = req.auth.user
    let sortBy = SortBy.SHIPPING_LIMIT_DATE
    if (['shipping_limit_date', 'price'].includes(req.query.sortBy)) {
      sortBy = req.query.sortBy
    }
    let offset = parseInt(req.query.offset) ?? 0
    const limit = parseInt(req.query.limit) ?? 20
    const ordersCount = await orderItems.countDocuments({ seller_id: sellerId })

    const startIndex = (offset - 1) * limit
    const endIndex = offset * limit
    if (endIndex < ordersCount) {
      offset++
    }
    if (startIndex > 0) {
      offset--
    }
    try {
      const orders = await orderItems
        .find({ seller_id: sellerId })
        .sort(sortBy)
        .collation({ locale: 'en_US', numericOrdering: true })
        .limit(limit)
        .skip(offset)
        .toArray()

      return ResponseHandler.requestSuccessful({
        res,
        payload: {
          data: orders,
          total: ordersCount,
          limit,
          offset
        }
      })
    } catch (error) {
      console.error('Error reading order items', error)
      return ResponseHandler.serverError(
        res,
        'There was an error retrieving your order items. Please try again.'
      )
    }
  })().then().catch(() => {})
})
app.delete('/order_items/:id', (req: Request, res: Response) => {
  (async () => {
    try {
      const orderItemId = req.params.id
      await orderItems.deleteOne({ order_item_id: orderItemId })
      return ResponseHandler.requestSuccessful({ res, message: 'Order item deleted successfully' })
    } catch (error) {
      console.error('Error reading order items.', error)
      return ResponseHandler.serverError(
        res,
        'There was an error retrieving your order items. Please try again.'
      )
    }
  })().then().catch(() => {})
})
app.put('/account', (req: Request, res: Response) => {
  (async () => {
    try {
      const i = 2
    } catch (error) {
      return ResponseHandler.serverError(res, 'Error updating account')
    }
  })().then().catch(() => {})
})

await connectAndRun()

//  define a port
const port = process.env.PORT ?? 3000
