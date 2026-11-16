// Guestbook moderation from the command line, through wrangler and your Cloudflare login.
// (Reading and replying is easier in the website's hidden Inbox window: #inbox.)
//
//   npm run admin -- list               latest 30 entries
//   npm run admin -- delete 12          delete entry #12
//   npm run admin -- delete 12 13 14    delete several
//   add --local to run against the local dev database instead of production
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const local = args.includes("--local");
const [cmd, ...rest] = args.filter((a) => a !== "--local");

function sql(command) {
  const res = spawnSync(
    "npx",
    ["wrangler", "d1", "execute", "guestbook", local ? "--local" : "--remote", "--command", command],
    { stdio: "inherit" },
  );
  process.exit(res.status ?? 1);
}

if (cmd === "list") {
  sql("SELECT id, datetime(created_at / 1000, 'unixepoch') AS created_utc, nickname, substr(replace(message, char(10), ' '), 1, 70) AS message, drawing IS NOT NULL AS drawing, substr(replace(reply, char(10), ' '), 1, 40) AS reply FROM entries ORDER BY id DESC LIMIT 30");
} else if (cmd === "delete" && rest.length > 0 && rest.every((id) => /^\d{1,12}$/.test(id))) {
  // Ids are validated as plain integers above, so building the SQL string is safe.
  sql(`DELETE FROM entries WHERE id IN (${rest.join(", ")})`);
} else {
  console.log("Usage: npm run admin -- list [--local]\n       npm run admin -- delete <id> [<id>...] [--local]");
  process.exit(1);
}
