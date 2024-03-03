import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import { categories } from "./audio_category";
export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing")
    .min(3, "Name is Short")
    .max(20, "Name is too big"),
  email: yup.string().required("Email is missing!").email("Invalid email id!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Too short")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return " ";
    })
    .required("Invalid UserId!"),
});

// export const PassResetTokenSchema = yup.object().shape({
//   token: yup.string().trim().required("Invalid Token!"),
//   userId: yup
//     .string()
//     .transform(function (value) {
//       if (this.isType(value) && isValidObjectId(value)) {
//         return value;
//       } else {
//         return " ";
//       }
//     })
//     .required("Invalid UserId!"),
// });
export const TokenAndIDValidaion = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      } else {
        return " ";
      }
    })
    .required("Invalid UserId!"),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      } else {
        return " ";
      }
    })
    .required("Invalid UserId!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Too short")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is missing!").email("Invalid email id!"),
  password: yup.string().trim().required("Password is missing!"),
});

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  about: yup.string().trim().required("About is missing!"),
  category: yup
    .string()
    .oneOf(categories, "Invalid category!")
    .required("Category is missing!"),
});

//while creating playlist there can be request from user
// with new playlist name and the audio that user wants to store inside that playlist
// or user just want to create an empty playlist...

export const NewPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  resId: yup.string().transform(function (value) {
    this.isType(value) && isValidObjectId(value) ? value : " ";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be either public or private")
    .required("Visibility is missing!"),
});

export const OldPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  //this is going to validiate the audio id

  item: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : " ";
  }),

  //this is going to validiate the playlist id
  id: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : " ";
  }),
  visibility: yup
    .string()
    .oneOf(
      ["public", "private"],
      "Visibility must be either public or private"
    ),
  //.required("Visibility is missing!"),
});

export const UpdateHistorySchema = yup.object().shape({
  audio: yup
    .string()
    .transform(function (value) {
      return this.isType(value) && isValidObjectId(value) ? value : " ";
    })
    .required("Invalid audio Id!"),
  progress: yup.number().required("History progress is missing!"),
  date: yup
    .string()
    .transform(function (value) {
      const date = new Date(value);
      if (date instanceof Date) return value;
      return "";
    })
    .required("Invaild date!"),
});
