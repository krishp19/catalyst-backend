import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();

    // Create a test user and get token
    const testUser: CreateUserDto = {
      username: 'usertest',
      email: 'usertest@example.com',
      password: 'Password123!',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    accessToken = response.body.accessToken;
    userId = response.body.user.id;
  });

  it('/users/profile (GET) - should get current user profile', () => {
    return request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('username');
        expect(res.body).toHaveProperty('email');
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/users/profile (PATCH) - should update user profile', () => {
    const updateData: UpdateUserDto = {
      bio: 'This is my test bio',
      avatarUrl: 'https://example.com/avatar.jpg',
    };

    return request(app.getHttpServer())
      .patch('/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateData)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('bio', updateData.bio);
        expect(res.body).toHaveProperty('avatarUrl', updateData.avatarUrl);
      });
  });

  it('/users/:username (GET) - should get user by username', () => {
    return request(app.getHttpServer())
      .get('/users/usertest')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('username', 'usertest');
        expect(res.body).toHaveProperty('bio', 'This is my test bio');
      });
  });

  it('/users/:userId/reputation (GET) - should get reputation breakdown', () => {
    return request(app.getHttpServer())
      .get(`/users/${userId}/reputation`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('totalScore');
        expect(res.body).toHaveProperty('breakdown');
        expect(res.body.breakdown).toHaveProperty('fromPosts');
        expect(res.body.breakdown).toHaveProperty('fromComments');
        expect(res.body.breakdown).toHaveProperty('fromCommunities');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});