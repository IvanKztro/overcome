import * as admin from 'firebase-admin';
import { UserProfile } from '../types/user';

import { v4 as uuidv4 } from 'uuid';
// import { } from 'uuid'
import { Sprites } from '../types/avatar';
import { getAvatar } from '../modules/avatars/service';
// import { sendEmail } from '../modules/mailgun/service';
// import { Request, Response } from 'firebase-functions';

const bucket = admin.storage().bucket();
const db = admin.firestore();
const auth = admin.auth();

export const getUserPhotoUrlController = async (user: UserProfile) => {
  try {
    if (user.displayName) {
      let uuid = uuidv4();
      const img = await getAvatar(Sprites.Initials, user.displayName);
      const file = bucket.file(`users/${user.uid}/profile-photo.svg`);
      await file.save(img, {
        metadata: {
          uploadType: 'media',
          contentType: 'image/svg+xml',
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
      });
      const url = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
      const ref = db.doc(`users/${user.uid}`);
      console.log(url);
      await ref.update({ photoURL: url });
      await auth.updateUser(user.uid, { photoURL: url });
    } else {
      console.log(`User ${user.uid} has no display name`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const createUserController = async (user: UserProfile) => {
  const { uid, email, displayName } = user;
  if (!email) {
    console.log('No email created');
    return;
  }

  try {
    const userNew = await admin.auth().createUser({
      uid,
      email,
      emailVerified: false,
      password: email,
      displayName,
      disabled: false,
    });

    console.log(userNew.email);
    console.log(email);
  } catch (error) {
    console.log('error createUserController');
    console.log(error);
  }
};

export const deleteUserController = async (user: UserProfile) => {
  const uid: string = user.uid as string;
  try {
    await admin.auth().deleteUser(uid);
  } catch (error) {
    const text = (error as { message: string }).message;
    console.log(text);
  }
};

export const updateUserController = async (
  user: UserProfile,
  oldUser: UserProfile
) => {
  console.log('Usuario modificandose');

  const uid: string = user.uid as string;
  const displayName: string = user.displayName!;
  const email: string = user.email!;
  try {
    await auth.updateUser(uid, {
      email,
      displayName,
    });
  } catch (error) {
    console.log((error as { message: string }).message);
    console.log((error as { code: string }).code);
  }
};
