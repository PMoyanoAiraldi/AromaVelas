import { Controller} from '@nestjs/common';
import { UsersService } from './users.service';
import {  ApiTags } from '@nestjs/swagger';


@ApiTags("User")
@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}


}