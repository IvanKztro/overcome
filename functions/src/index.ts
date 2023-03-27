// import * as functions from "firebase-functions";

const admin = require('firebase-admin');
admin.initializeApp();
import { getUserPhotoUrlTrigger } from './triggers/user';

exports.getUserPhotoUrl = getUserPhotoUrlTrigger;
