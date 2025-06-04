import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { LoginDto } from '../src/auth/dto/login.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

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
  });

  const testUser: CreateUserDto = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
  };

  const loginData: LoginDto = {
    usernameOrEmail: 'testuser',
    password: 'Password123!',
  };

  let accessToken: string;
  let refreshToken: string;

  it('/auth/register (POST) - should register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        expect(res.body.user.username).toEqual(testUser.username);
        expect(res.body.user.email).toEqual(testUser.email);
        expect(res.body.user).not.toHaveProperty('password');
      });
  });

  it('/auth/login (POST) - should login with username', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginData)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        expect(res.body.user.username).toEqual(testUser.username);
        
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
      });
  });

  it('/auth/login (POST) - should login with email', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        usernameOrEmail: testUser.email,
        password: testUser.password,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.username).toEqual(testUser.username);
      });
  });

  it('/auth/login (POST) - should fail with wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        usernameOrEmail: testUser.username,
        password: 'WrongPassword123!',
      })
      .expect(401);
  });

  it('/auth/refresh (POST) - should refresh token', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
      });
  });

  it('/auth/logout (POST) - should logout', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Logged out successfully');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});