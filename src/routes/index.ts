import { HTTP_METHODS } from "../constants";
import { UserController } from "../controller/UserController";
import { UserMiddleware } from "../middlewares/UserMiddleware";
import { AuthController } from "../controller/AuthController";
interface IRouter {
  path: string;
  method: HTTP_METHODS;
  action: Function;
  middlewares?: Array<Function>;
}

const userMiddleware = new UserMiddleware();

export const Routes: IRouter[] = [
  {
    path: "/user/:id",
    method: HTTP_METHODS.GET,
    action: new UserController().index,
    middlewares: [userMiddleware.findOneUser],
  },
  {
    path: "/user",
    method: HTTP_METHODS.POST,
    action: new UserController().create,
    middlewares: [userMiddleware.createUser],
  },
  {
    path: "/auth/facebook",
    method: HTTP_METHODS.POST,
    action: new AuthController().authFacebook,
    middlewares: [userMiddleware.createUserWithFacebook]
  },
];
