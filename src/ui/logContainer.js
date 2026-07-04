const { Container, Section, TextDisplay, Thumbnail, Separator, ActionRow, Button, MessageFlags } = require('discord.js');

function buildLogContainer(data) {
  return {
    content: '',
    flags: MessageFlags.Containerized,
    components: [
      new Container({
        accentColor: 0x5865F2,
        components: [
          new Section({
            accessory: new Thumbnail({ url: data.avatarUrl }),
            components: [
              new TextDisplay({ content: '## 🛡️ Verification Log' }),
              new TextDisplay({ content: `**Verification ID:** ${data.verificationId}` }),
              new TextDisplay({ content: `**Username:** ${data.username}` }),
              new TextDisplay({ content: `**User ID:** ${data.userId}` }),
              new TextDisplay({ content: `**Guild:** ${data.guild}` }),
              new TextDisplay({ content: `**Result:** ${data.result}` }),
              new TextDisplay({ content: `**Confidence:** ${data.confidence}` }),
              new TextDisplay({ content: `**Processing Time:** ${data.processingTime}` }),
              new TextDisplay({ content: `**Hash:** ${data.hash}` }),
              new TextDisplay({ content: `**Timestamp:** ${data.timestamp}` })
            ]
          }),
          new Separator(),
          new ActionRow({
            components: [
              new Button({ style: 5, label: 'Jump to Message', url: data.messageUrl }),
              new Button({ style: 5, label: 'User Profile', url: data.profileUrl })
            ]
          })
        ]
      })
    ]
  };
}

module.exports = { buildLogContainer };