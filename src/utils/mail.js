import Mailgen from "mailgen"

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'task manager',
      link: 'https://mailgen.js/',
    },
  });
  var emailText = mailGenerator.generatePlaintext(oprtions)

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_PORT,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });
};

const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: 'welcome to our platform',
    },
    action: {
      instructions: 'To get started with Mailgen, please click here:',
      button: {
        color: '#22BC66',
        text: 'Confirm your account',
        link: verificationUrl,
      },
    },

    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'

  };
};



const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
    return {
      body: {
        name: username,
        intro: 'reset your password',
      },
      action: {
        instructions: 'To get started with Mailgen, please click here:',
        button: {
          color: '#22BC66',
          text: 'reset password',
          link: passwordResetUrl,
        },
      },
  
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
  
    };
  };

sendMail({
    email: user.email,
    subject: "aaa",
    mailGencontent: emailVerificationMailGenContent(
        username,
        ``
    )
})
