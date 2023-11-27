import { UserDocument } from "@modules/users/users.schema";

export interface RequestWithUser extends Request {
  user: UserDocument;
}
