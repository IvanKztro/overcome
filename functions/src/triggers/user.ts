import * as functions from 'firebase-functions';
import {
  createUserController,
  deleteUserController,
  getUserPhotoUrlController,
  updateUserController,
} from '../controllers/user';
import { UserProfile } from '../types/user';

export const getUserPhotoUrlTrigger = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    try {
      await getUserPhotoUrlController(snap.data() as UserProfile);
    } catch (error) {
      console.log(error);
    }
  });

export const createUser = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    await createUserController(snap.data() as UserProfile);
  });

export const deleteUser = functions.firestore
  .document('users/{userID}')
  .onDelete(async (snap, context) => {
    await deleteUserController(snap.data() as UserProfile);
  });

export const updateEmailUser = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const updateUser = change.after.data();
    const oldUser = change.before.data();
    console.log('nuevo correo');
    console.log(updateUser.displayName);
    console.log(updateUser.email);

    await updateUserController(
      updateUser as UserProfile,
      oldUser as UserProfile
    );
  });
