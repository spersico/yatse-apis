import { DocumentToObjectOptions } from 'mongoose';

export const defaultModifier: DocumentToObjectOptions = {
  versionKey: false, virtuals: true, transform: (doc, ret, game) => { delete ret._id; },
};

export const userModifier: DocumentToObjectOptions = {
  versionKey: false, virtuals: true, transform: (doc, ret, game) => {
    delete ret._id;
    delete ret.password;
    delete ret.salt;
  },
};
