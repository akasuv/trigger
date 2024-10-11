import { schedules } from "@trigger.dev/sdk/v3";
import batchRun from "../claim-faucet";

export const claimBearFaucet = schedules.task({
  id: "claim-bear-faucet",
  cron: "0 */8 * * *",
  maxDuration: 300, // 5 minutes
  run: batchRun,
});
