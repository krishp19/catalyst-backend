import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with specific origins and credentials
  app.enableCors({
    origin: true, // Reflects the request origin (if it's allowed)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Setup validation pipe
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

  // Enable class serializer interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Increase payload size limit
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Reddit Clone API')
    .setDescription('API documentation for Reddit Clone application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth' // This name here is important for matching up with @ApiBearerAuth() in your controller
    )
    .addTag('search', 'Search endpoints')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('posts', 'Post management endpoints')
    .addTag('comments', 'Comment management endpoints')
    .addTag('votes', 'Voting endpoints')
    .addTag('communities', 'Community management endpoints')
    .addServer('https://catalyst-backend-i8ex.onrender.com/api', 'Production Server')
    .addServer('http://localhost:3000/api', 'Local Development Server')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    ignoreGlobalPrefix: false,
  });

  // Setup Swagger UI with options
  const swaggerOptions = {
    explorer: true,
    useGlobalPrefix: true,
    customSiteTitle: 'Reddit Clone API Documentation',
    customCss: `
      .topbar { background-color: #ff4500 !important; }
      .swagger-ui .info .title { color: #ff4500; }
      .scheme-container { display: none !important; } /* Hide server selection */
    `,
    swaggerOptions: {
      url: '/api/docs-json',
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      defaultModelsExpandDepth: -1, // Hide schemas section by default
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      validatorUrl: null, // Disable the validator
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      requestInterceptor: (req) => {
        // Ensure all requests use HTTPS in production
        if (req.url && req.url.startsWith('http://') && process.env.NODE_ENV === 'production') {
          req.url = req.url.replace('http://', 'https://');
        }
        return req;
      },
    },
  };

  // Add CORS headers for all routes
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Add CORS headers specifically for Swagger UI
  app.use('/api/docs', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  // Setup Swagger
  SwaggerModule.setup('api/docs', app, document, swaggerOptions);
  
  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();