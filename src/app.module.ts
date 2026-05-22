import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from 'nestjs-prisma';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { defaultUploadConfig } from './storage/config/upload';
import { StorageModule } from './storage/storage.module';
import { PostsModule } from './posts/posts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';

@Module({
  imports: [
    MulterModule.register({
      ...defaultUploadConfig,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/static',
      exclude: ['/graphql'],
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    NotificationsModule,
    StorageModule,
    UsersModule,
    PostsModule,
  ],

  controllers: [AppController],
})
export class AppModule {}
