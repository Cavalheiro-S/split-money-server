import cors from "cors"
import express from "express"
import { routerTransaction } from "./controllers/TransactionController"
import { errorHandler } from "./midllewares/ErrorHandler"

const app = express()
const router = express.Router()

// Server configuration
router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// Routes
router.use("/transaction", routerTransaction)

// Middlewares
router.use(errorHandler)

// Start server
app.use("/api", router)
app.listen(3030, () => {
    console.log("Server is running on port 3030")
})