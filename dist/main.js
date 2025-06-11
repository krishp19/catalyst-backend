"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Reddit Clone API')
        .setDescription('API documentation for Reddit Clone application')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
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
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        deepScanRoutes: true,
        ignoreGlobalPrefix: false,
    });
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
            defaultModelsExpandDepth: -1,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            validatorUrl: null,
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            requestInterceptor: (req) => {
                if (req.url && req.url.startsWith('http://') && process.env.NODE_ENV === 'production') {
                    req.url = req.url.replace('http://', 'https://');
                }
                return req;
            },
        },
    };
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
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
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    };
    app.enableCors(corsOptions);
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Forwarded-For');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count, Authorization');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Max-Age', '86400');
            return res.status(204).send();
        }
        next();
    });
    app.use((err, req, res, next) => {
        if (err.message === 'Not allowed by CORS') {
            common_1.Logger.warn(`CORS blocked: ${req.method} ${req.originalUrl} from ${req.headers.origin}`, 'CORS');
            return res.status(403).json({
                statusCode: 403,
                message: 'Not allowed by CORS',
            });
        }
        next(err);
    });
    swagger_1.SwaggerModule.setup('/docs', app, document, swaggerOptions);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map