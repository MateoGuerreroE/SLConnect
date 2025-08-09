import { Module } from '@nestjs/common';
import { AccessManagementModule } from './modules/IAM';
import { CoreModule } from './modules/core';

@Module({
  imports: [AccessManagementModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
