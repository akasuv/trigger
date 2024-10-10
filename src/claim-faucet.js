import { logger } from "@trigger.dev/sdk/v3";
const clientKey = "CAP-AF031EE52644E2D91E9C7C19978EDDC4";
const websiteKey = "0x4AAAAAAARdAuciFArKhVwt";
const websiteURL = "https://bartio.faucet.berachain.com";

async function capsolver() {
  const payload = {
    clientKey,
    task: {
      type: "AntiTurnstileTaskProxyLess",
      websiteKey,
      websiteURL,
      metadata: {
        action: "", // Optional, specify if needed
        type: "turnstile",
      },
    },
  };

  try {
    const res = await fetch("https://api.capsolver.com/createTask", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((res) => res.json());
    const task_id = res.taskId;
    if (!task_id) {
      logger.log("Failed to create task:", res.data);
      return;
    }
    logger.log("Got taskId:", task_id);

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second

      const getResultPayload = { clientKey, taskId: task_id };
      const resp = await fetch("https://api.capsolver.com/getTaskResult", {
        method: "POST",
        body: JSON.stringify(getResultPayload),
      }).then((res) => res.json());
      const status = resp.status;

      if (status === "ready") {
        return resp.solution.token;
      }
      if (status === "failed" || resp.errorId) {
        logger.log("Solve failed! response:", resp);
        return;
      }
    }
  } catch (error) {
    logger.error("Error:", error);
  }
}

export default async function claimFaucet() {
  const token = await capsolver();

  logger.log("--------- Claiming faucet -----------");

  await fetch("https://bartio-faucet.berachain-devnet.com/api/claim", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      "Content-Type": "text/plain; charset=utf-8",
    },
    body: JSON.stringify({
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    }),
  })
    .then((res) => res.text())
    .then((res) => logger.log(res))
    .catch((error) => logger.error(error));
}
