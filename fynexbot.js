const Discord = require("discord.js");
const client = new Discord.Client();
require("discord-replys-v12");
require("discord-buttons")(client)
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util, Intents } = require("discord.js");
const fs = require("fs");
const replaceOnce = require("replace-once");
require("./FynexUtil/FynexLoader.js")(client);
const db = require("orio.db");
const queue = new Map();
const { Canvas } = require("canvas-constructor");
const YouTube = require("simple-youtube-api");
const superagent = require("superagent");
const ytdl = require("ytdl-core");
const fynex = require("./fynex.json");
const bot = new Discord.Client();
const { MessageMenu, MessageMenuOption } = require("discord-buttons");
const { MessageEmbed } = require("discord.js");

var prefix = fynex.prefix;


const log = message => {
  console.log(`${message}`);
};



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./fynexkomutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(ffynex => {
    let props = require(`./fynexkomutlar/${ffynex}`);
    log(`Yüklenen komut: ${props.help.name}.js`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = fynexcommand => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./fynexkomutlar/${fynexcommand}`)];
      let cmd = require(`./fynexkomutlar/${fynexcommand}`);
      client.commands.delete(fynexcommand);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === fynexcommand) client.aliases.delete(alias);
      });
      client.commands.set(fynexcommand, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./fynexkomutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = fynexcommand => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./fynexkomutlar/${fynexcommand}`)];
      let cmd = require(`./fynexkomutlar/${fynexcommand}`);
      client.commands.delete(fynexcommand);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === fynexcommand) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.permissions.has("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.permissions.has("BAN_MEMBERS")) permlvl = 2;
  if (message.member.permissions.has("ADMINISTRATOR")) permlvl = 2;
  if (message.author.id === message.guild.owner.id) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g

client.login(process.env.TOKEN);
moment.locale('tr');
const { S_IFREG } = require("constants");
const data = require('quick.db');
const logs = require('discord-logs');
logs(client);


client.on('ready', async () => {
client.user.setStatus('online');
console.log(`${client.user.username} ismiyle bağlandım.`);
  console.log(`${client.user.username} Adlı kanala bağlandım.`);
    console.log("_________________________________________________________________________________________________________________");
  console.log(`Bot Adı            |:| Fynex`);
  console.log(`Sunucu sayısı      |:| ${client.guilds.cache.size}`);
  console.log(`Kullanıcı sayısı   |:| ${client.users.cache.size}`);
  console.log(`Ön ek              |:| ${fynex.prefix}`);
  console.log(`Token              |:| ${process.env.TOKEN}`);
  console.log(`Durum              |:| ${process.env.durum}`);
  console.log("_________________________________________________________________________________________________________________");
})

client.on('message', async message => {
if(message.channel.type !== 'text') return;
const datas = await data.fetch(`tag.${message.guild.id}`);
if(message.content.toLowerCase().toString().includes('tag')) {
if(datas) return message.channel.send('`'+datas+'`');
};
});





client.on('message', async message => {
  if(message.channel.type !== 'text') return;
const chimped = await data.fetch(`chimped.${message.guild.id}`);
if(!chimped) return;
let command = chimped.find(a => a.command === message.content.toLocaleLowerCase());
if(command) {
message.channel.send(`${message.author} ${command.respond}`);
};
});





////-----------------------------\\\\\\\\\

//AFK Baş

const ms = require("parse-ms");
const { DiscordAPIError } = require("discord.js");

client.on("message", async (message) => {


  var SEBEP = await db.fetch(`afk_${message.author.id}`);


  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.content.includes(`afk`)) return;
let süre2 = db.fetch(`afk_süre_${message.author.id}`)

  if (await db.fetch(`afk_${message.author.id}`)) {
    db.delete(`afk_${message.author.id}`);
    db.delete(`afk_süre_${message.author.id}`);
    db.delete(`afkkullanıcı.${message.guild.id}`, message.author.id);
    db.delete(`afksayısı.${message.guild.id}`, 1)

    let tag = db.fetch(`afktag.${message.guild.id}`) || " "
  
    const embed = new Discord.MessageEmbed()

      .setColor("GREEN")
      .setDescription(`${tag} ${message.author} Hoş geldiin: **${SEBEP}** sebebiyle AFK'idin`);

    message.replyNoMention(embed);
    message.guild.members.cache.get(message.author.id).setNickname(`${message.author.username}`);
  };

  var USER = message.mentions.users.first();
  if (!USER) return;
  var REASON = await db.fetch(`afk_${USER.id}`);

  if (REASON) {
    let süre = await db.fetch(`afk_süre_${USER.id}`, Date.now());
    let timeObj = ms(Date.now() - süre);

    const afk = new Discord.MessageEmbed()

      .setColor("#00ff00")
      .setDescription(
        `**Bu Kullanıcı AFK**\n\n**Afk Olan Kullanıcı :** \`${USER.tag}\`\n**Afk Süresi :** \`${timeObj.hours}saat\` \`${timeObj.minutes}dakika\` \`${timeObj.seconds}saniye\`\n**Sebep :** \`${REASON}\``
      );

    message.channel.send(afk);
  }
});

//AFK Son

//ModLog Baş

client.on("messageDelete", async message => {
let sistem = db.fetch(`log.${message.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

 
  let log = message.guild.channels.cache.get(
    await db.fetch(`log_${message.guild.id}`)
  );
  const entry = await message.guild
    .fetchAuditLogs({ type: "MANAGE_MESSAGES" })
    .then(audit => audit.entries.first());
  if (!log) return;
let mesaj = message.content || "Bir botun embed yazısı silinmiş."
  const embed = new Discord.MessageEmbed()

    .setAuthor(`${message.author.tag} Adlı kişinin mesajı silindi`, message.author.avatarURL())
.setDescription(`**Silinen mesaj:** \`\`\`${mesaj}\`\`\` \n\n **[** [**Silindiği yere gitmek için tıkla**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) **]**`)
  .setThumbnail(message.author.avatarURL())
   .setColor("GREEN")
  .setFooter(`Mesajı Silen: ${entry.executor.tag} | Kanal: #${message.channel.name}`, message.author.avatarURL())
  log.send(embed);
 }
})
client.on("messageUptade", async (newMessage, oldMessage) => {
let sistem = db.fetch(`log.${message.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

  let log = 
    await db.fetch(`log_${oldMessage.guild.id}`);

  if (!log) return;

  let embed = new Discord.MessageEmbed()

    .setAuthor(`${oldMessage.author.tag} Adlı kişi mesajını düzenledi`, oldMessage.author.avatarURL())
.setDescription(`**Eski mesaj:** \`\`\`${oldMessage.content}\`\`\` **Yeni mesajı:**  \`\`\`${newMessage.content}\`\`\` \n\n **[** [**Mesaja gitmek için tıkla**](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.author.lastMessageID}) **]**`)
  .setThumbnail(oldMessage.author.avatarURL())
   .setColor("GREEN")
  .setFooter(`Kanal: #${oldMessage.channel.name}`, oldMessage.author.avatarURL())

  log.send(embed);
 }
});

client.on("channelCreate", async (channel, message) => {
  let sistem = db.fetch(`log.${message.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_CREATE" })
    .then(audit => audit.entries.first());

  let kanal;

  if (channel.type === "text") kanal = `Yazı`;

  if (channel.type === "voice") kanal = `Ses`;

  if(channel.type === "stage") kanal = "Etkinlik";
  
  if(channel.type === "category") kanal = `Kategori`;

  let embed = new Discord.MessageEmbed()

    .setAuthor(`${entry.executor.tag} Adlı kişi kanal oluşturdu`, entry.executor.avatarURL())
.setDescription(`**Oluşturduğu kanal:** \`\`\`${channel.name}\`\`\`  \n\n **Kanal tipi:** \`\`\`${kanal}\`\`\` \n\n **[** [**Kanala gitmek için tıkla**](https://discord.com/channels/${channel.guild.id}/${channel.id}) **]**`)
  .setThumbnail(entry.executor.avatarURL())
   .setColor("GREEN")
  .setFooter(`Oluşturan kişi: ${entry.executor.tag}`, entry.executor.avatarURL())


  client.channels.cache.get(modlog).send(embed);
 }
});
client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
  let sistem = db.fetch(`log.${member.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

    let modlog =  db.fetch(`log_${member.guild.id}`);

  if (!modlog) return;

  const entry =  member.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()
    .setAuthor(`${member.author.tag} Adlı kişinin ismi değiştirildi!`, member.author.avatarURL())
.setDescription(`**Eski isim:** \`\`\`${oldNickname}\`\`\` \n**Yeni isim:** \`\`\`${newNickname}\`\`\` `)
  .setThumbnail(member.author.avatarURL())
   .setColor("GREEN")
  .setFooter(`Değiştiren kişi: ${entry.executor.tag}`, entry.executor.avatarURL())
  
   
  client.channels.cache.get(modlog).send(embed);
 }
});
client.on("messagePinned", (message) => {
  let sistem = db.fetch(`log.${message.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

      let modlog = db.fetch(`log_${message.guild.id}`);

  if (!modlog) return;

  const entry =  message.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()
    .setAuthor(`${message.author.tag} Adlı kişinin mesajı sabitlendi!`, message.author.avatarURL())
.setDescription(`**Sabitlenen mesaj:** \`\`\`${message, true}\`\`\`  `)
  .setThumbnail(message.author.avatarURL())
   .setColor("GREEN")
  .setFooter(`Mesajı sabitleyen kişi: ${entry.executor.tag}`, entry.executor.avatarURL())
  
   
  client.channels.cache.get(modlog).send(embed);
 }
})
client.on("channelDelete", async channel => {
  let sistem = db.fetch(`log.${channel.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());

  let kanal;

  if (channel.type === "text") kanal = `Yazı`;

  if (channel.type === "voice") kanal = `Ses`;

  if(channel.type === "stage") kanal = "Etkinlik";
  
  if(channel.type === "category") kanal = `Kategori`;

  let embed = new Discord.MessageEmbed()

    .setAuthor(`${entry.executor.tag} Adlı kişi kanal sildi`, entry.executor.avatarURL())
.setDescription(`**Sildiği kanal:** \`\`\`${channel.name}\`\`\`  \n\n **Kanal tipi:** \`\`\`${kanal}\`\`\` `)
  .setThumbnail(entry.executor.avatarURL())
   .setColor("GREEN")
  .setFooter(`Silen kişi: ${entry.executor.tag}`, entry.executor.avatarURL())

  client.channels.cache.get(modlog).send(embed);
}});

client.on("roleCreate", async role => {
  let sistem = db.fetch(`log.${role.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()
    .setAuthor(`${entry.executor.tag} Adlı kişi rol oluşturdu`, entry.executor.avatarURL())
.setDescription(`**Oluşturulan rol:** \`\`\`${role.name}\`\`\` `)
  .setThumbnail(entry.executor.avatarURL())
   .setColor("GREEN")
  .setFooter(`Oluşturan kişi: ${entry.executor.tag}`, entry.executor.avatarURL())
  
   
  client.channels.cache.get(modlog).send(embed);
}
});

client.on("roleDelete", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()
    .setAuthor(`${entry.executor.tag} Adlı kişi rol sildi`, entry.executor.avatarURL())
.setDescription(`**Sildiği rol:** \`\`\`${role.name}\`\`\`  \n\n **Rol renk:** \`\`\`${role.color}\`\`\` `)
  .setThumbnail(entry.executor.avatarURL())
   .setColor("GREEN")
  .setFooter(`Silen kişi: ${entry.executor.tag}`, entry.executor.avatarURL())
  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiCreate", async emoji => {
  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()
    .setAuthor(`${entry.executor.tag} Adlı kişi emoji oluşturdu`, entry.executor.avatarURL())
.setDescription(`**Olulturduğu emoji:** \`\`\`${emoji}\`\`\`  \n\n **Emoji adı:** \`\`\`${emoji.name}\`\`\`\n\n **Emoji id:** \`\`\`${emoji.id}\`\`\` `)
  .setThumbnail(entry.executor.avatarURL())
   .setColor("GREEN")
  .setFooter(`Oluşturan kişi: ${entry.executor.tag}`, entry.executor.avatarURL())
   

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiDelete", async emoji => {
  let sistem = db.fetch(`log.${emoji.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()
    .setAuthor(`${entry.executor.tag} Adlı kişi emoji sildi`, entry.executor.avatarURL())
.setDescription(`**Sildiği emoji:** ${emoji}  \n\n **Sildiği emoji adı:** \`\`\`${emoji.name}\`\`\`\n\n **Sildiği emoji id:** \`\`\`${emoji.id}\`\`\` `)
  .setThumbnail(entry.executor.avatarURL())
   .setColor("GREEN")
  .setFooter(`Silen kişi: ${entry.executor.tag}`, entry.executor.avatarURL())
   
  client.channels.cache.get(modlog).send(embed);
 }
});

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  let sistem = db.fetch(`log.${newEmoji.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

  let modlog = await db.fetch(`log_${oldEmoji.guild.id}`);

  if (!modlog) return;

  const entry = await oldEmoji.guild
    .fetchAuditLogs({ type: "EMOJI_UPDATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()
.setAuthor(`${entry.executor.tag} Adlı kişi emoji yeniledi`, entry.executor.avatarURL())
.setDescription(`**Yenilediği emoji:** ${newEmoji}  \n\n **Yeni emoji adı:** \`\`\`${newEmoji.name}\`\`\`\n\n **Eski emoji:** \`\`\`${oldEmoji}\`\`\`\n\n **Eski emoji adı:** \`\`\`${oldEmoji.name}\`\`\` `)
  .setThumbnail(entry.executor.avatarURL())
   .setColor("GREEN")
  .setFooter(`Silen kişi: ${entry.executor.tag}`, entry.executor.avatarURL())
   
  client.channels.cache.get(modlog).send(embed);
 }
});

client.on("guildBanAdd", async (guild, user) => {
  let sistem = db.fetch(`log.${user.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()
.setAuthor(`${entry.executor.tag} Adlı kişi emoji sildi`, entry.executor.avatarURL())
.setDescription(``)
  .setThumbnail(entry.executor.avatarURL())
   .setColor("GREEN")
  .setFooter(`Silen kişi: ${entry.executor.tag}`, entry.executor.avatarURL())
   

  client.channels.cache.get(modlog).send(embed);
 }
});

client.on("guildBanRemove", async (guild, user) => {
  let sistem = db.fetch(`log.${guild.guild.id}`)
 if(sistem != "acik") {
    return;
  }
 if(sistem = "acik") {

  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Yasak Kaldırma")

    .addField("**Yasağı Kaldıran Yetkili:**", `<@${entry.executor.id}>`)

    .addField(
      "**Yasağı Kaldırılan Kullanıcı:**",
      `**${user.tag}** - ${user.id}`
    )

    .setTimestamp()

    .setColor("#ff0000")

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
 }
});
// ModLog Son

//KüfürEngel Baş

const küfür = [
  "siktir",
  "orspu",
  "sg",
  "siktir git",
  "amcık",
  "amcu",
  "bitch",
  "fucking",
  "fuck",
  "puşt",
  "pust",
  "piç",
  "sikerim",
  "sik", 
  "yarra",
  "yarrak",
  "amcık",
  "orospu",
  "orosbu",
  "orosbucocu",
  "oç",
  ".oc",
  "ibne",
  "yavşak",
  "bitch",
  "dalyarak",
  "amk",
  "awk",
  "taşak",
  "orsp",
  "orsopu",
  "taşşak",
  "daşşak",
  "sikm",
  "sikim",
  "sikmm",
  "skim",
  "skm",
  "sg",
  "porn",
  "fak yu",
  "orrr",
  "taşşak",
  "AMK",
  "O rospu",
  "O.rospu",
  "Or ospu",
  "Oro spu",
  "Oros pu",
  "Orosp u",
  "O.rospu",
  "Oro.spu",
  "Or.ospu",
  "taşşağını",
  "Oros.pu",
  "Orosp.u",
  "porospu",
  "sikerler",
  "sikerim",
  "amınakodum",
  "amına kodum",
  "WTF",
  "wtf",
  "hay anan",
  "OÇ",
  "Oç",
  "piç kurusu",
  "piç",
  "göt",
  "got",
  "mk",
  "skm",
  "SİKCEM",
  "porn",
  "porno",
  "ağh",
  "ah",
  "sik",
  "abaza",
  "abazan",
  "aq",
  "ağzınasıçayım",
  "ahmak",
  "amarım",
  "ambiti",
  "OC",
  "0C",
  "ambiti",
  "amcığı",
  "amcığın",
  "amcığını",
  "amcığınızı",
  "amcık",
  "amcıkhoşafı",
  "amcıklama",
  "amcıklandı",
  "amcik",
  "amck",
  "amckl",
  "amcklama",
  "amcklaryla",
  "amckta",
  "amcktan",
  "amcuk",
  "amık",
  "amına",
  "amınako",
  "amınakoy",
  "amınakoyarım",
  "amınakoyayım",
  "amınakoyim",
  "amınakoyyim",
  "amınas",
  "amınasikem",
  "amınasokam",
  "amınferyadı",
  "amını",
  "amınıs",
  "amınoglu",
  "amınoğlu",
  "amınoğli",
  "amısına",
  "amısını",
  "amina",
  "aminakoyarim",
  "aminakoyayım",
  "aminakoyayim",
  "aminakoyim",
  "aminda",
  "amindan",
  "s+kim",
  "s+km",
  "s+ikim",
  "amindayken",
  "amini",
  "aminiyarraaniskiim",
  "aminoglu",
  "aminoglu",
  "amiyum",
  "amk",
  "amkafa",
  "amkçocuğu",
  "amlarnzn",
  "amlı",
  "amna",
  "amnda",
  "amndaki",
  "amngtn",
  "amnn",
  "amq",
  "amsız",
  "amsiz",
  "amuna",
  "anaaann",
  "anal",
  "anan",
  "anana",
  "anandan",
  "ananı",
  "ananı",
  "ananın",
  "ananınam",
  "ananınamı",
  "ananındölü",
  "ananınki",
  "ananısikerim",
  "ananısikerim",
  "ananısikeyim",
  "ananısikeyim",
  "ananızın",
  "ananızınam",
  "anani",
  "ananin",
  "ananisikerim",
  "ananisikerim",
  "ananisikeyim",
  "ananisikeyim",
  "anann",
  "ananz",
  "otuzbir",
  "otusbir",
  "anas",
  "anasını",
  "anasınınam",
  "anasıorospu",
  "anasi",
  "anasinin",
  "angut",
  "anneni",
  "annenin",
  "aq",
  "a.q",
  "a.q.",
  "aq.",
  "atkafası",
  "babaannesikaşar",
  "babasıpezevenk",
  "bacndan",
  "bitch",
  "bok",
  "boka",
  "bokbok",
  "bokça",
  "bokkkumu",
  "boklar",
  "boktan",
  "boku",
  "bokubokuna",
  "bokum",
  "bombok",
  "boner",
  "bosalmak",
  "boşalmak",
  "çük",
  "dallama",
  "daltassak",
  "dalyarak",
  "dalyarrak",
  "dangalak",
  "dassagi",
  "diktim",
  "dildo",
  "dingil",
  "dingilini",
  "dinsiz",
  "dkerim",
  "domal",
  "domalan",
  "domaldı",
  "domaldın",
  "domalık",
  "domalıyor",
  "domalmak",
  "domalmış",
  "domalsın",
  "domalt",
  "domaltarak",
  "domaltıp",
  "domaltır",
  "domaltırım",
  "domaltip",
  "domaltmak",
  "dölü",
  "eben",
  "ebeni",
  "ebenin",
  "ebeninki",
  "ecdadını",
  "ecdadini",
  "embesil",
  "fahise",
  "fahişe",
  "feriştah",
  "ferre",
  "fuck",
  "fucker",
  "fuckin",
  "fucking",
  "gavad",
  "gavat",
  "geber",
  "geberik",
  "gebermek",
  "gebermiş",
  "gebertir",
  "gerızekalı",
  "gerizekalı",
  "gerizekali",
  "gerzek",
  "gotlalesi",
  "gotlu",
  "gotten",
  "gotundeki",
  "gotunden",
  "gotune",
  "gotunu",
  "gotveren",
  "göt",
  "götdeliği",
  "götherif",
  "götlalesi",
  "götlek",
  "götoğlanı",
  "götoğlanı",
  "götoş",
  "götten",
  "götü",
  "götün",
  "götüne",
  "götünekoyim",
  "götünekoyim",
  "götünü",
  "götveren",
  "götveren",
  "götverir",
  "gtveren",
  "hasiktir",
  "hassikome",
  "hassiktir",
  "hassiktir",
  "hassittir",
  "ibine",
  "ibinenin",
  "ibne",
  "ibnedir",
  "ibneleri",
  "ibnelik",
  "ibnelri",
  "ibneni",
  "ibnenin",
  "ibnesi",
  "ipne",
  "itoğluit",
  "æmk",
   "æm",
   "mkkk",
   "mk",
   "orrr",
   "orrrr",
   "orsp",
   "orosp",
   "oros",
   "orospuu",
   "morspu",
   "mrspu",
   "ors",
  "kahpe",
  "kahpenin",
  "kaka",
  "kaltak",
  "kancık",
  "kancik",
  "kappe",
  "kavat",
  "kavatn",
  "kocagöt",
  "koduğmunun",
  "kodumun",
  "kodumunun",
  "koduumun",
  "mal",
  "malafat",
  "malak",
  "manyak",
  "meme",
  "memelerini",
  "oc",
  "ocuu",
  "ocuun",
  "0Ç",
  "o.çocuğu",
  "orosbucocuu",
  "orospu",
  "orospucocugu",
  "orospuçoc",
  "orospuçocuğu",
  "orospuçocuğudur",
  "orospuçocukları",
  "orospudur",
  "orospular",
  "orospunun",
  "orospununevladı",
  "orospuydu",
  "orospuyuz",
  "orrospu",
  "oruspu",
  "oruspuçocuğu",
  "oruspuçocuğu",
  "osbir",
  "öküz",
  "penis",
  "pezevek",
  "pezeven",
  "pezeveng",
  "pezevengi",
  "pezevenginevladı",
  "pezevenk",
  "pezo",
  "pic",
  "pici",
  "picler",
  "piç",
  "piçinoğlu",
  "piçkurusu",
  "piçler",
  "pipi",
  "pisliktir",
  "porno",
  "pussy",
  "puşt",
  "puşttur",
  "s1kerim",
  "s1kerm",
  "s1krm",
  "sakso",
  "salaak",
  "salak",
  "serefsiz",
  "sexs",
  "sıçarım",
  "sıçtığım",
  "sıkecem",
  "sicarsin",
  "sie",
  "sik",
  "sikdi",
  "sikdiğim",
  "sike",
  "sikecem",
  "sikem",
  "siken",
  "sikenin",
  "siker",
  "sikerim",
  "sikerler",
  "sikersin",
  "sikertir",
  "sikertmek",
  "sikesen",
  "sikey",
  "sikeydim",
  "sikeyim",
  "sikeym",
  "siki",
  "sikicem",
  "sikici",
  "sikien",
  "sikienler",
  "sikiiim",
  "sikiiimmm",
  "sikiim",
  "sikiir",
  "sikiirken",
  "sikik",
  "sikil",
  "sikildiini",
  "sikilesice",
  "sikilmi",
  "sikilmie",
  "sikilmis",
  "sikilmiş",
  "sikilsin",
  "sikim",
  "sikimde",
  "sikimden",
  "sikime",
  "sikimi",
  "sikimiin",
  "sikimin",
  "sikimle",
  "sikimsonik",
  "sikimtrak",
  "sikin",
  "sikinde",
  "sikinden",
  "sikine",
  "sikini",
  "sikip",
  "sikis",
  "sikisek",
  "sikisen",
  "sikish",
  "sikismis",
  "sikiş",
  "sikişen",
  "sikişme",
  "sikitiin",
  "sikiyim",
  "sikiym",
  "sikiyorum",
  "sikkim",
  "sikleri",
  "sikleriii",
  "sikli",
  "sikm",
  "sikmek",
  "sikmem",
  "sikmiler",
  "sikmisligim",
  "siksem",
  "sikseydin",
  "sikseyidin",
  "siksin",
  "siksinler",
  "siksiz",
  "siksok",
  "siksz",
  "sikti",
  "siktigimin",
  "siktigiminin",
  "siktiğim",
  "siktiğimin",
  "siktiğiminin",
  "siktii",
  "siktiim",
  "siktiimin",
  "siktiiminin",
  "siktiler",
  "siktim",
  "siktimin",
  "siktiminin",
  "siktir",
  "siktiret",
  "siktirgit",
  "siktirgit",
  "siktirir",
  "siktiririm",
  "siktiriyor",
  "siktirlan",
  "siktirolgit",
  "sittimin",
  "skcem",
  "skecem",
  "skem",
  "sker",
  "skerim",
  "skerm",
  "skeyim",
  "skiim",
  "skik",
  "skim",
  "skime",
  "skmek",
  "sksin",
  "sksn",
  "sksz",
  "sktiimin",
  "sktrr",
  "skyim",
  "slaleni",
  "sokam",
  "sokarım",
  "sokarim",
  "sokarm",
  "sokarmkoduumun",
  "sokayım",
  "sokaym",
  "sokiim",
  "soktuğumunun",
  "sokuk",
  "sokum",
  "sokuş",
  "sokuyum",
  "soxum",
  "sulaleni",
  "sülalenizi",
  "tasak",
  "tassak",
  "taşak",
  "taşşak",
  "s.k",
  "s.keyim",
  "vajina",
  "vajinanı",
  "xikeyim",
  "yaaraaa",
  "yalarım",
  "yalarun",
  "orospi",
  "orospinin",
  "orospının",
  "orospı",
  "yaraaam",
  "yarak",
  "yaraksız",
  "yaraktr",
  "yaram",
  "yaraminbasi",
  "yaramn",
  "yararmorospunun",
  "yarra",
  "yarraaaa",
  "yarraak",
  "yarraam",
  "yarraamı",
  "yarragi",
  "yarragimi",
  "yarragina",
  "yarragindan",
  "yarragm",
  "yarrağ",
  "yarrağım",
  "yarrağımı",
  "yarraimin",
  "yarrak",
  "yarram",
  "yarramin",
  "yarraminbaşı",
  "yarramn",
  "yarran",
  "yarrana",
  "yarrrak",
  "yavak",
  "yavş",
  "yavşak",
  "yavşaktır",
  "yrrak",
  "zigsin",
  "zikeyim",
  "zikiiim",
  "zikiim",
  "zikik",
  "zikim",
  "ziksiin",
  "ağzına",
  "mk",
  "amcık",
  "amcıkağız",
  "amcıkları",
  "amık",
  "amına",
  "amınakoyim",
  "amınoğlu",
  "amina",
  "amini",
  "amk",
  "amq",
  "anan",
  "ananı",
  "ananızı",
  "ananizi",
  "aminizi",
  "aminii",
  "avradını",
  "avradini",
  "anasını",
  "b.k",
  "bok",
  "boktan",
  "boşluk",
  "dalyarak",
  "dasak",
  "dassak",
  "daşak",
  "daşşak",
  "daşşaksız",
  "ensest",
  "erotik",
  "fahişe",
  "fuck",
  "g*t",
  "g*tü",
  "g*tün",
  "g*tüne",
  "g.t",
  "gavat",
  "gerızekalıdır",
  "gerizekalı",
  "gerizekalıdır",
  "got",
  "gotunu",
  "gotuze",
  "göt",
  "götü",
  "götüne",
  "götünü",
  "götünüze",
  "götüyle",
  "götveren",
  "götvern",
  "hasiktir",
  "hasiktr",
  "hastir",
  "i.ne",
  "ibne",
  "ibneler",
  "ibneliği",
  "ipne",
  "ipneler",
  "it",
  "iti",
  "itler",
  "kavat",
  "kıç",
  "kıro",
  "kromusunuz",
  "kromusunuz",
  "lezle",
  "lezler",
  "nah",
  "o.ç",
  "oç.",
  "okuz",
  "orosbu",
  "orospu",
  "orospucocugu",
  "orospular",
  "otusbir",
  "otuzbir",
  "penis",
  "pezevenk",
  "pezevenkler",
  "pezo",
  "pic",
  "piç",
  "piçi",
  "piçinin",
  "piçler",
  "pok",
  "pokunu",
  "porn",
  "porno",
  "puşt",
  "sex",
  "s.tir",
  "sakso",
  "salak",
  "sanane",
  "sanane",
  "sçkik",
  "seks",
  "serefsiz",
  "serefsz",
  "serefszler",
  "sex",
  "sıçmak",
  "sıkerım",
  "sıkm",
  "sıktır",
  "si.çmak",
  "sicmak",
  "sicti",
  "sik",
  "sikenin",
  "siker",
  "sikerim",
  "sikerler",
  "sikert",
  "sikertirler",
  "sikertmek",
  "sikeyim",
  "sikicem",
  "sikiim",
  "sikik",
  "sikim",
  "sikime",
  "sikimi",
  "sikiş",
  "sikişken",
  "sikişmek",
  "sikm",
  "sikmeyi",
  "siksinler",
  "siktiğim",
  "siktimin",
  "siktin",
  "siktirgit",
  "siktir",
  "siktirgit",
  "siktirsin",
  "siqem",
  "skiym",
  "skm",
  "skrm",
  "sktim",
  "sktir",
  "sktirsin",
  "sktr",
  "sktroradan",
  "sktrsn",
  "snane",
  "sokacak",
  "sokarim",
  "sokayım",
  "sülaleni",
  "şerefsiz",
  "şerefsizler",
  "şerefsizlerin",
  "şerefsizlik",
  "tasak",
  "tassak",
  "taşak",
  "taşşak",
  "yarak",
  "yark",
  "yarrağım",
  "yarrak",
  "yarramın",
  "yarrk",
  "yavşak",
  "yrak",
  "yrk",
  "ebenin",
  "ezik",
  "o.ç.",
  "orospu",
  "öküz",
  "pezevenk",
  "piç",
  "puşt",
  "salak",
  "salak",
  "serefsiz",
  "sik",
  "sperm",
  "bok",
  "aq",
  "a.q.",
  "amk",
  "amına",
  "ebenin",
  "ezik",
  "fahişe",
  "gavat",
  "gavurundölü",
  "gerizekalı",
  "göte",
  "götü",
  "götüne",
  "götünü",
  "mal",
  "o.ç.",
  "orospu",
  "pezevenk",
  "piç",
  "puşt",
  "salak",
  "salak",
  "serefsiz",
  "sik",
  "sikkırığı",
  "sikerler",
  "sikertmek",
  "sikik",
  "sikilmiş",
  "siktir",
  "sperm",
  "taşak",
  "yarak",
  "yarrak",
  "bok",
  "aq",
  "a.q.",
  "amk",
  "ebenin",
  "fahişe",
  "gavat",
  "gerizakalı",
  "gerizekalı",
  "göt",
  "göte",
  "götü",
  "götüne",
  "götsün",
  "piçsin",
  "götsünüz",
  "piçsiniz",
  "götünüze",
  "götünü",
  "ibne",
  "ibine",
  "kahpe",
  "mal",
  "o.c",
  "oc",
  "manyak",
  "o.ç.",
  "oç",
  "orospu",
  "öküz",
  "pezevenk",
  "puşt",
  "salak",
  "serefsiz",
  "sik",
  "sikkırığı",
  "sikerler",
  "sikertmek",
  "sikik",
  "sikiim",
  "siktim",
  "siki",
  "sikilmiş",
  "siktir",
  "siktir",
  "sperm",
  "şerefsiz",
  "taşak",
  "yarak",
  "yarrak",
  "yosma",
  "aq",
  "a.q.",
  "amk",
  "amına",
  "amınakoyim",
  "amina",
  "ammına",
  "amna",
  "sikim",
  "sikiym",
  "sikeyim",
  "siktr",
  "kodumun",
  "amık",
  "sikem",
  "sikim",
  "sikiym",
  "s.iktm",
  "s.ikerim",
  "s.ktir",
  "amg",
  "am.k",
  "a.mk",
  "amık",
  "rakı",
  "rak",
  "oruspu",
  "oc",
  "ananın",
  "ananınki",
  "bacının",
  "bacını",
  "babanın",
  "sike",
  "skim",
  "skem",
  "amcık",
  "şerefsiz",
  "piç",
  "piçinoğlu",
  "amcıkhoşafı",
  "amınasokam",
  "amkçocuğu",
  "amınferyadı",
  "amınoglu",
  "piçler",
  "sikerim",
  "sikeyim",
  "siktiğim",
  "siktiğimin",
  "amını",
  "amına",
  "amınoğlu",
  "amk",
  "ipne",
  "ibne",
  "serefsiz",
  "şerefsiz",
  "piç",
  "piçkurusu",
  "götün",
  "götoş",
  "yarrak",
  "amcik",
  "sıçarım",
  "sıçtığım",
  "aq",
  "a.q",
  "a.q.",
  "aq.",
  "amınak",
  "aminak",
  "amınag",
  "aminag",
  "amınıs",
  "amınas",
  "ananı",
  "babanı",
  "anani",
  "babani",
  "bacını",
  "bacini",
  "ecdadını",
  "ecdadini",
  "götten",
  "sikeyim",
  "sulaleni",
  "sülaleni",
  "dallama",
  "dangalak",
  "aptal",
  "salak",
  "gerızekalı",
  "gerizekali",
  "öküz",
  "angut",
  "dalyarak",
  "sikiyim",
  "sikeyim",
  "götüne",
  "götünü",
  "siktirgit",
  "siktirgit",
  "siktirolgit",
  "siktirolgit",
  "siktir",
  "hasiktir",
  "hassiktir",
  "hassiktir",
  "dalyarak",
  "dalyarrak",
  "kancık",
  "kancik",
  "kaltak",
  "orospu",
  "oruspu",
  "fahişe",
  "fahise",
  "pezevenk",
  "pezo",
  "kocagöt",
  "ambiti",
  "götünekoyim",
  "götünekoyim",
  "amınakoyim",
  "aminakoyim",
  "amınak",
  "aminakoyayım",
  "aminakoyayim",
  "amınakoyarım",
  "aminakoyarim",
  "aminakoyarim",
  "ananısikeyim",
  "ananisikeyim",
  "ananısikeyim",
  "ananisikeyim",
  "ananisikerim",
  "ananısikerim",
  "ananisikerim",
  "ananısikerim",
  "orospucocugu",
  "oruspucocu",
  "amk",
  "amq",
  "sikik",
  "götveren",
  "götveren",
  "amınoğlu",
  "aminoglu",
  "amınoglu",
  "gavat",
  "kavat",
  "anneni",
  "annenin",
  "ananın",
  "ananin",
  "dalyarak",
  "sikik",
  "amcık",
  "siktir",
  "piç",
  "pic",
  "sie",
  "yarram",
  "göt",
  "meme",
  "dildo",
  "skcem",
  "skerm",
  "skerim",
  "skecem",
  "orrospu",
  "annesiz",
  "kahpe",
  "kappe",
  "yarak",
  "yaram",
  "mkk",
  "dalaksız",
  "yaraksız",
  "amlı",
  "s1kerim",
  "s1kerm",
  "s1krm",
  "sikim",
  "orospuçocukları",
  "oç",
  "p.i.c",
  "p.i.ç",
  "a.m.k",
  "p.o.r.n",
  "m.k",
  "o.ç",
  "æmk",
  "pornocu",
  "pornohub",
  "pornhub",
  "O ç",
  "o ç",
  "pıc",
  "oros",
  "O. Ç",
  "O ÇÇ",
  "OÇÇ",
  "F*CKK",
  "skrm",
  "si kerim",
  "bi sikerim",
  "bi skrem",
  "bi skrm",
  "bi.skrm",
  "o r o s p u",
  "p i ç",
  "morospu",
  "m.o.r.o.s.p.u",
  "m.orospu",
  "mo.rospu",
  "mor.ospu",
  "moro.spu",
  "moros.pu",
  "morosp.u",
  "morospu.",
  "orospu.",
  "OOÇ",
  "OROS.PU",
  "ORO.SPU",
  "ananın amına teletabinin antenlerini sokar göbeğindeki televizyondan ulusal porno yayını yaparımananı özgürlük heykelinin yanmayan meşalesinde siker şehri duman ederimhollywood bulvarında donla gezen ananın amına topuklu ayakkabı sokayımananı ikiz kulelerinin yedinci katına cıkartır amına uçakla girerim..ananın o dazlak kafasına teflon tavayla vurur sersemletir sikerim.ananın buruşmuş amına tefal ütü basar dümdüz ederim.ananın amına windows 7 kurar mavi ekran hatası verinceye kadar sikerim.ananın amına telefon kablosu sokar paralel hattan bacını skermgardolapta tangasını arayan ananın kafasını dolap kapagına sıkıştırır müjde ar gibi sikerimdağdan inmediği icin yüzme bilmeyen ananı büyük pasificte 1 ton boşalan beyaz balinalarla beraber-- siker olimpiyat yüzme şampiyonasında altın madalya kazandırırımkırmızı eşarp giyip ormanda kırmızı başlıklı kız gibi takılan anana kurt gibi yaklaşır amını param parça ederimmmpikachuuuuuuuuu diye camdan atlayan sipastik ananın amına poke topu fırlatırımananı balbasaurun sarmaşık kırbacıyla dolar pikacuyla kanka olur veririm elektriğiedisonla kanka olur ananı fakir mahallenizde yanmayan sokak direğine bağlar sike sike trafoyu patlatırımhani benim gençliğim nerde diyen orospu cocugu seni.tavşan kostümü giyip fotograf cektirince kendini playboy dergisinde kapak sanan ananın amına evdeki elektrik süpürgesini sokarımananla karşılıklı salsa yaparken piste takla atarak giren orospu cocugu kardeşini götünden sikerim..ananla karşılıklı sikişirken ay çekirdeği cıtlatırım kabuklarını babanın suratına fırlatırımevde göbeğini yere deydirerek sınav cekince kendini atletik sanan abini götünden sikeyim...saclarını arkaya tarayınca kendini tarık akan sanan babanıda götünden sikeyim...tokyo drifti izleyip köyde traktörle drift yapmaya calısan abinin götüne kamyonla gireyim..kilotlu corapla denize giren kız kardeşinin kafasını suya sokup bogulana kadar sikeyim..ananı çeeeeeeeeeeeeeeee ..googleye türbanlı karı sikişleri yazan dedeni götünden sikeyim.camiden tabut calıp dedesine tabut satan ananı tabutun icinde siker öldürürüm...ananın amına kolumu sokar kücük kardeşlerini cıkartırımananı neil amstrongla beraber aya cıkartıp siker hardcore movie alırım altın portakal film festivalinde aldıgım ödülü ananın amına sokarımananın amına harry poterin assasını sokar kücük kücük büyücüler cıkartırım..ananın amına pandora kutusu sokar icinden tavşan cıkartırımananın amına duracel pill atar 10 kata kadar daha güçlü sikerim.ananı national geographic belgeselinde sikerim insanlar arslan ciftlesmesi görür..ananın amına 5+1 hoparlör sokar kolonları titretirimananı hollandadaki altın portakal film festivaline götürür amına portakal ağacını sokarımanana gerilla kostümü giydirir şanlı türk ordusunun icine atıp harmandalı oynattıktan sonra amına c4 yerlestirip havaya ucururumananı ramsstein konserinde pistte sikerim du hast şarkısını tersten okuttururumbabanın o kokmuş corabını ananın amına sokarımananı galatasaray fenerbahçe derbisinde kale yapar musa sow gibi hatrick yaparımkaradenizin cılgın dalgalarında sörf yapmaya calısırqene diye fotograf cektiren bacının amına sörf tahtasını sokarımananın amına nokia 3310 sokar polifonik müzik eşliğinde sikerim.ananı klavyemin üstünde sikerken paintte yarak resmi cizip kız kardeşine gönderirim.ananı jerry kılıgına sokar tom gibi kovalarım elbet bir köşede yakalar sikerim.hain antuan diye haykıran kız kardeşini atımın üstünde yan giderken siker öldürürüm.ananı afrikada am kıtlığı yaşayan 3 bacaklı familyasının arasına atar paramparça olana kadar sikerim.ananı bruce lee gibi havada 30 parande atarak sikerimananı barnebau stadınnın orta sahasında sikerim 70 milyon ispanyol ollaaaaa diye bagırır ..ananla karşılıklı okey oynuyum okeyi ananın kafasına vurayım beyin trawmesi gecirriken sikerimananın amına polis jobu sokar ay memur bey lütfen yavaş olun diye çığlık attırırımananı hamit gibi 365 gün siker geriye kalan 6 saatte direğe vururumananı ağrı dağının eteğinde sikerim ibrahim tatlıses halay çekerananın amına kemençe sokar üzerinde horon teperimalt alta ben orospu cocuguyum yazınca kendini akrostiş şiir yazdım sanan orospu cocuguananla yamyam ayininde karşılıklı barış çubuğu içer totem heykelinin tepesine oturttururuminşaat direğinde striptiz yapmaya calısırken bacagını kıran ananın kafasına kiremit atar bayıltıp sikerim",
];
client.on("messageUpdate", async (old, nev) => {
  if (old.content != nev.content) {
    let i = await db.fetch(`küfür.${nev.member.guild.id}.durum`);
    let y = await db.fetch(`küfür.${nev.member.guild.id}.kanal`);
    if (i) {
      if (küfür.some((word) => nev.content.includes(word))) {
        if (nev.member.hasPermission("BAN_MEMBERS")) return;
        const embed = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setDescription(
            ` ${nev.author} , **Mesajını editleyerek küfür etmeye çalıştı!**`
          )
          .addField(`Mesajı: \n ${nev}`);

        nev.delete();
        const embeds = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setDescription(
            ` ${nev.author} , **Mesajı düzenleyerek küfür etmene izin veremem!**`
          );
        client.channels.cache.get(y).send(embed);
        nev.channel.send(embeds).then((msg) => msg.delete({ timeout: 5000 }));
      }
    } else {
    }
    if (!i) return;
  }
});

client.on("message", async (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  let y = await db.fetch(`küfür.${msg.member.guild.id}.kanal`);

  let i = await db.fetch(`küfür.${msg.member.guild.id}.durum`);
  if (i) {
    if (küfür.some((word) => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("BAN_MEMBERS")) {
          msg.delete({ timeout: 750 });
          const embeds = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription(
              ` <@${msg.author.id}> , **Bu sunucuda küfür yasak!**`
            );
          msg.channel.send(embeds).then((msg) => msg.delete({ timeout: 5000 }));
          msg.author.send(`**Şşt yakışıklı senden hiç bu küfür beklemiyordum** : ${msg.content} :pensive: `)
          const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription(` ${msg.author} , **Küfür etmeye çalıştı!**`)
            .addField(`Mesaj içeriğinin tamamı: ${msg}`);
          client.channels.cache.get(y).send(embed);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

//KüfürEngel Son

//Reklam Engel Baş

const reklam = [
  ".com",
  ".net",
  ".xyz",
  ".tk",
  ".pw",
  ".io",
  ".me",
  ".gg",
  "www.",
  "https",
  "http",
  ".gl",
  ".org",
  ".ml",
  ".sk",
  ".fuck",
  ".nl",
  ".glitch.me",
  ".glitch",
  "com.tr",
  ".com.tr",
  ".biz",
  "net",
  ".rf",
  ".gd",
  ".az",
  ".party",
  ".gf",
  ".31",
  ".me",
  "https://",
  ".sg",
  ".amk",
  ".ez",
  ".fuck.me",
  ".fuck"
];
client.on("messageUpdate", async (old, nev) => {
  if (old.content != nev.content) {
    let i = await db.fetch(`reklam.${nev.member.guild.id}.durum`);
    let y = await db.fetch(`reklam.${nev.member.guild.id}.kanal`);
    if (i) {
      if (reklam.some((word) => nev.content.includes(word))) {
        if (nev.member.hasPermission("BAN_MEMBERS")) return;
        const embed = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setDescription(
            ` ${nev.author} , **Mesajını editleyerek reklam yapmaya çalıştı!**`
          )
          .addField("Mesajı:", nev);

        nev.delete();
        const embeds = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setDescription(
            ` ${nev.author} , **Mesajı editleyerek reklam yapamana izin veremem!**`
          );
        client.channels.cache.get(y).send(embed);
        nev.channel.send(embeds).then((msg) => msg.delete({ timeout: 5000 }));
      }
    } else {
    }
    if (!i) return;
  }
});

client.on("message", async (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  let y = await db.fetch(`reklam.${msg.member.guild.id}.kanal`);

  let i = await db.fetch(`reklam.${msg.member.guild.id}.durum`);
  if (i) {
    if (reklam.some((word) => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          if (!fynex.gelistiriciler.includes(msg.author.id)) return;
          msg.delete({ timeout: 750 });
          const embeds = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription(
              ` <@${msg.author.id}> , **Bu sunucuda reklam yapmak yasak!**`
            );
          msg.channel.send(embeds).then((msg) => msg.delete({ timeout: 5000 }));
          const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription(` ${msg.author} , **Reklam yapmaya çalıştı!**`)
            .addField("Mesajı:", msg);
          client.channels.cache.get(y).send(embed);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

//Reklam Engel Son

//Kelime Türetmece Baş

client.on("message", async (message) => {
  if (message.author.id === client.user.id) return;
  let kanal = "996681723238682744";
  if (message.channel.id !== kanal) return;

  let kelime = await db.fetch(`kelime`);

  if (message.author.id === db.fetch(`kelime-sahip`)) {
    message.delete({ timeout: 100, reason: "ce" });
    message
      .reply(
        " En son kelimeyi sen **yazmışsın**, başkasının oyuna katılmasını bekle."
      )
      .then((s) => s.delete({ timeout: 5000, reason: "s" }));
    return;
  }

  if (!kelime) {
    message.react("<a:dogrulandi:977524260451024966>");
    db.set(`kelime`, message.content.substr(-1));
    db.set(`kelime-sahip`, message.author.id);
    return;
  }

  if (!message.content.toLowerCase().startsWith(kelime)) {
    message.delete({ timeout: 100, reason: "ce" });
    message
      .reply(" Yeni kelime **" + kelime + "** harfi ile başlamalıdır.")
      .then((s) => s.delete({ timeout: 5000, reason: "s" }));
    return;
  }

  message.react("<a:dogrulandi:977524260451024966>");
  db.set(`kelime`, message.content.substr(-1));
  db.set(`kelime-sahip`, message.author.id);
});

//Kelime Türetmece Son

//Güvenlik Baş

client.on("guildMemberAdd", (member) => {
  let kanal = db.fetch(`güvenlik.${member.guild.id}`);
  if (!kanal) return;

  let aylar = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs",
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",
    "09": "Eylül",
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık",
  };

  let bitiş = member.user.createdAt;
  let günü = moment(new Date(bitiş).toISOString()).format("DD");
  let ayı = moment(new Date(bitiş).toISOString())
    .format("MM")
    .replace("01", "Ocak")
    .replace("02", "Şubat")
    .replace("03", "Mart")
    .replace("04", "Nisan")
    .replace("05", "Mayıs")
    .replace("06", "Haziran")
    .replace("07", "Temmuz")
    .replace("08", "Ağustos")
    .replace("09", "Eylül")
    .replace("10", "Ekim")
    .replace("11", "Kasım")
    .replace("12", "Aralık");
  let yılı = moment(new Date(bitiş).toISOString()).format("YYYY");
  let saati = moment(new Date(bitiş).toISOString()).format("HH:mm");

  let günay = `${günü} ${ayı} ${yılı} ${saati}`;

  let süre = member.user.createdAt;
  let gün = moment(new Date(süre).toISOString()).format("DD");
  let hafta = moment(new Date(süre).toISOString()).format("WW");
  let ay = moment(new Date(süre).toISOString()).format("MM");
  let ayy = moment(new Date(süre).toISOString()).format("MM");
  let yıl = moment(new Date(süre).toISOString()).format("YYYY");
  let yıl2 = moment(new Date().toISOString()).format("YYYY");

  let netyıl = yıl2 - yıl;

  let created = ` ${netyıl} yıl  ${ay} ay ${hafta} hafta ${gün} gün önce`;

  let kontrol;
  if (süre < 2592000000)
    kontrol = "Bu hesap **Şüpheli!**  <a:uyar:993190429413625856> **Bu kullanıcının hesabı 30 günden daha eski..**";
  if (süre > 2592000000)
    kontrol = "Bu hesap **Güvenilir!**  <a:dogrulandi:977524260451024966> 30 Günden daha fazladır discord kullanıyor.";
const kontrolyanlış = süre > 2592000000
  let öhm = new Discord.MessageEmbed()
    .setColor("GOLD")
    .setTitle(`${member.user.username} Katıldı`)
    .setDescription(
      "<@" +
        member.id +
        "> Bilgileri <a:solok:998662861410803722> \n\n  __Hesap Oluşturulma Tarihi__ <a:solok:998662861410803722> \n\n**[" +
        created +
        "]** (`" +
        günay +
        "`) \n\n __Hesap durumu__ <a:solok:998662861410803722> \n\n**" +
        kontrol +
        "**"
    );
  client.channels.cache.get(kanal).send(öhm);
});

//Güvenlik Son


client.on("ready", () => {
  // Oynuyor Kısmı

  var fynexactvs = [
    `Fynex, Müzik`,
    `Fynex, Müzik`,
    `Fynex, Müzik`,
    `Fynex, Müzik`,
    `Fynex, Müzik`,
    `Herkesi`,
    `Herkesi`,
    `Herkesi`,
    `Herkesi`,
    `Herkesi`,
    `Herkesi`,
    `Herkesi`,
    `${client.guilds.cache.size} Sunucuyu ve ${client.users.cache.size} Kullanıcıyı`,

    `${client.guilds.cache.size} Sunucuyu ve ${client.users.cache.size} Kullanıcıyı`,
    
    `${client.guilds.cache.size} Sunucuyu ve ${client.users.cache.size} Kullanıcıyı`,

    `${client.guilds.cache.size} Sunucuyu ve ${client.users.cache.size} Kullanıcıyı`,

    `${client.guilds.cache.size} Sunucuyu ve ${client.users.cache.size} Kullanıcıyı`,

    `${client.guilds.cache.size} Sunucuyu ve ${client.users.cache.size} Kullanıcıyı`,

    `${client.guilds.cache.size} Sunucuyu ve ${client.users.cache.size} Kullanıcıyı`,

    "Kafasını",
    "Kafasını",
    "Kafasını",
    "Kafasını",
    "Kafasını",
    "Kafasını",
    "Kafasını",
  ];

  client.user.setActivity(
    fynexactvs[Math.floor(Math.random() * (fynexactvs.length - 1) + 1)],
    { type: "LISTENING" }
  );
  setInterval(() => {
    client.user.setActivity(
      fynexactvs[Math.floor(Math.random() * (fynexactvs.length - 1) + 1)],
      { type: "LISTENING" }
    );
  }, 15000);


});
//DDOS KORUMASI BAŞ
client.on("message", (msgfynex) => {
  if (client.ping > 550) {
    let bölgeler = [
      "singapore",
      "eu-central",
      "india",
      "us-central",
      "london",
      "eu-west",
      "amsterdam",
      "brazil",
      "us-west",
      "hongkong",
      "us-south",
      "southafrica",
      "us-east",
      "sydney",
      "frankfurt",
      "russia",
    ];
    let yenibölge = bölgeler[Math.floor(Math.random() * bölgeler.length)];
    let sChannel = msgfynex.guild.channels.find(
      (c) => c.name === "saldırı-koruma"
    );

    sChannel.send(
      `⚠UYARI⚠\n \n🔸 Sunucunun Pingi Yükseldiğinden Dolayı Bölge Değiştirildi!\n🔸 Yeni Bölge: ${yenibölge} ` +
        client.ping
    );
    msgfynex.guild
      .setRegion(yenibölge)
      .then((g) => console.log("🌍 Bölge:" + g.region))
      .then((g) =>
        msgfynex.channel.send(
          "✅ Bölge **" + g.region + " Olarak Değiştirildi! 🏡"
        )
      )
      .then(msgfynex.reply("✅ Bölge Değiştirildi! "))
      .catch(console.error);
  }
});

//DDOS KORUMASI SON
//OTOMATİK MESAJ BAŞ
client.on("message", async (msgfynex) => {
  let data = [
    "sa",
    "Sa",
    "sA",
    "SA",
    "sea",
    "Sea",
    "SEA",
    "Sa",
    "SA",
    "sa",
    "Sea",
    "sea",
    "SEA",
    ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("o neymiş, doğrusu: Selamün Aleyküm");
    
  }
});
client.on("message", async (msgfynex) => {
  let data = [
    "hg",
    "HG",
    "Hg",
    "hG"
    ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("o neymiş, doğrusu: Hoş geldin");
    
  }
});
client.on("message", async (msgfynex) => {
  let data = [
    "hb",
    "HB",
    "Hb",
    "hB"
    ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("o neymiş, doğrusu: Hoş bulduk");
    
  }
});
client.on("message", async (msgfynex) => {
  let data = [
    "As Hg"
    ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("o neymiş, doğrusu: Aleyküm selam Hoş geldin");
    
  }
});
client.on("message", async (msgfynex) => {
  let data = [
    "As hg"
    ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("o neymiş, doğrusu: Aleyküm selam hoş geldin");
    
  }
});
client.on("message", async (msgfynex) => {
  let data = [
    "as",
    "As",
    "aS",
    "AS",
    "ase",
    "Ase",
    "ASE",
    "as",
    "AS",
    "as",
    "Ase",
    "ase",
    "ASE",
    ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("o neymiş, doğrusu: Aleyküm Selam");
    
  }
});
//OTOMATİK SA-AS SİSTEMİ BAŞ
client.on("message", async (msgfynex) => {
  let data = [
    "selamın aleyküm",
    "Selamın Aleyküm",
    "SELAMIN ALEYKÜm",
    "selamun aleyküm",
    "Selamun Aleyküm",
    "SELAMUN ALEYKÜM",
    "Selamün aleyküm",
    "Selamün Aleyküm"
  ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("Aleyküm Selam");
  }
});

client.on("message", async (msgfynex) => {
  let data = ["Prefix", "Ön ek", "ön ek", "prefix"];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("**Prefiximi soruyorsun sanırım? f!**");
  }
});
//OTOMATİK SA-AS SİSTEMİ SON
//BOTA SESLENİNCE EFENDİM DEMESİ BAŞ
client.on("message", async (msgfynex) => {
  let data = [
    "Fynex",
    "fynex",
    "fynx",
    "fyne",
    "fyn",
  ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("he");
  }
});
client.on("message", async (msgfynex) => {
  let data = [
    "<@998687706655772775>",
  ];
  if (data.includes(msgfynex.content)) {
    const embed = new Discord.MessageEmbed()
    .setTitle("▬▬▬▬[ Yardım Mesajım ]▬▬▬▬")
    .setDescription(" ``f!yardım`` **Yazarak** ``Benim Tüm Komutlarımı Görebilirsin`` **ve**  **Aşşağıdaki** ``Destek Sunucusuna Gelerek Botun Sahibinden Yardım Alabilirsin.``\n➥ Link\n\n[[Destek Sunucumuz]](https://discord.com/invite/PqJtVqbNXN)")
    .setAuthor(msgfynex.author.username, msgfynex.author.avatarURL())
    .setFooter(msgfynex.author.username, msgfynex.author.avatarURL())
    .setThumbnail(msgfynex.author.avatarURL({ dynamic: true }))
    .setColor("GOLD");

    msgfynex.replyNoMention(embed).then((msg) => msg.delete({ timeout: 15000 }));
  }
});
//BOTA SESLENİNCE EFENDİM DEMESİ SON
client.on("message", async (msgfynex) => {
  let data = ["selam", "slm", "salam"];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("**Selam Kardeşim Hoş Geldin Sefa Getirdin!**");
  }
});

client.on("message", async (msgfynex) => {
  let data = [
    "gnydn",
    "günaydın",
    "Günaydın",
    "gunaydin",
    "gunaydın",
    "Gunaydın",
    "Gunaydin",
  ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("**Sanada Günaydın** 🌄🌅");
  }
});

client.on("message", async (msgfynex) => {
  let data = [
    "iyi geceler",
    "iyi akşamlar",
    "iyi gclr",
    "ii geceler",
    "iyi aksamlar",
    "Iyi Geceler",
    "İyi geceler",
    "İyi akşamlar",
  ];
  if (data.includes(msgfynex.content)) {
    msgfynex.replyNoMention("**Sanada İyi Geceler.** 🌙🌜");
  }
});

//KURUCU BAŞ

var $FYNEXMSG_MESSAGE = "<@520564502136356864>";
client.on("message", async (msgfynex) => {
    if (msgfynex.content.startsWith(`<@520564502136356864>`)) {
if(msgfynex.bot) {}
if(msgfynex.author.id === "520564502136356864") {}
if(msgfynex.author.id === "998687706655772775") {}
    msgfynex.replyNoMention("Başına Taha kadar daş düşsün")

  }
  }
          )
;
//KURUCU SON

client.on("message", async (msgfynex) => {
  let data = ["<@980074575138287636>"];
  if (data.includes(msgfynex.content)) {
    msgfynex.reply("**Efendim**");
  }
});



client.on("message", async (msgfynex) => {
  let data = ["Aga be", "aga be", "sad", "agab", "aga b", "Aga b"];
  if (data.includes(msgfynex.content)) {
    msgfynex.channel.send(" <a:yak:977523933354008577>");
  }
});
client.on("message", async (msgfynex) => {
  let data = ["o7", "O7"];
  if (data.includes(msgfynex.content)) {
    msgfynex.reply("o7");
  }
});

//OTOMATİK MESAJ SON
//EĞLENCE BAŞ
client.on("message", (msgfynex) => {
  if (msgfynex.channel.id === "1014125928244314122") {
    msgfynex.react("🟢");
  }
});
client.on("message", (msgfynex) => {
  if (msgfynex.channel.id === "1014125928244314122") {
    msgfynex.react("🔴");
  }
});
//EĞLENCE SON
//EĞLENCE KANALI VE GÜZEL RESİMLER KANALI BAŞ
client.on("message", (msgfynex) => {
  if (msgfynex.channel.id !== "1014125928244314122") {
    //ID Yazın
    return;
  }
  if (msgfynex.author.id === msgfynex.guild.ownerID && client.user.id) return;
  if (msgfynex.attachments.size < 1) {
    msgfynex.delete();
  }
});

//EĞLENCE KANALI VE GÜZEL RESİMLER KANALI SON
//BOTU SESLİDE TUTMA BAŞ
client.on("ready", () => {
  client.channels.cache.get("1005718686394482698").join();
});

client.on("ready", () => {
  client.channels.cache.get("1014946583550361700").startTyping();
});
client.on("ready", () => {
  client.channels.cache.get("971789929040449596").startTyping();
});
client.on("ready", () => {
  client.channels.cache.get("1016655894559326281").join();
});
client.on("ready", () => {
  client.channels.cache.get("1014946586343768244").join();
});

//951189106543702106
//BOTU SESLİDE TUTMA SON





client.on("guildMemberBoost", (member) => {
  let kanal = client.channels.cache.get("997479618556739667");
  kanal.send(`${member.user.tag} Adlı kullanıcı sunucumuza boost bastı!`);
  member.send(
    `${member.guild.name} Adlı sunucumuza Boost Bastığın için teşekkürler`
  );
});

client.on("guildMemberAdd", async (member) => {
  if (db.has(`${member.guild.id}_otorol`)) {
    var rolID = db.fetch(`${member.guild.id}_otorol`);
    member.addRole(rolID);
  } else {
    return;
  }
  if (db.has(`${member.guild.id}_otokanal`)) {
    var kanal = client.channels.get(db.fetch(`${member.guild.id}_otokanal`));
    const embed = new Discord.RichEmbed()
      .setDescription(
        `Yeni katılan ${member} kullanıcısına <@&${rolID}> rolü verildi`
      )
      .setTimestamp();
    kanal.send(embed);
  } else {
    return;
  }
});
// channel.send(msg.content);
//980190314503487488
//ÖNERİ BAŞ
var $FYNEXMSG_CHANNEL_ID = "1005718689598939246";
var $LOG_CHANNEL_ID = "1012449821841440838";
//a
// Zaman
var zaman = new Date();
var fynexzaman =
  zaman.getDate() +
  "." +
  (zaman.getMonth() + 1) +
  "." +
  zaman.getFullYear();

client.on("message", (msgfynex) => {
  if (
    msgfynex.channel.id == $FYNEXMSG_CHANNEL_ID &&
    msgfynex.content.length > 0
  ) {
    const kanal = client.channels.cache.get($LOG_CHANNEL_ID);
        const kanal1 = client.channels.cache.get($FYNEXMSG_CHANNEL_ID);
    msgfynex.react("<a:dogrulandi:977524260451024966>");
    msgfynex.react("<a:x2:997480666470039652>");
    kanal.send(
      new Discord.MessageEmbed()
        .setFooter(fynexzaman)
      .setAuthor(msgfynex.author.username, msgfynex.author.avatarURL())
        .setThumbnail(msgfynex.author.avatarURL({ dynamic: true, size: 2048 }))
        .setTimestamp()
        .setColor("RANDOM")
        .setDescription(
          `<@${msgfynex.author.id}> tarafından bir öneri gönderildi!  \`\`\`Önerisi: ${msgfynex.content} \`\`\`
           `
        )
    );
    msgfynex.delete();
  }
});

client.on("message", (msgfynex) => {
  if (
    msgfynex.channel.id == $FYNEXMSG_CHANNEL_ID &&
    msgfynex.content.length > 0
  ) {
    const channel = client.channels.cache.get($FYNEXMSG_CHANNEL_ID);

    const fynex = new Discord.MessageEmbed()
      .setFooter(
        `${msgfynex.author.username}, Bu öneriniz kayıt altına alınmıştır. Eğer gereksiz yere yaptıysanız cezalanacaksınızdır.`
      )
      .setThumbnail(msgfynex.author.avatarURL({ dynamic: true }))
      .setColor("#5edb80")
      .setDescription(
        `<@${msgfynex.author.id}>, ${msgfynex.content} Adlı Öneriniz başarı ile iletildi öneriniz için teşekkürler.`
      );
    msgfynex.author.send(fynex)
  }
});

//ÖNERİ SON
var $FYNEXMSG_CHANNEL_IDSS = "1014932536218103848";
var $LOG_CHANNEL_IDSS = "1012449821841440838";
//a
// Zaman
var zaman = new Date();
var fynexzaman =
  zaman.getDate() +
  "." +
  (zaman.getMonth() + 1) +
  "." +
  zaman.getFullYear();

client.on("message", (msgfynex) => {
  if (msgfynex.channel.id == $FYNEXMSG_CHANNEL_IDSS) {
    var attachments = msgfynex.attachments.array();
    if (attachments.length > 0) 

    msgfynex.channel.id == $FYNEXMSG_CHANNEL_IDSS &&
    msgfynex.content.length > 0
 {
    const kanal = client.channels.cache.get($LOG_CHANNEL_IDSS);
        const kanal1 = client.channels.cache.get($FYNEXMSG_CHANNEL_IDSS);

    let a =  new Discord.MessageEmbed()
        .setFooter(fynexzaman)
      .setAuthor(msgfynex.author.username, msgfynex.author.avatarURL())
        .setThumbnail(msgfynex.author.avatarURL({ dynamic: true, size: 2048 }))
        .setTimestamp()
        .setColor("RANDOM")
        .setDescription(
          `<@${msgfynex.author.id}> tarafından bir şikayet gönderildi!  \`\`\`Şikayeti: ${msgfynex.content} \`\`\`
           `
        )
       kanal.send(a); 
    msgfynex.delete();
  }
    }}
);

client.on("message", (msgfynex) => {
  if (
    msgfynex.channel.id == $FYNEXMSG_CHANNEL_IDSS &&
    msgfynex.content.length > 0
  ) {
    const channel = client.channels.cache.get($FYNEXMSG_CHANNEL_IDSS);

    const fynex = new Discord.MessageEmbed()
      .setFooter(
        `${msgfynex.author.username}, Bu şikayetiniz kayıt altına alınmıştır. Eğer gereksiz yere yaptıysanız cezalanacaksınızdır.`
      )
      .setThumbnail(msgfynex.author.avatarURL({ dynamic: true }))
      .setColor("#5edb80")
      .setDescription(
        `<@${msgfynex.author.id}>, ${msgfynex.content} Adlı Şikayetiniz başarı ile iletildi şikayetiniz için teşekkürler.`
      );
    msgfynex.author.send(fynex)
  }
});




//YARDIM BAŞ
//  .setDescription(`<t:-myEpoch2:D>`)
  var myDate = new Date("19 July, 2022 00:00:00");
  var myEpoch = myDate.getTime()/1000.0;
  const myEpoch2 = myEpoch
  
function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return {
        d: d
        , h: h
        , m: m
        , s: s
    };
};
   let u = convertMS(bot.uptime);
    let uptime = u.d + " Gün " + u.h + " Saat " + u.m + " Dakika " + u.s + " Saniye"
const disbut = require('discord-buttons');
let button2 = new disbut.MessageButton()
    .setStyle("url")
    .setURL("https://discord.com/oauth2/authorize?client_id=998687706655772775&scope=bot&permissions=8")
    .setLabel("Beni davet et!")
    .setEmoji("1011577958449811476");

client.on("message", async (message) => {
  
  let button3 = new disbut.MessageButton()
    .setStyle("url")
    .setURL("https://discord.gg/GhXrSFT85b")
    .setLabel("Destek Sunucusu")
    .setEmoji("1012368028366811146");
  if (message.content === "f!yardım" || message.content === "f!yardim" || message.content === "f!komutlar" || message.content === "f!help") {
                      let karaliste = db.fetch(`ckaraliste.${message.author.id}`)
                    
       const disbut222 = require('discord-buttons')
       if(karaliste) {
  let button3 = new disbut222.MessageButton()
    .setStyle("url")
    .setURL("https://discord.gg/GhXrSFT85b")
    .setLabel("Destek Sunucusu")
    .setEmoji("1012368028366811146");
  message.react("<:carpi2:1014253669979525152>")
                    
     
 const fyneximbne = new Discord.MessageEmbed()
 .setColor("GREEN")
 .setDescription(`**${karaliste}** sebebiyle **kara listeye** eklenmişsiniz **Fynex**'in komutlarını kullanamazsınız.'`);
  
  
    
    return message.channel.send(fyneximbne).then((msg) => msg.delete({ timeout: 5000 })); }
   if (!message.guild) {
      let button32 = new disbut222.MessageButton()
    .setStyle("url")
    .setURL("https://discord.gg/GhXrSFT85b")
    .setLabel("Destek Sunucusu")
    .setEmoji("1012368028366811146");
  const ozelmesajuyari = new Discord.MessageEmbed()
.setColor("GREEN")
  .setDescription("Bu komutu sâdece sunucularda kullanabilirsiniz.")
  return message.author.send(ozelmesajuyari, button32); }
    if (message.author.bot) return;
    let secenek1 = new MessageMenuOption()
      .setLabel("Moderator (18)")
      .setValue("MODERATOR")
      .setDefault()
      .setEmoji("📗");
    let secenek2 = new MessageMenuOption()
      .setLabel("Extra (17)")
      .setValue("EXTRA")
      .setDefault()
      .setEmoji("📕");
    let secenek3 = new MessageMenuOption()
      .setLabel("Eğlence (7)")
      .setValue("EĞLENCE")
      .setDefault()
      .setEmoji("📙");
    let secenek4 = new MessageMenuOption()
      .setLabel("Kayıt (13)")
      .setValue("KAYIT")
      .setDefault()
      .setEmoji("1012459564806979604");
   
    let menu = new MessageMenu()
      .setID("MENU")
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder("Lütfen bir kategori seçiniz.")
      .addOption(secenek1)
      .addOption(secenek2)
      .addOption(secenek3)
      .addOption(secenek4);
const toplamss = client.commands.size-7
    const embed = new MessageEmbed()
      .setAuthor("Fynex Komutlar", client.user.avatarURL())
      .setDescription(
        `<:rengarenk:1012351292171104378> **f!komutlar (${toplamss})**\n\n :green_book: **f!mod (18)**\n :closed_book: **f!extra (17)**\n:orange_book: **f!eğlence (7)**\n\n\n <:istatistik:1014999414756089856> **f!istatistik**\n <:list:1012459564806979604> **f!kayıt sistemi**`
      )

    .setColor("#CBB6F0")
 .setFooter(`Sorgulayan: ${message.author.tag}`, message.author.avatarURL())
 .setThumbnail(message.author.avatarURL({ dynamic: true }));
    

    

    let menumesaj = await message.channel.send(embed, menu, {buttons: [
    new disbut.MessageButton()
    .setStyle("url")
    .setURL("https://discord.gg/GhXrSFT85b")
    .setLabel("Destek Sunucusu")
    .setEmoji("1012368028366811146"), 
    new disbut.MessageButton()
    .setStyle("url")
    .setURL("https://discord.com/oauth2/authorize?client_id=998687706655772775&scope=bot&permissions=8")
    .setLabel("Beni davet et!")
    .setEmoji("1011577958449811476")]})
  
    function menuselection(menu) {
      switch (menu.values[0]) {
        case "EĞLENCE":

   


          const eğlence = new Discord.MessageEmbed()
          .setDescription(`:orange_book:\`f!yazan-kazanır <@Üye>\`:** Etiketlenen kişi ile rastgele olarak verilen kelimeyi ilk yazan kazanır.**\n:orange_book:\`f!tkm\`:** Taş Kağıt Makas oynarsınız.**\n:orange_book:\`f!imp <Metin>\`:** Yazdığınız mesajı impostor olarak gösterir.**\n:orange_book:\`f!xox <@Üye>\`:** Etiketlediğiniz kişi ile XoX oynarsınız.**\n:orange_book:\`f!mayın-tarlası <Satır> <Sutün> <Mayın>\`:** Belirttiğiniz satır ve sutün ile mayın tarlası oynarsınız.**\n:orange_book:\`f!düello <@Üye>\`:** Belirttiğiniz kişi ile savaşırsınız.**\n:orange_book:\`f!konuştur <@Üye> <Metin>\`:** İstenen üyeye mesaj yazdırır.**`)
          .setAuthor("Fynex Bot Eğlence Komutları (7)", message.guild.iconURL())
          .setColor("GOLD")
menu.reply.send(eğlence, true);
          
          break;
                  case "MODERATOR":

   


          const MODERATOR = new Discord.MessageEmbed()
          .setDescription(`📗\`f!küfür engel aç\`:** Küfür engel sistemini açar.**\n📗\`f!küfür engel kapat\`:**Küfür engel sistemini kapatır.**\n📗\`f!küfür log <#Kanal>\`:** Edilen küfürlerin gönderileceği kanalı belirler.**\n📗\`f!link engel aç\`:** Link engel sistemini açar.**\n📗\`f!link engel kapat\`:**Link engel sistemini kapatır.**\n📗\`f!link log <#Kanal>\`:**Atılan linklerin gönderileceği kanalı belirler.**\n📗\`f!duyur <Metin>\`:** Belirttiğiniz yazıyı WebHook halinde yazar.**\n📗\`f!sil <Sayı>\`:**Belirttiğiniz sayı kanal mesajı siler.**\n📗\`f!afk-tag <Metin>\`:** Afk olunca isminizin soluna gelecek tagı belirler.**\n📗\`f!afk-tag-sıfırla\`:** Afk olunca isminizin soluna gelecek tagı sıfırlar.**\n📗\`f!ban <@Üye> <Sebep>\`:** Bir kullanıcıyı yasaklarsınız.**\n📗\`f!ban-affı\`:** Sunucudaki bütün yasaklanan kullanıcılarının yasaklarını kaldırırsınız.**\n📗\`f!butonrol ekle <@&Rol> <Buton Yazısı>\`:** Butona tıkladığınızda belirttiğiniz rolü kullanıcıya verir.**\n📗\`f!yavaş-mod <Sayı>\`:** Belirttiğiniz sayıyı komutu kullandığınız kanala yavaşmod uygular.**\n📗\`f!yaz <Yazı>\`:** Bota mesaj yazdırır.**\n📗\`f!oylama-kanal <#Kanal>\`:** Belirttiğiniz kanalı oylama kanalı olur.**\n📗\`f!otorol <@&Rol>\`:**Sunucuya giren kişilere otomatik olarak rol verir.**\n📗\`f!log <#Kanal>\`:**Belirttiğiniz kanalı log kanalı yaparsınız.**\n\`f!unban <ID>\`:**Girdiğiniz IDnin banını kaldırır.**`)
          .setAuthor("Fynex Bot Moderatör Komutları (18)", message.guild.iconURL())
          .setColor("GREEN")
menu.reply.send(MODERATOR, true);
          
          break;
      }
    }
    client.on("clickMenu", (menu) => {
      if (menu.message.id == menumesaj.id) {
        if (menu.clicker.id == message.author.id) {
          menuselection(menu);
        } else {
          const menusenindegil = new Discord.MessageEmbed()
          .setDescription(`**Bu menüyü sâdece sahibi (<@${message.author.id}>) Kullanabilir **.`)
          .setFooter("f!yardım kullanarak kendi menünü açabilirsin")
          .setColor("GREEN")
          .setTimestamp()
          menu.reply.send(menusenindegil, true);
        }
      }
    });
  }
});

//YARDIM SON
//REKLAM ENGEL BAŞ
client.on("message", async (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  let i = await db.fetch(`reklamFiltre_${msg.guild.id}`);
  if (i == "acik") {
    const reklam = [
      "discord.app",
      "discord.gg",
      "invite",
      "discordapp",
      "discordgg",
      ".com",
      ".net",
      ".xyz",
      ".tk",
      ".pw",
      ".io",
      ".me",
      ".gg",
      "www.",
      "https",
      "http",
      ".gl",
      ".org",
      ".com.tr",
      ".biz",
      ".party",
      ".rf.gd",
      ".az",
      ".gov",
      ".discord",
      ".ga",
      ".sg",
      ".amk",
      ".fuck",
      ".com.en"
    ];
    if (reklam.some((word) => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          msg.delete();
          let embed = new Discord.RichEmbed()
            .setColor(0xffa300)
            .setFooter(
              "Fynex BOT  -|-  Reklam engellendi.",
              client.user.avatarURL
            )
            .setAuthor(
              msg.guild.owner.user.username,
              msg.guild.owner.user.avatarURL
            )
            .setDescription(
              "Fynex BOT Reklam sistemi, " +
                `***${msg.guild.name}***` +
                " adlı sunucunuzda reklam yakaladım."
            )
            .addField(
              "Reklamı yapan kişi",
              "Kullanıcı: " + msg.author.tag + "\nID: " + msg.author.id,
              true
            )
            .addField("Engellenen mesaj", msg.content, true)
            .setTimestamp();
          msg.guild.owner.user.send(embed);
          return msg.channel
            .send(`${msg.author.tag}, Reklam Yapmak Yasak  Dostum!`)
            .then((msg) => msg.delete(25000));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});
//REKLAM ENGEL SON
client.on('ready', () => {
  client.channels.cache.get('1005723344043249704').startTyping();
})
client.on('ready', () => {
  client.channels.cache.get('995669877631238186').startTyping();
})

{
const cdb = require("orio.db")
client.on("clickButton", async button => {

let data = cdb.get(`buttonvar_${button.guild.id}_${button.id}`)
if(!data) return;

let emote = {
başarılı: "✅"
}

let member = button.guild.members.cache.get(button.clicker.user.id)

button.reply.think(true).then(async a => {

if(member.roles.cache.has(data.rol)) {
 const embed = new Discord.MessageEmbed()
.setDescription(` ${emote.başarılı} **Butona tıkladığın için başarıyla <@&${data.rol}> rolünü senden aldım!**`)
.setColor(0x36393f)
a.edit(embed)
member.roles.remove(data.rol)

} else {
const embed = new Discord.MessageEmbed()
.setDescription(` ${emote.başarılı} **Butona tıkladığın için başarıyla <@&${data.rol}> rolünü sana verdim!**`)
.setColor(0x36393f)
a.edit(embed)
member.roles.add(data.rol)

} //0x36393f

})

})
}




/ AYARLANABİLİR KAYIT KANAL //
client.on("guildMemberAdd", function(member) {
    const mesajlar = ["Umarım Pizza Getirmişsindir!", "Sunucuya Kayarak Girdi!", "Umarım Burada Olduğun İçin Sevinçlisindir!", "İniş Yaptı!", "Çıkageldi!", "Geldiğine çok sevindik."]
       const rastgele = mesajlar[Math.floor(Math.random() * mesajlar.length)];
  let guild = member.guild;
  let kanal = db.fetch(`kanal_${member.guild.id}`);
  let kayıtçı = db.fetch(`kayıtçırol_${member.guild.id}`);
  let aylar = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs",
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",
    "09": "Eylül",
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık",
  };

  let bitiş = member.user.createdAt;
  let günü = moment(new Date(bitiş).toISOString()).format("DD");
  let ayı = moment(new Date(bitiş).toISOString())
    .format("MM")
    .replace("01", "Ocak")
    .replace("02", "Şubat")
    .replace("03", "Mart")
    .replace("04", "Nisan")
    .replace("05", "Mayıs")
    .replace("06", "Haziran")
    .replace("07", "Temmuz")
    .replace("08", "Ağustos")
    .replace("09", "Eylül")
    .replace("10", "Ekim")
    .replace("11", "Kasım")
    .replace("12", "Aralık");
  let yılı = moment(new Date(bitiş).toISOString()).format("YYYY");
  let saati = moment(new Date(bitiş).toISOString()).format("HH:mm");

  let günay = `${günü} ${ayı} ${yılı} ${saati}`;

  let süre = member.user.createdAt;
  let gün = moment(new Date(süre).toISOString()).format("DD");
  let hafta = moment(new Date(süre).toISOString()).format("WW");
  let ay = moment(new Date(süre).toISOString()).format("MM");
  let ayy = moment(new Date(süre).toISOString()).format("MM");
  let yıl = moment(new Date(süre).toISOString()).format("YYYY");
  let yıl2 = moment(new Date().toISOString()).format("YYYY");

  let netyıl = yıl2 - yıl;

  let created = ` ${netyıl} yıl  ${ay} ay ${hafta} hafta ${gün} gün önce`;

  let kontrol;
  if (süre < 2592000000)
    kontrol = ` <a:uyar:993190429413625856> \`Güvenilir Değil!\``;
  if (süre > 2592000000)
    kontrol = `<a:blacktik:1001825140801294347> \`Güvenilir!\``;
const kontrolyanlış = süre > 2592000000
  let user = client.users.cache.get(member.id);


  if (!kanal) return;

  //////////////////////
  ///////////////////
  const embed = new Discord.MessageEmbed()
    .setColor(`${process.env.embedcolor}`)
    .setThumbnail(
      user.avatarURL({
        dynamic: true,
        format: "gif",
        format: "png",
        format: "jpg",
        size: 2048
      })
    )

 //
  .setTitle(`Yeni Bir Kullanıcı Katıldı, 👋 ${member.user.username}`)
  .setDescription(` <a:hosgelinizz:1011612408193753158> Sunucumuza hoş geldin ${member.user}\n\n<a:yildizimsibiseler:1011612372613476352> Seninle birlikte ${guild.memberCount} kişiyiz.\n\n  <a:yukleniyor:993190450133479424> Kayıt olmak için yetkilileri beklemen yeterlidir. \n\n > <a:yildiz:1011279588371992686> Hesap oluşturulma tarihi:  \`${moment(
        user.createdAt
      ).format("DD")} ${aylar[moment(user.createdAt).format("MM")]} ${moment(
        user.createdAt
      ).format(
        "YYYY HH:mm:ss"
       )}\` \n > <a:sinsi:1011612440577986600> Güvenilirlik Durumu : ${kontrol} `)
  .setFooter(`Fynex`, client.user.avatarURL())
  //
  client.channels.cache.get(kanal).send(`> <@&${kayıtçı}>, ${member} ${rastgele}`);
  client.channels.cache.get(kanal).send(embed);
  
});
  
//kayıt kanal son //










//ENV TOKEN EN SON
client.login(process.env.TOKEN);
//ENV TOKEN EN SON


client.on('ready', () => {
  client.channels.cache.get('995669877631238186').startTyping();
})
client.on('ready', () => {
  client.channels.cache.get('1005723344043249704').startTyping();
})







client.on('message', msg => {
  if (msg.content === 'f!deneme' ) {
msg.replyNoMention(`> <@${msg.author.id}>, **Neyi deniyorsun dostum?**`)
  }
});


 
//EKLENDİM ATILDIM BAŞ
     client.on("guildCreate", guild => {
  let fynex_kanal = client.channels.cache.get("1007578058393387069")
guild.channels
    .cache.filter(fynx => fynx.type === "text")
    .random()
    .createInvite()
    .then(async invite => {
      const fynex = new Discord.MessageEmbed()
        .setTitle("SUNUCUYA EKLENDİM")
        .setColor("GREEN")
        .addField("▪ Sunucu İsmi", `\`${guild.name}\``)
        .addField("▪ Üye Sayısı", `\`${guild.members.cache.size}\``)
        .addField("▪ Kurucu", `\`${guild.owner.user.tag}\``)
      .addField("▪ ID", `\`${guild.guild.id}\``)
        .addField("Davet", `https://discord.gg/${invite.code}`);
      fynex_kanal.send(fynex);
    });
});
client.on("guildCreate", guild => {
  if(guild.guild.id === "1014498829028044853") return guild.leave()
  guild.author.send("Beni bu sunucuya ekleyemezsin.")
})

client.on("guildDelete", guild => {
  let fynex_kanal = client.channels.cache.get("1007578058393387069")

 const fynex = new Discord.MessageEmbed()
.setTitle("SUNUCUDAN AYRILDIM")
.setColor("RED")
.addField('▪ Sunucu İsmi', `\`${guild.name}\``)
.addField('▪ Üye Sayısı', `\`${guild.members.cache.size}\``)
.addField('▪ Kurucu', `\`${guild.owner.user.tag}\``)
fynex_kanal.send(fynex)
});     
//EKLENDİM ATILDIM SON











  
client.on("message", async (message) => {
  if (message.content.startsWith("rr:")) {
      let log = message.guild.channels.cache.get(
    await db.fetch(`log_${message.guild.id}`)
  );
      const entry = await message.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());
  if (!log) return;

    const disbut = require('discord-buttons')
        let button = new disbut.MessageButton()
    .setStyle("url")
    .setURL("https://discord.gg/GhXrSFT85b")
    .setLabel("Destek Sunucumuz")
    .setEmoji("🥂");
      if (!message.guild) {
  const ozelmesajuyari = new Discord.MessageEmbed()
  .setColor(0x36393f)
  .setTimestamp()
  .setAuthor(message.author.username, message.author.avatarURL)
  .addField('Uyarı', 'Bu  komutu özel mesajlarda kullanamazsın.');
  return message.author.send(ozelmesajuyari, button); }
    if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`**Bu komutu kullanmak için yeterli yetkiye sahip değilsin!** <@${message.author.id}>`);
        const deneme = message.author.send(`**${message.channel.name} adlı kanal başarıyla kapatıldı.**`) 
    message.channel.delete()
  message.author.send(deneme)
    const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} Adlı kişi rr: kullandı`, message.author.avatarURL())
.setDescription(`**Sildiği kanal:** \`\`\`${message.channel.name}\`\`\` `)
  .setThumbnail(message.author.avatarURL())
   .setColor("GREEN")
  .setFooter(`Kanalı Silen: ${entry.executor.tag} | Kanal: ${message.channel.name}`, message.author.avatarURL())
    log.send(embed)
}})

client.on("message", async (message, channel) => {
  if (message.content.startsWith("sıfırla:")) {
    const disbut = require('discord-buttons')
        let button = new disbut.MessageButton()
    .setStyle("url")
    .setURL("https://discord.gg/GhXrSFT85b")
    .setLabel("Destek Sunucumuz")
    .setEmoji("🥂");
          let log = message.guild.channels.cache.get(
    await db.fetch(`log_${message.guild.id}`)
  );
      const entry = await message.guild
    .fetchAuditLogs({ type: "CHANNEL_CREATE" })
    .then(audit => audit.entries.first());
  if (!log) return;

      if (!message.guild) {
  const ozelmesajuyari = new Discord.MessageEmbed()
  .setColor(0x36393f)
  .setTimestamp()
  .setAuthor(message.author.username, message.author.avatarURL)
  .addField('Uyarı', 'Bu  komutu özel mesajlarda kullanamazsın.');
  return message.author.send(ozelmesajuyari, button); }
    if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`**Bu komutu kullanmak için yeterli yetkiye sahip deği
lsin!** <@${message.author.id}>`);
    let kanal = message.channel.clone({position: message.channel.position}, { timeout: 5000});
        const deneme = message.author.send(`**${message.channel.name} adlı kanal başarıyla Sıfırlandı.**`) 
    message.channel.delete()
  message.author.send(deneme)
        const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} Adlı kişi sıfırla: kullandı`, message.author.avatarURL())
.setDescription(`**Sıfırladığı kanal:** \`\`\`${message.channel.name}\`\`\`  `)
  .setThumbnail(message.author.avatarURL())
   .setColor("GREEN")
  .setFooter(`Kanalı sıfırlayan: ${entry.executor.tag} | Kanal: #${message.channel.name}`, message.author.avatarURL())
    log.send(embed)
}});






















client.on('guildMemberAdd', member => {

  const charArray = genCharArray();
  
    const nickArray = [];
    member.displayName.split('İsmimizi değiştiriniz.').forEach(ch => {
      if(charArray.includes(ch)) return nickArray.push(ch);
    });
    var clearedNick = nickArray.join('İsmimizi değiştiriniz.').replace(/\s+/g, ' ').trim();

    try {
      member.setNickname(clearedNick);
    } catch(error) {
    };

  function genCharArray() {
      var a = ['ç', 'ğ', 'ş', 'İ', 'ı', 'ü', 'q', '!', 'ö', '?', '.', ' '], i = 'a'.charCodeAt(0), j = 'z'.charCodeAt(0);
      for (; i <= j; ++i) {
          a.push(String.fromCharCode(i));
      };
      return a;
  };

});







client.on("guildCreate", guild => {
    let channelID;
    let channels = guild.channels.cache;

    channelLoop:
    for (let key in channels) {
        let c = channels[key];
        if (c[1].type === "text") {

        }
    }

    let channel = guild.channels.cache.get(guild.systemChannelID || channelID);
const disbut = require('discord-buttons')
        let button = new disbut.MessageButton()
    .setStyle("url")
    .setURL("https://discord.gg/GhXrSFT85b")
    .setLabel("Destek Sunucumuz")
    .setEmoji("🥂");

    const embed = new Discord.MessageEmbed()
    .setDescription(`**Beni eklediğiniz için teşekkür ederim ❤**\n\nBeni sunucunuza eklediğiniz için teşekkür ederiz sizin sayenizde  ${guild.members.cache.size} Kişiye daha hizmet verebileceğiz.`)
    .setColor(0x36393f)
    channel.send(embed, button);
});



client.on("message", async (msgfynex) => {
  const button = require('discord-buttons')
          let buttons = new button.MessageButton()
    .setStyle("url")
    .setURL(`https://discordapp.com/users/${msgfynex.author.id}`)
    .setLabel("Etiketleyen kişi")
    .setEmoji("🥂");
  let data = [`<@${msgfynex.author.id}>`];
  if (data.includes()) {
    const embed = new Discord.MessageEmbed()
    .setTitle("▬▬▬▬[ Etiket ]▬▬▬▬")
    .setDescription(`[[${msgfynex.author}]](https://discordapp.com/users/${msgfynex.author.id}) Adlı kişi seni etiketledi Mesaj içeriğinin tamamı : ${msgfynex.content}`)
    .setAuthor(msgfynex.author.username, msgfynex.author.avatarURL())
    .setFooter(msgfynex.author.username, msgfynex.author.avatarURL())
    .setThumbnail(msgfynex.author.avatarURL({ dynamic: true }))
    .setColor("GOLD");

    msgfynex.author.send(embed, buttons)
  }
});


















{
const cdb = require("orio.db")
client.on("clickButton", async button => {

let data = cdb.get(`buttonvar2_${button.guild.id}_${button.id}`)
if(!data) return;

let emote = {
başarılı: "✅"
}

let member = button.guild.members.cache.get(button.clicker.user.id)

button.reply.think(true).then(async a => {

if(member.roles.cache.has(data.rol)) {
 const embed = new Discord.MessageEmbed()
 .setDescription(` ${emote.başarılı} **Butona tıkladığın için başarıyla <@&${data.rol}> rolünü senden aldım!**`)
.setColor(0x36393f)
a.edit(embed)
member.roles.remove(data.rol)

} else {
 const embed = new Discord.MessageEmbed()
  .setDescription(` ${emote.başarılı} **Butona tıkladığın için başarıyla <@&${data.rol}> rolünü sana verdim!**`)
.setColor(0x36393f)
a.edit(embed)
member.roles.add(data.rol)

} 

})

})
}


{
const cdb = require("croxydb")
client.on("clickButton", async button => {

let data = cdb.get(`buttonvar3_${button.guild.id}_${button.id}`)
if(!data) return;

let emote = {
başarılı: "✅"
}

let member = button.guild.members.cache.get(button.clicker.user.id)

button.reply.think(true).then(async a => {

if(member.roles.cache.has(data.rol)) {
  const embed = new Discord.MessageEmbed()
  .setDescription(` ${emote.başarılı} **Butona tıkladığın için başarıyla <@&${data.rol}> rolünü senden aldım!**`)
.setColor(0x36393f)
a.edit(embed)
member.roles.remove(data.rol)

} else {
 const embed = new Discord.MessageEmbed()
  .setDescription(`> ${emote.başarılı} **Butona tıkladığın için başarıyla <@&${data.rol}> rolünü sana verdim!**`)
.setColor(0x36393f)
a.edit(embed)
member.roles.add(data.rol)

} 

})

})
}











client.on('guildMemberAdd', member => {
  let sistem = db.fetch(`otorol_${member.guild.id}`)

  // Eğer Sistem Açıksa Kod Döndürelim CodeMareFi 
  if(sistem === 'acik'){
    // Data Veri Çekme İşlemi
    let rol = db.fetch(`orol_${member.guild.id}`)

    // Rol Verme CodeMareFi 
    member.roles.add(rol)

    // Mesaj CodeMareFi 
  } else if(sistem != "acik") {
    // Eğer Sistem Kapalıysa... CodeMareFi 
    return;
  }
})

{
const cdb = require("orio.db")
client.on("clickButton", async button => {

let data = cdb.get(`buttonvar6_${button.guild.id}_${button.id}`)
if(!data) return;
    let rol = db.fetch(`orol_${button.guild.id}`)


let emote = {
başarılı: "✅"
}

let member = button.guild.members.cache.get(button.clicker.user.id)

button.reply.think(true).then(async a => {

if(member.roles.cache.has(data.rol)) {
  const embed = new Discord.MessageEmbed()
  .setDescription(`Başarıyla kayıt oldunuz.`)
.setColor(`GREEN`)
a.edit(embed)
member.roles.remove(data.rol)
member.roles.add(rol)
} else {
 const embed = new Discord.MessageEmbed()
  .setDescription(`Başarıyla kayıt oldunuz.`)
.setColor(`GREEN`)
a.edit(embed)
member.roles.add(data.rol)
member.roles.remove(rol)
client.channels.cache.get("1017850291024056451").send(`${member} Kayıt oldu. (sunucuya girenleri görebilmek için yapılmış bir mesajdır.)`)
} 

})

})
}

//1012074071099457656
var mesajkanalı = "1012074071099457656";
let logkanalı = "1012073993743896596";

// Zaman
var zaman = new Date();
var fynexzaman =
  zaman.getDate() +
  "." +
  (zaman.getMonth() + 1) +
  "." +
  zaman.getFullYear();

client.on("message", (msgfynex) => {
  if (
    msgfynex.channel.id == mesajkanalı &&
    msgfynex.content.length > 0
  ) {
  
    msgfynex.react("<a:dogrulandi:977524260451024966>");
    msgfynex.react("<a:x2:997480666470039652>");
    client.channels.cache.get(logkanalı).send(
      new Discord.MessageEmbed()
        .setFooter(fynexzaman)
      .setAuthor(msgfynex.author.username, msgfynex.author.avatarURL())
        .setThumbnail(msgfynex.author.avatarURL({ dynamic: true, size: 2048 }))
        .setTimestamp()
        .setColor("RANDOM")
        .setDescription(
          `<@${msgfynex.author.id}> tarafından bir öneri gönderildi!  \`\`\`Önerisi: ${msgfynex.content} \`\`\`
           `
        )
    );
    msgfynex.delete();
  }
});

client.on("message", (msgfynex) => {
  if (
    msgfynex.channel.id == mesajkanalı &&
    msgfynex.content.length > 0
  ) {
    const channel = client.channels.cache.get(mesajkanalı);

    const fynex = new Discord.MessageEmbed()
      .setFooter(
        `${msgfynex.author.username}, Bu öneriniz kayıt altına alınmıştır. Eğer gereksiz yere yaptıysanız cezalanacaksınızdır.`
      )
      .setThumbnail(msgfynex.author.avatarURL({ dynamic: true }))
      .setColor("#5edb80")
      .setDescription(
        `<@${msgfynex.author.id}>, ${msgfynex.content} Adlı Öneriniz başarı ile iletildi öneriniz için teşekkürler.`
      );
    msgfynex.author.send(fynex)
  }
});



client.on('guildMemberAdd', member => {
  let sistem = db.fetch(`otorol2_${member.guild.id}`)

  if(sistem === 'acik'){
    let rol = db.fetch(`orol2_${member.guild.id}`)

    member.roles.add(rol)

  } else if(sistem != "acik") {
    return;
  }
})
client.on("message", async (message) => {
  if(!message.guild) {
    
    
    if(message.content.length > 0) {
      const kanal = client.channels.cache.get("1017499456377204736");
const embed = new Discord.MessageEmbed()
.setAuthor(`Bir kullanıcı özel mesaj gönderdi!`, client.user.avatarURL())
.setDescription(`**Mesaj içeriği :** \n\`\`\`${message.content}\`\`\` \n **Kullanıcı :** \n \`\`\`${message.author.tag}\`\`\` \n **ID :** \n \`\`\`${message.author.id}\`\`\` `)
.setColor(`GREEN`)
      kanal.send(embed)
    }
  
  }
})







client.on("message", (message) => {
  let kanal = db.fetch(`galerikanalı.${message.guild.id}`)
  if (message.channel.id !== kanal) {
    //ID Yazın
    return;
  }
  if (message.author.id === message.guild.ownerID && client.user.id) return;
  if (message.attachments.size < 1) {
    message.delete();
    message.author.send(`Galeri kanalına sadece fotoğraf ve video paylaşabilirsin!`)
  }
});
