import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { StorageModule } from '../../storage/storage.module';

@Module({
  providers: [UsersService],
  exports: [UsersService], // Exporting UsersService to be used in AuthModule
  imports: [StorageModule], // Import any necessary modules here (e.g., StorageModule if needed)
})
export class UsersModule {}
