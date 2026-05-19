const fs = require('fs');

const p1 = "MTUwNTk5OTgyMjk5MjQ0NTUwMA.GaGnyI";
const p2 = ".jpKRQGVEBvY5rZbpFI4ggNwFqfm4unTCOqe200";

const envContent = `TOKEN=${p1}${p2}
CHANNEL_ID=1498688094759813251
WARNING_CHANNEL_ID=1499924979536494632
`;

fs.writeFileSync('.env', envContent);
console.log("✅ .env file created successfully! You can now restart your bot.");
