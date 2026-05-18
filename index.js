require("dotenv").config();

const fs = require("fs");
const cron = require("node-cron");

const {
Client,
GatewayIntentBits,
EmbedBuilder
} = require("discord.js");

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.GuildMessageReactions
]
});

const questions = require("./questions.json");

client.once("clientReady", async () => {

console.log("✅ Bot Online");

// DAILY QUESTION - 6 AM

cron.schedule("0 6 * * *", async () => {

```
try {

  const channel = await client.channels.fetch(
    process.env.CHANNEL_ID
  );

  const state = JSON.parse(
    fs.readFileSync("./state.json", "utf8")
  );

  let index = state.currentIndex;

  if (index >= questions.length) {
    index = 0;
  }

  const q = questions[index];

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("🔥 DSA Daily Challenge")
    .setDescription(
      "Question " +
      (index + 1) +
      "/" +
      questions.length
    )
    .addFields(
      {
        name: "🧠 Problem",
        value: q.title
      },
      {
        name: "📂 Topic",
        value: q.topic
      },
      {
        name: "📘 Concept",
        value: q.concept
      },
      {
        name: "🔗 Link",
        value: q.link
      }
    )
    .setFooter({
      text: "Striver 79 Sheet"
    })
    .setTimestamp();

  const message = await channel.send({
    embeds: [embed]
  });

  await message.react("✅");

  state.lastMessageId = message.id;

  state.currentIndex = index + 1;

  fs.writeFileSync(
    "./state.json",
    JSON.stringify(state, null, 2)
  );

  console.log(
    "✅ Posted Question " +
    (index + 1)
  );

} catch (error) {

  console.error(error);

}
```

}, {
timezone: "Asia/Kolkata"
});

// WARNING CHECK - 5:55 AM

cron.schedule("55 5 * * *", async () => {

```
try {

  const warningChannel =
    await client.channels.fetch(
      process.env.WARNING_CHANNEL_ID
    );

  const dsaChannel =
    await client.channels.fetch(
      process.env.CHANNEL_ID
    );

  const state = JSON.parse(
    fs.readFileSync("./state.json", "utf8")
  );

  if (!state.lastMessageId) {
    return;
  }

  const message =
    await dsaChannel.messages.fetch(
      state.lastMessageId
    );

  const reaction =
    message.reactions.cache.get("✅");

  if (!reaction) {

    await warningChannel.send(
      "⚠️ Nobody solved yesterday's DSA question."
    );

    return;
  }

  const users =
    await reaction.users.fetch();

  const guild = message.guild;

  const members =
    await guild.members.fetch();

  const notDone = [];

  members.forEach(member => {

    if (
      member.user.bot ||
      !member.permissions.has("SendMessages")
    ) {
      return;
    }

    const reacted = users.some(user =>
      user.id === member.user.id
    );

    if (!reacted) {

      notDone.push(
        "<@" + member.user.id + ">"
      );

    }

  });

  if (notDone.length > 0) {

    await warningChannel.send(
      "⚠️ Daily DSA Warning\n\n" +
      "These members did NOT react:\n\n" +
      notDone.join("\n")
    );

  } else {

    await warningChannel.send(
      "🔥 Everyone completed yesterday's DSA challenge!"
    );

  }

} catch (error) {

  console.error(error);

}
```

}, {
timezone: "Asia/Kolkata"
});

});

client.login(process.env.TOKEN);
