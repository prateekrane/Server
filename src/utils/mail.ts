import { MAILTRAP_PASS, MAILTRAP_USER, SIGN_IN_URL } from "./variables";
import { generateToken } from "./Helper";
import { generateTemplate } from "../mail/template";
import emailVerificationToken from "../model/emailVerificationToken";
import path from "path";
import nodemailer from "nodemailer";

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}
export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();
  const { name, email, userId } = profile;
  // const token = generateToken();

  const welcomeMessage = `Hi ${name}, welcome to podify! There are so much things that we do for verified users. Use the given OTP to verify your email.`;
  transport.sendMail(
    {
      to: email,
      // from: "core75364@gmail.com",
      from: {
        name: "PodiFY!",
        address: "core75364@gmail.com",
      },
      subject: "Podify Email Verification Token",
      html: generateTemplate({
        title: "Welcome To Podify!.",
        message: welcomeMessage,
        logo: "cid:logo",
        banner: "cid:welcome",
        link: "#",
        btnTitle: token,
      }),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../mail/logo.png"),
          cid: "logo",
        },
        {
          filename: "welcome.png",
          path: path.join(__dirname, "../mail/welcome.png"),
          cid: "welcome",
        },
      ],
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent sucessfully!!");
      }
    }
  );
};

interface Options {
  email: string;
  link: string;
}
export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();
  const { email, link } = options;
  // const token = generateToken();

  const message =
    "We just receive a request that you forget your password. No problem you can use the link below and create brand new password.";
  transport.sendMail(
    {
      to: email,
      // from: "core75364@gmail.com",
      from: {
        name: "PodiFY!",
        address: "core75364@gmail.com",
      },
      subject: "Reset Password Link",
      html: generateTemplate({
        title: "Forget Password",
        message,
        logo: "cid:logo",
        banner: "cid:welcome",
        link,
        btnTitle: "Reset Password",
      }),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../mail/logo.png"),
          cid: "logo",
        },
        {
          filename: "welcome.png",
          path: path.join(__dirname, "../mail/welcome.png"),
          cid: "welcome",
        },
      ],
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent sucessfully!!");
      }
    }
  );
};

export const sendPassResetSuccessEmail = async (
  name: string,
  email: string
) => {
  const transport = generateMailTransporter();

  // const token = generateToken();

  const message = `Dear ${name} we just updated your new password. You can now sign in with your new password.`;
  transport.sendMail(
    {
      to: email,
      // from: "core75364@gmail.com",
      from: {
        name: "PodiFY!",
        address: "core75364@gmail.com",
      },
      subject: "Password Reset Successfully",
      html: generateTemplate({
        title: "Password Reset Successfully",
        message,
        logo: "cid:logo",
        banner: "cid:welcome",
        link: SIGN_IN_URL,
        btnTitle: "Log In",
      }),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../mail/logo.png"),
          cid: "logo",
        },
        {
          filename: "welcome.png",
          path: path.join(__dirname, "../mail/welcome.png"),
          cid: "welcome",
        },
      ],
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent sucessfully!!");
      }
    }
  );
};
