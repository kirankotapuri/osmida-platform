import { NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "status";

    const cwd = process.cwd(); // d:\KIRAN\Osmida3\osmida-web
    const parentDir = path.resolve(cwd, ".."); // d:\KIRAN\Osmida3

    // Check if git is in cwd or parentDir
    const hasGitHere = fs.existsSync(path.join(cwd, ".git"));
    const hasGitParent = fs.existsSync(path.join(parentDir, ".git"));

    const gitDir = hasGitHere ? cwd : hasGitParent ? parentDir : cwd;

    let output = "";
    if (action === "status") {
      output = execSync("git status", { cwd: gitDir, encoding: "utf-8" });
    } else if (action === "remote") {
      output = execSync("git remote -v", { cwd: gitDir, encoding: "utf-8" });
    } else if (action === "branch") {
      output = execSync("git branch -a", { cwd: gitDir, encoding: "utf-8" });
    } else if (action === "log") {
      output = execSync("git log -n 5 --oneline", { cwd: gitDir, encoding: "utf-8" });
    } else if (action === "config") {
      output = execSync("git config --list", { cwd: gitDir, encoding: "utf-8" });
    } else if (action === "add") {
      output = execSync("git add -A osmida-web", { cwd: gitDir, encoding: "utf-8" }) || "Added successfully";
    } else if (action === "commit") {
      try {
        const msg = (searchParams.get("msg") || "Update Osmida web app").replace(/"/g, "'");
        output = execSync(`git commit -m "${msg}"`, { cwd: gitDir, encoding: "utf-8" });
      } catch (err: any) {
        output = `Error during commit: ${err.message}. Stdout: ${err.stdout?.toString() || ""}. Stderr: ${err.stderr?.toString() || ""}`;
      }
    } else if (action === "push") {
      try {
        output = execSync("git push origin main", { cwd: gitDir, encoding: "utf-8" }) || "Pushed successfully";
      } catch (err: any) {
        output = `Error during push: ${err.message}. Stdout: ${err.stdout?.toString() || ""}. Stderr: ${err.stderr?.toString() || ""}`;
      }
    }

    return NextResponse.json({
      success: true,
      cwd,
      parentDir,
      hasGitHere,
      hasGitParent,
      gitDir,
      output,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stdout: error.stdout?.toString(),
        stderr: error.stderr?.toString(),
      },
      { status: 500 }
    );
  }
}
