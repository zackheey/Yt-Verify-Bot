const { Container, Section, TextDisplay, Thumbnail, Separator, ActionRow, Button, MessageFlags } = require('discord.js');

function buildSuccessContainer(data) {
  return {
    content: '',
    flags: MessageFlags.Containerized,
    components: [
      new Container({
        accentColor: 0x2ecc71,
        components: [
          new Section({
            accessory: new Thumbnail({ url: data.avatarUrl }),
            components: [
              new TextDisplay({ content: '## ✅ Verification Successful' }),
              new TextDisplay({ content: `**Discord Username:** ${data.username}` }),
              new TextDisplay({ content: `**Discord ID:** ${data.userId}` }),
              new TextDisplay({ content: `**Verification ID:** ${data.verificationId}` }),
              new TextDisplay({ content: `**Confidence:** ${data.confidence}` }),
              new TextDisplay({ content: `**Verified Role:** ${data.roleName}` }),
              new TextDisplay({ content: `**Timestamp:** ${data.timestamp}` }),
              new TextDisplay({ content: `**Reason:** ${data.reason}` })
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

module.exports = { buildSuccessContainer };