import express, { } from "express"
import { routerTransaction } from "./controllers/TransactionController"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/transaction", routerTransaction)

app.listen(3030, () => {
    console.log("Server is running on port 3030")
})