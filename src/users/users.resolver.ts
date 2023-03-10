import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ItemsService } from 'src/items/items.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
  ) {}

  @Query(() => [User], { name: 'getAllUsers' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User[]> {
    return await this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  async disableUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User> {
    return await this.usersService.disable(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser([ValidRoles.ADMIN]) adminUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.itemService.itemCountByUser(user);
  }
}
