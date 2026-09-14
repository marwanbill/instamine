import { app } from "./app";
import { env } from "./config/env";

console.log("NODE_ENV at runtime:", env.NODE_ENV);

app.listen(env.PORT, () => {
  console.log(`InstaMine API listening on http://localhost:${env.PORT}`);
});
