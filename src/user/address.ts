import { IsString } from 'class-validator';
import { Schema } from 'mongoose';

export interface Address {
  street: string;
  city: string;
}

export class AddressDTO {
  @IsString()
  public street: string;
  @IsString()
  public city: string;
  @IsString()
  public country: string;
}

export const addressSchema = new Schema({
  city: String,
  country: String,
  street: String,
});
