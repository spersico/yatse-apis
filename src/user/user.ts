import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Document, model, Schema } from 'mongoose';
import { Address, AddressDTO, addressSchema } from './address';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  address?: Address;
  salt: string;
}

export class UserDTO {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @MinLength(10)
  public password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  public address?: AddressDTO;
}
const userSchema = new Schema({
  address: addressSchema,
  email: String,
  name: String,
  password: String,
  salt: String,
});
export const userModel = model<User & Document>('User', userSchema);
