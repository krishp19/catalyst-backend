import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  
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
    .addServer('https://catalyst-backend-i8ex.onrender.com', 'Production Server')
    .addServer('http://localhost:3000', 'Local Development Server')
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
      url: '/docs-json',
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

  // Configure CORS with more permissive settings
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow all origins in development, you might want to restrict this in production
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // In production, you might want to check against a whitelist
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://your-production-domain.com',
      ];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'X-Forwarded-For',
      'X-Forwarded-Proto',
      'X-Forwarded-Host',
      'X-Forwarded-Port',
      'X-Forwarded-Ssl',
    ],
    exposedHeaders: [
      'Content-Range',
      'X-Total-Count',
      'Authorization',
      'X-Request-Id',
      'X-Response-Time'
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  // Enable CORS with the above options
  app.enableCors(corsOptions);

  // Add global middleware for CORS headers and preflight
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Set CORS headers for all responses
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Forwarded-For');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Max-Age', '86400');
      return res.status(204).send();
    }
    
    next();
  });
  
  // Log CORS errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.message === 'Not allowed by CORS') {
      Logger.warn(`CORS blocked: ${req.method} ${req.originalUrl} from ${req.headers.origin}`, 'CORS');
      return res.status(403).json({
        statusCode: 403,
        message: 'Not allowed by CORS',
      });
    }
    next(err);
  });

  // Setup Swagger
  SwaggerModule.setup('/docs', app, document, swaggerOptions);
  
  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();