import { getRepository, Repository } from "typeorm";
import { UserEntity } from "../../database/entitys/user.entity";
import { firebaseAuth } from "../FirebaseService/FirebaseAuth";

class UserService {
  private userRepository!: Repository<UserEntity>;

  private singletonRepository() {
    if (this.userRepository === undefined) {
      this.userRepository = getRepository(UserEntity);
    }
  }

  async index(find: { id: string }): Promise<UserEntity | undefined> {
    const { id } = find;
    this.singletonRepository();
    return await this.userRepository
      .findOne({ id })
      .then((userEntity: UserEntity | undefined) => {
        if (userEntity !== undefined) {
          firebaseAuth.getUserByEmail(userEntity.email);
        }
        return userEntity;
      });
  }

  async create(user: UserEntity): Promise<UserEntity | boolean> {
    this.singletonRepository();

    const userFirebase: boolean | string = await firebaseAuth.saveUser({
      email: user.email,
      displayName: user.name,
      password: user.password,
      photoURL: user.photoURL
    });

    if (userFirebase) {
      user.uid = userFirebase.toString();
      return await this.userRepository.save(user);
    }else{
      throw new Error('The email address is already in use by another account.')
    }
  }

  async findByEmail(find: { email: string }): Promise<UserEntity | undefined> {
    const { email } = find;
    this.singletonRepository();
    return await this.userRepository
      .findOne({ email })
      .then((userEntity: UserEntity | undefined) => {
        if (userEntity !== undefined) {
          firebaseAuth.getUserByEmail(email);
        }
        return userEntity;
      });
  }
}

export const userService = new UserService();
