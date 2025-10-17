import { execSync } from "node:child_process";
import { Command } from "commander";
import prompts from "prompts";

const program = new Command();

program
  .option("-a, --appId <string>", "Encore App ID")
  .option("-o, --output <path>", "Output file path (e.g. ./src/lib/client.ts)")
  .option(
    "-e, --env <environment>",
    "Environment (local, development, staging, production)",
  )
  .parse(process.argv);

const options = program.opts<{
  appId?: string;
  output?: string;
  env?: string;
}>();

async function main() {
  const questions: prompts.PromptObject[] = [];

  if (!options.appId) {
    questions.push({
      type: "text",
      name: "appId",
      message: "Enter Encore App ID:",
      validate: (val: string) =>
        val.trim() === "" ? "App ID is required" : true,
    });
  }

  if (!options.output) {
    questions.push({
      type: "text",
      name: "output",
      message: "Enter output file path:",
      initial: "./src/lib/client.ts",
      validate: (val: string) =>
        val.trim() === "" ? "Output path is required" : true,
    });
  }

  if (!options.env) {
    questions.push({
      type: "select",
      name: "env",
      message: "Select environment:",
      choices: [
        { title: "local", value: "local" },
        { title: "development", value: "development" },
        { title: "staging", value: "staging" },
        { title: "production", value: "production" },
      ],
      initial: 0,
    });
  }

  const responses = await prompts(questions);

  const appId = options.appId ?? responses.appId;
  const output = options.output ?? responses.output;
  const env = options.env ?? responses.env ?? "local";

  if (!appId || !output) {
    console.error("Missing required input. Aborting.");
    process.exit(1);
  }

  const cmd = `encore gen client ${appId} --output=${output} --env=${env}`;

  try {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
    console.log("Client generated successfully.");
  } catch (err: unknown) {
    console.error("Command failed:", (err as Error).message);
    process.exit(1);
  }
}

main();
