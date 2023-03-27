import { Sprites } from '../../types/avatar';
const axios = require('axios').default;
const avatarApiURL = 'https://avatars.dicebear.com/api/';

export const getAvatar = async (sprite: Sprites, displayName: string) => {
  const url = `${avatarApiURL}${sprite}/${displayName}.svg`;
  console.log(url);
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
