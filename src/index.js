import "dotenv/config";

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
.then(() => {
    console.log("MONGODB CONNECTED");
    app.listen(process.env.PORT || 8000, () => {
        console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.error("MONGODB ERROR", err);
    process.exit(1);
})