const { Container, Section, TextDisplay, Separator, ActionRow, Button, MessageFlags } = require('discord.js');

function buildFailedContainer(data) {
  return {
    content: '',
    flags: MessageFlags.Containerized,
    components: [
      new Container({
        accentColor: 0xE74C3C,
        components: [
          new Section({
            components: [
              new TextDisplay({ content: '## ❌ Verification Failed' }),
              new TextDisplay({ content: `**Reason:** ${data.reason}` }),
              new TextDisplay({ content: `**Confidence:** ${data.confidence}` }),
              new TextDisplay({ content: `**Timestamp:** ${data.timestamp}` })
            ]
          }),
          new Separator(),
          new ActionRow({
            components: [
              new Button({ style: 5, label: 'Retry', url: data.retryUrl }),
              new Button({ style: 5, label: 'Contact Staff', url: data.staffUrl })
            ]
          })
        ]
      })
    ]
  };
}

module.exports = { buildFailedContainer };